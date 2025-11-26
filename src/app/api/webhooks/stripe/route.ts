// src/app/api/webhooks/stripe/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend'; // Importamos Resend
import { headers } from 'next/headers';

// Inicializamos Stripe y Resend
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Asegúrate de usar una versión API compatible
});
const resend = new Resend(process.env.RESEND_API_KEY!); // Usa tu clave de Resend
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Lo obtendremos de Stripe

// Tu dirección de email donde quieres recibir las notificaciones
const ownerEmail = 'laflordemalaura@gmail.com'; // <-- REEMPLAZA ESTO

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  // 1. Verificar que el evento vino de Stripe
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Error en la verificación de la firma del webhook: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 2. Manejar el evento 'payment_intent.succeeded' (pago exitoso)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`¡PaymentIntent ${paymentIntent.id} exitoso!`);

    // --- Enviar Notificación por Email ---
    try {
      // Aquí podrías buscar más detalles del pedido en Supabase si lo necesitas,
      // usando el paymentIntent.id que guardaste en la tabla 'orders'.
      // Por ahora, enviaremos una notificación básica.

      await resend.emails.send({
        from: 'Tienda Malaura <onboarding@resend.dev>', // Necesitas un dominio verificado en Resend
        to: [ownerEmail],
        subject: '🎉 ¡Nuevo Pedido en Jabones Malaura!',
        html: `
          <h1>¡Has recibido un nuevo pedido!</h1>
          <p><strong>ID de Pago Stripe:</strong> ${paymentIntent.id}</p>
          <p><strong>Importe:</strong> ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}</p>
          <p>Revisa tu panel de Supabase o Stripe para ver los detalles completos del pedido.</p>
        `,
      });
      console.log('Email de notificación enviado con éxito.');

    } catch (emailError) {
      console.error('Error al enviar el email de notificación:', emailError);
      // No fallar el webhook solo porque el email falle, pero regístralo.
    }
    // --- Fin de Notificación por Email ---

  } else {
    console.warn(`Tipo de evento no manejado: ${event.type}`);
  }

  // 3. Confirmar la recepción del evento a Stripe
  return NextResponse.json({ received: true });
}