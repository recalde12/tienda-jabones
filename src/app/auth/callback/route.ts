// src/app/auth/callback/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // --- CAMBIO IMPORTANTE ---
  // Preferimos usar la variable de entorno para asegurar que estamos en el dominio oficial.
  // Si no existe (ej. en localhost), usamos el origen de la petición.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  // Redirigimos a la raíz del sitio oficial
  return NextResponse.redirect(origin);
}