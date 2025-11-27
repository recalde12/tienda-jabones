// src/components/ProductTabs.tsx

"use client";

import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

// Definimos la estructura del producto
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

// El componente recibe los productos ya separados por categoría
interface ProductTabsProps {
  panales: Product[];
  alCorte: Product[];
  cestas: Product[];
  ProductosEspeciales: Product[];
}

// Componente reutilizable para la cuadrícula de productos
function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-stone-600 py-10">
        Próximamente... Aún no hay productos en esta categoría.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductTabs({ panales, alCorte, cestas, ProductosEspeciales }: ProductTabsProps) {
  // Estado para saber qué pestaña está activa
  const [activeTab, setActiveTab] = useState('panales');

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return isActive
      ? 'bg-stone-700 text-white' 
      : 'bg-white text-stone-700 hover:bg-stone-100';
  };

  return (
    <div className="w-full"> {/* Aseguramos ancho completo */}
      
      {/* --- BARRA DE PESTAÑAS CON SCROLL MEJORADO --- */}
      <div className="flex w-full overflow-x-auto flex-nowrap gap-3 md:gap-4 mb-8 pb-4 px-4 md:justify-center no-scrollbar">
        
        <button
          onClick={() => setActiveTab('panales')}
          className={`px-5 py-2 md:px-6 md:py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 border border-stone-200 ${getTabClass('panales')}`}
        >
          Panales
        </button>
        
        <button
          onClick={() => setActiveTab('al_corte')}
          className={`px-5 py-2 md:px-6 md:py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 border border-stone-200 ${getTabClass('al_corte')}`}
        >
          Al Corte
        </button>
        
        <button
          onClick={() => setActiveTab('cestas')}
          className={`px-5 py-2 md:px-6 md:py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 border border-stone-200 ${getTabClass('cestas')}`}
        >
          Cestas
        </button>
        
        {/* Este es el que se te cortaba */}
        <button
          onClick={() => setActiveTab('ProductosEspeciales')}
          className={`px-5 py-2 md:px-6 md:py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 border border-stone-200 ${getTabClass('ProductosEspeciales')}`}
        >
          Productos Especiales
        </button>

        {/* Truco: Div invisible al final para asegurar margen derecho al hacer scroll */}
        <div className="w-2 flex-shrink-0 md:hidden"></div> 
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {activeTab === 'panales' && <ProductGrid products={panales} />}
        {activeTab === 'al_corte' && <ProductGrid products={alCorte} />}
        {activeTab === 'cestas' && <ProductGrid products={cestas} />}
        {activeTab === 'ProductosEspeciales' && <ProductGrid products={ProductosEspeciales} />}
      </div>
    </div>
  );
}