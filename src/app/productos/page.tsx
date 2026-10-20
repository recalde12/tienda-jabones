// src/app/productos/page.tsx

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ProductTabs } from '@/components/ProductTabs';
import { ProductListJsonLd } from '@/components/JsonLd';
import { getCatalog } from '@/lib/catalog';
import type { Product } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Catálogo de Jabones Artesanales',
  description:
    'Descubre nuestro catálogo de jabones artesanales naturales: panales, cestas regalo, packs y productos especiales. Hechos a mano en San Martín de la Vega (Madrid), cruelty-free y sin parabenos.',
  alternates: { canonical: '/productos' },
  openGraph: {
    title: 'Catálogo de Jabones Artesanales | La Flor de Malaura',
    description:
      'Panales, cestas regalo, packs y productos especiales. Hechos a mano con ingredientes de origen natural.',
    url: '/productos',
  },
};

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
        <div className="text-center mb-10 flex flex-col items-center gap-3">
          <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">
            Hechos a mano en San Martín de la Vega
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-espresso">Nuestro catálogo</h1>
          <p className="text-cocoa max-w-xl leading-relaxed">
            ¿No sabes cuál elegir? Usa nuestro{' '}
            <a href="/#encuentra" className="font-bold text-honey-dark underline underline-offset-4">buscador por tipo de piel</a>.
          </p>
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
