// src/components/CookieBanner.tsx
// Banner de consentimiento de cookies (RGPD) integrado con Google Consent Mode v2.
// Guarda la elección en localStorage y actualiza el consentimiento de GTM/Analytics.

"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CONSENT_KEY = "cookie-consent"; // 'granted' | 'denied'

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // Si localStorage no está disponible, mostramos el banner igualmente.
      setVisible(true);
    }
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
    } catch {
      /* noop */
    }

    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5">
      <div className="mx-auto max-w-4xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 text-sm text-stone-600 leading-relaxed">
          <p className="font-semibold text-stone-800 mb-1">🍪 Usamos cookies</p>
          Utilizamos cookies propias y de terceros para analizar el uso de la web y mejorar tu
          experiencia. Puedes aceptarlas o rechazarlas. Las cookies necesarias para el funcionamiento
          (carrito y sesión) están siempre activas.
        </div>
        <div className="flex gap-3 shrink-0 sm:flex-col md:flex-row">
          <button
            onClick={() => setConsent(false)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-semibold text-stone-700 border border-stone-300 hover:bg-stone-100 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => setConsent(true)}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-stone-800 hover:bg-stone-900 transition-colors shadow-sm"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
