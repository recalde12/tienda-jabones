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

interface ProductTabsProps {
  panales: Product[];
  alCorte: Product[];
  cestas: Product[];
  ProductosEspeciales: Product[];
}

// 1. Definimos las categorías aquí para no repetir código
const categories = [
  { id: 'panales', label: 'Panales' },
  { id: 'al_corte', label: 'Al Corte' },
  { id: 'cestas', label: 'Cestas' },
  { id: 'ProductosEspeciales', label: 'Productos Especiales' },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6">
        <span className="text-5xl block mb-4">🧺</span>
        <p className="text-stone-600 leading-relaxed">
          Contáctanos por correo para hacer tu pedido y elegir la cantidad que deseas.
          <span className="block mt-1 font-semibold text-stone-800">¡Te esperamos!</span>
        </p>
      </div>
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para abrir/cerrar el menú móvil

  // Encontrar el nombre de la categoría activa para mostrarlo en el botón móvil
  const activeLabel = categories.find(c => c.id === activeTab)?.label;

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsDropdownOpen(false); // Cerrar el menú al seleccionar
  };

  return (
    <div className="w-full">
      
      {/* --- VISTA MÓVIL: MENÚ DESPLEGABLE (Visible solo en md:hidden) --- */}
      <div className="md:hidden relative mb-8 px-4">
        <label className="block text-stone-600 text-sm font-semibold mb-2">
          Selecciona una categoría:
        </label>
        
        {/* Botón principal del desplegable */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex justify-between items-center bg-white border border-stone-300 text-stone-800 font-semibold py-3 px-4 rounded-lg shadow-sm"
        >
          <span>{activeLabel}</span>
          {/* Icono de flecha que gira si está abierto */}
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Lista de opciones (Aparece solo si isDropdownOpen es true) */}
        {isDropdownOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`w-full text-left py-3 px-4 border-b border-stone-100 last:border-none hover:bg-stone-50 transition-colors ${
                  activeTab === cat.id ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>


      {/* --- VISTA DE ESCRITORIO: CONTROL SEGMENTADO (Oculto en móvil 'hidden md:flex') --- */}
      <div className="hidden md:flex w-full justify-center mb-12">
        <div className="inline-flex items-center gap-1 bg-stone-100 rounded-full p-1.5 shadow-inner">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                activeTab === cat.id
                  ? 'bg-stone-800 text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>


      {/* --- CONTENIDO (Igual para todos) --- */}
      <div>
        {activeTab === 'panales' && <ProductGrid products={panales} />}
        {activeTab === 'al_corte' && <ProductGrid products={alCorte} />}
        {activeTab === 'cestas' && <ProductGrid products={cestas} />}
        {activeTab === 'ProductosEspeciales' && <ProductGrid products={ProductosEspeciales} />}
      </div>
    </div>
  );
}