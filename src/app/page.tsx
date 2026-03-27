// src/app/page.tsx

import { HeroSlider } from '@/components/HeroSlider';
import { ContactSection } from '@/components/ContactSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import Link from 'next/link';

// Iconos decorativos inline para las características
const features = [
  {
    emoji: "🌿",
    title: "100% Natural",
    description: "Solo ingredientes de origen natural. Sin parabenos, sin sulfatos, sin artificiales.",
  },
  {
    emoji: "🤲",
    title: "Hecho a Mano",
    description: "Cada jabón es elaborado artesanalmente por Laura y María con mimo y dedicación.",
  },
  {
    emoji: "💚",
    title: "Cruelty-Free",
    description: "Respetuosos con los animales y con el medio ambiente en cada paso del proceso.",
  },
  {
    emoji: "🎁",
    title: "Ideal para Regalar",
    description: "Presentaciones únicas y cestas personalizadas para cualquier ocasión especial.",
  },
];

export default function HomePage() {
  return (
    <div>
      <HeroSlider />

      {/* ===== SECCIÓN BIENVENIDA ===== */}
      <section className="py-20 sm:py-28" style={{ background: "var(--background)" }}>
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <span className="text-sm font-semibold tracking-widest text-stone-500 uppercase mb-3">
            Jabones Artesanales Naturales
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-800 font-serif leading-tight max-w-3xl">
            Bienvenida a<br />
            <span className="text-stone-600 italic">La Flor de Malaura</span>
          </h1>
          <hr className="w-20 border-t-2 border-stone-400 my-8" />
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl leading-relaxed">
            Creamos jabones artesanales naturales hechos a mano por Laura y María.
            Un refugio de aromas y texturas que cuidan tu piel con la frescura de
            lo natural y el amor de lo hecho en casa.
          </p>
          <Link href="/productos" className="mt-10 inline-block bg-stone-700 hover:bg-stone-800 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg">
            Descubrir productos
          </Link>
        </div>
      </section>

      {/* ===== SECCIÓN "POR QUÉ ELEGIRNOS" ===== */}
      <section className="bg-stone-800 py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-100 font-serif">
              ¿Por qué elegir Malaura?
            </h2>
            <p className="text-stone-400 mt-3 text-lg max-w-xl mx-auto">
              Porque tu piel merece lo mejor, y lo mejor viene de la naturaleza.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-stone-700 rounded-2xl p-8 text-center hover:bg-stone-600 transition-colors duration-300 border border-stone-600"
              >
                <span className="text-5xl block mb-5">{feature.emoji}</span>
                <h3 className="text-xl font-bold text-stone-100 mb-3">{feature.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BANNER CTA ===== */}
      <section
        className="py-20 sm:py-24 text-center"
        style={{ background: "var(--background)" }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 font-serif mb-4">
            Un jabón para cada piel
          </h2>
          <p className="text-stone-600 text-lg max-w-xl mb-8">
            Explora todo nuestro catálogo: jabones al corte, en pastilla, cestas regalo
            y productos especiales. Seguro que encuentras el tuyo.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-white text-stone-800 font-bold px-10 py-4 rounded-full border-2 border-stone-400 shadow hover:bg-stone-50 hover:border-stone-600 transition-all duration-300 text-lg"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </section>

      {/* ===== RESEÑAS DE GOOGLE ===== */}
      <ReviewsSection />

      {/* ===== SECCIÓN CONTACTO ===== */}
      <ContactSection />
    </div>
  );
}