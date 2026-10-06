// src/app/admin/page.tsx
// /admin no tiene contenido propio: lleva directamente al panel de descuentos.
// (El middleware ya exige sesión de admin antes de llegar aquí.)

import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/admin/descuentos");
}
