// src/components/Header.tsx

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { FREE_SHIPPING_OVER } from '@/lib/shipping';

const navItems = [
  { href: '/productos', label: 'Jabones' },
  { href: '/cestas-de-regalo', label: 'Cestas de regalo' },
  { href: '/bodas', label: 'Bodas y eventos' },
  { href: '/#historia', label: 'Nuestra historia' },
  { href: '/#club', label: 'Club Malaura' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-espresso">
      {/* Flor de ginkgo de la marca (dibujo vectorizado, color honey-dark) */}
      <Image src="/brand/ginkgo.svg" alt="" width={46} height={49} priority unoptimized className="flex-none w-[46px] h-[49px]" />
      <span className="flex flex-col leading-none">
        <span className="text-[11px] tracking-[0.3em] uppercase text-cocoa">La Flor de</span>{' '}
        <span className="font-serif italic font-bold text-[26px]">Malaura</span>
      </span>
    </Link>
  );
}

export function Header({ session }: { session: Session | null }) {
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
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

  // Cierra el menú móvil al cambiar de página
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    const path = href.split(/[?#]/)[0];
    if (href.includes('#') || href.includes('?')) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const CartLink = () => (
    <Link
      href="/carrito"
      aria-label={totalItems > 0 ? `Carrito (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})` : 'Carrito'}
      className="relative w-11 h-11 flex items-center justify-center text-espresso hover:text-honey-dark transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 8h14l-1.2 12H6.2z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute top-1 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-honey text-espresso text-[11px] font-bold flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );

  return (
    <>
      <div className="bg-espresso text-sand text-xs sm:text-sm px-4 py-2 flex flex-wrap justify-center gap-x-8 gap-y-1 text-center">
        <span>Envío gratis en pedidos de más de {FREE_SHIPPING_OVER} €</span>
        <span className="hidden sm:inline">Recogida gratis en nuestra tienda de San Martín de la Vega</span>
      </div>

      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-line">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Móvil: menú a la izquierda */}
          <button
            type="button"
            className="lg:hidden w-11 h-11 -ml-2 flex items-center justify-center text-espresso"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="menu-movil"
          >
            {isMobileMenuOpen ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12" /></svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>

          <Logo />

          {/* Escritorio: navegación */}
          <nav aria-label="Principal" className="hidden lg:flex flex-wrap items-center gap-x-7 gap-y-2 text-[15px] font-bold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`relative py-1 transition-colors ${isActive(item.href) ? 'text-honey-dark' : 'text-espresso hover:text-honey-dark'}`}
              >
                {item.label}
                {isActive(item.href) && <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-honey" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden lg:flex items-center gap-4 mr-2 text-sm font-bold">
              {session ? (
                <>
                  <Link href="/perfil" className="text-espresso hover:text-honey-dark">Mi cuenta</Link>
                  <Link href="/pedidos" className="text-espresso hover:text-honey-dark">Mis pedidos</Link>
                  <button type="button" onClick={handleLogout} className="text-cocoa hover:text-espresso">Salir</button>
                </>
              ) : (
                <Link href="/login" className="text-espresso hover:text-honey-dark">Entrar</Link>
              )}
            </div>
            <CartLink />
          </div>
        </div>

        {/* Móvil: menú desplegable */}
        {isMobileMenuOpen && (
          <nav id="menu-movil" aria-label="Menú" className="lg:hidden border-t border-line bg-cream">
            <ul className="container mx-auto px-4 py-3 flex flex-col text-base font-bold">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-espresso">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-line mt-2 pt-2" />
              {session ? (
                <>
                  <li><Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-espresso">Mi cuenta</Link></li>
                  <li><Link href="/pedidos" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-espresso">Mis pedidos</Link></li>
                  <li><button type="button" onClick={handleLogout} className="block w-full text-left py-3 text-cocoa">Salir</button></li>
                </>
              ) : (
                <li><Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-espresso">Entrar</Link></li>
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
