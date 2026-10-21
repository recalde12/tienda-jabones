// src/app/bodas/page.tsx
// Jabones personalizados para bodas, comuniones, bautizos y empresas.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BodasForm } from "@/components/BodasForm";
import { Faq, type FaqItem } from "@/components/Faq";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getCatalogSafe, indexBySlug } from "@/lib/catalog";
import { formatPrice, productPath, type Product } from "@/lib/products";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Jabones personalizados para bautizos, comuniones, bodas y eventos",
  description:
    "Detalles de jabón artesanal para tus invitados en bautizos, comuniones, bodas, empresas y cualquier celebración. Elegimos contigo aroma, color, presentación y etiqueta personalizada. Hechos a mano en San Martín de la Vega (Madrid).",
  alternates: { canonical: "/bodas" },
  openGraph: {
    title: "Jabones personalizados para eventos | La Flor de Malaura",
    description: "Detalles de jabón artesanal para tus invitados, con etiqueta personalizada. Elegimos contigo aroma, color y presentación.",
    url: "/bodas",
  },
};

const eyebrow = "text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark";
const h2 = "font-serif text-3xl sm:text-[42px] font-semibold leading-tight";

const steps = [
  { title: "Cuéntanos tu evento", text: "La fecha, el número de invitados y el estilo de la celebración." },
  { title: "Lo diseñamos juntas", text: "Elegimos contigo el aroma, el color, la presentación y la etiqueta personalizada." },
  { title: "Listos para regalar", text: "Recógelos gratis en nuestra tienda de San Martín de la Vega o te los enviamos." },
];

const faqs: FaqItem[] = [
  {
    q: "¿Para qué eventos hacéis detalles?",
    a: "Para cualquier celebración en la que contéis con nosotras: bautizos, comuniones, bodas, cumpleaños, empresas…",
  },
  {
    q: "¿Hacéis etiquetas personalizadas?",
    a: "Sí. Personalizamos la etiqueta de cada detalle para tu celebración.",
  },
  {
    q: "¿Puedo elegir el aroma y los colores?",
    a: "Sí. Diseñamos cada detalle según tu evento y elegimos juntas el aroma, el color y la presentación.",
  },
  {
    q: "¿Hacéis detalles para empresas?",
    a: "Sí. Nuestras piruletas de jabón, por ejemplo, son un regalo corporativo útil que decora y perfuma.",
  },
  {
    q: "¿Cómo pido presupuesto?",
    a: `Rellena el formulario de esta página o escríbenos por WhatsApp al ${WHATSAPP_DISPLAY} con la fecha, el número de invitados y lo que tienes en mente.`,
  },
  {
    q: "¿Puedo recogerlos en la tienda?",
    a: "Sí, gratis, en nuestra tienda de San Martín de la Vega (Madrid).",
  },
];

export default async function BodasPage() {
  const products = await getCatalogSafe();
  const bySlug = indexBySlug(products);
  const piruleta = bySlug.get("piruleta-de-jabon");
  const osito = bySlug.get("jabon-osito-amoroso");
  const panal = bySlug.get("jabon-caricia-de-seda");
  const packDuo = bySlug.get("pack-duo");
  const cheapestPanal = products
    .filter((p) => p.category === "panales")
    .reduce<Product | null>((min, p) => (!min || Number(p.price) < Number(min.price) ? p : min), null);

  const ideas = [
    piruleta && { href: productPath(piruleta), image: piruleta.image_url, title: piruleta.name, price: formatPrice(piruleta.price), text: "En tonos botánicos. Un recuerdo útil que decora y perfuma." },
    osito && { href: productPath(osito), image: osito.image_url, title: osito.name, price: formatPrice(osito.price), text: "Dosis de ternura y limpieza, en el color que elijas." },
    panal && cheapestPanal && { href: "/productos", image: panal.image_url, title: "Panal con abeja", price: `desde ${formatPrice(cheapestPanal.price)}`, text: "Nuestro jabón más reconocible, con el aroma de tu evento." },
    packDuo && { href: productPath(packDuo), image: packDuo.image_url, title: `${packDuo.name} para padrinos`, price: formatPrice(packDuo.price), text: "Panales presentados en una caja exclusiva." },
  ].filter(Boolean) as { href: string; image: string; title: string; price: string; text: string }[];

  return (
    <div>
      <BreadcrumbJsonLd items={[{ name: "Inicio", path: "/" }, { name: "Bodas y eventos", path: "/bodas" }]} />

      {/* ===== HERO ===== */}
      <section className="container mx-auto px-4 pt-10 pb-16 sm:pt-14 sm:pb-20 flex flex-wrap items-center gap-10 lg:gap-12">
        <div className="flex-1 basis-[460px] min-w-0 flex flex-col gap-5">
          <span className={eyebrow}>Bautizos · Comuniones · Bodas · Empresas</span>
          <h1 className="font-serif font-semibold text-[38px] sm:text-[56px] leading-[1.06]">Jabones personalizados para tus invitados</h1>
          <p className="text-lg sm:text-[19px] leading-relaxed text-cocoa max-w-[560px]">
            Creamos jabones personalizados para cualquier celebración. Diseñamos cada detalle según tu evento, eligiendo juntos
            el aroma, el color, la presentación y la etiqueta personalizada. Un regalo artesanal que deja huella.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#presupuesto" className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-espresso text-cream font-bold hover:bg-black transition-colors">
              Pedir presupuesto
            </a>
            <a
              href={whatsappUrl("¡Hola! Me gustaría pedir presupuesto para detalles de jabón para un evento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[52px] px-7 rounded-full border-2 border-espresso text-espresso font-bold hover:bg-espresso hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" /></svg>
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </div>
          {piruleta && (
            <p className="text-[15px] text-cocoa">
              Detalles desde <strong className="text-espresso">{formatPrice(piruleta.price)}</strong> la unidad
            </p>
          )}
        </div>
        {piruleta && (
          <div className="flex-1 basis-[440px] min-w-0 relative h-[320px] sm:h-[520px] rounded-[28px] overflow-hidden">
            <Image src={piruleta.image_url} alt={`${piruleta.name} en tonos botánicos como detalle para invitados`} fill priority sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" />
          </div>
        )}
      </section>

      {/* ===== PASOS ===== */}
      <section className="bg-sand py-16 sm:py-20 px-4">
        <div className="container mx-auto flex flex-col gap-10">
          <h2 className={h2}>Así de fácil</h2>
          <ol className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-4">
                <span className="hexagon w-[84px] h-[73px] bg-honey text-espresso flex items-center justify-center font-serif text-3xl font-bold" aria-hidden="true">{i + 1}</span>
                <h3 className="font-serif text-2xl font-semibold">{step.title}</h3>
                <p className="text-base leading-relaxed text-cocoa">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== IDEAS ===== */}
      {ideas.length > 0 && (
        <section className="container mx-auto px-4 py-16 sm:py-20 flex flex-col gap-8">
          <h2 className={h2}>Ideas de detalles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ideas.map((idea) => (
              <Link key={idea.title} href={idea.href} className="group flex flex-col gap-3 text-espresso">
                <div className="relative aspect-square rounded-[22px] overflow-hidden bg-sand">
                  <Image src={idea.image} alt={idea.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-wrap justify-between gap-x-3 items-baseline">
                  <h3 className="font-serif text-xl font-semibold group-hover:text-honey-dark">{idea.title}</h3>
                  <strong className="whitespace-nowrap">{idea.price}</strong>
                </div>
                <p className="text-[15px] leading-relaxed text-cocoa">{idea.text}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== PRESUPUESTO ===== */}
      <section id="presupuesto" className="bg-espresso text-cream py-16 sm:py-20 px-4 scroll-mt-24">
        <div className="container mx-auto flex flex-wrap gap-10 lg:gap-14">
          <div className="flex-1 basis-[340px] min-w-0 flex flex-col gap-5">
            <h2 className={h2}>Pide tu presupuesto sin compromiso</h2>
            <p className="text-[17px] leading-relaxed text-latte">
              Cuéntanos qué tienes en mente y te respondemos con ideas y precio. Si lo prefieres, escríbenos directamente por
              WhatsApp al {WHATSAPP_DISPLAY}.
            </p>
          </div>
          <div className="flex-1 basis-[520px] min-w-0">
            <BodasForm />
          </div>
        </div>
      </section>

      {/* ===== PREGUNTAS ===== */}
      <section className="container mx-auto px-4 py-16 sm:py-20 max-w-[900px]">
        <Faq faqs={faqs} title="Preguntas sobre detalles para eventos" />
      </section>
    </div>
  );
}
