// src/middleware.ts
// Protege todas las rutas /admin/* a nivel de servidor.
// Si no hay cookie de sesión válida, redirige al login de admin.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo protegemos las rutas /admin/* EXCEPTO /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSession = request.cookies.get('admin_session');
    const adminSecret = process.env.ADMIN_SECRET;

    // Si no hay cookie o no coincide con el secret → redirigir al login
    if (!adminSession || adminSession.value !== adminSecret) {
      const loginUrl = new URL('/admin/login', request.url);
      // Guardamos la URL de destino para redirigir después del login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Indicamos a Next.js en qué rutas debe ejecutarse el middleware
export const config = {
  matcher: ['/admin/:path*'],
};