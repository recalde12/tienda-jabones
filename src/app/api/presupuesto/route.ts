// src/app/api/presupuesto/route.ts
// Formulario de presupuesto de /bodas: envía la solicitud por email a la tienda con Resend.
// No se guarda nada en la BD. Al responder al email se contesta directamente al cliente (replyTo).

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { siteConfig } from '@/lib/site';

const resend = new Resend(process.env.RESEND_API_KEY!);
// Mismo dominio verificado en Resend que los emails de pedidos (webhook de Stripe)
const sender = 'Presupuestos Malaura <pedidos@laflordemalaura.com>';
// Destino: el email de la tienda. QUOTE_EMAIL_TO permite cambiarlo sin tocar código.
const recipient = process.env.QUOTE_EMAIL_TO || siteConfig.business.email;

// Longitud máxima de cada campo (lo que sobre se recorta)
const LIMITS = {
  nombre: 80,
  email: 120,
  telefono: 30,
  evento: 40,
  fecha: 10,
  invitados: 6,
  aroma: 200,
  mensaje: 2000,
} as const;
type Field = keyof typeof LIMITS;

// Freno básico contra envíos masivos: máximo 5 solicitudes por IP cada 10 minutos.
// Vive en memoria de cada instancia del servidor; suficiente para un formulario pequeño.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentByIp = new Map<string, number[]>();

function tooManyRequests(ip: string): boolean {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  recentByIp.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const error = (message: string, status = 400) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error('Solicitud no válida.');
  }

  // Campo trampa: está oculto, solo lo rellenan los bots. Respondemos "ok" sin enviar nada.
  if (typeof body.web === 'string' && body.web.trim()) {
    return NextResponse.json({ ok: true });
  }

  const get = (key: Field) =>
    typeof body[key] === 'string' ? (body[key] as string).trim().slice(0, LIMITS[key]) : '';
  const data = Object.fromEntries((Object.keys(LIMITS) as Field[]).map((k) => [k, get(k)])) as Record<Field, string>;

  if (!data.nombre) return error('Escribe tu nombre.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return error('Escribe un email válido para poder responderte.');

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (tooManyRequests(ip)) {
    return error('Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos o escríbenos por WhatsApp.', 429);
  }

  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(data.fecha)
    ? new Date(`${data.fecha}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const evento = data.evento || 'Evento';

  const rows: [string, string][] = (
    [
      ['Nombre', data.nombre],
      ['Email', data.email],
      ['Teléfono', data.telefono],
      ['Tipo de evento', evento],
      ['Fecha del evento', fecha],
      ['Número de invitados', data.invitados],
      ['Aroma o colores', data.aroma],
    ] as [string, string][]
  ).filter(([, value]) => value);

  // Sin saltos de línea en el asunto
  const subject = `Presupuesto: ${evento}${fecha ? ` · ${fecha}` : ''} · ${data.nombre}`.replace(/[\r\n]+/g, ' ');

  const html = `
    <div style="font-family: sans-serif; color: #2A201A; max-width: 600px;">
      <h1 style="font-size: 22px;">Nueva solicitud de presupuesto</h1>
      <table style="border-collapse: collapse; width: 100%;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 6px 12px 6px 0; color: #5A4B40; white-space: nowrap; vertical-align: top;"><strong>${label}</strong></td>
            <td style="padding: 6px 0;">${escapeHtml(value)}</td>
          </tr>`
          )
          .join('')}
      </table>
      ${data.mensaje ? `<h2 style="font-size: 16px; margin-top: 20px;">Más detalles</h2><p style="white-space: pre-wrap;">${escapeHtml(data.mensaje)}</p>` : ''}
      <p style="margin-top: 24px; color: #5A4B40; font-size: 14px;">Responde a este email para contestar directamente a ${escapeHtml(data.nombre)}.</p>
    </div>
  `;
  const text = [
    'Nueva solicitud de presupuesto',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(data.mensaje ? ['', 'Más detalles:', data.mensaje] : []),
  ].join('\n');

  try {
    const { error: sendError } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: data.email,
      subject,
      html,
      text,
    });
    if (sendError) throw sendError;
  } catch (err) {
    console.error('❌ Error enviando la solicitud de presupuesto:', err);
    return error('No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.', 502);
  }

  return NextResponse.json({ ok: true });
}
