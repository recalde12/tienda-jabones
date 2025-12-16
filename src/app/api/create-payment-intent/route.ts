import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Inicializamos Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Mantenemos tu versión
});

// Inicializamos Supabase (para verificar precios en el futuro)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- CONSTANTES DE ENVÍO (Deben ser iguales al Frontend) ---
const COSTO_ENVIO = 4.50;
const UMBRAL_ENVIO_GRATIS = 40;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Aceptamos 'items' (que es lo que manda el nuevo frontend) o 'cart' por compatibilidad
    const cart = body.items || body.cart; 

    // --- 1. Calcular el Subtotal de los productos ---
    let subtotal = 0;
    
    // NOTA DE SEGURIDAD PARA PRODUCCIÓN:
    // Ahora mismo confiamos en el precio que viene del frontend (item.price).
    // Un usuario hacker podría modificar el JSON y poner precio: 0.
    // Lo ideal en el futuro es hacer:
    // const { data: product } = await supabase.from('products').eq('id', item.id)...
    // subtotal += product.price * item.quantity;
    
    for (const item of cart) {
        subtotal += item.price * item.quantity;
    }

    // --- 2. Calcular Gastos de Envío (Lógica del Servidor) ---
    // Si el subtotal supera el umbral, envío es 0, si no, es 4.50
    const shippingCost = subtotal > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;

    // --- 3. Calcular Total Final ---
    const totalAmount = subtotal + shippingCost;

    // Convertir a céntimos para Stripe (Evitamos decimales largos con Math.round)
    const amountInCents = Math.round(totalAmount * 100);

    // 4. Crear el Payment Intent en Stripe con el TOTAL CORRECTO
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 5. Devolver el 'client_secret' al frontend
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return new NextResponse(error.message, { status: 400 });
  }
}