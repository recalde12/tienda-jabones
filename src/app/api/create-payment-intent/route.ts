// src/app/api/create-payment-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Inicializamos Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Inicializamos Supabase (para verificar precios en el futuro)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { cart } = await request.json(); // Recibimos el carrito

    // --- Lógica de Cálculo de Total (¡Importante!) ---
    // Aquí deberías recalcular el total en el backend
    // para asegurarte de que los precios son correctos.
    // Por ahora, lo calcularemos desde el 'cart' que nos llega,
    // pero en producción deberías consultar tu BBDD.

    let totalAmount = 0;
    for (const item of cart) {
        // En un caso real:
        // const { data: product } = await supabase.from('products').select('price').eq('id', item.id).single();
        // totalAmount += product.price * item.quantity;

        // Por simplicidad ahora:
        totalAmount += item.price * item.quantity;
    }

    // Convertir a céntimos para Stripe
    const amountInCents = Math.round(totalAmount * 100);

    // 1. Crear el Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 2. Devolver el 'client_secret' al frontend
    // El frontend necesita esto para confirmar el pago.
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return new NextResponse(error.message, { status: 400 });
  }
}