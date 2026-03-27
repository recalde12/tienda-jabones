// src/app/api/discount/admin/route.ts
// Panel admin: listar, crear y dar de baja codigos de descuento.
// Protegida: requiere cookie de sesion admin (establecida por /api/admin/login).
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// Verificar cookie de sesion de admin
function isAuthorized(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === process.env.ADMIN_SECRET;
}
// GET /api/discount/admin -> listar todos los codigos
export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
// POST /api/discount/admin -> crear un nuevo codigo
export async function POST(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const body = await request.json();
  const { code, type, value, min_amount, max_uses, expires_at } = body;
  if (!code || !type || value === undefined) {
    return NextResponse.json({ error: 'Faltan campos obligatorios: code, type, value.' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('discount_codes')
    .insert({
      code: code.toUpperCase().trim(),
      type,
      value: parseFloat(value),
      min_amount: parseFloat(min_amount) || 0,
      max_uses: max_uses ? parseInt(max_uses) : null,
      expires_at: expires_at || null,
      active: true,
    })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ya existe un codigo con ese nombre.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
// PATCH /api/discount/admin -> activar o dar de baja un codigo
export async function PATCH(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const { id, active } = await request.json();
  if (id === undefined || active === undefined) {
    return NextResponse.json({ error: 'Faltan campos: id, active.' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('discount_codes')
    .update({ active })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
// DELETE /api/discount/admin -> borrar un codigo definitivamente
export async function DELETE(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Falta el id.' }, { status: 400 });
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}