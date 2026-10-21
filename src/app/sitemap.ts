// src/app/sitemap.ts
// Genera /sitemap.xml automáticamente con las páginas públicas y una entrada por producto.

import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/site";
import { productPath } from "@/lib/products";

// Se regenera cada hora, así los productos nuevos aparecen solos sin redesplegar.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Páginas públicas indexables (las privadas/cuenta se excluyen en robots.ts).
  const pages: MetadataRoute.Sitemap = [
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
    {
      url: `${SITE_URL}/bodas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/devoluciones`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Una entrada por producto. Si la BD falla, servimos al menos las páginas de arriba.
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const { data } = await supabase.from("products").select("name");
      for (const product of data ?? []) {
        pages.push({
          url: `${SITE_URL}${productPath(product)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error("sitemap: no se pudieron cargar los productos", error);
  }

  return pages;
}
