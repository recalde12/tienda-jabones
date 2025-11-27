// src/components/Header.tsx

"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // <--- Importamos useEffect
import type { Session } from '@supabase/supabase-js';

export function Header({ session }: { session: Session | null }) {
  const { cart } = useCart();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // === CAMBIO CLAVE: Escuchar cambios de sesión y refrescar ===
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      // Si el evento es SIGNED_IN (ej: volviendo de Google), refrescamos la página
      // para que el servidor lea la cookie y actualice la UI
      if (event === 'SIGNED_IN') {
        router.refresh();
      }
      if (event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);
  // ==========================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); 
    router.refresh(); 
  };

  return (
    // === CAMBIO 1: Fondo a 'bg-black' ===
    <header className="bg-black shadow-md w-full sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        
        {/* === CAMBIO 2: Color del logo a 'text-stone-300' (marrón claro/beige) === */}
        <Link href="/" className="text-2xl font-bold text-stone-300 hover:text-white transition-colors">
          La Flor de Malaura
        </Link>
        
        <ul className="flex items-center space-x-4 sm:space-x-6 text-lg">
          {/* === CAMBIOS 2: Color de enlaces a 'text-stone-300' y hover a 'text-white' === */}
          <li>
            <Link href="/" className="text-stone-300 hover:text-white transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/productos" className="text-stone-300 hover:text-white transition-colors">
              Productos
            </Link>
          </li>

          {session ? (
            <>
              <li>
                <Link href="/pedidos" className="text-stone-300 hover:text-white transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-stone-300 hover:text-white transition-colors">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="text-stone-300 hover:text-white transition-colors">
                Login
              </Link>
            </li>
          )}
          {/* === FIN DE LOS CAMBIOS DE COLOR === */}

          <li>
            <Link href="/carrito" className="relative flex items-center text-stone-300 hover:text-white transition-colors">
              <span>Carrito</span>
              {totalItems > 0 && (
                // === CAMBIO 3: Invertido el color del contador para que resalte ===
                <span className="absolute -top-2 -right-3 bg-stone-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}