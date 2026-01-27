// src/app/page.tsx

import { HeroSlider } from '@/components/HeroSlider';
import { ContactSection } from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />

      {/* --- SECCIÓN "BIENVENIDO" MEJORADA --- */}
      {/* 1. Eliminamos el fondo negro. Ahora usará el fondo claro del 'body' */}
      {/* 2. Aumentamos el padding (py-20) y la centramos */}
      <section className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
        
        {/* 3. Título más grande (usará la fuente 'font-serif' de tu cabecera) */}
        <h1 className="text-4xl md:text-5xl font-bold text-stone-300 font-serif">
          Bienvenido a La Flor de Malaura
        </h1>

        {/* 4. Divisor decorativo (usa un color marrón/piedra) */}
        <hr className="w-24 border-t-2 border-stone-400 my-6" />

        {/* 5. Párrafo con ancho limitado (más fácil de leer) y color de texto más suave */}
        <p className="text-lg md:text-xl text-stone-300 max-w-3xl leading-relaxed">
            En Malaura, creamos jabones artesanales naturales hechos a mano por Laura y María. 
            Un refugio de aromas y texturas que cuidan tu piel con la frescura de lo natural y el amor de lo hecho en casa.
        </p>

      </section>
      {/* --- FIN DE LA SECCIÓN --- */}


      {/* Tu sección de contacto que ya tenías */}
      <ContactSection />
    </div>
  );
}