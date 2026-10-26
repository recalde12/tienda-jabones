// src/components/CookieBanner.tsx
// Banner de consentimiento de cookies (RGPD) integrado con Google Consent Mode v2.
// Guarda la elección en localStorage y actualiza el consentimiento de GTM/Analytics.
// CookieSettingsButton (pie de página y /cookies) vuelve a abrir el banner para cambiar la elección.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CONSENT_KEY = "cookie-consent"; // 'granted' | 'denied'
const OPEN_EVENT = "cookie-settings:open";

/** Borra las cookies de Google Analytics ya guardadas (al rechazar o retirar el consentimiento). */
function deleteAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // Si localStorage no está disponible, mostramos el banner igualmente.
      setVisible(true);
    }
    const open = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const setConsent = (granted: boolean) => {
    const value = granted ? "granted" : "denied";

    // Actualiza el estado de consentimiento en GTM (Consent Mode v2)
    try {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      }
      // @ts-expect-error gtag usa arguments igual que el snippet oficial de Google
      gtag("consent", "update", {
        analytics_storage: value,
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
      });
      // Aviso para Tag Manager: la etiqueta de Analytics exige consentimiento, así que con
      // este evento empieza a medir en esta misma página (activador «Consentimiento aceptado»)
      if (granted) window.dataLayer.push({ event: "consent_granted" });
    } catch {
      /* noop */
    }
    if (!granted) deleteAnalyticsCookies();

    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  if (!visible) return null;

  // Rechazar y aceptar con el mismo peso visual (guía de cookies de la AEPD)
  const button =
    "flex-1 sm:flex-none min-h-[44px] px-6 rounded-full text-sm font-bold border-2 border-espresso text-espresso hover:bg-espresso hover:text-cream transition-colors";

  return (
    <div role="dialog" aria-label="Aviso de cookies" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5">
      <div className="mx-auto max-w-4xl bg-cream rounded-2xl shadow-2xl border border-line p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 text-sm text-cocoa leading-relaxed">
          <p className="font-bold text-espresso mb-1">Usamos cookies</p>
          Con tu permiso usamos cookies de análisis para saber cómo se usa la web y mejorarla. Las necesarias para iniciar
          sesión y pagar de forma segura están siempre activas.{" "}
          {/* Texto descriptivo: Google penaliza enlaces genéricos como «Más información» */}
          <Link href="/cookies" className="font-bold text-honey-dark underline underline-offset-4">Ver la política de cookies</Link>
        </div>
        <div className="flex gap-3 shrink-0 sm:flex-col md:flex-row">
          <button type="button" onClick={() => setConsent(false)} className={button}>
            Rechazar
          </button>
          <button type="button" onClick={() => setConsent(true)} className={button}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

/** Botón «Configurar cookies»: vuelve a mostrar el banner para aceptar o rechazar. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Configurar cookies
    </button>
  );
}
