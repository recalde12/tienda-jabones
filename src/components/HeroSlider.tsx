// src/components/HeroSlider.tsx

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from 'next/link';

// Asegúrate de que los CSS de Swiper estén importados en layout.tsx o aquí si fallan
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slideData = [
  { 
    id: 1, 
    src: "/slider/InicioSlide.png", 
    alt: "Jabón Malaura", 
    logoSrc: "/logo-malaura-small.png",
    position: "center center"
  },
  { 
    id: 2, 
    src: "/slider/Slide2.png", 
    alt: "Flor de mimbre", 
    logoSrc: "/logo-malaura-small.png", 
    position: "center center" 
  },
  { 
    id: 3, 
    src: "/slider/Slide3.png", 
    alt: "Loción Malaura", 
    logoSrc: "/logo-malaura-small.png", 
    position: "center center" 
  },
];

export function HeroSlider() {
  // CAMBIO 1: Altura mucho menor en móvil (h-[300px]) para que la foto no se corte tanto
  const sliderHeightClasses = "h-[300px] md:h-[700px]";

  return (
    <div className={`w-full bg-black ${sliderHeightClasses}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0} slidesPerView={1} navigation pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }} loop
        className={`w-full ${sliderHeightClasses}`}
      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative w-full ${sliderHeightClasses}`}>
              
              <Image 
                src={slide.src} 
                alt={slide.alt} 
                fill 
                priority={index === 0} 
                style={{
                  objectFit: 'cover', // Cubre todo el espacio (recorta si es necesario)
                  objectPosition: slide.position || 'center'
                }}
              />
              
              {/* Capa oscura muy sutil para mejorar lectura de textos si la foto es clara */}
              <div className="absolute inset-0 bg-black bg-opacity-10" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">

                {/* --- Banner Superior (Slide 1) --- */}
                {index === 0 && (
                  // CAMBIO 2: Usamos Flexbox (justify-between o center) en lugar de absolute
                  // En móvil usamos 'flex-col' para poner logo arriba y texto abajo si quieres,
                  // o 'flex-row' con gap para que no se monten.
                  <div className="absolute top-0 left-0 right-0 py-2 px-4 md:py-8 md:px-8 bg-stone-700 bg-opacity-80 z-30">
                    <div className="flex flex-row items-center justify-center gap-2 md:gap-8 max-w-6xl mx-auto">
                      
                      {/* Logo: Más pequeño en móvil */}
                      <div className="relative h-8 w-24 md:h-16 md:w-60 flex-shrink-0">
                        <Image
                          src="/logo-malaura-banner.png" 
                          alt="Malaura Logo"
                          fill
                          className="object-contain" 
                        />
                      </div>

                      {/* Texto: Ya no es absolute, fluye con el logo */}
                      <h2 className="text-lg md:text-5xl font-bold font-serif text-center leading-tight">
                        Jabones Artesanales
                      </h2>
                    </div>
                  </div>
                )}

                {/* Texto Principal del Slide (Si lo hubiera) */}
                {/* Lo hemos quitado antes, pero si lo usas, asegúrate de que sea pequeño en móvil */}

                {/* --- Botones --- */}
                
                {/* 1. Botón en el CENTRO (Slide 1) */}
                {index === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 mt-8">
                    <Link href="/productos" passHref>
                      <button className="px-5 py-2 text-sm md:px-8 md:py-3 md:text-xl bg-stone-700 text-white font-semibold rounded-lg shadow-xl hover:bg-stone-800 transition-colors transform hover:scale-105 border border-white/20">
                        COMPRAR
                      </button>
                    </Link>
                  </div>
                )}

                {/* 2. Botón ABAJO IZQUIERDA (Resto de slides) */}
                {index !== 0 && (
                  <div className="absolute bottom-6 left-4 md:bottom-12 md:left-12 z-30">
                    <Link href="/productos" passHref>
                      <button className="px-5 py-2 text-sm md:px-8 md:py-3 md:text-xl bg-stone-700 text-white font-semibold rounded-lg shadow-xl hover:bg-stone-800 transition-colors transform hover:scale-105">
                        COMPRAR
                      </button>
                    </Link>
                  </div>
                )}

                {/* Logo inferior derecha (Opcional: Ocultar en móvil si molesta) */}
                {slide.logoSrc && (
                  <div className="absolute bottom-6 right-4 md:bottom-12 md:right-12 z-30 hidden md:block">
                    <div className="relative w-12 h-12 md:w-20 md:h-20">
                      <Image src={slide.logoSrc} alt="Logo Pequeño" fill className="rounded-full shadow-lg object-cover" />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}