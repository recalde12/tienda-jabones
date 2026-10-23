// src/app/jabones/[necesidad]/page.tsx
// Páginas por tipo de piel: /jabones/piel-sensible, /jabones/piel-grasa… (contenido en lib/landing.ts)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { LandingHero, LandingLinks, LandingProducts, TipsGrid } from "@/components/Landing";
import { getCatalogSafe, indexBySlug } from "@/lib/catalog";
import { NEED_PAGES } from "@/lib/landing";
import type { Product } from "@/lib/products";

type Props = { params: { necesidad: string } };

const pageFor = (necesidad: string) => NEED_PAGES.find((p) => p.path === `/jabones/${necesidad}`);

// Como el resto de la tienda: se genera en cada visita para que precios y productos estén al día
export const dynamic = "force-dynamic";

async function productsFor(slugs: string[] = []): Promise<Product[]> {
  const bySlug = indexBySlug(await getCatalogSafe());
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pageFor(params.necesidad);
  if (!page) return {};
  const [first] = await productsFor(page.slugs);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: `${page.title} | La Flor de Malaura`,
      description: page.description,
      url: page.path,
      ...(first ? { images: [{ url: first.image_url, alt: first.name }] } : {}),
    },
  };
}

export default async function NeedPage({ params }: Props) {
  const page = pageFor(params.necesidad);
  if (!page) notFound();

  const products = await productsFor(page.slugs);
  const packs = await productsFor(page.packs);

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 flex flex-col gap-16 sm:gap-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Productos", path: "/productos" },
          { name: page.name, path: page.path },
        ]}
      />
      <ItemListJsonLd name={page.h1} products={[...products, ...packs]} />

      <LandingHero
        eyebrow={page.eyebrow}
        h1={page.h1}
        intro={page.intro}
        crumb={page.name}
        image={products[0] && { src: products[0].image_url, alt: `${products[0].name}, ${page.h1.toLowerCase()}` }}
      />
      <LandingProducts title="Elige tu jabón" products={products} />
      <TipsGrid title={page.tipsTitle} tips={page.tips} />
      <LandingProducts title="También en pack de regalo" products={packs} />
      <div className="max-w-[900px] w-full">
        <Faq faqs={page.faqs} />
      </div>
      <LandingLinks current={page.path} />
    </div>
  );
}
