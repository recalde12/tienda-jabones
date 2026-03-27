// src/app/layout.tsx

import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "La Flor de Malaura | Jabones Artesanales Naturales",
  description: "Jabones artesanales hechos a mano con ingredientes 100% naturales por Laura y María. Cruelty-free, sin parabenos ni sulfatos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="es">
      <body className={`${lato.variable} ${playfair.variable} ${lato.className}`}>
        <CartProvider>
          <Header session={session} />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}