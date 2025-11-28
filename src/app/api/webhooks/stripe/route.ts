import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});
const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// --- IMPORTANTE: Usamos la Service Role Key para tener permisos de admin ---
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ownerEmail = 'laflordemalaura@gmail.com'; // <--- PON AQUÍ TU EMAIL REAL
const senderEmail = 'Pedidos Malaura <onboarding@resend.dev>'; // O tu dominio verificado

// Función de espera (para dar tiempo a que se guarde el pedido en la BD)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`💰 Pago recibido: ${paymentIntent.id}`);

    // 1. ESPERAR: Damos 3 segundos para asegurar que el frontend guardó el pedido en Supabase
    await sleep(3000);

    try {
      // 2. BUSCAR EL PEDIDO ACTUAL EN SUPABASE
      // Buscamos por el ID de pago de Stripe que guardamos en la tabla 'orders'
      const { data: currentOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_per_unit,
            products (name)
          )
        `)
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single();

      if (orderError || !currentOrder) {
        throw new Error("No se encontró el pedido en Supabase a tiempo.");
      }

      // 3. CALCULAR HISTORIAL Y PREMIOS
      // Contamos cuántos pedidos pagados tiene este email en total
      const { count: totalOrders, error: countError } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('customer_email', currentOrder.customer_email)
        .eq('status', 'paid');

      const orderNumber = totalOrders || 1; // Por si acaso es null
      const isMilestone = orderNumber % 15 === 0; // ¿Es múltiplo de 15?
      
      // Calculamos el nivel actual
      let nivel = "Bronce";
      if (orderNumber >= 60) nivel = "Platino";
      else if (orderNumber >= 45) nivel = "Diamante";
      else if (orderNumber >= 30) nivel = "Oro";
      else if (orderNumber >= 15) nivel = "Plata";

      // 4. PREPARAR LISTA DE PRODUCTOS (HTML)
      const productsHtml = currentOrder.order_items.map((item: any) => `
        <li style="margin-bottom: 5px;">
          <strong>${item.products.name}</strong> - Cantidad: ${item.quantity} 
          (${item.price_per_unit}€/ud)
        </li>
      `).join('');

      // ---------------------------------------------------------
      // 5. ENVIAR EMAIL AL ADMINISTRADOR (A TI)
      // ---------------------------------------------------------
      const adminSubject = isMilestone 
        ? `🎁 ¡ALERTA PREMIO! Pedido #${currentOrder.id} (Nivel ${nivel})` 
        : `Nuevo Pedido #${currentOrder.id} - ${currentOrder.customer_name}`;

      const adminHtml = `
        <div style="font-family: sans-serif; color: #333;">
          <h1>Nuevo Pedido Recibido</h1>
          ${isMilestone ? `
            <div style="background-color: #fef08a; padding: 15px; border: 2px solid #eab308; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #854d0e; margin-top:0;">🎉 ¡ATENCIÓN: PREMIO!</h2>
              <p>Este cliente ha realizado su <strong>pedido número ${orderNumber}</strong>.</p>
              <p>Ha alcanzado/mantenido el nivel <strong>${nivel}</strong>.</p>
              <p><strong>Recuerda incluir el regalo correspondiente en el paquete.</strong></p>
            </div>
          ` : ''}
          
          <h3>Detalles del Cliente</h3>
          <p><strong>Nombre:</strong> ${currentOrder.customer_name}</p>
          <p><strong>Email:</strong> ${currentOrder.customer_email}</p>
          <p><strong>Dirección:</strong> ${currentOrder.shipping_address}</p>
          <p><strong>Historial:</strong> Pedido número ${orderNumber} (Nivel ${nivel})</p>

          <h3>Productos</h3>
          <ul>${productsHtml}</ul>
          
          <p><strong>Total:</strong> ${currentOrder.total_amount} €</p>
        </div>
      `;

      await resend.emails.send({
        from: senderEmail,
        to: [ownerEmail],
        subject: adminSubject,
        html: adminHtml,
      });

      // ---------------------------------------------------------
      // 6. ENVIAR EMAIL AL CLIENTE
      // ---------------------------------------------------------
      const customerHtml = `
        <div style="font-family: sans-serif; color: #333;">
          <h1 style="color: #8D7B68;">¡Gracias por tu pedido, ${currentOrder.customer_name}!</h1>
          <p>Hemos recibido tu pedido correctamente y ya estamos preparándolo con mucho cariño.</p>
          
          <div style="background-color: #FBF9F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Resumen del Pedido #${currentOrder.id}</h3>
            <ul>${productsHtml}</ul>
            <p style="font-size: 1.2em; font-weight: bold;">Total: ${currentOrder.total_amount} €</p>
          </div>

          ${isMilestone ? `
            <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; color: #166534;">
              <h3>🎁 ¡Felicidades!</h3>
              <p>Este es tu pedido número <strong>${orderNumber}</strong>. Como agradecimiento a tu fidelidad, 
              hemos incluido un <strong>regalo especial</strong> en tu paquete.</p>
            </div>
          ` : `
            <p style="color: #666; font-size: 0.9em;">
              Llevas <strong>${orderNumber}</strong> pedidos. 
              ¡Recuerda que al llegar a 15 pedidos recibirás un regalo exclusivo!
            </p>
          `}

          <p>Te avisaremos cuando tu pedido haya sido enviado.</p>
          <p>Atentamente,<br/>El equipo de La Flor de Malaura 🌿</p>
        </div>
      `;

      await resend.emails.send({
        from: senderEmail,
        to: [currentOrder.customer_email],
        subject: 'Confirmación de tu pedido - La Flor de Malaura',
        html: customerHtml,
      });

      console.log('✅ Emails enviados correctamente (Admin y Cliente)');

    } catch (error: any) {
      console.error('❌ Error procesando el pedido post-pago:', error);
      // No devolvemos error 400 a Stripe porque el pago sí fue real, 
      // solo falló nuestro proceso interno de email.
    }
  }

  return NextResponse.json({ received: true });
}