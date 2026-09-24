// src/app/productos/[slug]/page.tsx
// Página propia de cada producto: /productos/jabon-caricia-de-seda

import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/JsonLd";
import {
  CATEGORY_LABELS,
  SOAP_CATEGORIES,
  cleanDescription,
  formatPrice,
  formatWeight,
  productPath,
  slugify,
  toMetaDescription,
  type Product,
} from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";

type Props = { params: { slug: string } };

// Una sola consulta por petición, compartida entre generateMetadata y la página.
const getProducts = cache(async (): Promise<Product[]> => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(`Error al cargar los productos: ${error.message}`);
  return (data as Product[]) ?? [];
});

async function getProduct(slug: string) {
  const products = await getProducts();
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

const soapFeatures = [
  { icon: "🌿", text: "Ingredientes de origen natural" },
  { icon: "🤲", text: "Hecho a mano por Laura y María" },
  { icon: "💚", text: "Cruelty-free" },
  { icon: "✨", text: "Sin parabenos ni sulfatos" },
];

export default async function ProductPage({ params }: Props) {
  const { product, products } = await getProduct(params.slug);
  if (!product) notFound();

  const description = cleanDescription(product.description);
  const weight = formatWeight(product);
  const categoryLabel = product.category ? CATEGORY_LABELS[product.category] : undefined;
  const isSoap = !!product.category && SOAP_CATEGORIES.includes(product.category);
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="bg-stone-50 min-h-screen">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Productos", path: "/productos" },
          { name: product.name, path: productPath(product) },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Migas de pan */}
        <nav aria-label="Migas de pan" className="text-sm text-stone-500 mb-6 md:mb-10">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-stone-800 transition-colors">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/productos" className="hover:text-stone-800 transition-colors">Productos</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-stone-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Imagen */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/70 shadow-sm">
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
          <div className="md:sticky md:top-28">
            {categoryLabel && (
              <span className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                {categoryLabel}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-stone-900 mt-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-5">
              <p className="text-3xl font-bold text-stone-800">{formatPrice(product.price)}</p>
              {weight && (
                <span className="px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-sm font-semibold">
                  {weight}
                </span>
              )}
            </div>

            {description && (
              <p className="mt-6 text-base md:text-lg text-stone-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            )}

            <AddToCart product={product} className="mt-8 max-w-sm" />

            {isSoap && (
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
                {soapFeatures.map((f) => (
                  <li key={f.text} className="flex items-center gap-2">
                    <span aria-hidden="true">{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 rounded-2xl bg-white border border-stone-200/70 p-5 text-sm text-stone-600 space-y-2">
              <p>
                🚚 <strong className="text-stone-800">Envío a domicilio:</strong> {formatPrice(SHIPPING_COST)}.
                Gratis en pedidos de más de {formatPrice(FREE_SHIPPING_OVER)}.
              </p>
              <p>
                📍 <strong className="text-stone-800">Recogida en tienda</strong> gratis en San Martín de la Vega (Madrid).
              </p>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-800 text-center mb-10">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/productos"
            className="inline-block px-8 py-3 rounded-full border-2 border-stone-300 text-stone-700 font-semibold hover:bg-white hover:border-stone-500 transition-all"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
