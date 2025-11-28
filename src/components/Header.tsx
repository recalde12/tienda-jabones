// src/components/Header.tsx

"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

export function Header({ session }: { session: Session | null }) {
  const { cart } = useCart();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    router.push('/'); 
    router.refresh(); 
  };

  // Componente del Icono del Carrito (para reutilizarlo y no repetir código)
  const CartIcon = () => (
    <Link href="/carrito" className="relative flex items-center text-stone-300 hover:text-white transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-3 bg-stone-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );

  return (
    <header className="bg-black shadow-md w-full sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        
        {/* 1. LOGO (Izquierda) */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-stone-300 hover:text-white transition-colors truncate">
          La Flor de Malaura
        </Link>

        {/* 2. CONTROLES MÓVIL (Derecha - Solo visible en móvil) */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Carrito Móvil (Siempre visible en el móvil arriba) */}
          <CartIcon />
          
          {/* Botón Hamburguesa */}
          <button 
            className="text-stone-300 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* 3. MENÚ PRINCIPAL (Links + Carrito Desktop) */}
        {/* En móvil: Ocupa 100% ancho y se oculta/muestra. En PC: Se pone al lado del logo */}
        <div className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } w-full md:block md:w-auto mt-4 md:mt-0`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-lg border-t md:border-none border-stone-800 pt-4 md:pt-0">
            <li>
              <Link href="/" className="block text-stone-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className="block text-stone-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Productos
              </Link>
            </li>

            {session ? (
              <>
               <li>
                  <Link href="/perfil" className="text-stone-300 hover:text-white transition-colors">
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link href="/pedidos" className="block text-stone-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Mis Pedidos
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-left text-stone-300 hover:text-white transition-colors w-full md:w-auto">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="block text-stone-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
            )}

            {/* Carrito de ESCRITORIO (Oculto en móvil para no duplicarlo, visible en MD) */}
            <li className="hidden md:block">
              <CartIcon />
            </li>
          </ul>
        </div>

      </nav>
    </header>
  );
}