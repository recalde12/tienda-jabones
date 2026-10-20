// src/components/MapEmbed.tsx
// Mapa de Google "bajo demanda": no carga el iframe (≈400 KB de JS y cookies de
// Google) hasta que el usuario lo pide. Mejora mucho la velocidad de la home.

"use client";

import { useState } from "react";

export function MapEmbed({
  embedUrl,
  mapsUrl,
  address,
  title,
}: {
  embedUrl: string;
  mapsUrl: string;
  address: string;
  title: string;
}) {
  const [showMap, setShowMap] = useState(false);

  if (showMap) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-stone-200 p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <p className="text-stone-700 font-semibold max-w-xs">{address}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="px-5 py-2.5 rounded-full bg-stone-800 text-white text-sm font-semibold hover:bg-stone-900 transition-colors"
        >
          Ver mapa aquí
        </button>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full border border-stone-400 text-stone-800 text-sm font-semibold hover:bg-white transition-colors"
        >
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
}
