// src/components/ProductCard.tsx

"use client"; 

import Image from "next/image";
import { useCart } from "@/context/CartContext"; 

// Definimos la estructura del producto
interface Product {
  id: number;
  name: string;
  description: string; // <-- La descripción está aquí
  price: number;
  image_url: string;
  stock?: number; // Añadido 'stock' para que coincida con la página (opcional)
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart(); 

  return (
    // CAMBIO 1: Añadimos 'flex flex-col' al div principal
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <div className="relative w-full h-64">
        <Image
          src={product.image_url}
          alt={`Imagen de ${product.name}`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* CAMBIO 2: Añadimos 'flex flex-col flex-grow' y quitamos 'h-48' */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* CAMBIO 3: Añadimos 'flex-grow' a este div para empujar el botón hacia abajo */}
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-stone-900 truncate">
            {product.name}
          </h2>
          <p className="text-lg font-bold text-green-600 mt-2">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
          </p>
          
          {/* --- ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA! --- */}
          <p className="text-sm text-stone-600 mt-3">
            {product.description}
          </p>
          {/* --- FIN DE LA LÍNEA --- */}
        </div>
        
        {/* Este botón ahora se quedará al fondo */}
        <button 
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-stone-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}