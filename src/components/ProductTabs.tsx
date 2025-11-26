// src/components/ProductTabs.tsx

"use client"; // ¡Importante! Este componente necesita estado

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
      ? 'bg-stone-700 text-white' // Estilo de la pestaña activa
      : 'bg-white text-stone-700 hover:bg-stone-100'; // Estilo de la inactiva
  };

  return (
    <div>
      {/* Contenedor de los botones de las pestañas */}
      <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
        <button
          onClick={() => setActiveTab('panales')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${getTabClass('panales')}`}
        >
          Panales
        </button>
        <button
          onClick={() => setActiveTab('al_corte')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${getTabClass('al_corte')}`}
        >
          Al Corte
        </button>
        <button
          onClick={() => setActiveTab('cestas')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${getTabClass('cestas')}`}
        >
          Cestas
        </button>
        <button
          onClick={() => setActiveTab('ProductosEspeciales')}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${getTabClass('ProductosEspeciales')}`}
        >
          Productos Especiales
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {/* Mostramos el contenido solo si la pestaña está activa */}
        {activeTab === 'panales' && <ProductGrid products={panales} />}
        {activeTab === 'al_corte' && <ProductGrid products={alCorte} />}
        {activeTab === 'cestas' && <ProductGrid products={cestas} />}
        {activeTab === 'ProductosEspeciales' && <ProductGrid products={ProductosEspeciales} />}
      </div>
    </div>
  );
}