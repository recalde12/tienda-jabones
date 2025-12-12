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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <div className="relative w-full h-64">
        <Image
          src={product.image_url}
          alt={`Imagen de ${product.name}`}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-stone-900 truncate">{product.name}</h2>
          <p className="text-lg font-bold text-green-600 mt-2">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
          </p>
          <p className="text-sm text-stone-600 mt-3">{product.description}</p>

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
          className="mt-6 w-full bg-stone-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}