// src/components/JsonLd.tsx
// Datos estructurados (schema.org) para que Google entienda mejor el negocio y la tienda.
// Se renderizan como <script type="application/ld+json"> en el <head>.

import { siteConfig, SITE_URL } from "@/lib/site";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es de confianza (generado por nosotros), no de entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Ficha de negocio local + sitio web + logo. Va en el layout raíz (todas las páginas).
 */
export function LocalBusinessJsonLd() {
  const { business, social } = siteConfig;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": `${SITE_URL}/#business`,
        name: siteConfig.name,
        image: `${SITE_URL}${siteConfig.ogImage}`,
        logo: `${SITE_URL}/logo-malaura-small.png`,
        url: SITE_URL,
        email: business.email,
        telephone: business.phones[0],
        priceRange: "€€",
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: business.address.street,
          addressLocality: business.address.locality,
          addressRegion: business.address.region,
          postalCode: business.address.postalCode,
          addressCountry: business.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.geo.lat,
          longitude: business.geo.lng,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "10:00",
            closes: "18:00",
          },
        ],
        sameAs: [social.instagram, social.facebook],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${SITE_URL}/#business` },
        inLanguage: "es-ES",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.name,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo-malaura-small.png`,
        },
        sameAs: [social.instagram, social.facebook],
      },
    ],
  };

  return <JsonLdScript data={data} />;
}

type ProductForJsonLd = {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock?: number;
};

/**
 * Lista de productos (ItemList) para la página de catálogo. Permite que Google
 * entienda cada producto con su precio y disponibilidad.
 */
export function ProductListJsonLd({ products }: { products: ProductForJsonLd[] }) {
  if (!products?.length) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description || siteConfig.description,
        image: p.image_url ? [p.image_url] : [`${SITE_URL}${siteConfig.ogImage}`],
        brand: { "@type": "Brand", name: siteConfig.name },
        offers: {
          "@type": "Offer",
          price: Number(p.price).toFixed(2),
          priceCurrency: "EUR",
          availability:
            (p.stock ?? 1) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/productos`,
          seller: { "@id": `${SITE_URL}/#business` },
        },
      },
    })),
  };

  return <JsonLdScript data={data} />;
}
