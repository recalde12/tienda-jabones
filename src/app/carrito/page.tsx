// src/app/carrito/page.tsx

"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-stone-800 mb-12">
          Tu Carrito de Compras
        </h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-stone-600">Tu carrito está vacío.</p>
            <Link 
              href="/productos" 
              className="mt-6 inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                // Key única combinando todo
                <div key={`${item.id}-${item.selectedColor}-${item.selectedFinish}`} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    
                    {/* --- MOSTRAR OPCIONES --- */}
                    <div className="flex flex-col text-sm text-stone-500 mt-1">
                      {item.selectedColor && (
                        <span>Color: <span className="font-semibold text-stone-700">{item.selectedColor}</span></span>
                      )}
                      {item.selectedFinish && (
                        <span>Acabado: <span className="font-semibold text-stone-700">{item.selectedFinish}</span></span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mt-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedFinish, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 h-8 w-8 rounded-full font-bold hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedFinish, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 h-8 w-8 rounded-full font-bold hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-6">
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedFinish)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">Gratis</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
                  </span>
                </div>
                
                <Link 
                  href="/checkout"
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors text-center inline-block"
                >
                  Proceder al Pago
                </Link>
                
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}