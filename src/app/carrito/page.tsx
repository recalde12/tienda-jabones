// src/app/carrito/page.tsx

"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link"; // 1. Asegúrate de que 'Link' esté importado

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 font-serif">
          Tu Carrito de Compras
        </h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-600">Tu carrito está vacío.</p>
            <Link 
              href="/productos" 
              className="mt-6 inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna de productos (ocupa 2/3) */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden mr-4">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-800 h-8 w-8 rounded-full font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 h-8 w-8 rounded-full font-bold hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-6">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Columna de resumen (ocupa 1/3) */}
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
                
                {/* --- ¡AQUÍ ESTÁ EL CAMBIO! --- */}
                {/* 2. Cambiamos el <button> por un <Link> */}
                <Link 
                  href="/checkout"
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors text-center inline-block"
                >
                  Proceder al Pago
                </Link>
                {/* --- FIN DEL CAMBIO --- */}
                
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}