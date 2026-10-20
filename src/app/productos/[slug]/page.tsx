// src/app/productos/[slug]/page.tsx
// Página propia de cada producto: /productos/jabon-caricia-de-seda

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { InfoTabs, type InfoTab } from "@/components/InfoTabs";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/JsonLd";
import { getCatalog, indexBySlug } from "@/lib/catalog";
import { PRODUCT_NOTES } from "@/lib/editorial";
import {
  CATEGORY_LABELS,
  SOAP_CATEGORIES,
  cleanDescription,
  formatPrice,
  formatWeight,
  productPath,
  slugify,
  toMetaDescription,
} from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";

type Props = { params: { slug: string } };

async function getProduct(slug: string) {
  const products = await getCatalog();
  return { product: products.find((p) => slugify(p.name) === slug), products };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProduct(params.slug);
  if (!product) return {};

  const description = toMetaDescription(
    cleanDescription(product.description) || `${product.name}, jabón artesanal natural hecho a mano.`
  );
  const path = productPath(product);

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${product.name} | La Flor de Malaura`,
      description,
      url: path,
      images: [{ url: product.image_url, alt: product.name }],
    },
  };
}

function LeafIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21V9" />
      <path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z" />
      <path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z" />
    </svg>
  );
}

export default async function ProductPage({ params }: Props) {
  const { product, products } = await getProduct(params.slug);
  if (!product) notFound();

  const slug = slugify(product.name);
  const notes = PRODUCT_NOTES[slug];
  const description = cleanDescription(product.description);
  const weight = formatWeight(product);
  const categoryLabel = product.category ? CATEGORY_LABELS[product.category] : undefined;
  const isSoap = !!product.category && SOAP_CATEGORIES.includes(product.category);
  const packDuo = isSoap ? indexBySlug(products).get("pack-duo") : undefined;
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const chips = [
    ...(notes?.idealFor.map((need) => `Ideal para: ${need.toLowerCase()}`) ?? []),
    ...(isSoap ? ["Sin parabenos ni sulfatos", "Cruelty-free"] : []),
  ];

  const tabs: InfoTab[] = [
    ...(isSoap
      ? [{
          id: "uso",
          label: "Cómo usarlo",
          content:
            "Humedece el jabón y la piel, haz espuma con las manos y aclara.\nDéjalo secar en una jabonera con drenaje: así dura mucho más.",
        }]
      : []),
    {
      id: "envio",
      label: "Envío y recogida",
      content: `Envío a domicilio: ${formatPrice(SHIPPING_COST)}. Gratis en pedidos de más de ${formatPrice(FREE_SHIPPING_OVER)}.\nRecogida en tienda: gratis en San Martín de la Vega (Madrid).`,
    },
  ];

  return (
    <div className="min-h-screen">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Productos", path: "/productos" },
          { name: product.name, path: productPath(product) },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-10 flex flex-col gap-16">
        <div className="flex flex-col gap-6 md:gap-10">
          {/* Migas de pan */}
          <nav aria-label="Migas de pan" className="text-sm text-cocoa">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-espresso transition-colors">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/productos" className="hover:text-espresso transition-colors">Productos</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-espresso font-bold">{product.name}</li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Imagen */}
            <div className="relative aspect-square rounded-[26px] overflow-hidden bg-sand">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Información */}
            <div className="md:sticky md:top-28 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {categoryLabel && (
                  <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">
                    {categoryLabel} · Hecho a mano en San Martín de la Vega
                  </span>
                )}
                <h1 className="font-serif text-4xl lg:text-[52px] font-semibold leading-[1.05]">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
                {weight && (
                  <span className="px-4 py-1.5 rounded-full bg-sand text-[15px] font-bold">{weight}</span>
                )}
              </div>

              {description && (
                <p className="text-lg leading-relaxed text-cocoa whitespace-pre-line">{description}</p>
              )}

              {notes && notes.ingredients.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-4" aria-label="Ingredientes destacados">
                  {notes.ingredients.map((ing) => (
                    <li key={ing.name} className="flex items-center gap-3">
                      <span className="hexagon w-[70px] h-[61px] bg-honey text-espresso flex items-center justify-center flex-none">
                        <LeafIcon />
                      </span>
                      <span className="flex flex-col">
                        <strong>{ing.name}</strong>
                        <span className="text-sm text-cocoa">{ing.benefit}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {chips.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <li key={chip} className="px-4 py-2 rounded-full border border-edge text-sm font-bold">{chip}</li>
                  ))}
                </ul>
              )}

              <AddToCart product={product} withQuantity className="max-w-md" />

              <div className="rounded-[20px] bg-sand px-5 py-4 text-[15px] leading-relaxed flex flex-col gap-2">
                <p>
                  <strong>Envío a domicilio:</strong> {formatPrice(SHIPPING_COST)}. Gratis en pedidos de más de {formatPrice(FREE_SHIPPING_OVER)}.
                </p>
                <p>
                  <strong>Recogida en tienda:</strong> gratis en San Martín de la Vega (Madrid).
                </p>
              </div>

              {packDuo && (
                <Link
                  href={productPath(packDuo)}
                  className="flex items-center gap-4 p-3.5 rounded-[20px] border-2 border-honey hover:bg-sand transition-colors"
                >
                  <span className="relative w-[72px] h-[72px] flex-none rounded-xl overflow-hidden">
                    <Image src={packDuo.image_url} alt={packDuo.name} fill sizes="72px" className="object-cover" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <strong>¿Es para regalar? Hazlo {packDuo.name}</strong>
                    <span className="text-sm text-cocoa">
                      Elige tus panales y los presentamos en una caja exclusiva · {formatPrice(packDuo.price)}
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <InfoTabs tabs={tabs} />

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="flex flex-col gap-8">
            <h2 className="font-serif text-3xl font-semibold">Combina bien con</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href="/productos"
            className="inline-flex items-center min-h-[48px] px-8 rounded-full border-2 border-edge text-espresso font-bold hover:border-espresso transition-colors"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
