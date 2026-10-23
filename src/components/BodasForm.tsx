// src/components/BodasForm.tsx
// Formulario de presupuesto para eventos. Envía la solicitud por email a la tienda
// (/api/presupuesto); no se guarda nada en la BD. Si el envío falla, ofrece WhatsApp.

"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/editorial";

const EVENTS = ["Bautizo", "Comunión", "Boda", "Cumpleaños", "Empresa", "Evento deportivo", "Otro"];

const EMPTY = { nombre: "", email: "", telefono: "", evento: "Bautizo", fecha: "", invitados: "", aroma: "", mensaje: "", web: "" };

const field =
  "min-h-[46px] w-full rounded-xl border border-edge bg-white px-3.5 text-base text-espresso focus:outline-none focus:ring-2 focus:ring-honey-dark";
const label = "flex flex-col gap-1.5 text-sm font-bold";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

export function BodasForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  // Mensaje de WhatsApp con los mismos datos, por si el email falla
  const whatsappText = () => {
    const fecha = form.fecha ? new Date(`${form.fecha}T12:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "";
    return [
      form.evento === "Otro"
        ? "¡Hola! Me gustaría pedir presupuesto para detalles para un evento."
        : `¡Hola! Me gustaría pedir presupuesto para detalles de ${form.evento.toLowerCase()}.`,
      form.nombre && `Nombre: ${form.nombre}`,
      fecha && `Fecha del evento: ${fecha}`,
      form.invitados && `Número de invitados: ${form.invitados}`,
      form.aroma && `Aroma o colores: ${form.aroma}`,
      form.mensaje && `Más detalles: ${form.mensaje}`,
    ].filter(Boolean).join("\n");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/presupuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus({ state: "error", message: data.message || "No hemos podido enviar tu solicitud. Inténtalo de nuevo." });
        return;
      }
      setStatus({ state: "sent" });
    } catch {
      setStatus({ state: "error", message: "No hemos podido enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo." });
    }
  };

  if (status.state === "sent") {
    return (
      <div role="status" className="bg-cream text-espresso rounded-[26px] p-6 sm:p-8 flex flex-col gap-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-semibold">¡Gracias, {form.nombre}!</h3>
        <p className="text-[17px] leading-relaxed text-cocoa">
          Hemos recibido tu solicitud. Te responderemos a <strong className="text-espresso">{form.email}</strong> lo antes
          posible con ideas y precio.
        </p>
        <button
          type="button"
          onClick={() => { setForm(EMPTY); setStatus({ state: "idle" }); }}
          className="self-start min-h-[48px] px-6 rounded-full border-2 border-espresso font-bold hover:bg-espresso hover:text-cream transition-colors"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-cream text-espresso rounded-[26px] p-6 sm:p-8 grid sm:grid-cols-2 gap-4 sm:gap-5">
      <label className={label}>
        Tu nombre
        <input type="text" name="nombre" autoComplete="name" required maxLength={80} value={form.nombre} onChange={set("nombre")} className={field} />
      </label>
      <label className={label}>
        Tu email
        <input type="email" name="email" autoComplete="email" required maxLength={120} value={form.email} onChange={set("email")} className={field} />
      </label>
      <label className={label}>
        Teléfono (opcional)
        <input type="tel" name="telefono" autoComplete="tel" maxLength={30} value={form.telefono} onChange={set("telefono")} className={field} />
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
        <input type="number" name="invitados" min={1} max={99999} inputMode="numeric" value={form.invitados} onChange={set("invitados")} className={field} />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Aroma o colores que te gustan
        <input type="text" name="aroma" maxLength={200} value={form.aroma} onChange={set("aroma")} placeholder="Por ejemplo: lavanda, tonos blancos y verdes" className={field} />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Cuéntanos más
        <textarea name="mensaje" rows={4} maxLength={2000} value={form.mensaje} onChange={set("mensaje")} className={`${field} py-3 resize-y`} />
      </label>

      {/* Campo trampa para bots: oculto para las personas */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          No rellenes este campo
          <input type="text" name="web" tabIndex={-1} autoComplete="off" value={form.web} onChange={set("web")} />
        </label>
      </div>

      <p className="sm:col-span-2 text-sm text-cocoa leading-relaxed">
        Te responderemos por email. Usamos tus datos solo para preparar tu presupuesto.
      </p>

      {status.state === "error" && (
        <div role="alert" className="sm:col-span-2 rounded-xl bg-[#FBE9E4] text-[#8A2E12] px-4 py-3 text-[15px] leading-relaxed">
          {status.message}{" "}
          <a href={whatsappUrl(whatsappText())} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">
            Enviar por WhatsApp
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="sm:col-span-2 min-h-[54px] rounded-full bg-espresso text-cream text-[17px] font-bold hover:bg-black transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        {status.state === "sending" ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
