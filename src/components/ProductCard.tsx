// src/components/ProductCard.tsx

"use client"; 

import Image from "next/image";
import { useCart } from "@/context/CartContext"; 
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock?: number;
  colors?: string[];   // Array de colores
  finishes?: string[]; // Array de acabados (Mate, Transparente...)
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart(); 
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  
  const [errorColor, setErrorColor] = useState(false);
  const [errorFinish, setErrorFinish] = useState(false);

  const handleAddToCart = () => {
    let hasError = false;

    // Validación de Color
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorColor(true);
      hasError = true;
    }

    // Validación de Acabado
    if (product.finishes && product.finishes.length > 0 && !selectedFinish) {
      setErrorFinish(true);
      hasError = true;
    }

    if (hasError) return; // Si falta algo, no añadimos
    
    // Todo OK: Resetear errores y añadir
    setErrorColor(false);
    setErrorFinish(false);
    addToCart(product, selectedColor, selectedFinish);
  };

  const outOfStock = product.stock === 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative w-full aspect-square overflow-hidden bg-stone-100">
        <Image
          src={product.image_url}
          alt={`Imagen de ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="px-4 py-1.5 rounded-full bg-stone-800 text-white text-sm font-semibold tracking-wide">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-stone-900 font-serif leading-snug line-clamp-2">
              {product.name}
            </h2>
            <p className="shrink-0 text-lg font-bold text-stone-800 whitespace-nowrap">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
            </p>
          </div>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed line-clamp-2">{product.description}</p>

          {/* --- SELECTOR DE COLORES --- */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-stone-500 mb-2 uppercase">Color:</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setErrorColor(false); }}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      selectedColor === color
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {errorColor && <p className="text-red-500 text-xs mt-1">Selecciona un color.</p>}
            </div>
          )}

          {/* --- SELECTOR DE ACABADOS (Mate / Transparente) --- */}
          {product.finishes && product.finishes.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-stone-500 mb-2 uppercase">Acabado:</p>
              <div className="flex flex-wrap gap-2">
                {product.finishes.map((finish) => (
                  <button
                    key={finish}
                    onClick={() => { setSelectedFinish(finish); setErrorFinish(false); }}
                    className={`px-3 py-1 text-sm rounded-lg border transition-all ${
                      selectedFinish === finish
                        ? 'bg-stone-600 text-white border-stone-600'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
              {errorFinish && <p className="text-red-500 text-xs mt-1">Selecciona un acabado.</p>}
            </div>
          )}

        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-stone-800 text-white py-2.5 px-4 rounded-full font-semibold shadow-sm transition-all hover:bg-stone-900 hover:shadow-md active:scale-[0.98] disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {outOfStock ? (
            'Sin stock'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Añadir al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
}