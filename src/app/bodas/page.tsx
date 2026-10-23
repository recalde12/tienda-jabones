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
  title: "Jabones personalizados para bautizos, bodas y eventos",
  description:
    "Detalles de jabón artesanal con etiqueta personalizada para bautizos, comuniones, bodas y empresas. Tú eliges aroma, color y presentación.",
  alternates: { canonical: "/bodas" },
  openGraph: {
    title: "Jabones personalizados para bautizos, bodas y eventos | La Flor de Malaura",
    description: "Detalles de jabón artesanal para tus invitados, con etiqueta personalizada. Elegimos contigo aroma, color y presentación.",
    url: "/bodas",
    images: [{ url: "/eventos/bautizo-margaritas-blancas.jpg", width: 1100, height: 1003, alt: "Margaritas de jabón con etiqueta personalizada para un bautizo" }],
  },
};

const eyebrow = "text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark";
const h2 = "font-serif text-3xl sm:text-[42px] font-semibold leading-tight";

const steps = [
  { title: "Cuéntanos tu evento", text: "La fecha, el número de invitados y el estilo de la celebración." },
  { title: "Lo diseñamos juntas", text: "Elegimos contigo el aroma, el color, la presentación y la etiqueta personalizada." },
  { title: "Listos para regalar", text: "Recógelos gratis en nuestra tienda de San Martín de la Vega o te los enviamos." },
];

// Fotos reales de detalles que ya hemos hecho (public/eventos). Tamaños = los de cada archivo.
const gallery = [
  {
    src: "/eventos/boda-ramilletes-margaritas.jpg",
    width: 813,
    height: 1100,
    event: "Boda",
    alt: "Ramilletes de margaritas de jabón de colores en cucuruchos de arpillera con paniculata, jabones con rama de olivo y etiquetas personalizadas para una boda",
    text: "Ramilletes de margaritas de jabón en cucurucho de arpillera con paniculata, jabones con rama de olivo y ositos. Etiqueta con los nombres de los novios y la fecha.",
  },
  {
    src: "/eventos/bautizo-margaritas-blancas.jpg",
    width: 1100,
    height: 1003,
    event: "Bautizo",
    alt: "Margaritas blancas de jabón en cucuruchos de arpillera con paniculata y etiqueta personalizada «Mi bautizo»",
    text: "Margaritas blancas de jabón en cucurucho de arpillera con paniculata y etiqueta «Mi bautizo» con el nombre y la fecha.",
  },
  {
    src: "/eventos/carrera-atletismo-flores.jpg",
    width: 1100,
    height: 825,
    event: "Carrera de atletismo",
    alt: "Flores de jabón de colores sobre tarjetas personalizadas «¡Enhorabuena! Tus pies corren, tu esfuerzo florece» para los corredores",
    text: "Flores de jabón sobre tarjeta personalizada para los corredores: «¡Enhorabuena! Tus pies corren, tu esfuerzo florece».",
  },
  {
    src: "/eventos/boda-osito-etiqueta.jpg",
    width: 822,
    height: 1100,
    event: "Boda",
    alt: "Osito de jabón envuelto en celofán, atado con cordel y con etiqueta personalizada «Gracias por acompañarnos»",
    text: "Osito de jabón envuelto en celofán, atado con cordel y con su etiqueta «Gracias por acompañarnos».",
  },
];

const faqs: FaqItem[] = [
  {
    q: "¿Para qué eventos hacéis detalles?",
    a: "Para cualquier celebración en la que contéis con nosotras: bautizos, comuniones, bodas, cumpleaños, empresas o eventos deportivos como carreras…",
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

      {/* ===== DETALLES QUE YA HEMOS HECHO ===== */}
      <section aria-labelledby="hechos" className="container mx-auto px-4 pb-16 sm:pb-20 flex flex-col gap-8">
        <div className="flex flex-col gap-3 max-w-[640px]">
          <span className={eyebrow}>Hechos por nosotras</span>
          <h2 id="hechos" className={h2}>Detalles que ya hemos creado</h2>
          <p className="text-[17px] leading-relaxed text-cocoa">
            Cada evento es distinto: adaptamos los jabones, los colores, el envoltorio y la etiqueta a cada celebración.
          </p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {gallery.map((photo) => (
            <figure key={photo.src} className="break-inside-avoid mb-6 flex flex-col gap-3">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto rounded-[22px] bg-sand"
              />
              <figcaption className="flex flex-col gap-1.5">
                <span className="self-start px-3 py-1 rounded-full bg-sand text-[13px] font-bold text-espresso">{photo.event}</span>
                <span className="text-[15px] leading-relaxed text-cocoa">{photo.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
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
