// src/app/pedidos/page.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

// --- ¡¡AQUÍ ESTÁ LA DEFINICIÓN QUE FALTABA!! ---
async function getOrdersData(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      total_amount,
      status,
      order_items (
        quantity,
        price_per_unit,
        products (
          name,
          image_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], paidOrderCount: 0 };
  }

  const paidOrderCount = data.filter((order: any) => order.status === 'paid').length;

  return { orders: data, paidOrderCount };
}
// --- FIN DE LA DEFINICIÓN ---


// --- Componente para la barra de progreso (sin cambios) ---
function RewardProgress({ count }: { count: number }) {
  const goal = 15;
  const progress = (count % goal); 
  const percentage = Math.floor((progress / goal) * 100);
  const rewardsEarned = Math.floor(count / goal);

  return (
    <div className="bg-amber-100 p-6 rounded-lg shadow-md mb-12 border border-amber-200">
      <h2 className="text-2xl font-semibold text-stone-800 mb-4">
        🎁 Tu Programa de Fidelidad
      </h2>
      <p className="text-lg text-stone-800 mb-1">
        Llevas <span className="font-bold">{count}</span> pedidos completados.
      </p>
      
      {rewardsEarned > 0 && (
         <p className="text-md text-green-700 font-semibold mb-3">
           ¡Has conseguido {rewardsEarned} jabón{rewardsEarned > 1 ? 'es' : ''} gratis hasta ahora! 🎉
         </p>
      )}

      <p className="text-lg text-stone-800 mb-2">
        Consigue un jabón gratis cada 15 pedidos. ¡Te faltan <span className="font-bold">{goal - progress}</span> para el próximo!
      </p>
      <div className="w-full bg-stone-200 rounded-full h-4 overflow-hidden">
        <div 
          // Usamos un color estándar para la barra
          className="bg-stone-700 h-4 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
       <p className="text-right text-sm text-stone-800 mt-1">{progress}/{goal}</p>
    </div>
  );
}


export default async function PedidosPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // --- Ahora esta llamada SÍ encontrará la función ---
  const { orders, paidOrderCount } = await getOrdersData(supabase, session.user.id);

  return (
    // Usamos un color estándar para el fondo
    <div className="bg-stone-50 min-h-screen"> 
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-stone-800 mb-12 font-serif">
          Historial de Pedidos
        </h1>

        <RewardProgress count={paidOrderCount} />

        {orders.length === 0 ? (
          <p className="text-center text-xl text-stone-600">
            Aún no has realizado ningún pedido.
          </p>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-200">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                      Pedido #{order.id}
                    </h2>
                    <p className="text-stone-500">
                      Realizado el: {new Date(order.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-stone-900">
                      Total: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(order.total_amount)}
                    </p>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>
                </div>

                <h3 className="text-md font-semibold text-stone-900 mb-3">Artículos del pedido:</h3>
                <div className="space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={`${order.id}-${item.products.name}`} className="flex items-center">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 border border-stone-200">
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="64px" 
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-stone-900">{item.products.name}</h4>
                        <p className="text-sm text-stone-600">
                          {item.quantity} x {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.price_per_unit)}
                        </p>
                      </div>
                      <p className="font-semibold text-stone-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.quantity * item.price_per_unit)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}