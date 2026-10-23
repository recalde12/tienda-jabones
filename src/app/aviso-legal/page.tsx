// src/app/aviso-legal/page.tsx
// Aviso legal: datos del titular de la web (LSSI-CE, art. 10) y condiciones de uso.

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de La Flor de Malaura: datos del titular de la web, condiciones de uso y propiedad intelectual.",
  alternates: { canonical: "/aviso-legal" },
};

// Fecha de la última revisión de este texto (actualízala si lo cambias)
const LAST_UPDATED = "23 de octubre de 2026";

const h2 = "font-serif text-2xl sm:text-3xl font-semibold text-espresso mt-12 mb-4";
const p = "text-[17px] leading-[1.75] text-cocoa mb-4";
const li = "text-[17px] leading-[1.75] text-cocoa";
const link = "text-honey-dark underline underline-offset-4";

export default function AvisoLegalPage() {
  const { business, legal } = siteConfig;
  const address = `${business.address.street}, ${business.address.postalCode} ${business.address.locality} (Madrid)`;
  const domain = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[{ name: "Inicio", path: "/" }, { name: "Aviso legal", path: "/aviso-legal" }]} />

      <article className="max-w-[760px] mx-auto">
        <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">Información legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-espresso mt-3 leading-tight">Aviso legal</h1>
        <p className="text-sm text-cocoa mt-3">Última actualización: {LAST_UPDATED}</p>

        <h2 className={h2}>1. Datos del titular</h2>
        <p className={p}>
          En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico
          (LSSI-CE), te informamos de que este sitio web ({domain}) pertenece a:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li className={li}><strong className="text-espresso">Titular:</strong> {legal.owner}</li>
          <li className={li}><strong className="text-espresso">NIF:</strong> {legal.nif}</li>
          <li className={li}><strong className="text-espresso">Nombre comercial:</strong> {siteConfig.name}</li>
          <li className={li}><strong className="text-espresso">Domicilio:</strong> {address}</li>
          <li className={li}>
            <strong className="text-espresso">Email:</strong>{" "}
            <a href={`mailto:${business.email}`} className={link}>{business.email}</a>
          </li>
          <li className={li}><strong className="text-espresso">Teléfono:</strong> 669 78 85 74</li>
          <li className={li}>
            <strong className="text-espresso">Actividad:</strong> elaboración artesanal y venta de jabones y cosmética
            natural, en tienda física y online.
          </li>
        </ul>

        <h2 className={h2}>2. Uso de la web</h2>
        <p className={p}>
          Al navegar por esta web aceptas usarla de forma lícita y de acuerdo con este aviso legal. No está permitido usarla
          para fines ilícitos ni de forma que pueda dañar la web, a sus usuarios o a terceros.
        </p>
        <p className={p}>
          Las compras que hagas en la tienda online se rigen además por nuestra{" "}
          <Link href="/devoluciones" className={link}>política de envíos, cambios y devoluciones</Link>.
        </p>

        <h2 className={h2}>3. Propiedad intelectual</h2>
        <p className={p}>
          Los textos, fotografías, logotipos y diseño de esta web pertenecen a {siteConfig.name} o se usan con permiso de sus
          autores. No puedes copiarlos, reproducirlos ni distribuirlos sin nuestra autorización por escrito, salvo para uso
          personal y privado.
        </p>

        <h2 className={h2}>4. Responsabilidad</h2>
        <p className={p}>
          Cuidamos que la información de la web (productos, precios, horarios) sea correcta y esté actualizada, pero puede
          contener algún error puntual que corregiremos en cuanto lo detectemos. No nos hacemos responsables de los daños que
          pueda causar un uso indebido de la web ni de interrupciones del servicio ajenas a nosotras.
        </p>
        <p className={p}>
          La web puede incluir enlaces a otras páginas (por ejemplo, redes sociales o mapas). No controlamos su contenido y no
          somos responsables de él.
        </p>

        <h2 className={h2}>5. Legislación aplicable</h2>
        <p className={p}>
          Este aviso legal se rige por la legislación española. Si eres consumidor, para cualquier conflicto serán competentes
          los juzgados y tribunales de tu domicilio.
        </p>

        <h2 className={h2}>6. Contacto</h2>
        <p className={p}>
          Para cualquier duda sobre este aviso legal, escríbenos a{" "}
          <a href={`mailto:${business.email}`} className={link}>{business.email}</a>.
        </p>

        <p className="text-cocoa mt-12">
          <Link href="/" className="font-bold text-honey-dark underline underline-offset-4">← Volver a la tienda</Link>
        </p>
      </article>
    </div>
  );
}
