"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  // --- LÓGICA DE ENVÍO ---
  const COSTO_ENVIO = 4.50;
  const UMBRAL_ENVIO_GRATIS = 40;

  // Si el total es MAYOR a 40, el envío es 0, si no, es 4.50
  const precioEnvio = totalPrice > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;

  // El total final es la suma de los productos + el envío calculado
  const precioFinal = totalPrice + precioEnvio;

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
                <div 
                  key={`${item.id}-${item.selectedColor}-${item.selectedFinish}`} 
                  className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow-md"
                >
                  {/* Imagen */}
                  <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Detalles */}
                  <div className="flex-grow w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    
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
                  
                  {/* Controles Cantidad */}
                  <div className="flex items-center space-x-3 mb-4 md:mb-0">
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

                  {/* Botón Quitar */}
                  <div className="md:ml-6">
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedFinish)}
                      className="text-red-500 hover:text-red-700 font-semibold border border-red-200 md:border-none px-4 py-1 rounded md:p-0"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- SECCIÓN RESUMEN ACTUALIZADA --- */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
                
                {/* Subtotal */}
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
                  </span>
                </div>
                
                {/* Envío Dinámico */}
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Envío</span>
                  <span className={`font-semibold ${precioEnvio === 0 ? 'text-green-600' : ''}`}>
                    {precioEnvio === 0 
                      ? "Gratis" 
                      : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioEnvio)
                    }
                  </span>
                </div>
                
                {/* Mensaje de cuánto falta para envío gratis (Opcional pero recomendado) */}
                {precioEnvio > 0 && (
                   <div className="text-xs text-stone-500 mb-4 text-right">
                     Te faltan {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(UMBRAL_ENVIO_GRATIS - totalPrice)} para envío gratis.
                   </div>
                )}

                {/* Total Final */}
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {/* Aquí usamos precioFinal en lugar de totalPrice */}
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioFinal)}
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