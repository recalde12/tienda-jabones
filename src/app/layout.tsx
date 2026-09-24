// src/app/layout.tsx

import type { Metadata } from "next";
import Script from "next/script";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { siteConfig, SITE_URL } from "@/lib/site";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair" });

// Google Tag Manager. Solo se carga en producción para no contar visitas de desarrollo.
const GTM_ID = "GTM-PDK2HZTK";
const gtmEnabled = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "La Flor de Malaura | Jabones Artesanales Naturales en Madrid",
    template: "%s | La Flor de Malaura",
  },
  description: siteConfig.description,
  keywords: [
    "jabones artesanales",
    "jabones naturales",
    "jabón hecho a mano",
    "cosmética natural",
    "jabones sin parabenos",
    "cruelty free",
    "cestas regalo jabones",
    "La Flor de Malaura",
    "jabones Madrid",
    "San Martín de la Vega",
  ],
  authors: [{ name: "La Flor de Malaura" }],
  creator: "La Flor de Malaura",
  publisher: "La Flor de Malaura",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: SITE_URL,
    siteName: siteConfig.name,
    title: "La Flor de Malaura | Jabones Artesanales Naturales",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "La Flor de Malaura — Jabones artesanales naturales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Flor de Malaura | Jabones Artesanales Naturales",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "shopping",
  verification: {
    google: "AHBz0hY6B_AFDTCkBMuye5rZDniJ5Budo1Rc3qRLjXw",
  },
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
        {gtmEnabled && (
          <>
            {/* Google Tag Manager */}
            <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }} />
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <LocalBusinessJsonLd />
        <CartProvider>
          <Header session={session} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}