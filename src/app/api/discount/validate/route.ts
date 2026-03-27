// src/app/api/discount/validate/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { code, cartTotal, markUsed } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Código no proporcionado.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('active', true)
      .ilike('code', code.trim())
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, message: 'Código no válido o no existe.' });
    }

    // Comprobar caducidad
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Este código ha caducado.' });
    }

    // Comprobar usos máximos
    if (data.max_uses !== null && data.used_count >= data.max_uses) {
      return NextResponse.json({ valid: false, message: 'Este código ha alcanzado el límite de usos.' });
    }

    // Comprobar importe mínimo
    if (cartTotal < data.min_amount) {
      return NextResponse.json({
        valid: false,
        message: `Este código requiere un mínimo de ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(data.min_amount)}.`,
      });
    }

    // Calcular el descuento
    let discountAmount = 0;
    if (data.type === 'percentage') {
      discountAmount = (cartTotal * data.value) / 100;
    } else {
      discountAmount = Math.min(data.value, cartTotal);
    }
    discountAmount = Math.round(discountAmount * 100) / 100;

    // Si markUsed=true, incrementar el contador de usos
    if (markUsed) {
      await supabase
        .from('discount_codes')
        .update({ used_count: data.used_count + 1 })
        .eq('id', data.id);
    }

    return NextResponse.json({
      valid: true,
      message: data.type === 'percentage'
        ? `¡Código aplicado! ${data.value}% de descuento.`
        : `¡Código aplicado! ${data.value}€ de descuento.`,
      discount: {
        id: data.id,
        code: data.code,
        type: data.type,
        value: data.value,
        discountAmount,
      },
    });

  } catch (err: any) {
    return NextResponse.json({ valid: false, message: 'Error del servidor.' }, { status: 500 });
  }
}
