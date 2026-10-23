// src/lib/pricing.ts
// Cálculo de precios del pedido EN EL SERVIDOR: precios reales desde la BD,
// códigos de descuento y envío. Nunca confiamos en los precios que manda el navegador.

import type { SupabaseClient } from "@supabase/supabase-js";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";

export type DeliveryMethod = "shipping" | "pickup";

export type DiscountCode = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_amount: number;
  max_uses: number | null;
  /** Usos máximos por cliente (cuenta). null o ausente = sin límite por cliente. */
  max_uses_per_customer?: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
};

export type DiscountResult =
  | { valid: true; code: string; type: DiscountCode["type"]; value: number; amount: number }
  | { valid: false; message: string };

/** Error de datos del carrito (se devuelve al cliente como 400). */
export class CartError extends Error {}

const round2 = (n: number) => Math.round(n * 100) / 100;

const formatEur = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

/**
 * Busca un código ACTIVO por coincidencia exacta (sin distinguir mayúsculas ni
 * espacios). No usamos ilike porque trata % y _ como comodines y permitía
 * "adivinar" códigos escribiendo, por ejemplo, "%".
 */
export async function findActiveDiscount(
  supabase: SupabaseClient,
  rawCode: unknown
): Promise<DiscountCode | null> {
  if (typeof rawCode !== "string") return null;
  const wanted = rawCode.trim().toUpperCase();
  if (!wanted) return null;

  const { data, error } = await supabase.from("discount_codes").select("*").eq("active", true);
  if (error) throw error;
  return (data as DiscountCode[] | null)?.find((dc) => dc.code.trim().toUpperCase() === wanted) ?? null;
}

/**
 * Usos de un código que ya ha hecho un cliente con pagos confirmados. Los registra
 * el webhook de Stripe en discount_code_uses.
 */
export async function countCustomerUses(
  supabase: SupabaseClient,
  discountCodeId: number,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("discount_code_uses")
    .select("id", { count: "exact", head: true })
    .eq("discount_code_id", discountCodeId)
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}

/**
 * Comprueba caducidad, usos y mínimo, y calcula el descuento sobre el subtotal.
 * `customerUses`: usos que ya ha hecho este cliente. undefined = no se comprueba el
 * límite por cliente; null = cliente sin identificar (no puede usar códigos con límite).
 */
export function evaluateDiscount(
  dc: DiscountCode | null,
  subtotal: number,
  customerUses?: number | null
): DiscountResult {
  if (!dc) return { valid: false, message: "Código no válido o no existe." };
  if (dc.expires_at && new Date(dc.expires_at) < new Date()) {
    return { valid: false, message: "Este código ha caducado." };
  }
  if (dc.max_uses !== null && dc.used_count >= dc.max_uses) {
    return { valid: false, message: "Este código ha alcanzado el límite de usos." };
  }
  const perCustomer = dc.max_uses_per_customer ?? null;
  if (perCustomer !== null && customerUses !== undefined) {
    if (customerUses === null) {
      return { valid: false, message: "Inicia sesión para usar este código." };
    }
    if (customerUses >= perCustomer) {
      return {
        valid: false,
        message: perCustomer === 1
          ? "Ya has usado este código."
          : `Ya has usado este código ${perCustomer} veces, el máximo por cliente.`,
      };
    }
  }
  const minAmount = Number(dc.min_amount) || 0;
  if (subtotal < minAmount) {
    return { valid: false, message: `Este código requiere un mínimo de ${formatEur(minAmount)}.` };
  }

  const value = Number(dc.value);
  const amount = dc.type === "percentage" ? (subtotal * value) / 100 : Math.min(value, subtotal);
  return { valid: true, code: dc.code, type: dc.type, value, amount: round2(amount) };
}

/**
 * Busca el código y lo evalúa para este cliente, incluido el límite de usos por cliente.
 * Con `preview` (vista previa del carrito) y sin sesión, el límite por cliente no se
 * comprueba todavía: se comprueba siempre al pagar, donde la sesión es obligatoria.
 */
export async function resolveDiscount(
  supabase: SupabaseClient,
  rawCode: unknown,
  subtotal: number,
  userId: string | null,
  { preview = false }: { preview?: boolean } = {}
): Promise<DiscountResult> {
  const dc = await findActiveDiscount(supabase, rawCode);
  let customerUses: number | null | undefined;
  if (dc && dc.max_uses_per_customer != null) {
    if (userId) customerUses = await countCustomerUses(supabase, dc.id, userId);
    else customerUses = preview ? undefined : null;
  }
  return evaluateDiscount(dc, subtotal, customerUses);
}

/** Envío: gratis en recogida o si el subtotal (antes del descuento) supera el umbral. */
export function shippingCost(subtotal: number, method: DeliveryMethod): number {
  if (method === "pickup") return 0;
  return subtotal > FREE_SHIPPING_OVER ? 0 : SHIPPING_COST;
}

/**
 * Calcula el subtotal con los precios REALES de la BD. Del carrito solo usamos
 * el id y la cantidad de cada línea.
 */
export async function priceCart(
  supabase: SupabaseClient,
  items: unknown
): Promise<{ subtotal: number; unitPrices: Record<number, number> }> {
  if (!Array.isArray(items) || items.length === 0) throw new CartError("El carrito está vacío.");
  if (items.length > 100) throw new CartError("El carrito tiene demasiadas líneas.");

  const lines = items.map((item) => {
    const id = Number(item?.id);
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new CartError("El carrito no es válido.");
    }
    return { id, quantity };
  });

  const ids = Array.from(new Set(lines.map((l) => l.id)));
  const { data, error } = await supabase.from("products").select("id, price").in("id", ids);
  if (error) throw error;

  const unitPrices: Record<number, number> = {};
  for (const p of data ?? []) unitPrices[p.id] = Number(p.price);
  if (ids.some((id) => unitPrices[id] === undefined)) {
    throw new CartError("Alguno de los productos ya no está disponible. Revisa tu carrito.");
  }

  const subtotal = round2(lines.reduce((sum, l) => sum + unitPrices[l.id] * l.quantity, 0));
  return { subtotal, unitPrices };
}

/** Total final del pedido: subtotal − descuento + envío. */
export function orderTotal(subtotal: number, discountAmount: number, shipping: number): number {
  return round2(Math.max(subtotal - discountAmount, 0) + shipping);
}
