"use client";

import { useState, useEffect, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- Constantes de Envío ---
const COSTO_ENVIO = 4.50;
const UMBRAL_ENVIO_GRATIS = 40;

function CheckoutForm({
  deliveryMethod,
  discountCode,
  discountAmount,
}: {
  deliveryMethod: 'shipping' | 'pickup';
  discountCode: string | null;
  discountAmount: number;
}) {
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

  const precioEnvio = deliveryMethod === 'pickup'
    ? 0
    : (totalPrice > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO);

  const precioFinal = Math.max(totalPrice - discountAmount + precioEnvio, 0);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!shippingInfo.name || !shippingInfo.email) {
      setMessage("Por favor, introduce nombre y email.");
      return;
    }

    if (deliveryMethod === 'shipping') {
      if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
        setMessage("Por favor, rellena la dirección completa para el envío.");
        return;
      }
    }

    setIsLoading(true);

    const direccionGuardada = deliveryMethod === 'shipping'
      ? `${shippingInfo.address}, ${shippingInfo.postalCode}, ${shippingInfo.city}`
      : `RECOGIDA EN TIENDA - Cliente: ${shippingInfo.name}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success',
        payment_method_data: {
          billing_details: {
            name: shippingInfo.name,
            email: shippingInfo.email,
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

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado.");

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            customer_name: shippingInfo.name,
            customer_email: shippingInfo.email,
            shipping_address: direccionGuardada,
            total_amount: precioFinal,
            stripe_payment_intent_id: paymentIntent.id,
            status: 'paid',
          })
          .select()
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error("No se pudo crear el pedido en la base de datos.");

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

        // Incrementar el contador de usos del código de descuento
        if (discountCode) {
          await fetch('/api/discount/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: discountCode, cartTotal: totalPrice, markUsed: true }),
          });
        }

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

  const fmt = (amount: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6 w-full">

      {/* --- RESUMEN DE PAGO --- */}
      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm space-y-2">
        <h4 className="font-semibold text-stone-700 mb-1">Resumen</h4>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{fmt(totalPrice)}</span>
        </div>

        {/* Descuento */}
        {discountAmount > 0 && discountCode && (
          <div className="flex justify-between text-green-700 font-medium">
            <span className="flex items-center gap-1">🏷️ Descuento ({discountCode})</span>
            <span>−{fmt(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between pb-2 border-b border-stone-200">
          <span>Método</span>
          <span className="font-medium text-stone-600">
            {deliveryMethod === 'pickup' ? 'Recogida en Tienda' : 'Envío a Domicilio'}
          </span>
        </div>

        <div className="flex justify-between pb-2 border-b border-stone-200">
          <span>Envío</span>
          <span className={precioEnvio === 0 ? "text-green-600 font-bold" : ""}>
            {precioEnvio === 0 ? "Gratis" : fmt(precioEnvio)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg text-stone-900">
          <span>Total a Pagar</span>
          <span>{fmt(precioFinal)}</span>
        </div>
      </div>

      {/* --- DATOS DEL CLIENTE --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Datos de Contacto</h3>
        <div className="space-y-3">
          <input type="text" name="name" placeholder="Nombre Completo" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
          <input type="email" name="email" placeholder="Email" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />

          {deliveryMethod === 'shipping' && (
            <div className="space-y-3">
              <input type="text" name="address" placeholder="Dirección y Número" onChange={handleShippingChange} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
              <div className="flex gap-3">
                <input type="text" name="postalCode" placeholder="C.P." onChange={handleShippingChange} className="w-1/3 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
                <input type="text" name="city" placeholder="Ciudad / Provincia" onChange={handleShippingChange} className="w-2/3 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
            </div>
          )}

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
        <span>{isLoading ? "Procesando..." : `Pagar ${fmt(precioFinal)}`}</span>
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
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutPageInner() {
  const [clientSecret, setClientSecret] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const { cart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');

  const discountCode = searchParams.get('code');

  useEffect(() => {
    async function initCheckout() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      if (cart.length === 0) { router.push('/productos'); return; }

      setIsUserChecked(true);

      try {
        setClientSecret("");
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            deliveryMethod,
            discountCode: discountCode || null,
          }),
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
        setDiscountAmount(data.discountAmount ?? 0);
      } catch (error) {
        console.error("Error iniciando pago:", error);
      }
    }

    initCheckout();
  }, [cart, router, supabase, deliveryMethod, discountCode]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: { colorPrimary: '#16a34a' }
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
          {discountCode && (
            <div className="mt-2 inline-flex items-center gap-1 bg-green-700 text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
              🏷️ Código aplicado: {discountCode}
            </div>
          )}
        </div>

        {/* Selector método de envío */}
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
              <CheckoutForm
                deliveryMethod={deliveryMethod}
                discountCode={discountCode}
                discountAmount={discountAmount}
              />
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-600 animate-pulse">Cargando...</p>
      </div>
    }>
      <CheckoutPageInner />
    </Suspense>
  );
}
