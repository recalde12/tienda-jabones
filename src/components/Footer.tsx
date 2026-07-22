// src/components/Footer.tsx
// Pie de página global. Server Component (sin JS en cliente).

import Link from "next/link";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/perfil", label: "Mi perfil" },
  { href: "/pedidos", label: "Mis pedidos" },
];

// Teléfonos en formato legible + versión limpia para el enlace tel:
const phones = [
  { display: "669 78 85 74", tel: "+34669788574" },
  { display: "619 32 64 49", tel: "+34619326449" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* --- Marca --- */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex flex-col leading-tight">
              <span className="text-xs font-light tracking-[0.3em] text-stone-400 uppercase">
                La Flor de
              </span>
              <span className="text-2xl font-bold font-serif italic text-stone-100">
                Malaura
              </span>
            </Link>
            <p className="mt-4 text-sm text-stone-400 leading-relaxed max-w-xs">
              Jabones artesanales naturales hechos a mano por Laura y María.
              Cruelty-free, sin parabenos ni sulfatos.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de La Flor de Malaura"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de La Flor de Malaura"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* --- Navegación --- */}
          <div>
            <h3 className="text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Contacto --- */}
          <div>
            <h3 className="text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <a href={`mailto:${siteConfig.business.email}`} className="hover:text-white transition-colors break-all">
                  {siteConfig.business.email}
                </a>
              </li>
              {phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="hover:text-white transition-colors">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Tienda / dirección --- */}
          <div>
            <h3 className="text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4">
              Nuestra tienda
            </h3>
            <address className="not-italic text-sm text-stone-400 leading-relaxed">
              {siteConfig.business.address.street}
              <br />
              {siteConfig.business.address.postalCode} {siteConfig.business.address.locality}
              <br />
              {siteConfig.business.address.region}
            </address>
            <p className="mt-4 text-xs text-stone-500">
              Horario: Lun–Vie · 10:00–18:00
            </p>
          </div>
        </div>
      </div>

      {/* --- Barra inferior --- */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {year} La Flor de Malaura. Todos los derechos reservados.</p>
          <p>Jabones artesanales hechos a mano en Madrid 🌿</p>
        </div>
      </div>
    </footer>
  );
}
