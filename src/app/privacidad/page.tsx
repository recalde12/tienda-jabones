// src/app/privacidad/page.tsx
// Política de privacidad (RGPD y LOPDGDD). Describe los datos que trata la web y con qué proveedores.

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata La Flor de Malaura tus datos personales: cuenta de cliente, pedidos, pagos, solicitudes de presupuesto y tus derechos.",
  alternates: { canonical: "/privacidad" },
};

// Fecha de la última revisión de este texto (actualízala si lo cambias)
const LAST_UPDATED = "23 de octubre de 2026";

const h2 = "font-serif text-2xl sm:text-3xl font-semibold text-espresso mt-12 mb-4";
const h3 = "font-serif text-xl font-semibold text-espresso mt-8 mb-3";
const p = "text-[17px] leading-[1.75] text-cocoa mb-4";
const li = "text-[17px] leading-[1.75] text-cocoa";
const ul = "list-disc pl-6 flex flex-col gap-2 mb-4";
const link = "text-honey-dark underline underline-offset-4";
const strong = "text-espresso";

// Cada tratamiento: qué datos, para qué y con qué base legal (art. 6 RGPD)
const treatments = [
  {
    title: "Tu cuenta de cliente",
    data: "Email y contraseña (la contraseña se guarda cifrada y no podemos verla). Si entras con Google, Google nos facilita tu nombre, tu email y tu foto. En tu perfil puedes añadir nombre, apellidos, dirección, teléfono y una foto.",
    purpose: "Crear y gestionar tu cuenta, que puedas comprar y ver tus pedidos.",
    basis: "La ejecución del contrato que aceptas al registrarte (art. 6.1.b RGPD).",
  },
  {
    title: "Pedidos y pagos",
    data: "Nombre, email, dirección de envío (o recogida en tienda), productos, importes y código de descuento usado. El pago lo procesa Stripe: los datos de tu tarjeta van directamente a Stripe y nosotras no los vemos ni los guardamos.",
    purpose: "Preparar y entregar tu pedido, enviarte los emails de confirmación, atender cambios y devoluciones, y cumplir con la facturación y la contabilidad.",
    basis: "La ejecución del contrato de compra (art. 6.1.b RGPD) y el cumplimiento de obligaciones legales fiscales y contables (art. 6.1.c RGPD).",
  },
  {
    title: "Club Malaura y códigos de descuento",
    data: "Número de pedidos pagados con tu email y los códigos de descuento que has usado con tu cuenta.",
    purpose: "Calcular tu nivel del Club Malaura y los regalos, y aplicar los límites de uso de cada código.",
    basis: "La ejecución del contrato, como parte de las condiciones de la tienda (art. 6.1.b RGPD).",
  },
  {
    title: "Solicitudes de presupuesto para eventos",
    data: "Nombre, email, teléfono (opcional) y los detalles del evento que nos cuentes en el formulario.",
    purpose: "Responderte y prepararte un presupuesto. La solicitud nos llega por email; no se guarda en la web.",
    basis: "La aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).",
  },
  {
    title: "Contacto por email, teléfono o WhatsApp",
    data: "Los datos que nos des al escribirnos o llamarnos.",
    purpose: "Atender tu consulta.",
    basis: "Tu solicitud y, en su caso, la relación comercial (art. 6.1.b RGPD) o nuestro interés legítimo en responderte (art. 6.1.f RGPD).",
  },
  {
    title: "Seguridad de la web",
    data: "Datos técnicos de la conexión (dirección IP, navegador, páginas visitadas) que registran nuestros proveedores de alojamiento y de pago.",
    purpose: "Mantener la web segura y prevenir el fraude en los pagos.",
    basis: "Nuestro interés legítimo en proteger la tienda y a sus clientes (art. 6.1.f RGPD).",
  },
];

const providers = [
  { name: "Vercel Inc.", role: "Alojamiento de la web." },
  { name: "Supabase Inc.", role: "Base de datos, cuentas de cliente y pedidos." },
  { name: "Stripe Payments Europe Ltd.", role: "Procesamiento de los pagos y prevención del fraude." },
  { name: "Resend (Plus Five Five, Inc.)", role: "Envío de los emails de pedidos y de las solicitudes de presupuesto." },
  { name: "Google", role: "Buzón de correo de la tienda (Gmail), inicio de sesión con Google y, solo si las aceptas, herramientas de análisis." },
  { name: "Empresa de transporte", role: "Entrega de tu pedido (nombre, dirección y teléfono)." },
];

export default function PrivacidadPage() {
  const { business, legal } = siteConfig;
  const address = `${business.address.street}, ${business.address.postalCode} ${business.address.locality} (Madrid)`;
  const mail = <a href={`mailto:${business.email}`} className={link}>{business.email}</a>;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[{ name: "Inicio", path: "/" }, { name: "Política de privacidad", path: "/privacidad" }]} />

      <article className="max-w-[760px] mx-auto">
        <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">Información legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-espresso mt-3 leading-tight">Política de privacidad</h1>
        <p className="text-sm text-cocoa mt-3">Última actualización: {LAST_UPDATED}</p>

        <p className={`${p} mt-8`}>
          En esta página te contamos qué datos personales tratamos cuando usas nuestra web o compras en ella, para qué, durante
          cuánto tiempo y qué derechos tienes. Lo hacemos de acuerdo con el Reglamento General de Protección de Datos (RGPD) y
          la Ley Orgánica 3/2018 de Protección de Datos (LOPDGDD).
        </p>

        <h2 className={h2}>1. Quién es la responsable de tus datos</h2>
        <ul className={ul}>
          <li className={li}><strong className={strong}>Responsable:</strong> {legal.owner} ({siteConfig.name})</li>
          <li className={li}><strong className={strong}>NIF:</strong> {legal.nif}</li>
          <li className={li}><strong className={strong}>Domicilio:</strong> {address}</li>
          <li className={li}><strong className={strong}>Email:</strong> {mail}</li>
          <li className={li}><strong className={strong}>Teléfono:</strong> 669 78 85 74</li>
        </ul>

        <h2 className={h2}>2. Qué datos tratamos y para qué</h2>
        {treatments.map((t) => (
          <section key={t.title}>
            <h3 className={h3}>{t.title}</h3>
            <ul className={ul}>
              <li className={li}><strong className={strong}>Datos:</strong> {t.data}</li>
              <li className={li}><strong className={strong}>Para qué:</strong> {t.purpose}</li>
              <li className={li}><strong className={strong}>Base legal:</strong> {t.basis}</li>
            </ul>
          </section>
        ))}
        <p className={p}>
          Las cookies de análisis solo se usan si las aceptas. Te lo explicamos en la{" "}
          <Link href="/cookies" className={link}>política de cookies</Link>.
        </p>
        <p className={p}>
          Los campos marcados como obligatorios en los formularios son necesarios para atender tu compra o tu solicitud; si no
          los rellenas, no podremos hacerlo. No te enviaremos publicidad por email sin tu consentimiento.
        </p>

        <h2 className={h2}>3. Cuánto tiempo guardamos tus datos</h2>
        <ul className={ul}>
          <li className={li}>
            <strong className={strong}>Cuenta de cliente:</strong> mientras la mantengas. Si nos pides borrarla, la eliminamos,
            salvo los datos de los pedidos que la ley nos obliga a conservar.
          </li>
          <li className={li}>
            <strong className={strong}>Pedidos y facturación:</strong> durante los plazos que marca la ley (con carácter
            general, 6 años para la documentación contable y 4 años a efectos fiscales).
          </li>
          <li className={li}>
            <strong className={strong}>Solicitudes de presupuesto y consultas:</strong> el tiempo necesario para atenderlas y,
            si no llegamos a contratar, un máximo de 1 año.
          </li>
          <li className={li}>
            <strong className={strong}>Registros técnicos de seguridad:</strong> el tiempo que los conservan nuestros
            proveedores para ese fin, normalmente unas semanas.
          </li>
        </ul>

        <h2 className={h2}>4. Con quién compartimos tus datos</h2>
        <p className={p}>
          No vendemos tus datos ni los cedemos a terceros para publicidad. Para que la tienda funcione trabajamos con estos
          proveedores, que tratan los datos por cuenta nuestra y solo para el servicio que nos prestan:
        </p>
        <ul className={ul}>
          {providers.map((pr) => (
            <li key={pr.name} className={li}><strong className={strong}>{pr.name}:</strong> {pr.role}</li>
          ))}
        </ul>
        <p className={p}>
          Stripe también trata algunos datos como responsable independiente, para prevenir el fraude y cumplir sus obligaciones
          como entidad de pago. Si nos escribes por WhatsApp, el servicio lo presta Meta según su propia política de
          privacidad. Además, podemos comunicar datos a las administraciones públicas cuando la ley lo exija (por ejemplo, a la
          Agencia Tributaria).
        </p>

        <h2 className={h2}>5. Transferencias fuera de la Unión Europea</h2>
        <p className={p}>
          Algunos de estos proveedores son empresas de Estados Unidos o pueden tratar datos fuera del Espacio Económico Europeo.
          En esos casos, la transferencia se hace con las garantías que exige el RGPD: el Marco de Privacidad de Datos
          UE-EE. UU. o las cláusulas contractuales tipo aprobadas por la Comisión Europea.
        </p>

        <h2 className={h2}>6. Tus derechos</h2>
        <p className={p}>En cualquier momento puedes pedirnos:</p>
        <ul className={ul}>
          <li className={li}><strong className={strong}>Acceso:</strong> saber qué datos tuyos tratamos.</li>
          <li className={li}><strong className={strong}>Rectificación:</strong> corregir los que sean inexactos.</li>
          <li className={li}><strong className={strong}>Supresión:</strong> que los borremos cuando ya no sean necesarios.</li>
          <li className={li}><strong className={strong}>Oposición y limitación:</strong> que dejemos de tratarlos o los tratemos solo en ciertos casos.</li>
          <li className={li}><strong className={strong}>Portabilidad:</strong> recibirlos en un formato que puedas llevar a otro servicio.</li>
          <li className={li}><strong className={strong}>Retirar tu consentimiento</strong> cuando el tratamiento se base en él, sin que afecte a lo anterior.</li>
        </ul>
        <p className={p}>
          Escríbenos a {mail} con el asunto «Protección de datos», indicando qué derecho quieres ejercer. Si hace falta, te
          pediremos que acredites tu identidad. Te responderemos en el plazo máximo de un mes.
        </p>
        <p className={p}>
          Si crees que no hemos tratado bien tus datos, puedes presentar una reclamación ante la Agencia Española de Protección
          de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className={link}>www.aepd.es</a>).
        </p>

        <h2 className={h2}>7. Menores de edad</h2>
        <p className={p}>
          La tienda no está dirigida a menores de 14 años. Si tienes menos de 14 años, no te registres ni nos envíes tus datos
          sin la autorización de tu madre, padre o tutor.
        </p>

        <h2 className={h2}>8. Seguridad</h2>
        <p className={p}>
          La web funciona con conexión cifrada (HTTPS), las contraseñas se guardan cifradas y los pagos los procesa Stripe,
          que cumple el estándar de seguridad de la industria de tarjetas (PCI DSS). Solo nosotras y los proveedores
          indicados tenemos acceso a los datos, y únicamente para lo que hemos explicado aquí.
        </p>

        <h2 className={h2}>9. Cambios en esta política</h2>
        <p className={p}>
          Si cambiamos la forma en que tratamos tus datos, actualizaremos esta página y su fecha. Si el cambio es importante,
          te avisaremos.
        </p>

        <p className="text-cocoa mt-12 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/cookies" className="font-bold text-honey-dark underline underline-offset-4">Política de cookies</Link>
          <Link href="/aviso-legal" className="font-bold text-honey-dark underline underline-offset-4">Aviso legal</Link>
          <Link href="/" className="font-bold text-honey-dark underline underline-offset-4">← Volver a la tienda</Link>
        </p>
      </article>
    </div>
  );
}
