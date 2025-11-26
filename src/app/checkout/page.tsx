// src/app/checkout/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // ¡NUEVO!

// --- El componente del formulario (CheckoutForm) se queda igual que antes ---
// ... (Puedes copiar el componente 'CheckoutForm' entero que te di en el paso anterior)
// ... (Asegúrate de que está aquí, justo encima de 'CheckoutPage')
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const supabase = createClientComponentClient();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
      setMessage("Por favor, rellena todos los datos de envío.");
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message || "Ocurrió un error inesperado.");
      setIsLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado. El pago se realizó pero el pedido no se pudo guardar.");

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            customer_name: shippingInfo.name,
            customer_email: shippingInfo.email,
            shipping_address: shippingInfo.address,
            total_amount: totalPrice,
            stripe_payment_intent_id: paymentIntent.id,
            status: 'paid',
          })
          .select()
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error("No se pudo crear el pedido.");

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

        setMessage("¡Pago realizado con éxito!");
        clearCart();
        router.push('/pedidos');

      } catch (dbError: any) {
        console.error("Error guardando en Supabase:", dbError);
        setMessage(`Pago exitoso, pero hubo un error al guardar tu pedido: ${dbError.message}`);
      }
    } else {
      setMessage("El pago no se completó.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Datos de Envío</h3>
        <div className="space-y-4">
          <input type="text" name="name" placeholder="Nombre Completo" onChange={handleShippingChange} className="w-full p-2 border rounded" required />
          <input type="email" name="email" placeholder="Email" onChange={handleShippingChange} className="w-full p-2 border rounded" required />
          <input type="text" name="address" placeholder="Dirección de Envío" onChange={handleShippingChange} className="w-full p-2 border rounded" required />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Datos de Pago</h3>
        <PaymentElement id="payment-element" />
      </div>
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mt-6 disabled:bg-gray-400"
      >
        <span>{isLoading ? "Procesando..." : `Pagar ${totalPrice.toFixed(2)} €`}</span>
      </button>
      {message && <div className="text-red-500 mt-4 text-center">{message}</div>}
    </form>
  );
}

// --- Componente principal de la página ---

// Cargamos Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { cart, totalPrice } = useCart();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isUserChecked, setIsUserChecked] = useState(false); // Estado de carga

  useEffect(() => {
    // --- ¡NUEVA LÓGICA DE COMPROBACIÓN! ---
    async function checkUserAndCart() {
      // 1. Comprobar si el usuario está logueado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Si no hay sesión, redirigir al login
        router.push('/login');
        return;
      }

      // 2. Comprobar si el carrito está vacío
      if (cart.length === 0) {
        router.push('/productos');
        return;
      }

      // 3. Si todo está bien, crear el Payment Intent
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
      
      setIsUserChecked(true); // Marcamos que la comprobación ha terminado
    }

    checkUserAndCart();
  }, [cart, router, supabase]);

  const options = {
    clientSecret,
    appearance: { theme: 'stripe' as const },
  };

  // Mostrar un "Cargando..." mientras se comprueba el usuario
  if (!isUserChecked) {
    return <p className="text-center py-20">Comprobando sesión...</p>;
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Completar Pedido</h1>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <p className="text-center py-10">Cargando formulario de pago...</p>
        )}
      </div>
    </div>
  );
}