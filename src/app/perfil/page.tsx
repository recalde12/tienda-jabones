// src/app/perfil/page.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoyaltyLevel } from "@/components/LoyaltyLevel";
import { ProfileForm } from "@/components/ProfileForm";

// Función para contar pedidos PAGADOS
async function getOrderCount(supabase: any, userId: string) {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true }) // 'head: true' solo cuenta, no descarga datos
    .eq('user_id', userId)
    .eq('status', 'paid');

  if (error) return 0;
  return count || 0;
}

export default async function PerfilPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Obtenemos cuántos pedidos pagados tiene
  const orderCount = await getOrderCount(supabase, session.user.id);

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-center text-stone-800 mb-2">
          Mi Perfil
        </h1>
        <p className="text-center text-stone-600 mb-10">Gestiona tus datos y consulta tu nivel VIP</p>

        {/* 1. Componente de Nivel VIP */}
        <LoyaltyLevel orderCount={orderCount} />

        {/* 2. Formulario de Datos Personales */}
        <ProfileForm user={session.user} />
        
      </div>
    </div>
  );
}