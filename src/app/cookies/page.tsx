// src/app/cookies/page.tsx
// Política de cookies (LSSI-CE art. 22.2 y guía de cookies de la AEPD).
// Si se activan nuevas herramientas en Google Tag Manager, añade aquí sus cookies.

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies usa la web de La Flor de Malaura, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu elección.",
  alternates: { canonical: "/cookies" },
};

// Fecha de la última revisión de este texto (actualízala si lo cambias)
const LAST_UPDATED = "23 de octubre de 2026";

const h2 = "font-serif text-2xl sm:text-3xl font-semibold text-espresso mt-12 mb-4";
const p = "text-[17px] leading-[1.75] text-cocoa mb-4";
const li = "text-[17px] leading-[1.75] text-cocoa";
const link = "text-honey-dark underline underline-offset-4";

type CookieRow = { name: string; provider: string; purpose: string; duration: string };

const necessary: CookieRow[] = [
  { name: "sb-…-auth-token", provider: "La Flor de Malaura (Supabase)", purpose: "Mantener tu sesión iniciada en tu cuenta.", duration: "Hasta que cierras sesión" },
  { name: "cookie-consent (almacenamiento local)", provider: "La Flor de Malaura", purpose: "Recordar si has aceptado o rechazado las cookies de análisis.", duration: "Hasta que la borres o cambies tu elección" },
  { name: "__stripe_mid", provider: "Stripe", purpose: "Prevenir el fraude al pagar con tarjeta.", duration: "1 año" },
  { name: "__stripe_sid", provider: "Stripe", purpose: "Prevenir el fraude al pagar con tarjeta.", duration: "30 minutos" },
  { name: "admin_session", provider: "La Flor de Malaura", purpose: "Sesión del panel de administración (solo para el personal de la tienda).", duration: "8 horas" },
];

const analytics: CookieRow[] = [
  { name: "_ga", provider: "Google Analytics", purpose: "Distinguir visitantes para obtener estadísticas de uso de la web.", duration: "2 años" },
  { name: "_ga_<ID>", provider: "Google Analytics", purpose: "Mantener el estado de la visita para las estadísticas.", duration: "2 años" },
];

function CookieList({ rows }: { rows: CookieRow[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-4 mb-6">
      {rows.map((c) => (
        <li key={c.name} className="rounded-[18px] border border-line bg-white/60 p-4 flex flex-col gap-1.5">
          <code className="font-mono text-[15px] font-bold text-espresso break-words">{c.name}</code>
          <span className="text-[15px] text-cocoa"><strong className="text-espresso">Quién:</strong> {c.provider}</span>
          <span className="text-[15px] text-cocoa"><strong className="text-espresso">Para qué:</strong> {c.purpose}</span>
          <span className="text-[15px] text-cocoa"><strong className="text-espresso">Duración:</strong> {c.duration}</span>
        </li>
      ))}
    </ul>
  );
}

const browsers = [
  { name: "Chrome", href: "https://support.google.com/chrome/answer/95647?hl=es" },
  { name: "Firefox", href: "https://support.mozilla.org/es/kb/Borrar%20cookies" },
  { name: "Safari", href: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
  { name: "Edge", href: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
];

export default function CookiesPage() {
  const { business, legal } = siteConfig;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[{ name: "Inicio", path: "/" }, { name: "Política de cookies", path: "/cookies" }]} />

      <article className="max-w-[760px] mx-auto">
        <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">Información legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-espresso mt-3 leading-tight">Política de cookies</h1>
        <p className="text-sm text-cocoa mt-3">Última actualización: {LAST_UPDATED}</p>

        <h2 className={h2}>1. Qué son las cookies</h2>
        <p className={p}>
          Las cookies son pequeños archivos que una web guarda en tu navegador para recordar información sobre tu visita.
          Llamamos también «cookies» a tecnologías parecidas, como el almacenamiento local del navegador. Esta web es de{" "}
          {legal.owner} ({siteConfig.name}).
        </p>

        <h2 className={h2}>2. Cookies necesarias</h2>
        <p className={p}>
          Son imprescindibles para que la web funcione: iniciar sesión, pagar de forma segura y recordar tu elección sobre las
          cookies. Por eso están siempre activas y no necesitan tu consentimiento (artículo 22.2 de la LSSI-CE).
        </p>
        <CookieList rows={necessary} />
        <p className={p}>
          Si inicias sesión con tu cuenta de Google, Google usa sus propias cookies en sus páginas para identificarte.
        </p>

        <h2 className={h2}>3. Cookies de análisis (solo si las aceptas)</h2>
        <p className={p}>
          Nos ayudan a saber cuántas personas visitan la web y qué páginas usan más, para mejorarla. Solo se instalan si pulsas
          «Aceptar» en el aviso de cookies. Las gestionamos con Google Tag Manager, que no instala cookies por sí mismo y no
          activa ninguna herramienta de análisis hasta que das tu consentimiento.
        </p>
        <CookieList rows={analytics} />
        <p className={p}>
          Google puede tratar estos datos fuera de la Unión Europea con las garantías que exige el RGPD. Puedes leer cómo los
          usa en su{" "}
          <a href="https://policies.google.com/technologies/partner-sites?hl=es" target="_blank" rel="noopener noreferrer" className={link}>
            información sobre el uso de datos
          </a>
          . No usamos cookies de publicidad.
        </p>

        <h2 className={h2}>4. Cómo aceptar, rechazar o cambiar tu elección</h2>
        <p className={p}>
          La primera vez que entras te preguntamos si aceptas las cookies de análisis; rechazarlas es igual de fácil que
          aceptarlas y no te impide usar la web. Puedes cambiar de opinión cuando quieras:
        </p>
        <div className="mb-6">
          <CookieSettingsButton className="inline-flex items-center min-h-[48px] px-6 rounded-full bg-espresso text-cream font-bold hover:bg-black transition-colors" />
        </div>
        <p className={p}>
          También puedes borrar o bloquear las cookies desde la configuración de tu navegador:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          {browsers.map((b) => (
            <li key={b.name} className={li}>
              <a href={b.href} target="_blank" rel="noopener noreferrer" className={link}>{b.name}</a>
            </li>
          ))}
        </ul>
        <p className={p}>
          Si bloqueas las cookies necesarias, es posible que no puedas iniciar sesión ni pagar.
        </p>

        <h2 className={h2}>5. Más información</h2>
        <p className={p}>
          Para saber cómo tratamos tus datos personales, consulta la{" "}
          <Link href="/privacidad" className={link}>política de privacidad</Link>. Si tienes cualquier duda, escríbenos a{" "}
          <a href={`mailto:${business.email}`} className={link}>{business.email}</a>.
        </p>

        <p className="text-cocoa mt-12">
          <Link href="/" className="font-bold text-honey-dark underline underline-offset-4">← Volver a la tienda</Link>
        </p>
      </article>
    </div>
  );
}
