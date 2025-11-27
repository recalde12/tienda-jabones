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
  const [activeTab, setActiveTab] = useState('panales');

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return isActive
      ? 'bg-stone-700 text-white' 
      : 'bg-white text-stone-700 hover:bg-stone-100';
  };

  return (
    <div>
      {/* --- CAMBIOS PARA MÓVIL (Scroll Horizontal) --- */}
      {/* 1. overflow-x-auto: Permite deslizar si no caben
          2. flex-nowrap: Obliga a que estén en una sola fila
          3. justify-start md:justify-center: En móvil alineado al inicio, en PC centrado
          4. pb-4: Espacio extra abajo para que se vea bien al deslizar
      */}
      <div className="flex overflow-x-auto flex-nowrap justify-start md:justify-center gap-4 mb-12 pb-4 px-2">
        
        <button
          onClick={() => setActiveTab('panales')}
          // Added: whitespace-nowrap flex-shrink-0
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 ${getTabClass('panales')}`}
        >
          Panales
        </button>
        
        <button
          onClick={() => setActiveTab('al_corte')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 ${getTabClass('al_corte')}`}
        >
          Al Corte
        </button>
        
        <button
          onClick={() => setActiveTab('cestas')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 ${getTabClass('cestas')}`}
        >
          Cestas
        </button>
        
        <button
          onClick={() => setActiveTab('ProductosEspeciales')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap flex-shrink-0 ${getTabClass('ProductosEspeciales')}`}
        >
          Productos Especiales
        </button>
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