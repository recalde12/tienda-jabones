// src/lib/catalog.ts
// Lectura del catálogo en el servidor (misma tabla `products` y mismo cliente de Supabase
// que el resto de la web). `cache` evita repetir la consulta dentro de una misma petición.

import { cache } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { slugify, type Product } from "@/lib/products";

export const getCatalog = cache(async (): Promise<Product[]> => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(`Error al cargar los productos: ${error.message}`);
  return (data as Product[]) ?? [];
});

/** Igual que getCatalog, pero si la BD falla devuelve [] (para páginas que deben cargar igualmente). */
export async function getCatalogSafe(): Promise<Product[]> {
  // Leer las cookies FUERA del try: así el aviso interno de Next que marca la página como
  // dinámica no queda atrapado por el catch (si se atrapara, podría generarse la página vacía).
  cookies();
  try {
    return await getCatalog();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function indexBySlug(products: Product[]): Map<string, Product> {
  return new Map(products.map((p) => [slugify(p.name), p]));
}
