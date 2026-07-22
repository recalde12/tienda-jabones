// src/app/sitemap.ts
// Genera /sitemap.xml automáticamente con las páginas públicas.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas públicas indexables (las privadas/cuenta se excluyen en robots.ts).
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
