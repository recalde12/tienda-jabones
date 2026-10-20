// src/lib/editorial.ts
// Textos editoriales de la web (buscador "¿Qué necesita tu piel?", ingredientes destacados,
// "Ideal para"...). Están en código y no en la BD para no tocar Supabase; se enlazan con
// cada producto por su slug (src/lib/products.ts → slugify(name)).
// Todo sale de las descripciones reales de cada jabón. Si un producto cambia de nombre,
// actualiza aquí su slug. Precio, peso, foto y nombre siempre vienen de la BD.

export type Ingredient = { name: string; benefit: string };

export type ProductNotes = {
  /** Frase corta para el buscador: por qué este jabón encaja con esa necesidad. */
  why: string;
  ingredients: Ingredient[];
  idealFor: string[];
};

export const PRODUCT_NOTES: Record<string, ProductNotes> = {
  "jabon-artesanal-malaura": {
    why: "Con leche de cabra rica en vitaminas. Creado para las pieles más sensibles: nutre sin irritar.",
    ingredients: [{ name: "Leche de cabra", benefit: "Nutre y calma" }],
    idealFor: ["Piel sensible"],
  },
  "jabon-caricia-de-seda": {
    why: "Avena coloidal y miel pura. Suave, hidratante e ideal para calmar la piel.",
    ingredients: [
      { name: "Avena coloidal", benefit: "Para calmar" },
      { name: "Miel pura", benefit: "Para hidratar" },
    ],
    idealFor: ["Piel sensible", "Piel que necesita calma"],
  },
  "jabon-de-elixir-verde": {
    why: "Aloe vera: hidrata sin dejar sensación grasa y calma rojeces y brotes.",
    ingredients: [{ name: "Aloe vera", benefit: "Hidrata y calma" }],
    idealFor: ["Piel sensible", "Rojeces"],
  },
  "jabon-amanecer-citrico": {
    why: "Aceite esencial de limón, astringente y purificante. Deja la piel limpia y fresca sin resecar.",
    ingredients: [{ name: "Aceite esencial de limón", benefit: "Purifica" }],
    idealFor: ["Piel mixta o grasa"],
  },
  "jabon-flor-de-noche": {
    why: "Carbón activo que limpia impurezas y cierra los poros, con aceite de coco para una suavidad extra.",
    ingredients: [
      { name: "Carbón activo", benefit: "Limpia impurezas" },
      { name: "Aceite de coco", benefit: "Suaviza" },
    ],
    idealFor: ["Piel grasa", "Poros abiertos"],
  },
  "jabon-perla-oriental": {
    why: "Extracto de arroz: ilumina y unifica el tono de la piel.",
    ingredients: [{ name: "Extracto de arroz", benefit: "Ilumina" }],
    idealFor: ["Piel apagada", "Tono irregular"],
  },
  "jabon-de-flor-de-azahar": {
    why: "Naranja y vitamina C: limpieza efectiva y un extra de luminosidad.",
    ingredients: [
      { name: "Naranja", benefit: "Limpia" },
      { name: "Vitamina C", benefit: "Aporta luz" },
    ],
    idealFor: ["Piel apagada"],
  },
  "jabon-chispa-vital": {
    why: "Granos de café y aceite de naranja dulce: exfolia suavemente y ayuda a tonificar.",
    ingredients: [
      { name: "Granos de café", benefit: "Exfolian" },
      { name: "Aceite de naranja dulce", benefit: "Tonifica" },
    ],
    idealFor: ["Exfoliar", "Activar la piel"],
  },
  "jabon-flor-silvestre": {
    why: "Aceite esencial de lavanda: calma cuerpo y mente al final del día.",
    ingredients: [{ name: "Aceite esencial de lavanda", benefit: "Relaja" }],
    idealFor: ["Relajarse"],
  },
  "jabon-jardin-secreto": {
    why: "Rosa mosqueta y agua de rosas: revitaliza y ayuda a mantener la juventud natural de la piel.",
    ingredients: [
      { name: "Rosa mosqueta", benefit: "Revitaliza" },
      { name: "Agua de rosas", benefit: "Suaviza" },
    ],
    idealFor: ["Antiedad"],
  },
  "raiz-de-olivo": {
    why: "Polifenoles y vitamina E, un antioxidante que ayuda a mantener la elasticidad de la piel.",
    ingredients: [
      { name: "Polifenoles", benefit: "Antioxidantes" },
      { name: "Vitamina E", benefit: "Elasticidad" },
    ],
    idealFor: ["Antiedad"],
  },
  ginger: {
    why: "Jengibre, con propiedades antioxidantes y antiinflamatorias.",
    ingredients: [{ name: "Jengibre", benefit: "Antioxidante" }],
    idealFor: ["Antioxidante"],
  },
};

/** Opciones del buscador "¿Qué necesita tu piel hoy?" y los jabones que recomienda cada una. */
export const SKIN_NEEDS: { id: string; label: string; slugs: string[] }[] = [
  { id: "sensible", label: "Piel sensible", slugs: ["jabon-artesanal-malaura", "jabon-caricia-de-seda", "jabon-de-elixir-verde"] },
  { id: "grasa", label: "Grasa o mixta", slugs: ["jabon-amanecer-citrico", "jabon-flor-de-noche"] },
  { id: "luz", label: "Apagada, sin luz", slugs: ["jabon-perla-oriental", "jabon-de-flor-de-azahar"] },
  { id: "exfoliar", label: "Quiero exfoliar", slugs: ["jabon-chispa-vital"] },
  { id: "relax", label: "Quiero relajarme", slugs: ["jabon-flor-silvestre"] },
  { id: "antiedad", label: "Antiedad", slugs: ["jabon-jardin-secreto", "raiz-de-olivo"] },
];

/** Panales destacados en la home (los tres primeros son los que más citan las reseñas). */
export const FEATURED_SLUGS = ["jabon-flor-de-noche", "jabon-artesanal-malaura", "jabon-perla-oriental", "jabon-caricia-de-seda"];

/** Niveles del Club Malaura (mismos umbrales que LoyaltyLevel y el webhook de Stripe). */
export const CLUB_LEVELS = [
  { name: "Bronce", rule: "Desde tu primer pedido", className: "bg-[#E7CBA9] text-espresso" },
  { name: "Plata", rule: "A partir de 15 pedidos", className: "bg-[#D9D4CC] text-espresso" },
  { name: "Oro", rule: "A partir de 30 pedidos", className: "bg-honey text-espresso" },
  { name: "Diamante", rule: "A partir de 45 pedidos", className: "bg-[#BFD6D2] text-espresso" },
  { name: "Platino", rule: "A partir de 60 pedidos", className: "bg-espresso text-cream" },
];

export const WHATSAPP_NUMBER = "34669788574";
export const WHATSAPP_DISPLAY = "669 78 85 74";
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "La flor de malaura jabones, Av. del Alcalde Antonio Chapado 29, San Martín de la Vega"
)}`;

export function whatsappUrl(text?: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
