import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Inicializamos Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Inicializamos Supabase con service_role para validar descuentos sin RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- CONSTANTES DE ENVÍO ---
const COSTO_ENVIO = 4.50;
const UMBRAL_ENVIO_GRATIS = 40;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const cart = body.items || body.cart;
    const deliveryMethod = body.deliveryMethod || 'shipping';
    const discountCode: string | null = body.discountCode || null;

    // --- 1. Calcular Subtotal ---
    let subtotal = 0;
    for (const item of cart) {
        subtotal += item.price * item.quantity;
    }

    // --- 2. Calcular Descuento ---
    let discountAmount = 0;
    let discountInfo: string = '';

    if (discountCode) {
      const { data: dc } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('active', true)
        .ilike('code', discountCode.trim())
        .single();

      if (dc) {
        const now = new Date();
        const notExpired = !dc.expires_at || new Date(dc.expires_at) > now;
        const hasUses = dc.max_uses === null || dc.used_count < dc.max_uses;
        const meetsMinimum = subtotal >= dc.min_amount;

        if (notExpired && hasUses && meetsMinimum) {
          if (dc.type === 'percentage') {
            discountAmount = (subtotal * dc.value) / 100;
          } else {
            discountAmount = Math.min(dc.value, subtotal);
          }
          discountAmount = Math.round(discountAmount * 100) / 100;
          discountInfo = dc.code;
        }
      }
    }

    // --- 3. Calcular Envío ---
    let shippingCost = 0;
    if (deliveryMethod === 'pickup') {
        shippingCost = 0;
    } else {
        shippingCost = subtotal > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
    }

    // --- 4. Total Final (subtotal - descuento + envío, mínimo 0.50€ para Stripe) ---
    const totalAfterDiscount = Math.max(subtotal - discountAmount, 0);
    const totalAmount = totalAfterDiscount + shippingCost;
    const amountInCents = Math.max(Math.round(totalAmount * 100), 50); // Stripe mínimo 50 céntimos

    // --- 5. Crear Payment Intent ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        delivery_method: deliveryMethod === 'pickup' ? 'Recogida en Tienda' : 'Envío a Domicilio',
        discount_code: discountInfo || 'ninguno',
        discount_amount: discountAmount.toString(),
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      discountAmount,
      totalAmount,
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return new NextResponse(error.message, { status: 400 });
  }
}