// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Usamos la fuente por defecto
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] }); // Fuente por defecto

export const metadata = {
  title: "Jabones Malaura",
  description: "Jabones artesanales hechos con ingredientes naturales.",
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
      <body className={inter.className}>
        <CartProvider>
          <Header session={session} />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}