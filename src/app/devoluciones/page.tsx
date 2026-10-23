// src/app/devoluciones/page.tsx
// Política de envíos, cambios y devoluciones (venta online a consumidores en España).

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_OVER, SHIPPING_COST } from "@/lib/shipping";
import { siteConfig } from "@/lib/site";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Envíos, cambios y devoluciones",
  description:
    "Política de envíos, cambios y devoluciones de La Flor de Malaura: 14 días para devolver tu pedido, recogida gratis en tienda y envío gratis en pedidos de más de 40 €.",
  alternates: { canonical: "/devoluciones" },
};

// Fecha de la última revisión de esta política (actualízala si cambias el texto)
const LAST_UPDATED = "21 de octubre de 2026";

const h2 = "font-serif text-2xl sm:text-3xl font-semibold text-espresso mt-12 mb-4";
const p = "text-[17px] leading-[1.75] text-cocoa mb-4";
const li = "text-[17px] leading-[1.75] text-cocoa";

export default function DevolucionesPage() {
  const { business } = siteConfig;
  const address = `${business.address.street}, ${business.address.postalCode} ${business.address.locality} (${business.address.region})`;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[{ name: "Inicio", path: "/" }, { name: "Envíos y devoluciones", path: "/devoluciones" }]} />

      <article className="max-w-[760px] mx-auto">
        <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">Ayuda</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-espresso mt-3 leading-tight">
          Envíos, cambios y devoluciones
        </h1>
        <p className="text-sm text-cocoa mt-3">Última actualización: {LAST_UPDATED}</p>

        <p className={`${p} mt-8`}>
          Hacemos cada jabón a mano y queremos que te encante. Si algo no es como esperabas, aquí te explicamos cómo
          devolverlo o cambiarlo. Para cualquier duda, escríbenos a{" "}
          <a href={`mailto:${business.email}`} className="text-honey-dark underline underline-offset-4">{business.email}</a> o por{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-honey-dark underline underline-offset-4">
            WhatsApp al {WHATSAPP_DISPLAY}
          </a>
          .
        </p>

        <h2 className={h2}>1. Envíos y recogida en tienda</h2>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li className={li}>
            <strong className="text-espresso">Envío a domicilio:</strong> {formatPrice(SHIPPING_COST)}. Es gratis en pedidos de
            más de {formatPrice(FREE_SHIPPING_OVER)}.
          </li>
          <li className={li}>
            <strong className="text-espresso">Recogida en tienda:</strong> gratis, en {address}. Te avisaremos por email cuando tu
            pedido esté listo.
          </li>
          <li className={li}>Cuando enviemos tu pedido te lo comunicaremos por email.</li>
        </ul>

        <h2 className={h2}>2. Tienes 14 días para devolver tu pedido</h2>
        <p className={p}>
          Si compras en nuestra web, tienes derecho a desistir de la compra en un plazo de <strong className="text-espresso">14
          días naturales</strong> desde el día en que recibes el pedido o lo recoges en la tienda, sin necesidad de darnos
          ninguna explicación.
        </p>
        <p className={p}>Para hacerlo:</p>
        <ol className="list-decimal pl-6 flex flex-col gap-2 mb-4">
          <li className={li}>
            Avísanos dentro de esos 14 días por email ({business.email}) o por WhatsApp ({WHATSAPP_DISPLAY}), indicando tu
            nombre, el número de pedido y los productos que quieres devolver. Si lo prefieres, puedes usar el modelo de
            formulario que encontrarás al final de esta página.
          </li>
          <li className={li}>
            Devuélvenos los productos en un plazo máximo de 14 días desde que nos avisas. Puedes{" "}
            <strong className="text-espresso">traerlos a nuestra tienda sin ningún coste</strong> o enviarlos a {address}.
          </li>
          <li className={li}>
            Los productos deben estar sin usar y, a ser posible, en su embalaje original.
          </li>
        </ol>
        <p className={p}>
          Si eliges devolverlos por mensajería, el coste del envío de vuelta corre de tu cuenta, salvo que el producto llegara
          dañado o no fuera el que pediste (ver punto 4).
        </p>

        <h2 className={h2}>3. Reembolso</h2>
        <p className={p}>
          Te devolveremos el importe de los productos y también los gastos del envío original (el envío estándar que pagaste al
          comprar) en un plazo máximo de <strong className="text-espresso">14 días naturales</strong> desde que nos comunicas que
          desistes. Podemos esperar a haber recibido los productos, o a que nos muestres que ya los has enviado, antes de hacer
          el reembolso.
        </p>
        <p className={p}>
          El reembolso se hará por el mismo medio de pago que usaste en la compra, sin ningún coste para ti.
        </p>

        <h2 className={h2}>4. Productos dañados o equivocados</h2>
        <p className={p}>
          Si tu pedido llega dañado o recibes un producto distinto del que pediste, escríbenos lo antes posible con una foto del
          producto y del paquete. Te lo cambiamos o te devolvemos el dinero, y en este caso{" "}
          <strong className="text-espresso">nosotras nos hacemos cargo de todos los gastos de envío</strong>.
        </p>
        <p className={p}>
          Además, todos nuestros productos cuentan con la garantía legal de conformidad de 3 años que establece la ley.
        </p>

        <h2 className={h2}>5. Productos que no se pueden devolver</h2>
        <p className={p}>Por ley, el derecho de desistimiento no se aplica a:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li className={li}>
            <strong className="text-espresso">Productos personalizados</strong> o hechos a medida para ti, como los detalles para
            bautizos, comuniones, bodas y otros eventos con aroma, color o etiqueta personalizados.
          </li>
          <li className={li}>
            <strong className="text-espresso">Productos precintados que, por higiene o protección de la salud,</strong> no pueden
            devolverse si se han desprecintado después de la entrega.
          </li>
        </ul>
        <p className={p}>
          Esto no afecta a tus derechos si el producto llega dañado o no es el que pediste: en ese caso aplica siempre el punto 4.
        </p>

        <h2 className={h2}>6. Contacto</h2>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li className={li}>Email: <a href={`mailto:${business.email}`} className="text-honey-dark underline underline-offset-4">{business.email}</a></li>
          <li className={li}>WhatsApp: {WHATSAPP_DISPLAY}</li>
          <li className={li}>Tienda: {address}</li>
          <li className={li}>
            Titular: {siteConfig.legal.owner}, NIF {siteConfig.legal.nif} (ver{" "}
            <Link href="/aviso-legal" className="text-honey-dark underline underline-offset-4">aviso legal</Link>)
          </li>
        </ul>

        <h2 className={h2}>Modelo de formulario de desistimiento</h2>
        <p className={p}>Solo tienes que rellenarlo y enviárnoslo si quieres desistir de tu compra:</p>
        <div className="rounded-[20px] bg-sand p-6 text-[16px] leading-[1.8] text-espresso whitespace-pre-line">
          {`A la atención de ${siteConfig.legal.owner} (La Flor de Malaura), ${address}, ${business.email}:

Por la presente le comunico que desisto de mi contrato de venta de los siguientes productos:

– Número de pedido:
– Productos:
– Pedido el / recibido el:
– Nombre:
– Domicilio:
– Firma (solo si el formulario se presenta en papel):
– Fecha:`}
        </div>

        <p className="text-cocoa mt-12">
          <Link href="/" className="font-bold text-honey-dark underline underline-offset-4">← Volver a la tienda</Link>
        </p>
      </article>
    </div>
  );
}
