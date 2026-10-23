// src/app/admin/descuentos/page.tsx
// Panel de administración para gestionar códigos de descuento.
// Acceso protegido por middleware (cookie httpOnly). Ver src/middleware.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface DiscountCode {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_amount: number;
  max_uses: number | null;
  max_uses_per_customer?: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

const EMPTY_FORM = {
  code: "",
  type: "percentage",
  value: "",
  min_amount: "",
  max_uses: "",
  max_uses_per_customer: "",
  expires_at: "",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

export default function AdminDescuentosPage() {
  const router = useRouter();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  // Formulario nuevo código
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discount/admin", {
        credentials: "include", // Envía la cookie automáticamente
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      // Si la API falla (p. ej. la BD no responde) devuelve { error }, no una lista.
      if (!res.ok || !Array.isArray(data)) {
        setCodes([]);
        setLoadError(`No se pudieron cargar los códigos${data?.error ? `: ${data.error}` : "."}`);
        return;
      }
      setLoadError("");
      setCodes(data);
    } catch {
      setCodes([]);
      setLoadError("No se pudieron cargar los códigos: error de conexión.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleToggleActive = async (id: number, current: boolean) => {
    setActionMsg("");
    const res = await fetch("/api/discount/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, active: !current }),
    });
    if (res.ok) {
      setActionMsg(current ? "Código desactivado." : "Código activado.");
      fetchCodes();
    }
  };

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`¿Seguro que quieres BORRAR definitivamente el código "${code}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch("/api/discount/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setActionMsg("Código eliminado.");
      fetchCodes();
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.code || !form.value) { setFormError("El código y el valor son obligatorios."); return; }

    setFormLoading(true);
    const res = await fetch("/api/discount/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: form.value,
        min_amount: form.min_amount || "0",
        max_uses: form.max_uses || null,
        max_uses_per_customer: form.max_uses_per_customer || null,
        expires_at: form.expires_at || null,
      }),
    });

    const data = await res.json();
    setFormLoading(false);

    if (res.ok) {
      setActionMsg(`Código "${data.code}" creado correctamente.`);
      setForm(EMPTY_FORM);
      fetchCodes();
    } else {
      setFormError(data.error || "Error al crear el código.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 font-serif">Códigos de descuento</h1>
            <p className="text-stone-500 text-sm mt-1">Crea, activa y desactiva los códigos de tu tienda.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fetchCodes()} className="text-stone-500 hover:text-stone-800 text-sm border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors">
              Refrescar
            </button>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 text-sm border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            {actionMsg}
          </div>
        )}

        {/* ── Formulario crear nuevo código ── */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-5">Crear nuevo código</h2>
          <form onSubmit={handleCreateCode} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">Código</label>
              <input
                type="text"
                placeholder="ej: VERANO20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 font-mono uppercase focus:ring-2 focus:ring-stone-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">Tipo *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-stone-500 outline-none bg-white"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Cantidad fija (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">
                Valor * {form.type === "percentage" ? "(ej: 10 = 10%)" : "(ej: 5 = 5€)"}
              </label>
              <input
                type="number"
                placeholder={form.type === "percentage" ? "10" : "5"}
                min="0.01"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-stone-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">Compra mínima</label>
              <input
                type="number"
                placeholder="0 = sin mínimo"
                min="0"
                step="0.01"
                value={form.min_amount}
                onChange={(e) => setForm({ ...form, min_amount: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-stone-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">Usos máximos</label>
              <input
                type="number"
                placeholder="Vacío = ilimitado"
                min="1"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-stone-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">Usos por cliente</label>
              <input
                type="number"
                placeholder="Vacío = sin límite"
                min="1"
                value={form.max_uses_per_customer}
                onChange={(e) => setForm({ ...form, max_uses_per_customer: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-stone-500 outline-none"
              />
              <p className="text-xs text-stone-400 mt-1">Veces que cada cliente (cuenta) puede usarlo. 1 = un solo uso.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase">Fecha de caducidad</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-stone-500 outline-none"
              />
            </div>

            {formError && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-red-500 text-sm">⚠️ {formError}</p>
              </div>
            )}

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-stone-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-stone-900 transition-colors disabled:opacity-50"
              >
                {formLoading ? "Creando..." : "Crear código"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Tabla de códigos existentes ── */}
        <div className="bg-white rounded-2xl shadow border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-800">Códigos existentes ({codes.length})</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-stone-400">Cargando...</div>
          ) : loadError ? (
            <div className="p-10 text-center text-red-600 text-sm">⚠️ {loadError}</div>
          ) : codes.length === 0 ? (
            <div className="p-10 text-center text-stone-400">No hay códigos creados todavía.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600">Código</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600">Descuento</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600">Mínimo</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600">Usos</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600">Caducidad</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-600">Estado</th>
                    <th className="text-right px-4 py-3 font-semibold text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${!c.active ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3 font-mono font-bold text-stone-800">{c.code}</td>
                      <td className="px-4 py-3 text-stone-700">
                        {c.type === "percentage" ? `${c.value}%` : fmt(c.value)}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {c.min_amount > 0 ? fmt(c.min_amount) : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {c.used_count} / {c.max_uses ?? "∞"}
                        {c.max_uses_per_customer != null && (
                          <span className="block text-xs text-stone-400">
                            Máx. {c.max_uses_per_customer} por cliente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {c.expires_at
                          ? new Date(c.expires_at).toLocaleDateString("es-ES")
                          : "Sin caducidad"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          c.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                        }`}>
                          {c.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleToggleActive(c.id, c.active)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              c.active
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
                          >
                            {c.active ? "Desactivar" : "Activar"}
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}