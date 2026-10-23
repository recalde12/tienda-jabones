// src/components/ProductCard.tsx
// Tarjeta del catálogo. La imagen, el nombre y "Ver detalles" llevan a la página del producto.

import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/AddToCart";
import { formatPrice, formatWeight, productPath, slugify, type Product } from "@/lib/products";
import { productSeo } from "@/lib/seo";

export function ProductCard({
  product,
  priority = false,
  heading: Heading = "h2",
}: {
  product: Product;
  priority?: boolean;
  /** Nivel del título: h3 cuando la tarjeta va dentro de una sección con su propio h2. */
  heading?: "h2" | "h3";
}) {
  const href = productPath(product);
  const weight = formatWeight(product);
  const { headline } = productSeo(product, slugify(product.name));

  return (
    <div className="group flex flex-col bg-cream rounded-2xl border border-line shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={href} aria-label={`Ver ${product.name}`} className="relative block w-full aspect-square overflow-hidden bg-sand">
        <Image
          src={product.image_url}
          alt={`${product.name}: ${headline.toLowerCase()}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-3">
            <Heading className="text-lg font-semibold text-espresso font-serif leading-snug line-clamp-2">
              <Link href={href} className="hover:text-honey-dark transition-colors">
                {product.name}
              </Link>
            </Heading>
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-espresso whitespace-nowrap">
                {formatPrice(product.price)}
              </p>
              {weight && <p className="text-xs text-cocoa">{weight}</p>}
            </div>
          </div>
          <p className="text-sm text-cocoa mt-2 leading-relaxed line-clamp-2">{product.description}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-espresso underline-offset-4 hover:underline"
          >
            Ver detalles <span aria-hidden="true">→</span>
          </Link>
        </div>

        <AddToCart product={product} className="mt-6" />
      </div>
    </div>
  );
}
