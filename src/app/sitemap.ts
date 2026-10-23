// src/app/sitemap.ts
// Genera /sitemap.xml automáticamente con las páginas públicas y una entrada por producto.

import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/site";
import { productPath } from "@/lib/products";
import { GIFT_PAGE, NEED_PAGES } from "@/lib/landing";

// Se regenera cada hora, así los productos nuevos aparecen solos sin redesplegar.
export const revalidate = 3600;

// Fecha de la última revisión del contenido de las páginas fijas. Google solo hace caso de
// lastmod si es fiable, así que no ponemos «hoy» en todas: actualízala al cambiar los textos.
const CONTENT_UPDATED = new Date("2026-10-23");
const LEGAL_UPDATED = new Date("2026-10-23");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" | "yearly", lastModified = CONTENT_UPDATED) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  // Páginas públicas indexables (las privadas/cuenta se excluyen en robots.ts).
  const pages: MetadataRoute.Sitemap = [
    { ...page("", 1, "weekly"), url: SITE_URL },
    page("/productos", 0.9, "daily"),
    page(GIFT_PAGE.path, 0.9, "weekly"),
    ...NEED_PAGES.map((p) => page(p.path, 0.8, "monthly")),
    page("/bodas", 0.8, "monthly"),
    page("/devoluciones", 0.3, "yearly", LEGAL_UPDATED),
    page("/aviso-legal", 0.2, "yearly", LEGAL_UPDATED),
    page("/privacidad", 0.2, "yearly", LEGAL_UPDATED),
    page("/cookies", 0.2, "yearly", LEGAL_UPDATED),
  ];

  // Una entrada por producto. Si la BD falla, servimos al menos las páginas de arriba.
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const { data } = await supabase.from("products").select("name, created_at");
      for (const product of data ?? []) {
        // La ficha cambia como muy pronto al desplegar textos nuevos: la fecha más reciente de las dos
        const created = product.created_at ? new Date(product.created_at) : CONTENT_UPDATED;
        pages.push({
          url: `${SITE_URL}${productPath(product)}`,
          lastModified: created > CONTENT_UPDATED ? created : CONTENT_UPDATED,
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
