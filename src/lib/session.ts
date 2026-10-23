// src/lib/session.ts
// Cliente con sesión iniciada en una ruta de API (solo servidor).

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/** id del usuario con sesión iniciada, o null. getUser() valida el token con Supabase. */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = cookies();
  try {
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}
