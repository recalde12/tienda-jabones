"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- Constantes de Envío ---
const COSTO_ENVIO = 4.50;
const UMBRAL_ENVIO_GRATIS = 40;

// Definimos los props que recibe el formulario
function CheckoutForm({ deliveryMethod }: { deliveryMethod: 'shipping' | 'pickup' }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, totalPrice } = useCart(); 
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

  // --- Lógica de cálculo de precios VISUAL ---
  // Si es recogida (pickup), el envío es 0. Si no, calculamos según el umbral.
  const precioEnvio = deliveryMethod === 'pickup' 
    ? 0 
    : (totalPrice > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO);

  const precioFinal = totalPrice + precioEnvio;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    
    // --- VALIDACIÓN ---
    if (!shippingInfo.name || !shippingInfo.email) {
      setMessage("Por favor, introduce nombre y email.");
      return;
    }

    // Solo validamos dirección si es envío a domicilio
    if (deliveryMethod === 'shipping') {
        if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
            setMessage("Por favor, rellena la dirección completa para el envío.");
            return;
        }
    }

    setIsLoading(true);

    // Preparamos el texto de la dirección para Supabase
    const direccionGuardada = deliveryMethod === 'shipping'
        ? `${shippingInfo.address}, ${shippingInfo.postalCode}, ${shippingInfo.city}`
        : `RECOGIDA EN TIENDA - Cliente: ${shippingInfo.name}`;

    // 1. Confirmar pago con Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success', 
        payment_method_data: {
            billing_details: {
                name: shippingInfo.name,
                email: shippingInfo.email,
                // Solo enviamos dirección a Stripe si es envío a domicilio
                address: deliveryMethod === 'shipping' ? {
                    line1: shippingInfo.address,
                    city: shippingInfo.city,
                    postal_code: shippingInfo.postalCode,
                    country: 'ES', 
                } : undefined
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

    // 2. Si el pago fue exitoso, guardar en Supabase
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado.");

        // Insertar Pedido
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            customer_name: shippingInfo.name,
            customer_email: shippingInfo.email,
            shipping_address: direccionGuardada, // Guardamos la dirección o el aviso de recogida
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

        // Redirección con ID para pasar la seguridad de success
        router.push(`/success?payment_intent=${paymentIntent.id}`); 

      } catch (dbError: any) {
        console.error("Error guardando en Supabase:", dbError);
        setMessage(`Pago exitoso, pero error guardando pedido: ${dbError.message}. Contáctanos.`);
      }
    } else {
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
        
        {/* Mostramos qué método está seleccionado */}
        <div className="flex justify-between mb-2 pb-2 border-b border-stone-200">
          <span>Método</span>
          <span className="font-medium text-stone-600">
             {deliveryMethod === 'pickup' ? 'Recogida en Tienda' : 'Envío a Domicilio'}
          </span>
        </div>

        <div className="flex justify-between mb-2 pb-2 border-b border-stone-200">
          <span>Envío / Gestión</span>
          <span className={precioEnvio === 0 ? "text-green-600 font-bold" : ""}>
            {precioEnvio === 0 ? "Gratis" : formatMoney(precioEnvio)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg text-stone-900">
          <span>Total a Pagar</span>
          <span>{formatMoney(precioFinal)}</span>
        </div>
      </div>

      {/* --- DATOS DEL CLIENTE --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Datos de Contacto</h3>
        <div className="space-y-3">
          <input type="text" name="name" placeholder="Nombre Completo" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          <input type="email" name="email" placeholder="Email" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          
          {/* CAMPOS DE DIRECCIÓN (SOLO SI ES ENVÍO) */}
          {deliveryMethod === 'shipping' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                <input type="text" name="address" placeholder="Dirección y Número" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
                
                <div className="flex gap-3">
                    <input type="text" name="postalCode" placeholder="C.P." onChange={handleShippingChange} className="w-1/3 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
                    <input type="text" name="city" placeholder="Ciudad / Provincia" onChange={handleShippingChange} className="w-2/3 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
                </div>
            </div>
          )}

          {/* MENSAJE INFORMATIVO SI ES RECOGIDA */}
          {deliveryMethod === 'pickup' && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm text-yellow-800">
                📍 <strong>Recogida en tienda:</strong> Podrás recoger tu pedido en nuestra tienda física una vez recibas el email de confirmación.
            </div>
          )}
        </div>
      </div>

      {/* --- DATOS DE PAGO STRIPE --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Pago Seguro</h3>
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
  const { cart } = useCart(); 
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isUserChecked, setIsUserChecked] = useState(false);
  
  // NUEVO ESTADO: Controla si es envío o recogida
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');

  useEffect(() => {
    async function initCheckout() {
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

      setIsUserChecked(true);

      // 3. Crear (o actualizar) Payment Intent en el servidor
      try {
        // Ponemos el secret a vacío para mostrar spinner mientras recalcula
        setClientSecret("");

        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Enviamos el método seleccionado al backend
          body: JSON.stringify({ 
              items: cart, 
              deliveryMethod: deliveryMethod 
          }), 
        });
        
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error iniciando pago:", error);
      }
    }

    initCheckout();
    
    // IMPORTANTE: Añadimos deliveryMethod a las dependencias.
    // Cuando el usuario cambie el botón, esto se ejecuta de nuevo y actualiza el precio en Stripe.
  }, [cart, router, supabase, deliveryMethod]);

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
            <p className="text-stone-600 animate-pulse">Cargando...</p>
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
        
        {/* --- SELECTOR DE MÉTODO DE ENVÍO (NUEVO) --- */}
        <div className="p-6 pb-0">
            <h3 className="text-xs font-bold text-stone-500 mb-3 uppercase tracking-wider">Método de entrega</h3>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setDeliveryMethod('shipping')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all flex flex-col items-center justify-center gap-1
                        ${deliveryMethod === 'shipping' 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                >
                    <span className="text-xl">🚚</span>
                    <span>Envío a Casa</span>
                </button>
                <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all flex flex-col items-center justify-center gap-1
                        ${deliveryMethod === 'pickup' 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                >
                   <span className="text-xl">🏪</span>
                   <span>Recogida</span>
                   <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">GRATIS</span>
                </button>
            </div>
        </div>

        <div className="p-6 md:p-8 pt-4">
            {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
                {/* Pasamos el método al formulario hijo para que sepa qué campos mostrar */}
                <CheckoutForm deliveryMethod={deliveryMethod} />
            </Elements>
            ) : (
            <div className="flex flex-col items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-stone-500">Calculando precio...</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}