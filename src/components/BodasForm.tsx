// src/components/BodasForm.tsx
// Formulario de presupuesto para eventos. No envía nada a nuestro servidor: compone el
// mensaje y abre WhatsApp para que la persona lo envíe (no guardamos datos en la web).

"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/editorial";

const EVENTS = ["Bautizo", "Comunión", "Boda", "Cumpleaños", "Empresa", "Evento deportivo", "Otro"];

const field =
  "min-h-[46px] w-full rounded-xl border border-edge bg-white px-3.5 text-base text-espresso focus:outline-none focus:ring-2 focus:ring-honey-dark";
const label = "flex flex-col gap-1.5 text-sm font-bold";

export function BodasForm() {
  const [form, setForm] = useState({ nombre: "", evento: "Bautizo", fecha: "", invitados: "", aroma: "", mensaje: "" });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fecha = form.fecha ? new Date(`${form.fecha}T12:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "";
    const lines = [
      form.evento === "Otro"
        ? "¡Hola! Me gustaría pedir presupuesto para detalles para un evento."
        : `¡Hola! Me gustaría pedir presupuesto para detalles de ${form.evento.toLowerCase()}.`,
      form.nombre && `Nombre: ${form.nombre}`,
      fecha && `Fecha del evento: ${fecha}`,
      form.invitados && `Número de invitados: ${form.invitados}`,
      form.aroma && `Aroma o colores: ${form.aroma}`,
      form.mensaje && `Más detalles: ${form.mensaje}`,
    ].filter(Boolean);
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} className="bg-cream text-espresso rounded-[26px] p-6 sm:p-8 grid sm:grid-cols-2 gap-4 sm:gap-5">
      <label className={label}>
        Tu nombre
        <input type="text" name="nombre" autoComplete="given-name" value={form.nombre} onChange={set("nombre")} className={field} />
      </label>
      <label className={label}>
        Tipo de evento
        <select name="evento" value={form.evento} onChange={set("evento")} className={field}>
          {EVENTS.map((ev) => <option key={ev}>{ev}</option>)}
        </select>
      </label>
      <label className={label}>
        Fecha del evento
        <input type="date" name="fecha" value={form.fecha} onChange={set("fecha")} className={field} />
      </label>
      <label className={label}>
        Número de invitados
        <input type="number" name="invitados" min={1} inputMode="numeric" value={form.invitados} onChange={set("invitados")} className={field} />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Aroma o colores que te gustan
        <input type="text" name="aroma" value={form.aroma} onChange={set("aroma")} placeholder="Por ejemplo: lavanda, tonos blancos y verdes" className={field} />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Cuéntanos más
        <textarea name="mensaje" rows={4} value={form.mensaje} onChange={set("mensaje")} className={`${field} py-3 resize-y`} />
      </label>
      <p className="sm:col-span-2 text-sm text-cocoa leading-relaxed">
        Al pulsar el botón se abrirá WhatsApp con tu mensaje ya preparado para que nos lo envíes. No guardamos tus datos en la web.
      </p>
      <button
        type="submit"
        className="sm:col-span-2 min-h-[54px] rounded-full bg-espresso text-cream text-[17px] font-bold hover:bg-black transition-colors inline-flex items-center justify-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" />
        </svg>
        Enviar por WhatsApp
      </button>
    </form>
  );
}
