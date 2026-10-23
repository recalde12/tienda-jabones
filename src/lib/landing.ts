// src/lib/landing.ts
// Páginas de aterrizaje para búsquedas concretas («jabones para piel sensible», «cestas de regalo»…).
// Cada una tiene texto propio, sus productos (por slug) y preguntas frecuentes. Solo hay página
// para las necesidades con al menos dos jabones: con uno solo, su ficha ya cubre esa búsqueda.
// Textos basados en las descripciones reales de los productos, sin alegaciones médicas.

import type { FaqItem } from "@/components/Faq";

export type Tip = { title: string; text: string };

export type LandingPage = {
  /** URL de la página */
  path: string;
  /** Nombre corto (migas de pan, pie de página) */
  name: string;
  /** Texto de los enlaces a la página, en minúscula: «Ver todos los <linkText>» */
  linkText: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  /** Productos principales, en orden */
  slugs: string[];
  /** Packs relacionados (opcional) */
  packs?: string[];
  tipsTitle: string;
  tips: Tip[];
  faqs: FaqItem[];
};

const NO_PARABENS: FaqItem = {
  q: "¿Llevan parabenos o sulfatos?",
  a: "No. Elaboramos nuestros jabones a mano con ingredientes de origen natural, sin parabenos ni sulfatos, y son cruelty-free.",
};

const MAKE_IT_LAST: FaqItem = {
  q: "¿Cómo hago que el jabón me dure más?",
  a: "Déjalo secar entre usos en una jabonera con drenaje y lejos del chorro de la ducha. Un jabón artesanal que no se queda en agua dura mucho más.",
};

/** Páginas por tipo de piel: /jabones/<slug> */
export const NEED_PAGES: LandingPage[] = [
  {
    path: "/jabones/piel-sensible",
    name: "Piel sensible",
    linkText: "jabones para piel sensible",
    title: "Jabones naturales para piel sensible",
    description:
      "Jabones artesanales para piel sensible con leche de cabra, avena y miel o aloe vera. Limpian sin irritar. Hechos a mano en Madrid, sin parabenos.",
    eyebrow: "Para piel sensible",
    h1: "Jabones naturales para piel sensible",
    intro: [
      "La piel sensible se enrojece, tira o pica con facilidad, sobre todo con jabones de detergentes fuertes o mucho perfume. Por eso hemos creado jabones con ingredientes suaves que limpian sin llevarse la hidratación natural de la piel.",
      "Los elaboramos a mano, en pequeñas tandas, en nuestro taller de San Martín de la Vega, sin parabenos ni sulfatos. Elige el tuyo según lo que más te preocupe: calmar, hidratar o reducir las rojeces.",
    ],
    slugs: ["jabon-artesanal-malaura", "jabon-caricia-de-seda", "jabon-de-elixir-verde"],
    packs: ["secreto-de-cleopatra", "equilibrio-puro"],
    tipsTitle: "Cómo lavar la piel sensible",
    tips: [
      { title: "Agua templada", text: "El agua muy caliente reseca e irrita más la piel. Mejor templada, también al aclarar." },
      { title: "Sin frotar", text: "Haz espuma en las manos y aplícala con suavidad, sin esponjas ásperas." },
      { title: "Seca a toques", text: "Usa la toalla a toques en lugar de frotar, sobre todo en la cara." },
      { title: "Prueba primero", text: "Si tu piel reacciona con facilidad, prueba el jabón en una zona pequeña antes de usarlo a diario." },
    ],
    faqs: [
      {
        q: "¿Qué jabón es mejor para la piel sensible?",
        a: "Si tu piel es muy reactiva, empieza por el Jabón Artesanal Malaura, con leche de cabra. Si además notas tirantez, el Caricia de Seda, con avena coloidal y miel, calma e hidrata. Para rojeces y brotes, el Elixir Verde, con aloe vera.",
      },
      NO_PARABENS,
      MAKE_IT_LAST,
    ],
  },
  {
    path: "/jabones/piel-grasa",
    name: "Piel grasa o mixta",
    linkText: "jabones para piel grasa o mixta",
    title: "Jabones naturales para piel grasa o mixta",
    description:
      "Jabones artesanales para piel grasa o mixta: carbón activo que limpia poros e impurezas y limón purificante. Hechos a mano en Madrid, sin sulfatos.",
    eyebrow: "Para piel grasa o mixta",
    h1: "Jabones naturales para piel grasa o mixta",
    intro: [
      "La piel grasa o mixta produce más sebo, sobre todo en la frente, la nariz y la barbilla, y tiende a los brillos y a los poros obstruidos. Lo que necesita es una limpieza que purifique sin resecar: si eliminas toda la grasa, la piel reacciona produciendo todavía más.",
      "Para ella tenemos dos jabones artesanales: uno de carbón activo, que arrastra las impurezas de los poros, y otro de aceite esencial de limón, astringente y purificante.",
    ],
    slugs: ["jabon-flor-de-noche", "jabon-amanecer-citrico"],
    packs: ["ying-yang", "equilibrio-puro"],
    tipsTitle: "Cómo lavar la piel grasa",
    tips: [
      { title: "Dos veces al día", text: "Mañana y noche es suficiente: lavarla más a menudo la reseca y produce más grasa." },
      { title: "Insiste en la zona T", text: "Masajea la espuma unos segundos en frente, nariz y barbilla, donde más brilla." },
      { title: "Aclara con agua fresca", text: "Después de limpiar, un aclarado con agua fresca deja una sensación más limpia." },
      { title: "Hidrata igualmente", text: "Una crema ligera después del lavado ayuda a que la piel no compense produciendo más sebo." },
    ],
    faqs: [
      {
        q: "¿Carbón activo o limón?",
        a: "El Flor de Noche, con carbón activo, es para una limpieza más profunda de poros e impurezas. El Amanecer Cítrico, con limón, purifica y deja una sensación fresca; si tu piel es mixta, es un buen punto de partida.",
      },
      {
        q: "¿Resecan la piel?",
        a: "Están pensados para limpiar sin resecar. El Flor de Noche lleva además aceite de coco para aportar una suavidad extra.",
      },
      NO_PARABENS,
    ],
  },
  {
    path: "/jabones/piel-apagada",
    name: "Piel apagada",
    linkText: "jabones para piel apagada",
    title: "Jabones iluminadores para piel apagada",
    description:
      "Jabones artesanales que dan luz a la piel apagada: extracto de arroz que unifica el tono y naranja con vitamina C. Hechos a mano en Madrid, sin parabenos.",
    eyebrow: "Para una piel con más luz",
    h1: "Jabones para una piel apagada y sin luz",
    intro: [
      "Cansancio, poco descanso, frío, contaminación… La piel apagada pierde luminosidad y su tono se ve menos uniforme. Una limpieza diaria con ingredientes que aportan luz ayuda a que recupere un aspecto más fresco.",
      "El extracto de arroz es un clásico de la cosmética oriental para unificar el tono, y la naranja con vitamina C aporta un extra de luminosidad y acción antioxidante.",
    ],
    slugs: ["jabon-perla-oriental", "jabon-de-flor-de-azahar"],
    packs: ["ritual-dia-y-noche"],
    tipsTitle: "Cómo recuperar la luz de la piel",
    tips: [
      { title: "Vitamina C por la mañana", text: "El jabón de naranja despierta la piel para empezar el día." },
      { title: "Constancia", text: "El efecto se nota con el uso diario, no de un día para otro." },
      { title: "Exfolia de vez en cuando", text: "Una o dos veces por semana, una exfoliación suave retira las células muertas que apagan el tono." },
      { title: "Protector solar", text: "El sol es lo que más mancha y apaga la piel: protégela a diario." },
    ],
    faqs: [
      {
        q: "¿Cuál uso por la mañana y cuál por la noche?",
        a: "El Flor de Azahar, con naranja y vitamina C, es ideal por la mañana. El Perla Oriental, con extracto de arroz, puedes usarlo a diario, mañana o noche. También tienes el pack Ritual Día y Noche: naranja para el día y aloe vera para la noche.",
      },
      NO_PARABENS,
      MAKE_IT_LAST,
    ],
  },
  {
    path: "/jabones/antiedad",
    name: "Antiedad",
    linkText: "jabones antiedad",
    title: "Jabones naturales antiedad",
    description:
      "Jabones artesanales antiedad con rosa mosqueta, o polifenoles y vitamina E del olivo, que cuidan la elasticidad de la piel. Hechos a mano en Madrid.",
    eyebrow: "Para cuidar la piel madura",
    h1: "Jabones naturales antiedad",
    intro: [
      "Con los años la piel pierde elasticidad, luminosidad y firmeza. El primer paso de cualquier rutina antiedad es una limpieza que cuide la piel en lugar de castigarla.",
      "La rosa mosqueta y los antioxidantes del olivo, polifenoles y vitamina E, son dos de los ingredientes más valorados para ayudar a mantener la piel joven. Los encontrarás en estos dos jabones artesanales.",
    ],
    slugs: ["jabon-jardin-secreto", "raiz-de-olivo"],
    packs: ["secreto-de-cleopatra"],
    tipsTitle: "Cómo cuidar la piel madura",
    tips: [
      { title: "Limpieza suave", text: "Sin frotar y con agua templada: la piel madura es más fina y se irrita antes." },
      { title: "Hidrata en húmedo", text: "Aplica tu crema con la piel todavía un poco húmeda para retener mejor el agua." },
      { title: "Protector solar a diario", text: "El sol es la principal causa del envejecimiento prematuro de la piel." },
      { title: "Constancia", text: "Los cuidados diarios son los que marcan la diferencia con el tiempo." },
    ],
    faqs: [
      {
        q: "¿Rosa mosqueta u olivo?",
        a: "El Jardín Secreto, con rosa mosqueta y agua de rosas, revitaliza y aporta suavidad. El Raíz de Olivo, con polifenoles y vitamina E, es un antioxidante que ayuda a mantener la elasticidad y la firmeza. Puedes alternarlos.",
      },
      {
        q: "¿Hay algún pack para regalar?",
        a: "Sí: el pack Secreto de Cleopatra combina un jabón de leche de cabra, que nutre y suaviza, con uno de rosas de aroma envolvente.",
      },
      NO_PARABENS,
    ],
  },
];

/** Página de cestas y packs de regalo: /cestas-de-regalo (productos de la categoría «cestas»). */
export const GIFT_PAGE = {
  path: "/cestas-de-regalo",
  name: "Cestas de regalo",
  title: "Cestas de regalo de jabones artesanales",
  description:
    "Cestas y packs de regalo con jabones artesanales hechos a mano en Madrid. Para Navidad, cumpleaños o empresas. Envío o recogida gratis en tienda.",
  eyebrow: "Regalos hechos a mano",
  h1: "Cestas de regalo de jabones artesanales",
  intro: [
    "Un regalo que se usa, huele bien y está hecho a mano. Nuestras cestas y packs combinan jabones naturales elaborados en nuestro taller de San Martín de la Vega, listos para regalar.",
  ],
  occasions: [
    {
      title: "Navidad y amigo invisible",
      text: "Los packs de dos jabones son el detalle perfecto para el amigo invisible, y las cestas, un regalo que luce bajo el árbol.",
    },
    {
      title: "Cumpleaños y aniversarios",
      text: "Una cesta para convertir el baño en un pequeño spa: el regalo para alguien que se merece un rato para sí.",
    },
    {
      title: "Día de la Madre",
      text: "Nuestra marca nace del amor de madre. Pocas ocasiones le van mejor a un regalo hecho a mano.",
    },
    {
      title: "Empresas y eventos",
      text: "Preparamos detalles con etiqueta personalizada para clientes, equipos y celebraciones.",
    },
  ] as Tip[],
  faqs: [
    {
      q: "¿Puedo elegir los jabones de la caja?",
      a: "Sí. Con el Pack Dúo eliges tus panales favoritos y te los preparamos en una caja exclusiva.",
    },
    {
      q: "¿Hacéis cestas personalizadas para empresas o eventos?",
      a: "Sí, con etiqueta personalizada. Pídenos presupuesto en nuestra página de bodas y eventos y te respondemos con ideas y precio.",
    },
    NO_PARABENS,
  ] as FaqItem[],
};

/** Página de tipo de piel que incluye este producto (para enlazarla desde su ficha). */
export function needPageFor(slug: string): LandingPage | undefined {
  return NEED_PAGES.find((page) => page.slugs.includes(slug));
}
