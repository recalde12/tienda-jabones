"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- Constantes de Envío (Deben coincidir con tu lógica de negocio) ---
const COSTO_ENVIO = 4.50;
const UMBRAL_ENVIO_GRATIS = 40;

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart(); // clearCart ya no es estrictamente necesario aquí, pero no molesta
  const supabase = createClientComponentClient();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',    
    postalCode: '' 
  });

  // --- Lógica de cálculo de precios ---
  const precioEnvio = totalPrice > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
  const precioFinal = totalPrice + precioEnvio;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    
    // Validación básica
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
      setMessage("Por favor, rellena todos los datos de envío obligatorios.");
      return;
    }

    setIsLoading(true);

    // 1. Confirmar pago con Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Añadimos esto por si el banco requiere redirección (3D Secure)
        return_url: window.location.origin + '/success', 
        payment_method_data: {
            billing_details: {
                name: shippingInfo.name,
                email: shippingInfo.email,
                address: {
                    line1: shippingInfo.address,
                    city: shippingInfo.city,
                    postal_code: shippingInfo.postalCode,
                    country: 'ES', // Puedes hacerlo dinámico si vendes fuera
                }
            }
        }
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message || "Ocurrió un error inesperado en el pago.");
      setIsLoading(false);
      return;
    }

    // 2. Si el pago fue exitoso (y no requirió redirección externa), guardar en Supabase
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Nota: Si permites compra como invitado, quita la validación estricta de usuario
        if (!user) throw new Error("Usuario no autenticado.");

        // Insertar Pedido
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            customer_name: shippingInfo.name,
            customer_email: shippingInfo.email,
            shipping_address: `${shippingInfo.address}, ${shippingInfo.postalCode}, ${shippingInfo.city}`,
            total_amount: precioFinal, 
            stripe_payment_intent_id: paymentIntent.id,
            status: 'paid',
          })
          .select()
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error("No se pudo crear el pedido en la base de datos.");

        // Insertar Items del pedido
        const orderItems = cart.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          quantity: item.quantity,
          price_per_unit: item.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // --- CORRECCIÓN FINAL ---
        // Pasamos el ID del pago en la URL para que la página de success sepa que es real
        // y proceda a borrar el carrito.
        router.push(`/success?payment_intent=${paymentIntent.id}`); 

      } catch (dbError: any) {
        console.error("Error guardando en Supabase:", dbError);
        setMessage(`Pago exitoso en Stripe, pero error guardando pedido: ${dbError.message}. Contáctanos.`);
      }
    } else {
      // Si entra aquí es porque paymentIntent no es succeeded o está pendiente
      setMessage("El pago no se ha completado inmediatamente. Revisa tu banco.");
    }

    setIsLoading(false);
  };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6 w-full">
      
      {/* --- RESUMEN DE PAGO --- */}
      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm">
        <h4 className="font-semibold text-stone-700 mb-2">Resumen</h4>
        <div className="flex justify-between mb-1">
          <span>Subtotal</span>
          <span>{formatMoney(totalPrice)}</span>
        </div>
        <div className="flex justify-between mb-2 pb-2 border-b border-stone-200">
          <span>Envío</span>
          <span className={precioEnvio === 0 ? "text-green-600 font-bold" : ""}>
            {precioEnvio === 0 ? "Gratis" : formatMoney(precioEnvio)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg text-stone-900">
          <span>Total a Pagar</span>
          <span>{formatMoney(precioFinal)}</span>
        </div>
      </div>

      {/* --- DATOS DE ENVÍO --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Datos de Envío</h3>
        <div className="space-y-3">
          <input type="text" name="name" placeholder="Nombre Completo" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          <input type="email" name="email" placeholder="Email" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          <input type="text" name="address" placeholder="Dirección y Número" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          
          <div className="flex gap-3">
            <input type="text" name="postalCode" placeholder="C.P." onChange={handleShippingChange} className="w-1/3 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
            <input type="text" name="city" placeholder="Ciudad / Provincia" onChange={handleShippingChange} className="w-2/3 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          </div>
        </div>
      </div>

      {/* --- DATOS DE PAGO STRIPE --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Tarjeta de Crédito</h3>
        <div className="border p-3 rounded-md bg-white">
          <PaymentElement id="payment-element" />
        </div>
      </div>

      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
      >
        <span>{isLoading ? "Procesando..." : `Pagar ${formatMoney(precioFinal)}`}</span>
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded text-center text-sm ${message.includes("éxito") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
    </form>
  );
}

// --- Componente principal ---

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { cart, totalPrice } = useCart(); 
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isUserChecked, setIsUserChecked] = useState(false);

  useEffect(() => {
    async function checkUserAndCart() {
      // 1. Auth check
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // 2. Cart check
      if (cart.length === 0) {
        router.push('/productos');
        return;
      }

      // 3. Crear Payment Intent en el servidor
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart }), 
        });
        
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error iniciando pago:", error);
      }
      
      setIsUserChecked(true);
    }

    checkUserAndCart();
  }, [cart, router, supabase]);

  const options = {
    clientSecret,
    appearance: { 
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#16a34a', 
        }
    },
  };

  if (!isUserChecked) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <p className="text-stone-600 animate-pulse">Cargando pasarela de pago...</p>
        </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-stone-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Completar Pedido</h1>
            <p className="text-sm text-stone-300 mt-1">Finaliza tu compra de forma segura</p>
        </div>
        
        <div className="p-6 md:p-8">
            {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
            ) : (
            <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}