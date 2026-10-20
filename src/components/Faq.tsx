// src/components/Faq.tsx
// Preguntas frecuentes con <details> (funciona sin JavaScript) + datos estructurados FAQPage.

import { FaqJsonLd } from "@/components/JsonLd";

export type FaqItem = { q: string; a: string };

export function Faq({ faqs, title = "Preguntas frecuentes" }: { faqs: FaqItem[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <div className="flex flex-col">
      <FaqJsonLd faqs={faqs} />
      <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-2">{title}</h2>
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-line py-4">
          <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-[17px] min-h-[28px]">
            {f.q}
            <span aria-hidden="true" className="text-honey-dark text-xl leading-none transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-base leading-relaxed text-cocoa">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
