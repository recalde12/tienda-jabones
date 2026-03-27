// src/app/api/admin/login/route.ts
// Valida la contraseña de admin y establece una cookie de sesión httpOnly.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }

  // Establecer cookie segura httpOnly (no accesible desde JS del navegador)
  const cookieStore = cookies();
  cookieStore.set('admin_session', process.env.ADMIN_SECRET!, {
    httpOnly: true,       // No accesible por JavaScript del cliente
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict',   // Protección CSRF
    maxAge: 60 * 60 * 8,  // 8 horas
    path: '/',       // Accesible en todas las rutas para que el middleware pueda leerla
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  // Cerrar sesión: borrar la cookie
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ ok: true });
}