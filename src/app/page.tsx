// src/app/page.tsx

import Image from "next/image";
import Link from "next/link";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SkinFinder, type FinderNeed } from "@/components/SkinFinder";
import { Faq, type FaqItem } from "@/components/Faq";
import { getCatalogSafe, indexBySlug } from "@/lib/catalog";
import { formatPrice, formatWeight, productPath, type Product } from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";
import {
  CLUB_LEVELS,
  FEATURED_SLUGS,
  MAPS_URL,
  PRODUCT_NOTES,
  SKIN_NEEDS,
  WHATSAPP_DISPLAY,
  whatsappUrl,
} from "@/lib/editorial";
import { openingHoursLines, siteConfig } from "@/lib/site";

const eyebrow = "text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark";
const h2 = "font-serif text-3xl sm:text-[42px] font-semibold leading-tight";
const btnDark =
  "inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-espresso text-cream font-bold hover:bg-black transition-colors";
const btnOutline =
  "inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border-2 border-espresso text-espresso font-bold hover:bg-espresso hover:text-cream transition-colors";

function priceLabel(p: Product) {
  return [formatPrice(p.price), formatWeight(p)].filter(Boolean).join(" · ");
}

export default async function HomePage() {
  const products = await getCatalogSafe();
  const bySlug = indexBySlug(products);

  // Buscador: solo jabones que existen en el catálogo y tienen texto editorial
  const needs: FinderNeed[] = SKIN_NEEDS.map((need) => ({
    id: need.id,
    label: need.label,
    cards: need.slugs.flatMap((slug) => {
      const p = bySlug.get(slug);
      const notes = PRODUCT_NOTES[slug];
      return p && notes ? [{ name: p.name, href: productPath(p), image: p.image_url, priceLabel: priceLabel(p), why: notes.why }] : [];
    }),
  })).filter((need) => need.cards.length > 0);

  const featured = FEATURED_SLUGS.flatMap((slug) => {
    const p = bySlug.get(slug);
    const notes = PRODUCT_NOTES[slug];
    return p && notes ? [{ p, tag: notes.ingredients[0].name, key: notes.idealFor.join(" · ") }] : [];
  });

  const panales = products.filter((p) => p.category === "panales");
  const cheapest = panales.reduce<Product | null>((min, p) => (!min || Number(p.price) < Number(min.price) ? p : min), null);

  const cesta = bySlug.get("cesta-grande");
  const packDuo = bySlug.get("pack-duo");
  const piruleta = bySlug.get("piruleta-de-jabon");

  const faqs: FaqItem[] = [
    {
      q: "¿Cuánto cuesta el envío?",
      a: `${formatPrice(SHIPPING_COST)}. Es gratis en pedidos de más de ${formatPrice(FREE_SHIPPING_OVER)}.`,
    },
    {
      q: "¿Puedo recoger mi pedido en la tienda?",
      a: "Sí, y es gratis. Elige «Recogida en tienda» al pagar y recógelo en nuestra tienda de San Martín de la Vega (Madrid) cuando recibas el email de confirmación.",
    },
    {
      q: "¿Llevan parabenos o sulfatos?",
      a: "No. Elaboramos nuestros jabones a mano con ingredientes de origen natural, sin parabenos ni sulfatos, y son cruelty-free.",
    },
    {
      q: "¿Qué jabón me recomendáis para piel sensible?",
      a: "El Jabón Artesanal Malaura, con leche de cabra, está creado para las pieles más sensibles. También el Caricia de Seda, con avena coloidal y miel pura.",
    },
    {
      q: "¿Hacéis jabones personalizados para eventos?",
      a: "Sí, para cualquier celebración: bautizos, comuniones, bodas, cumpleaños o empresas. Elegimos contigo el aroma, el color y la presentación, y hacemos etiquetas personalizadas. Pide presupuesto en nuestra página de bodas y eventos.",
    },
    {
      q: "¿Cuál es el horario de la tienda?",
      a: `${openingHoursLines().join(". ")}. Estamos en ${siteConfig.business.address.street}, ${siteConfig.business.address.locality} (Madrid).`,
    },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="container mx-auto px-4 pt-10 pb-16 sm:pt-14 sm:pb-20 flex flex-wrap items-center gap-10 lg:gap-12">
        <div className="flex-1 basis-[460px] min-w-0 flex flex-col gap-5">
          <span className={eyebrow}>Jabonería artesanal · San Martín de la Vega, Madrid</span>
          <h1 className="font-serif font-semibold text-[40px] sm:text-6xl leading-[1.05] tracking-tight">
            Jabones artesanales hechos a mano, uno a uno.
          </h1>
          <p className="text-lg sm:text-[19px] leading-relaxed text-cocoa max-w-[540px]">
            Laura y María los elaboran con leche de cabra, avena y miel, rosa mosqueta o carbón activo. Sin parabenos ni
            sulfatos, y pensados para cada tipo de piel.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="#encuentra" className={btnDark}>Encuentra tu jabón</Link>
            <Link href="/bodas" className={btnOutline}>Detalles para eventos</Link>
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 pt-2 text-sm text-cocoa">
            <li>Hecho a mano en pequeñas tandas</li>
            <li>Cruelty-free</li>
            {cheapest && <li>Desde {formatPrice(cheapest.price)} el panal{formatWeight(cheapest) ? ` de ${formatWeight(cheapest)}` : ""}</li>}
          </ul>
        </div>
        <div className="flex-1 basis-[480px] min-w-0 relative order-first lg:order-none">
          <div className="relative w-full h-[260px] sm:h-[460px] lg:h-[520px] rounded-[28px] overflow-hidden">
            <Image
              src="/slider/InicioSlide.jpg"
              alt="Surtido de jabones artesanales de La Flor de Malaura con lavanda, eucalipto y granos de café"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="hexagon absolute -left-3 sm:-left-6 bottom-6 sm:bottom-9 w-[120px] h-[104px] sm:w-[150px] sm:h-[130px] bg-honey text-espresso flex flex-col items-center justify-center text-center" aria-hidden="true">
            <span className="font-serif font-bold text-lg sm:text-[22px] leading-tight">Hecho<br />a mano</span>
            <span className="text-[11px] sm:text-xs font-bold pt-1">en pequeñas tandas</span>
          </div>
        </div>
      </section>

      {/* ===== BUSCADOR POR TIPO DE PIEL ===== */}
      {needs.length > 0 && (
        <section id="encuentra" className="bg-sand py-16 sm:py-20 px-4 scroll-mt-24">
          <div className="container mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-3 max-w-[720px]">
              <span className={eyebrow}>Encuentra tu jabón</span>
              <h2 className={h2}>¿Qué necesita tu piel hoy?</h2>
              <p className="text-[17px] leading-relaxed text-cocoa">Elige una opción y te decimos cuál de nuestros jabones encaja contigo y por qué.</p>
            </div>
            <SkinFinder needs={needs} />
          </div>
        </section>
      )}

      {/* ===== PANALES DESTACADOS ===== */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16 sm:py-20 flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <span className={eyebrow}>Hechos a mano en pequeñas tandas</span>
              <h2 className={h2}>Nuestros panales</h2>
            </div>
            <Link href="/productos" className="font-bold text-honey-dark underline underline-offset-4">
              Ver {panales.length > 0 ? `los ${panales.length} panales` : "el catálogo"}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(({ p, tag, key }) => (
              <Link key={p.id} href={productPath(p)} className="group flex flex-col gap-3 text-espresso">
                <div className="relative aspect-square rounded-[22px] overflow-hidden bg-sand">
                  <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-cream text-xs sm:text-[13px] font-bold">{tag}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3 items-baseline">
                  <span className="font-serif text-lg sm:text-[21px] font-semibold leading-snug group-hover:text-honey-dark">{p.name}</span>
                  <span className="font-bold whitespace-nowrap">{formatPrice(p.price)}</span>
                </div>
                <span className="text-sm sm:text-[15px] text-cocoa">{key}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== HISTORIA ===== */}
      <section id="historia" className="bg-sand py-16 sm:py-20 px-4 scroll-mt-24">
        <div className="container mx-auto flex flex-wrap items-center gap-10 lg:gap-14">
          <div className="flex-1 basis-[360px] min-w-0">
            <div className="relative w-full max-w-[460px] mx-auto aspect-[561/729] rounded-[22px] overflow-hidden">
              <Image src="/brand/taller.jpg" alt="Vertiendo jabón natural a mano en los moldes" fill sizes="(max-width: 768px) 100vw, 460px" className="object-cover" />
            </div>
          </div>
          <div className="flex-1 basis-[460px] min-w-0 flex flex-col gap-5">
            <span className={eyebrow}>Nuestra historia</span>
            <h2 className={h2}>Hechos a mano, con la suavidad del hogar</h2>
            <p className="text-[17px] leading-[1.7] text-cocoa">
              En La Flor de Malaura elaboramos jabones artesanales con alma, combinando tradición y naturaleza. Cada jabón
              está hecho a mano con ingredientes puros y cuidadosamente seleccionados, inspirados en el amor de madre y el
              bienestar del hogar.
            </p>
            <p className="font-serif italic text-[22px] text-espresso">Una marca donde el cuidado se siente, se huele y se vive.</p>
            <span className="text-[15px] font-bold">— Laura y María</span>
          </div>
        </div>
      </section>

      {/* ===== CESTAS Y PACKS ===== */}
      {(cesta || packDuo) && (
        <section className="container mx-auto px-4 py-16 sm:py-20 flex flex-wrap gap-6">
          {cesta && (
            <Link href={productPath(cesta)} className="group relative flex-1 basis-[420px] min-w-0 h-[320px] sm:h-[380px] rounded-[26px] overflow-hidden text-cream">
              <Image src={cesta.image_url} alt={cesta.name} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-7 bg-gradient-to-t from-espresso/90 to-transparent">
                <div className="font-serif text-[28px] sm:text-[30px] font-semibold">Cestas regalo</div>
                <div className="text-base pt-1">Para convertir el baño en un pequeño spa · {cesta.name} {formatPrice(cesta.price)}</div>
              </div>
            </Link>
          )}
          {packDuo && (
            <Link href={productPath(packDuo)} className="group relative flex-1 basis-[420px] min-w-0 h-[320px] sm:h-[380px] rounded-[26px] overflow-hidden text-cream">
              <Image src={packDuo.image_url} alt={packDuo.name} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-7 bg-gradient-to-t from-espresso/90 to-transparent">
                <div className="font-serif text-[28px] sm:text-[30px] font-semibold">Diseña tu {packDuo.name}</div>
                <div className="text-base pt-1">Elige tus panales y creamos una caja exclusiva · {formatPrice(packDuo.price)}</div>
              </div>
            </Link>
          )}
        </section>
      )}

      {/* ===== BODAS Y COMUNIONES ===== */}
      <section className="bg-espresso text-cream py-16 sm:py-20 px-4">
        <div className="container mx-auto flex flex-wrap items-center gap-10 lg:gap-14">
          <div className="flex-1 basis-[460px] min-w-0 flex flex-col gap-5">
            <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey">Bautizos, comuniones, bodas y más</span>
            <h2 className={h2}>Detalles que huelen a recuerdo</h2>
            <p className="text-[17px] leading-[1.7] text-latte">
              Creamos jabones personalizados para cualquier celebración. Diseñamos cada detalle según tu evento, eligiendo juntos
              el aroma, el color, la presentación y la etiqueta personalizada.
            </p>
            {piruleta && (
              <p className="text-[15px] text-latte">
                <strong className="text-honey">{piruleta.name}</strong> desde {formatPrice(piruleta.price)} la unidad
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/bodas#presupuesto" className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-honey text-espresso font-bold hover:bg-[#F2CB86] transition-colors">
                Pedir presupuesto
              </Link>
              <Link href="/bodas" className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border-2 border-honey text-honey font-bold hover:bg-honey hover:text-espresso transition-colors">
                Ver ideas
              </Link>
            </div>
          </div>
          {piruleta && (
            <div className="flex-1 basis-[400px] min-w-0 relative h-[300px] sm:h-[420px] rounded-[26px] overflow-hidden">
              <Image src={piruleta.image_url} alt={`${piruleta.name} como detalle para invitados`} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* ===== CLUB MALAURA ===== */}
      <section id="club" className="container mx-auto px-4 py-16 sm:py-20 flex flex-col gap-8 scroll-mt-24">
        <div className="flex flex-col gap-3 max-w-[720px]">
          <span className={eyebrow}>Club Malaura</span>
          <h2 className={h2}>Cada 15 pedidos, un regalo en tu caja</h2>
          <p className="text-[17px] leading-relaxed text-cocoa">
            Con tu cuenta vas subiendo de nivel con cada pedido. Cada vez que alcanzas un nivel nuevo (cada 15 pedidos)
            incluimos un regalo especial en tu paquete.
          </p>
        </div>
        <ol className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-6">
          {CLUB_LEVELS.map((level) => (
            <li key={level.name} className="min-w-0 flex flex-col items-center gap-3 text-center">
              <div className={`hexagon w-[96px] h-[83px] lg:w-[112px] lg:h-[97px] flex items-center justify-center font-serif font-bold text-base lg:text-lg ${level.className}`}>
                {level.name}
              </div>
              <span className="text-[15px] text-cocoa">{level.rule}</span>
            </li>
          ))}
        </ol>
        <div>
          <Link href="/login" className={btnOutline}>Crear mi cuenta</Link>
        </div>
      </section>

      {/* ===== RESEÑAS REALES DE GOOGLE ===== */}
      <ReviewsSection />

      {/* ===== VISITA + PREGUNTAS FRECUENTES ===== */}
      <section className="container mx-auto px-4 py-16 sm:py-20 flex flex-wrap gap-12">
        <div className="flex-1 basis-[400px] min-w-0 flex flex-col gap-5">
          <span className={eyebrow}>Ven a vernos</span>
          <h2 className={h2}>Huele, toca y elige en persona</h2>
          <p className="text-[17px] leading-relaxed text-cocoa">
            {siteConfig.business.address.street} · {siteConfig.business.address.locality} (Madrid). Si compras online, recoge
            tu pedido aquí sin gastos de envío.
          </p>
          <ul className="flex flex-col gap-2 text-base">
            <li><strong>Horario:</strong> {openingHoursLines().join(" · ")}</li>
            <li><strong>WhatsApp:</strong> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-honey-dark underline underline-offset-4">{WHATSAPP_DISPLAY}</a></li>
            <li><strong>Email:</strong> <a href={`mailto:${siteConfig.business.email}`} className="text-honey-dark underline underline-offset-4 break-all">{siteConfig.business.email}</a></li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-1">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={btnDark}>Cómo llegar</a>
            <a href={whatsappUrl("¡Hola! Tengo una pregunta sobre vuestros jabones.")} target="_blank" rel="noopener noreferrer" className={btnOutline}>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
        <div className="flex-1 basis-[400px] min-w-0">
          <Faq faqs={faqs} />
        </div>
      </section>
    </div>
  );
}
