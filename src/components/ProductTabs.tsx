// src/components/ProductTabs.tsx

"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { categoryFromParam, categoryToParam, type Product } from '@/lib/products';

interface ProductTabsProps {
  panales: Product[];
  alCorte: Product[];
  cestas: Product[];
  ProductosEspeciales: Product[];
}

// Categorías (el id coincide con la columna `category` de la BD).
// `short` es el nombre en móvil, donde las pestañas van en una cuadrícula de 2 columnas.
export const CATALOG_TABS = [
  { id: 'panales', label: 'Panales', short: 'Panales' },
  { id: 'al_corte', label: 'Al corte', short: 'Al corte' },
  { id: 'cestas', label: 'Cestas y packs', short: 'Cestas y packs' },
  { id: 'ProductosEspeciales', label: 'Productos especiales', short: 'Especiales' },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 flex flex-col items-center gap-4">
        <div className="hexagon w-20 h-[70px] bg-honey" aria-hidden="true" />
        <p className="text-cocoa leading-relaxed">
          Escríbenos para hacer tu pedido y elegir la cantidad que deseas.
          <span className="block mt-1 font-bold text-espresso">¡Te esperamos!</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product, index) => (
        // Las primeras fotos se ven nada más entrar: se cargan con prioridad (mejora el LCP)
        <ProductCard key={product.id} product={product} priority={index < 2} />
      ))}
    </div>
  );
}

export function ProductTabs({ panales, alCorte, cestas, ProductosEspeciales }: ProductTabsProps) {
  // La pestaña activa sale SIEMPRE de la URL (?categoria=), así coinciden el menú,
  // los enlaces compartidos y los clics en las pestañas.
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = categoryFromParam(searchParams.get('categoria'));

  const byTab: Record<string, Product[]> = {
    panales,
    al_corte: alCorte,
    cestas,
    ProductosEspeciales,
  };

  const selectTab = (id: string) => {
    // replaceState se sincroniza con el router de Next (useSearchParams) sin recargar la página
    const params = new URLSearchParams(searchParams.toString());
    const value = categoryToParam(id);
    if (value) params.set('categoria', value);
    else params.delete('categoria');
    const query = params.toString();
    window.history.replaceState(null, '', query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="w-full">
      {/* Móvil: cuadrícula 2×2 (todas las categorías a la vista, sin deslizar). Desde sm: una fila centrada. */}
      <div role="tablist" aria-label="Categorías" className="grid grid-cols-2 gap-2 mb-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        {/* Las categorías vacías no se muestran (salvo que alguien llegue a ella por enlace) */}
        {CATALOG_TABS.filter((cat) => byTab[cat.id].length > 0 || cat.id === activeTab).map((cat) => {
          const active = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="catalogo-panel"
              onClick={() => selectTab(cat.id)}
              className={`min-h-[48px] px-3 sm:px-6 rounded-full border-2 text-[15px] font-bold transition-colors inline-flex items-center justify-center [&:last-child:nth-child(odd)]:col-span-2 ${
                active ? 'bg-espresso border-espresso text-cream' : 'bg-cream border-edge text-espresso hover:border-espresso'
              }`}
            >
              <span className="sm:hidden">{cat.short}</span>
              <span className="hidden sm:inline">{cat.label}</span>
              <span className={`ml-2 text-xs ${active ? 'text-latte' : 'text-cocoa'}`}>{byTab[cat.id].length}</span>
            </button>
          );
        })}
      </div>

      <div id="catalogo-panel" role="tabpanel">
        <ProductGrid products={byTab[activeTab]} />
      </div>
    </div>
  );
}
