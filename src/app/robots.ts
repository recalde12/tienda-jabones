// src/app/robots.ts
// Genera /robots.txt automáticamente.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Zonas privadas / de cuenta que no aportan a Google.
      disallow: [
        "/admin",
        "/api/",
        "/checkout",
        "/carrito",
        "/success",
        "/perfil",
        "/pedidos",
        "/login",
        "/auth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
