"use client";

import { useEffect, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";

// Creamos un componente interno para el contenido que usa parámetros de búsqueda
function SuccessContent() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtenemos el ID del pago de la URL (Stripe siempre lo envía)
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    // 1. PROTECCIÓN DE RUTA
    // Si no hay 'payment_intent' en la URL, es que no vienen de Stripe.
    if (!paymentIntent) {
      router.push('/'); // Los mandamos al inicio (o a /productos)
      return; // Detenemos la ejecución para NO borrar el carrito
    }

    // 2. Si hay paymentIntent, es una compra real: Vaciamos el carrito
    clearCart();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío importante para evitar bucles

  // Mientras verificamos (o si redirigimos), podemos no mostrar nada o un spinner
  if (!paymentIntent) return null;

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

// COMPONENTE PRINCIPAL QUE EXPORTAMOS
// En Next.js, cuando usas useSearchParams, es recomendable envolver en Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}