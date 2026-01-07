"use client";

import { useEffect } from "react";
// import Link from "next/link"; // Puedes usar Link o el router, ambos funcionarán ahora
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Vaciamos el carrito SOLO UNA VEZ al montar el componente
    clearCart();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <--- IMPORTANTE: Array vacío para evitar el bucle infinito

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-stone-100">
        
        {/* SVG Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <svg 
              className="w-12 h-12 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-stone-600 mb-6">
          Muchas gracias por tu compra. Hemos procesado tu pedido correctamente.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-left">
          <div className="flex items-start">
            <span className="text-2xl mr-3">📧</span>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">Siguiente paso:</h3>
              <p className="text-blue-800 text-sm mt-1">
                Hemos enviado un correo de confirmación. 
                <br/>
                <span className="text-xs text-blue-600">(Revisa Spam si no lo ves).</span>
              </p>
            </div>
          </div>
        </div>

        {/* Botón con navegación programática (más seguro contra bloqueos de CSS) */}
        <button 
          onClick={() => router.push('/productos')}
          type="button"
          className="block w-full bg-stone-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-stone-700 transition-colors"
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}