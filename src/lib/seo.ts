// src/lib/seo.ts
// Textos SEO de cada producto: el <title> empieza por lo que la gente busca en Google
// («jabón de avena y miel», «cesta de regalo»…) y no solo por el nombre comercial.
// Todo sale de las descripciones reales de la BD (sin alegaciones médicas). Se enlazan por slug.
// Si añades un producto y no lo pones aquí, se usa un texto genérico según su categoría.

import { cleanDescription, toMetaDescription, type Product } from "@/lib/products";

export type ProductSeo = {
  /** <title> sin la marca (la añade la plantilla del layout). ~60 caracteres máx. */
  title: string;
  /** Subtítulo visible bajo el nombre y texto alternativo de la foto. */
  headline: string;
  /** Meta descripción. ~155 caracteres máx. */
  description: string;
};

const MADRID = "Hecho a mano en Madrid.";
const SOAPS_MADRID = "Jabones hechos a mano en Madrid.";

export const PRODUCT_SEO: Record<string, ProductSeo> = {
  // ---------- Panales ----------
  "jabon-artesanal-malaura": {
    title: "Jabón de leche de cabra para piel sensible · Malaura",
    headline: "Jabón artesanal de leche de cabra para pieles sensibles",
    description: `Jabón artesanal de leche de cabra, rico en vitaminas: nutre sin irritar las pieles más sensibles. ${MADRID}`,
  },
  "jabon-caricia-de-seda": {
    title: "Jabón de avena y miel para piel sensible · Caricia de Seda",
    headline: "Jabón artesanal de avena coloidal y miel pura",
    description: `Jabón natural de avena coloidal y miel pura: suave, hidratante e ideal para calmar la piel sensible. ${MADRID}`,
  },
  "jabon-de-elixir-verde": {
    title: "Jabón de aloe vera natural · Elixir Verde",
    headline: "Jabón artesanal de aloe vera",
    description: `Jabón de aloe vera natural: hidrata sin dejar sensación grasa y calma rojeces y brotes respetando tu barrera natural. ${MADRID}`,
  },
  "jabon-amanecer-citrico": {
    title: "Jabón de limón para piel grasa o mixta · Amanecer Cítrico",
    headline: "Jabón artesanal con aceite esencial de limón",
    description: `Jabón con aceite esencial de limón, astringente y purificante: deja la piel grasa o mixta limpia y fresca sin resecar. ${MADRID}`,
  },
  "jabon-flor-de-noche": {
    title: "Jabón de carbón activo y aceite de coco · Flor de Noche",
    headline: "Jabón artesanal de carbón activo con aceite de coco",
    description: `Jabón de carbón activo que limpia impurezas y poros, con aceite de coco para una suavidad extra. Ideal para piel grasa. ${MADRID}`,
  },
  "jabon-perla-oriental": {
    title: "Jabón de arroz para iluminar la piel · Perla Oriental",
    headline: "Jabón artesanal de extracto de arroz",
    description: `Jabón con extracto de arroz que ilumina y unifica el tono, dejando la piel más suave y radiante. ${MADRID}`,
  },
  "jabon-de-flor-de-azahar": {
    title: "Jabón de naranja y vitamina C · Flor de Azahar",
    headline: "Jabón artesanal de naranja con vitamina C",
    description: `Jabón de naranja con vitamina C: limpieza efectiva, extra de luminosidad y acción antioxidante. ${MADRID}`,
  },
  "jabon-chispa-vital": {
    title: "Jabón exfoliante de café y naranja · Chispa Vital",
    headline: "Jabón exfoliante artesanal de café y naranja dulce",
    description: `Jabón exfoliante con granos de café natural y aceite de naranja dulce: exfolia suavemente y ayuda a tonificar la piel. ${MADRID}`,
  },
  "jabon-flor-silvestre": {
    title: "Jabón de lavanda relajante · Flor Silvestre",
    headline: "Jabón artesanal con aceite esencial de lavanda",
    description: `Jabón con aceite esencial de lavanda que calma cuerpo y mente y ayuda a liberar el estrés del día. ${MADRID}`,
  },
  "jabon-jardin-secreto": {
    title: "Jabón de rosa mosqueta y agua de rosas · Jardín Secreto",
    headline: "Jabón artesanal de rosa mosqueta y agua de rosas",
    description: `Jabón con rosa mosqueta y agua de rosas que revitaliza la piel y ayuda a mantener su juventud natural. ${MADRID}`,
  },
  "raiz-de-olivo": {
    title: "Jabón antioxidante de olivo y vitamina E · Raíz de Olivo",
    headline: "Jabón artesanal con polifenoles y vitamina E",
    description: `Jabón antioxidante con polifenoles y vitamina E que ayuda a mantener la elasticidad, la luminosidad y la firmeza de la piel. ${MADRID}`,
  },
  ginger: {
    title: "Jabón de jengibre antioxidante · Ginger",
    headline: "Jabón artesanal de jengibre",
    description: `Jabón de jengibre con propiedades antioxidantes, para una piel con un aspecto más fresco y revitalizado. ${MADRID}`,
  },

  // ---------- Cestas y packs ----------
  "cesta-grande": {
    title: "Cesta de regalo grande de jabones artesanales · Spa en casa",
    headline: "Cesta de regalo con jabones naturales y discos de bambú",
    description: `Cesta de regalo para convertir el baño en un pequeño spa: jabones naturales, discos de tela de bambú y más detalles. ${SOAPS_MADRID}`,
  },
  "cesta-mediana": {
    title: "Cesta de regalo con 10 jabones artesanales · Cesta Mediana",
    headline: "Cesta de regalo con 10 jabones y detalles sorpresa",
    description: `Cesta de regalo con 10 jabones artesanales variados y detalles sorpresa para mimar la piel. Perfecta para regalar. ${SOAPS_MADRID}`,
  },
  "equilibrio-puro": {
    title: "Pack de jabón de limón y leche de cabra · Equilibrio Puro",
    headline: "Pack de dos jabones: limón y leche de cabra",
    description: `Pack de dos jabones artesanales: limón para purificar y leche de cabra para hidratar y nutrir. Un regalo perfecto. ${SOAPS_MADRID}`,
  },
  "pack-duo": {
    title: "Caja regalo de jabones a elegir · Pack Dúo",
    headline: "Caja regalo con los panales de jabón que tú elijas",
    description: `Diseña tu caja regalo: elige tus panales de jabón artesanal favoritos y te los preparamos en una caja exclusiva. ${SOAPS_MADRID}`,
  },
  "ritual-dia-y-noche": {
    title: "Pack de jabón de naranja y aloe vera · Ritual Día y Noche",
    headline: "Pack de día y noche: jabón de naranja y jabón de aloe vera",
    description: `Rutina de día y noche: jabón de naranja con vitamina C para la mañana y aloe vera para la noche. Pack de regalo. ${SOAPS_MADRID}`,
  },
  "secreto-de-cleopatra": {
    title: "Pack de jabón de leche de cabra y rosas · Secreto de Cleopatra",
    headline: "Pack de dos jabones: leche de cabra y rosas",
    description: `Pack de leche de cabra, que nutre y suaviza, y jabón de rosas de aroma envolvente. Un regalo para cuidarse. ${SOAPS_MADRID}`,
  },
  "ying-yang": {
    title: "Pack facial detox e hidratante · Ying Yang",
    headline: "Pack de dos jabones: detox de poros e hidratación calmante",
    description: `Pack de dos jabones: primero un detox para liberar los poros y después una hidratación calmante, sin piel tirante. ${SOAPS_MADRID}`,
  },

  // ---------- Productos especiales ----------
  "piruleta-de-jabon": {
    title: "Piruleta de jabón para detalles de boda, bautizo y comunión",
    headline: "Flor de jabón en piruleta, en tonos botánicos",
    description: `Piruleta de jabón en tonos botánicos, ideal como detalle para bodas, bautizos, comuniones o regalos de empresa. Hecha a mano en Madrid.`,
  },
  "jabon-osito-amoroso": {
    title: "Jabón con forma de osito · Osito Amoroso",
    headline: "Jabón artesanal con forma de osito",
    description: `Jabón con forma de osito hecho con ingredientes suaves. Elige tu color: un detalle tierno para regalar o para bautizos. ${MADRID}`,
  },
  "jabon-vendimia-dulce": {
    title: "Jabón de manos con forma de racimo de uvas · Vendimia Dulce",
    headline: "Jabón de manos con forma de racimo de uvas",
    description: `Jabón de manos con forma de racimo de uvas: limpieza suave que hidrata ligeramente y deja las manos frescas. ${MADRID}`,
  },
  "jabon-vendimia-dulce-pequena": {
    title: "Racimo de uvas de jabón pequeño · Vendimia Dulce",
    headline: "Jabón de manos con forma de racimo de uvas, tamaño pequeño",
    description: `Racimo de uvas de jabón, tamaño pequeño: limpieza suave que hidrata ligeramente y deja las manos frescas. ${MADRID}`,
  },
  "jabon-vendimia-dulce-mediana": {
    title: "Racimo de uvas de jabón mediano · Vendimia Dulce",
    headline: "Jabón de manos con forma de racimo de uvas, tamaño mediano",
    description: `Racimo de uvas de jabón, tamaño mediano: limpieza suave que hidrata ligeramente y deja las manos frescas. ${MADRID}`,
  },
  "balsamo-malaura-rojo": {
    title: "Bálsamo labial artesanal rojo · Bálsamo Malaura",
    headline: "Bálsamo labial hecho a mano, con un toque de color rojo",
    description: `Bálsamo labial artesanal que cuida tus labios del frío y la sequedad y les da un toque de color rojo. ${MADRID}`,
  },
  "balsamo-malaura-neutro": {
    title: "Bálsamo labial artesanal neutro · Bálsamo Malaura",
    headline: "Bálsamo labial hecho a mano, en tono neutro",
    description: `Bálsamo labial artesanal que cuida tus labios del frío y la sequedad, en un tono neutro para llevarlo a diario. ${MADRID}`,
  },
};

/** Descriptor genérico por categoría, para productos sin texto propio. */
const CATEGORY_HEADLINE: Record<string, string> = {
  panales: "Jabón artesanal natural",
  al_corte: "Jabón artesanal natural al corte",
  cestas: "Cesta de regalo de jabones artesanales",
  ProductosEspeciales: "Producto artesanal hecho a mano",
};

/** Textos SEO de un producto (los propios o unos genéricos a partir de su nombre y categoría). */
export function productSeo(product: Product, slug: string): ProductSeo {
  const own = PRODUCT_SEO[slug];
  if (own) return own;
  const headline = CATEGORY_HEADLINE[product.category ?? ""] ?? "Producto artesanal hecho a mano";
  return {
    title: `${product.name} · ${headline}`,
    headline,
    description: toMetaDescription(cleanDescription(product.description) || `${product.name}. ${headline}. ${MADRID}`),
  };
}
