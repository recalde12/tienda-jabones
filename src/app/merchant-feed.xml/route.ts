// src/app/merchant-feed.xml/route.ts
// Feed de productos para Google Merchant Center (fichas gratuitas en Google Shopping) y
// para el catálogo de Meta (Instagram / Facebook Shopping): /merchant-feed.xml
// Formato RSS 2.0 de Google. Se genera desde la BD y se actualiza cada hora.

import { createClient } from "@supabase/supabase-js";
import { CATEGORY_LABELS, SOAP_CATEGORIES, formatWeight, productPath, slugify, type Product } from "@/lib/products";
import { productSeo } from "@/lib/seo";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";
import { SITE_URL, siteConfig } from "@/lib/site";

export const revalidate = 3600;

const xml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

const absolute = (src: string) => (/^https?:\/\//.test(src) ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`);
const eur = (n: number) => `${n.toFixed(2)} EUR`;

function item(p: Product): string {
  const seo = productSeo(p, slugify(p.name));
  const weight = formatWeight(p);
  const isSoap = !!p.category && SOAP_CATEGORIES.includes(p.category);
  const price = Number(p.price);
  // Textos de lib/seo.ts (revisados, sin alegaciones médicas) + datos de la tienda
  const description = [
    seo.description,
    isSoap ? "Sin parabenos ni sulfatos y cruelty-free." : "",
    "Envío a toda España o recogida gratis en nuestra tienda de San Martín de la Vega (Madrid).",
  ].filter(Boolean).join(" ");

  return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${xml(`${seo.headline} · ${p.name}${weight ? ` (${weight})` : ""}`)}</g:title>
      <g:description>${xml(description)}</g:description>
      <g:link>${xml(`${SITE_URL}${productPath(p)}`)}</g:link>
      <g:image_link>${xml(absolute(p.image_url))}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${eur(price)}</g:price>
      <g:brand>${xml(siteConfig.name)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${xml(CATEGORY_LABELS[p.category ?? ""] ?? "Productos")}</g:product_type>
      <g:shipping>
        <g:country>ES</g:country>
        <g:service>Envío a domicilio</g:service>
        <g:price>${eur(price > FREE_SHIPPING_OVER ? 0 : SHIPPING_COST)}</g:price>
      </g:shipping>${weight ? `\n      <g:shipping_weight>${weight}</g:shipping_weight>` : ""}
    </item>`;
}

export async function GET() {
  let products: Product[] = [];
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, image_url, category, weight_grams")
      .order("id");
    if (error) throw error;
    products = (data ?? []) as Product[];
  } catch (error) {
    console.error("merchant-feed: no se pudieron cargar los productos", error);
    return new Response("Feed no disponible", { status: 503 });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(siteConfig.name)}</title>
    <link>${SITE_URL}</link>
    <description>${xml(siteConfig.description)}</description>${products.map(item).join("")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
