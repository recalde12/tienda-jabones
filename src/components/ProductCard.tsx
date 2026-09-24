// src/components/ProductCard.tsx
// Tarjeta del catálogo. La imagen, el nombre y "Ver detalles" llevan a la página del producto.

import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/AddToCart";
import { formatPrice, formatWeight, productPath, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const href = productPath(product);
  const weight = formatWeight(product);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={href} aria-label={`Ver ${product.name}`} className="relative block w-full aspect-square overflow-hidden bg-stone-100">
        <Image
          src={product.image_url}
          alt={`Imagen de ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-stone-900 font-serif leading-snug line-clamp-2">
              <Link href={href} className="hover:text-stone-600 transition-colors">
                {product.name}
              </Link>
            </h2>
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-stone-800 whitespace-nowrap">
                {formatPrice(product.price)}
              </p>
              {weight && <p className="text-xs text-stone-500">{weight}</p>}
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed line-clamp-2">{product.description}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-stone-800 underline-offset-4 hover:underline"
          >
            Ver detalles <span aria-hidden="true">→</span>
          </Link>
        </div>

        <AddToCart product={product} className="mt-6" />
      </div>
    </div>
  );
}
