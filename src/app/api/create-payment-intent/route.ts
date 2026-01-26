import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Inicializamos Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Mantenemos tu versión
});

// Inicializamos Supabase
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
    
    // Aceptamos 'items' o 'cart'
    const cart = body.items || body.cart; 
    
    // --- NUEVO: Recibimos el método de entrega (por defecto 'shipping') ---
    const deliveryMethod = body.deliveryMethod || 'shipping'; 

    // --- 1. Calcular el Subtotal de los productos ---
    let subtotal = 0;
    
    // (Mantenemos tu nota de seguridad sobre validar precios en el futuro)
    for (const item of cart) {
        subtotal += item.price * item.quantity;
    }

    // --- 2. Calcular Gastos de Envío (Lógica Actualizada) ---
    let shippingCost = 0;

    if (deliveryMethod === 'pickup') {
        // Si es recogida en tienda, el coste es SIEMPRE 0
        shippingCost = 0;
    } else {
        // Si es envío a domicilio, aplicamos la lógica del umbral
        shippingCost = subtotal > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
    }

    // --- 3. Calcular Total Final ---
    const totalAmount = subtotal + shippingCost;

    // Convertir a céntimos para Stripe
    const amountInCents = Math.round(totalAmount * 100);

    // 4. Crear el Payment Intent en Stripe con el TOTAL CORRECTO
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      // --- NUEVO: Guardamos en Stripe si es para recoger o enviar ---
      metadata: {
        delivery_method: deliveryMethod === 'pickup' ? 'Recogida en Tienda' : 'Envío a Domicilio'
      }
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