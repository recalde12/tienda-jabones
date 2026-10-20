// src/components/InfoTabs.tsx
// Pestañas accesibles (teclado: flechas izquierda/derecha) para la información del producto.

"use client";

import { useRef, useState } from "react";

export type InfoTab = { id: string; label: string; content: string };

export function InfoTabs({ tabs }: { tabs: InfoTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  if (tabs.length === 0) return null;
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Información del producto" className="flex gap-2 overflow-x-auto border-b border-line">
        {tabs.map((tab, i) => {
          const selected = tab.id === current.id;
          return (
            <button
              key={tab.id}
              ref={(el) => { buttons.current[i] = el; }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex-none min-h-[48px] px-4 sm:px-5 border-b-[3px] text-base font-bold transition-colors ${
                selected ? "border-espresso text-espresso" : "border-transparent text-cocoa hover:text-espresso"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        className="max-w-[760px] text-[17px] leading-[1.7] text-cocoa whitespace-pre-line"
      >
        {current.content}
      </div>
    </div>
  );
}
