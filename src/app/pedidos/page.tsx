// src/app/pedidos/page.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

// --- FUNCIÓN DE DATOS ---
async function getOrdersData(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      total_amount,
      status,
      shipping_address,  
      order_items (
        quantity,
        price_per_unit,
        products (
          name,
          image_url
        )
      )
    `)
    // ^^^ HE AÑADIDO 'shipping_address' ARRIBA, ES NECESARIO PARA LA LÓGICA
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], paidOrderCount: 0 };
  }

  const paidOrderCount = data.filter((order: any) => order.status === 'paid').length;

  return { orders: data, paidOrderCount };
}

// --- Componente para la barra de progreso ---
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

  const { orders, paidOrderCount } = await getOrdersData(supabase, session.user.id);

  return (
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
            {orders.map((order: any) => {
              
              // --- LÓGICA DE DETECCIÓN DE RECOGIDA ---
              const esRecogida = order.shipping_address?.includes("RECOGIDA EN TIENDA");

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                  
                  {/* CABECERA DEL PEDIDO */}
                  <div className="p-6 pb-4 border-b border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-semibold text-stone-900">
                          Pedido #{order.id}
                        </h2>
                        <p className="text-stone-500 text-sm">
                          {new Date(order.created_at).toLocaleDateString('es-ES', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-stone-900">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(order.total_amount)}
                        </p>
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                          order.status === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* --- NUEVA SECCIÓN: DETALLES DE ENVÍO / RECOGIDA --- */}
                  <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
                    {esRecogida ? (
                      <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-100 w-fit">
                        <span className="text-2xl">🏪</span>
                        <div>
                          <p className="font-bold text-xs uppercase">Recogida en Tienda</p>
                          <p className="text-xs">Recoger en Avd/ Alcalde Antonio Chapado, 29, San Martin de la Vega, Madrid, 28330</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-stone-600">
                        <span className="text-2xl">🚚</span>
                        <div>
                          <p className="font-bold text-xs uppercase text-stone-800">Envío a Domicilio</p>
                          <p className="text-xs">{order.shipping_address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ARTÍCULOS */}
                  <div className="p-6 pt-4">
                    <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Productos</h3>
                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={`${order.id}-${item.products.name}`} className="flex items-center">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 border border-stone-200 flex-shrink-0">
                            {item.products.image_url ? (
                                <Image
                                src={item.products.image_url}
                                alt={item.products.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="64px" 
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">Sin foto</div>
                            )}
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

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}