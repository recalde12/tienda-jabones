// src/components/SkinFinder.tsx
// Buscador "¿Qué necesita tu piel hoy?": recomienda jabones según la necesidad elegida.
// Los datos (productos reales + textos de src/lib/editorial.ts) llegan ya preparados del servidor.

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type FinderCard = {
  name: string;
  href: string;
  image: string;
  priceLabel: string;
  why: string;
};

/** `page`: página con todos los jabones para esa necesidad (si existe). */
export type FinderNeed = { id: string; label: string; cards: FinderCard[]; page?: { href: string; label: string } };

export function SkinFinder({ needs }: { needs: FinderNeed[] }) {
  const [selected, setSelected] = useState(needs[0]?.id);
  if (needs.length === 0) return null;
  const current = needs.find((n) => n.id === selected) ?? needs[0];

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="¿Qué necesita tu piel?" className="flex flex-wrap gap-3">
        {needs.map((need) => {
          const active = need.id === current.id;
          return (
            <button
              key={need.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(need.id)}
              className={`min-h-[48px] px-6 rounded-full border-2 text-base font-bold transition-colors ${
                active
                  ? "bg-espresso border-espresso text-cream"
                  : "bg-cream border-edge text-espresso hover:border-espresso"
              }`}
            >
              {need.label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {current.cards.map((card) => (
          <article key={card.href} className="min-w-0 bg-cream rounded-[22px] p-4 sm:p-5 flex gap-4 sm:gap-5 items-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-none rounded-2xl overflow-hidden">
              <Image src={card.image} alt={card.name} fill sizes="144px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="font-serif text-xl sm:text-[22px] font-semibold leading-snug">{card.name}</h3>
              <p className="text-[15px] leading-relaxed text-cocoa">{card.why}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="font-bold text-[17px]">{card.priceLabel}</span>
                <Link href={card.href} className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-espresso text-cream text-sm font-bold hover:bg-black transition-colors">
                  Ver jabón
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {current.page && (
        <Link href={current.page.href} className="self-start font-bold text-honey-dark underline underline-offset-4">
          {current.page.label} →
        </Link>
      )}
    </div>
  );
}
