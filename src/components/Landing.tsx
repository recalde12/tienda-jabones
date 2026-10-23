// src/components/Landing.tsx
// Piezas de las páginas de aterrizaje (/jabones/<tipo-de-piel> y /cestas-de-regalo).

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, type Product } from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";
import { GIFT_PAGE, NEED_PAGES, type Tip } from "@/lib/landing";

export const landingEyebrow = "text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark";
export const landingH2 = "font-serif text-3xl sm:text-[40px] font-semibold leading-tight";

export function LandingHero({
  eyebrow,
  h1,
  intro,
  crumb,
  image,
}: {
  eyebrow: string;
  h1: string;
  intro: string[];
  crumb: string;
  image?: { src: string; alt: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-10 lg:gap-14">
      <div className="flex-1 basis-[460px] min-w-0 flex flex-col gap-5 max-w-[760px]">
      <nav aria-label="Migas de pan" className="text-sm text-cocoa">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-espresso transition-colors">Inicio</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/productos" className="hover:text-espresso transition-colors">Productos</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-espresso font-bold">{crumb}</li>
        </ol>
      </nav>
      <span className={landingEyebrow}>{eyebrow}</span>
      <h1 className="font-serif font-semibold text-[38px] sm:text-[54px] leading-[1.06]">{h1}</h1>
      {intro.map((text) => (
        <p key={text} className="text-lg leading-relaxed text-cocoa">{text}</p>
      ))}
      <p className="text-[15px] text-cocoa">
        <strong className="text-espresso">Envío {formatPrice(SHIPPING_COST)}</strong>, gratis en pedidos de más de{" "}
        {formatPrice(FREE_SHIPPING_OVER)} · <strong className="text-espresso">Recogida gratis</strong> en San Martín de la Vega
      </p>
      </div>
      {image && (
        <div className="flex-1 basis-[360px] min-w-0 max-w-[520px] relative aspect-[4/3] lg:aspect-square rounded-[28px] overflow-hidden bg-sand">
          <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 900px) 100vw, 40vw" className="object-cover" />
        </div>
      )}
    </div>
  );
}

export function LandingProducts({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="flex flex-col gap-8">
      <h2 className={landingH2}>{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} heading="h3" />
        ))}
      </div>
    </section>
  );
}

export function TipsGrid({ title, tips }: { title: string; tips: Tip[] }) {
  return (
    <section className="bg-sand -mx-4 px-4 py-14 sm:py-16 rounded-none sm:rounded-[28px] sm:mx-0 sm:px-10 flex flex-col gap-8">
      <h2 className={landingH2}>{title}</h2>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tips.map((tip, i) => (
          <li key={tip.title} className="flex flex-col gap-3">
            <span className="hexagon w-[64px] h-[56px] bg-honey text-espresso flex items-center justify-center font-serif text-2xl font-bold" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="font-serif text-xl font-semibold">{tip.title}</h3>
            <p className="text-base leading-relaxed text-cocoa">{tip.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Enlaces al resto de páginas de aterrizaje (enlazado interno). */
export function LandingLinks({ current }: { current: string }) {
  const links = [
    ...NEED_PAGES.map((p) => ({ href: p.path, label: p.linkText.charAt(0).toUpperCase() + p.linkText.slice(1) })),
    { href: GIFT_PAGE.path, label: GIFT_PAGE.name },
    { href: "/productos", label: "Todo el catálogo" },
    { href: "/bodas", label: "Detalles para bodas y eventos" },
  ].filter((l) => l.href !== current);

  return (
    <nav aria-label="Más jabones" className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-semibold">Sigue explorando</h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex items-center min-h-[44px] px-5 rounded-full border-2 border-edge text-[15px] font-bold text-espresso hover:border-espresso transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
