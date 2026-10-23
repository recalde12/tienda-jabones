import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import {
  CartError,
  orderTotal,
  priceCart,
  resolveDiscount,
  shippingCost,
  type DeliveryMethod,
} from '@/lib/pricing';
import { getSessionUserId } from '@/lib/session';

// Inicializamos Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Inicializamos Supabase con service_role para leer precios y descuentos sin RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const deliveryMethod: DeliveryMethod = body.deliveryMethod === 'pickup' ? 'pickup' : 'shipping';

    // --- 1. Subtotal con los precios REALES de la BD (no los del navegador) ---
    const { subtotal, unitPrices } = await priceCart(supabase, body.items ?? body.cart);

    // --- 2. Descuento (validado en el servidor) ---
    let discountAmount = 0;
    let appliedCode: string | null = null;
    let discountMessage: string | null = null;
    let userId: string | null = null;

    if (body.discountCode) {
      // El cliente (cuenta) para el límite de usos por cliente; el webhook registra el uso con él.
      userId = await getSessionUserId();
      const discount = await resolveDiscount(supabase, body.discountCode, subtotal, userId);
      if (discount.valid) {
        discountAmount = discount.amount;
        appliedCode = discount.code;
      } else {
        discountMessage = discount.message;
      }
    }

    // --- 3. Envío y total ---
    const shipping = shippingCost(subtotal, deliveryMethod);
    const totalAmount = orderTotal(subtotal, discountAmount, shipping);
    const amountInCents = Math.max(Math.round(totalAmount * 100), 50); // Stripe mínimo 50 céntimos

    // --- 4. Crear Payment Intent ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        delivery_method: deliveryMethod === 'pickup' ? 'Recogida en Tienda' : 'Envío a Domicilio',
        // El webhook usa discount_code para contar el uso SOLO cuando el pago se confirma.
        discount_code: appliedCode || 'ninguno',
        discount_amount: discountAmount.toString(),
        subtotal: subtotal.toString(),
        ...(appliedCode && userId ? { user_id: userId } : {}),
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subtotal,
      discountAmount,
      discountCode: appliedCode,
      discountMessage,
      shippingCost: shipping,
      totalAmount,
      unitPrices,
    });

  } catch (error: any) {
    if (error instanceof CartError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'No se pudo preparar el pago. Inténtalo de nuevo.' }, { status: 500 });
  }
}
