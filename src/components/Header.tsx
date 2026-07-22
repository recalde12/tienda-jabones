// src/components/Header.tsx

"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

export function Header({ session }: { session: Session | null }) {
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Enlace de navegación con estado "activo" (resalta la página actual)
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`relative block px-1 py-1 font-medium tracking-wide transition-colors ${
          isActive ? 'text-white' : 'text-stone-300 hover:text-white'
        }`}
      >
        {children}
        <span
          className={`absolute left-1 right-1 -bottom-0.5 h-0.5 rounded-full bg-amber-400 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </Link>
    );
  };

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
    <Link href="/carrito" className="relative flex items-center text-stone-400 hover:text-white transition-colors p-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-2 bg-amber-400 text-stone-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
          {totalItems}
        </span>
      )}
    </Link>
  );

  return (
    <header className="bg-stone-900 border-b border-stone-700/50 w-full sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">

        {/* 1. LOGO (Izquierda) */}
        <Link href="/" className="flex flex-col leading-tight group">
          <span className="text-xs font-light tracking-[0.3em] text-stone-400 uppercase group-hover:text-stone-300 transition-colors">
            La Flor de
          </span>
          <span className="text-xl md:text-2xl font-bold font-serif text-stone-100 group-hover:text-white transition-colors italic">
            Malaura
          </span>
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
          <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-7 text-sm border-t md:border-none border-stone-700 pt-4 md:pt-0">
            <li><NavLink href="/">Inicio</NavLink></li>
            <li><NavLink href="/productos">Productos</NavLink></li>

            {session ? (
              <>
                <li><NavLink href="/perfil">Mi Perfil</NavLink></li>
                <li><NavLink href="/pedidos">Mis Pedidos</NavLink></li>
                <li>
                  <button onClick={handleLogout} className="text-left px-1 py-1 text-stone-400 hover:text-white transition-colors font-medium tracking-wide w-full md:w-auto">
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <li><NavLink href="/login">Entrar</NavLink></li>
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