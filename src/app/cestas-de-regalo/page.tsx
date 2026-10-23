// src/app/cestas-de-regalo/page.tsx
// Cestas y packs de regalo (productos de la categoría «cestas»). Contenido en lib/landing.ts.

import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/Faq";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { LandingHero, LandingLinks, LandingProducts, TipsGrid, landingH2 } from "@/components/Landing";
import { getCatalogSafe } from "@/lib/catalog";
import { GIFT_PAGE } from "@/lib/landing";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";

export const metadata: Metadata = {
  title: GIFT_PAGE.title,
  description: GIFT_PAGE.description,
  alternates: { canonical: GIFT_PAGE.path },
  openGraph: {
    title: `${GIFT_PAGE.title} | La Flor de Malaura`,
    description: GIFT_PAGE.description,
    url: GIFT_PAGE.path,
    images: [{ url: "/images/Cesta60.jpg", alt: "Cesta de regalo de jabones artesanales" }],
  },
};

export default async function CestasPage() {
  const products = (await getCatalogSafe())
    .filter((p) => p.category === "cestas")
    .sort((a, b) => Number(b.price) - Number(a.price));
  const cheapest = products.length ? Math.min(...products.map((p) => Number(p.price))) : null;

  const faqs: FaqItem[] = [
    ...GIFT_PAGE.faqs,
    {
      q: "¿Cuánto cuesta el envío?",
      a: `${formatPrice(SHIPPING_COST)}, y es gratis en pedidos de más de ${formatPrice(FREE_SHIPPING_OVER)}. También puedes recoger tu regalo gratis en nuestra tienda de San Martín de la Vega.`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 flex flex-col gap-16 sm:gap-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Productos", path: "/productos" },
          { name: GIFT_PAGE.name, path: GIFT_PAGE.path },
        ]}
      />
      <ItemListJsonLd name={GIFT_PAGE.h1} products={products} />

      <LandingHero
        eyebrow={GIFT_PAGE.eyebrow}
        h1={GIFT_PAGE.h1}
        intro={[
          ...GIFT_PAGE.intro,
          ...(cheapest !== null ? [`Hay packs desde ${formatPrice(cheapest)} y cestas completas para los regalos más especiales.`] : []),
        ]}
        crumb={GIFT_PAGE.name}
        image={products[0] && { src: products[0].image_url, alt: `${products[0].name}: cesta de regalo de jabones artesanales` }}
      />
      <LandingProducts title="Nuestras cestas y packs" products={products} />
      <TipsGrid title="Un regalo para cada ocasión" tips={GIFT_PAGE.occasions} />

      <section className="flex flex-col gap-4 max-w-[760px]">
        <h2 className={landingH2}>¿Lo quieres personalizado?</h2>
        <p className="text-lg leading-relaxed text-cocoa">
          Para empresas, bodas, bautizos o cualquier celebración preparamos detalles de jabón con el aroma, el color y la
          etiqueta que elijas.{" "}
          <Link href="/bodas" className="font-bold text-honey-dark underline underline-offset-4">Pide tu presupuesto</Link>.
        </p>
      </section>

      <div className="max-w-[900px] w-full">
        <Faq faqs={faqs} />
      </div>
      <LandingLinks current={GIFT_PAGE.path} />
    </div>
  );
}
