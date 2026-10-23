// src/app/api/discount/validate/route.ts
// Vista previa del descuento en el carrito. NO cuenta usos: eso lo hace el webhook
// de Stripe cuando el pago se confirma. El cobro real se recalcula en el servidor
// (create-payment-intent), así que aquí el total del carrito es solo orientativo.

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveDiscount } from '@/lib/pricing';
import { getSessionUserId } from '@/lib/session';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Código no proporcionado.' }, { status: 400 });
    }

    const subtotal = Number(cartTotal);
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json({ valid: false, message: 'Importe del carrito no válido.' }, { status: 400 });
    }

    // Si hay sesión ya avisamos aquí del límite por cliente; si no, se comprueba al pagar.
    const discount = await resolveDiscount(supabase, code, subtotal, await getSessionUserId(), { preview: true });
    if (!discount.valid) {
      return NextResponse.json({ valid: false, message: discount.message });
    }

    return NextResponse.json({
      valid: true,
      message: discount.type === 'percentage'
        ? `¡Código aplicado! ${discount.value}% de descuento.`
        : `¡Código aplicado! ${discount.value}€ de descuento.`,
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        discountAmount: discount.amount,
      },
    });

  } catch {
    return NextResponse.json({ valid: false, message: 'Error del servidor.' }, { status: 500 });
  }
}
