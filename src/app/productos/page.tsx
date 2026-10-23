// src/app/productos/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ProductTabs } from '@/components/ProductTabs';
import { ProductListJsonLd } from '@/components/JsonLd';
import { getCatalog } from '@/lib/catalog';
import { GIFT_PAGE, NEED_PAGES } from '@/lib/landing';
import type { Product } from '@/lib/products';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Jabones artesanales naturales y cestas de regalo',
  description:
    'Catálogo de jabones artesanales naturales hechos a mano en Madrid: para piel sensible, grasa o madura, cestas de regalo y packs. Sin parabenos ni sulfatos.',
  alternates: { canonical: '/productos' },
  openGraph: {
    title: 'Jabones artesanales naturales y cestas de regalo | La Flor de Malaura',
    description:
      'Panales de jabón, cestas de regalo, packs y productos especiales. Hechos a mano con ingredientes de origen natural.',
    url: '/productos',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'La Flor de Malaura — Jabones artesanales naturales' }],
  },
};

// Accesos directos a las páginas por tipo de piel y a las cestas (enlazado interno)
const shortcuts = [
  ...NEED_PAGES.map((p) => ({ href: p.path, label: p.name })),
  { href: GIFT_PAGE.path, label: GIFT_PAGE.name },
];

// La pestaña activa la decide ProductTabs leyendo ?categoria= (cestas | especiales | al_corte).
export default async function ProductosPage() {
  cookies(); // fuera del try: no atrapar el aviso interno de Next que marca la página como dinámica
  let allProducts: Product[];
  try {
    allProducts = await getCatalog();
  } catch (error: any) {
    return <p className="container mx-auto p-4">Error al cargar los productos: {error.message}</p>;
  }

  return (
    <div className="min-h-screen">
      <ProductListJsonLd products={allProducts} />
      <div className="container mx-auto px-4 py-12 sm:py-14">
        <div className="text-center mb-10 flex flex-col items-center gap-4">
          <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">
            Hechos a mano en San Martín de la Vega
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-espresso">Jabones artesanales naturales</h1>
          <p className="text-cocoa max-w-xl leading-relaxed">
            Panales de jabón, cestas de regalo y detalles hechos a mano, sin parabenos ni sulfatos. ¿No sabes cuál elegir? Busca
            por tipo de piel:
          </p>
          <nav aria-label="Buscar por tipo de piel" className="flex flex-wrap justify-center gap-2">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="inline-flex items-center min-h-[40px] px-4 rounded-full border border-edge text-sm font-bold text-espresso hover:border-espresso transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        <ProductTabs
          panales={allProducts.filter((p) => p.category === 'panales')}
          alCorte={allProducts.filter((p) => p.category === 'al_corte')}
          cestas={allProducts.filter((p) => p.category === 'cestas')}
          ProductosEspeciales={allProducts.filter((p) => p.category === 'ProductosEspeciales')}
        />
      </div>
    </div>
  );
}
