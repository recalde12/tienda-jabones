// src/components/JsonLd.tsx
// Datos estructurados (schema.org) para que Google entienda mejor el negocio y la tienda.
// Se renderizan como <script type="application/ld+json"> en el <head>.

import { GOOGLE_MAPS_PLACE_URL, siteConfig, SITE_URL } from "@/lib/site";
import { cleanDescription, productPath, type Product } from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";
import { MAPS_URL } from "@/lib/editorial";

/**
 * Política de devoluciones (la de /devoluciones): 14 días, en tienda o por correo, y el envío
 * de vuelta lo paga el cliente. Google la muestra en los resultados de productos.
 */
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "ES",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: ["https://schema.org/ReturnInStore", "https://schema.org/ReturnByMail"],
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  merchantReturnLink: `${SITE_URL}/devoluciones`,
};

/** Envío a España: 4,50 €, gratis si el pedido supera 40 € (lib/shipping). */
function shippingDetails(price: number) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: price > FREE_SHIPPING_OVER ? 0 : SHIPPING_COST,
      currency: "EUR",
    },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "ES" },
  };
}

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
        openingHoursSpecification: business.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        hasMap: MAPS_URL,
        currenciesAccepted: "EUR",
        paymentAccepted: "Efectivo, tarjeta",
        areaServed: { "@type": "Country", name: "España" },
        hasMerchantReturnPolicy: RETURN_POLICY,
        sameAs: [social.instagram, social.facebook, GOOGLE_MAPS_PLACE_URL],
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

/** Las imágenes de la BD pueden ser rutas relativas (/images/x.jpg); Google las quiere absolutas. */
function absoluteUrl(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

/** Schema.org Product de un producto, con su oferta (precio) y su URL propia. */
function productSchema(p: Product) {
  const url = `${SITE_URL}${productPath(p)}`;
  return {
    "@type": "Product",
    name: p.name,
    description: cleanDescription(p.description) || siteConfig.description,
    image: [p.image_url ? absoluteUrl(p.image_url) : `${SITE_URL}${siteConfig.ogImage}`],
    sku: String(p.id),
    url,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(p.weight_grams
      ? { weight: { "@type": "QuantitativeValue", value: p.weight_grams, unitCode: "GRM" } }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      price: Number(p.price).toFixed(2),
      priceCurrency: "EUR",
      itemCondition: "https://schema.org/NewCondition",
      // El stock de la BD no es real: todo lo que está en el catálogo se puede comprar.
      availability: "https://schema.org/InStock",
      shippingDetails: shippingDetails(Number(p.price)),
      hasMerchantReturnPolicy: RETURN_POLICY,
      seller: { "@id": `${SITE_URL}/#business` },
    },
  };
}

/**
 * Lista de páginas de producto (para las páginas de aterrizaje): solo URLs, sin repetir
 * los datos de cada producto, que ya están en su propia ficha.
 */
export function ItemListJsonLd({ name, products }: { name: string; products: Product[] }) {
  if (!products.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${productPath(p)}`,
    })),
  };
  return <JsonLdScript data={data} />;
}

/**
 * Lista de productos (ItemList) para la página de catálogo. Cada elemento
 * apunta a la página propia del producto.
 */
export function ProductListJsonLd({ products }: { products: Product[] }) {
  if (!products?.length) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: productSchema(p),
    })),
  };

  return <JsonLdScript data={data} />;
}

/** Producto individual, para su página propia. */
export function ProductJsonLd({ product }: { product: Product }) {
  return <JsonLdScript data={{ "@context": "https://schema.org", ...productSchema(product) }} />;
}

/** Migas de pan (Inicio > Productos > Jabón X). Google las muestra en los resultados. */
export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return <JsonLdScript data={data} />;
}

/** Preguntas frecuentes (FAQPage). Deben coincidir con las que se muestran en la página. */
export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return <JsonLdScript data={data} />;
}
