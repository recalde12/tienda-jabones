// src/lib/products.ts
// Utilidades de producto compartidas (servidor y cliente): tipo, categorías y URLs.

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  // Nota: la columna `stock` de la BD no refleja el stock real; no se usa en la web.
  weight_grams?: number | null; // Peso en gramos (columna opcional en Supabase)
  category?: string | null;
  colors?: string[];   // Colores disponibles (si aplica)
  finishes?: string[]; // Acabados disponibles, p. ej. Mate / Transparente (si aplica)
};

export const CATEGORY_LABELS: Record<string, string> = {
  panales: "Panales",
  al_corte: "Al corte",
  cestas: "Cestas",
  ProductosEspeciales: "Productos especiales",
};

/** Valor de ?categoria= en la URL del catálogo → categoría de la BD. */
const CATEGORY_ALIASES: Record<string, string> = {
  panales: "panales",
  cestas: "cestas",
  packs: "cestas",
  especiales: "ProductosEspeciales",
  ProductosEspeciales: "ProductosEspeciales",
  al_corte: "al_corte",
  "al-corte": "al_corte",
};

export function categoryFromParam(param?: string | null): string {
  return CATEGORY_ALIASES[param ?? ""] ?? "panales";
}

/** Categoría de la BD → valor para ?categoria= (panales es la de por defecto: sin parámetro). */
export function categoryToParam(category: string): string | null {
  if (category === "panales") return null;
  return category === "ProductosEspeciales" ? "especiales" : category;
}

/** Categorías que son jabones (para mostrar sus características: natural, sin parabenos...). */
export const SOAP_CATEGORIES = ["panales", "al_corte"];

/** "Jabón Caricia de Seda" -> "jabon-caricia-de-seda" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes (á -> a, ñ -> n)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ruta de la página de un producto, p. ej. /productos/jabon-caricia-de-seda */
export function productPath(product: { name: string }): string {
  return `/productos/${slugify(product.name)}`;
}

/** Normaliza saltos de línea (\r\n de la BD) y quita espacios sobrantes. */
export function cleanDescription(text?: string | null): string {
  return (text ?? "").replace(/\r\n?/g, "\n").trim();
}

/** Descripción corta para Google (una línea, máx. ~155 caracteres, sin cortar palabras). */
export function toMetaDescription(text: string, max = 155): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  const cut = oneLine.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** "100 g", o null si el producto no tiene peso definido. */
export function formatWeight(product: Pick<Product, "weight_grams">): string | null {
  return product.weight_grams ? `${product.weight_grams} g` : null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(Number(price));
}
