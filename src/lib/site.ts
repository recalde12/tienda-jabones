// src/lib/site.ts
// Configuración central del sitio: se usa en metadata, sitemap, robots y datos estructurados (JSON-LD).
// Cambia el dominio en la variable de entorno NEXT_PUBLIC_SITE_URL (en .env.local y en Vercel).

/**
 * URL base de producción. Sin barra final.
 * Prioridad: NEXT_PUBLIC_SITE_URL > URL de Vercel > localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const siteConfig = {
  name: "La Flor de Malaura",
  shortName: "Malaura",
  url: SITE_URL,
  description:
    "Jabones artesanales hechos a mano con ingredientes 100% naturales por Laura y María. Cruelty-free, sin parabenos ni sulfatos. Tienda en San Martín de la Vega (Madrid) y envíos a toda España.",
  locale: "es_ES",
  // Imagen para redes sociales (Open Graph). 1200x630 recomendado.
  ogImage: "/logo-malaura-banner.png",

  business: {
    legalName: "La Flor de Malaura",
    email: "laflordemalaura@gmail.com",
    phones: ["+34669788574", "+34619326449"],
    whatsapp: "+34669788574",
    address: {
      street: "Av. del Alcalde Antonio Chapado, 29",
      locality: "San Martín de la Vega",
      region: "Comunidad de Madrid",
      postalCode: "28330",
      country: "ES",
    },
    geo: { lat: 40.2074705, lng: -3.5756814 },
    // Horario en formato schema.org (L-V 10:00-18:00)
    openingHours: "Mo-Fr 10:00-18:00",
  },

  social: {
    instagram: "https://instagram.com/flordemalaura",
    facebook:
      "https://www.facebook.com/profile.php?id=61582573412425&locale=es_ES",
  },
};

export type SiteConfig = typeof siteConfig;
