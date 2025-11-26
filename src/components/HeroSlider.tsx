// src/components/HeroSlider.tsx

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from 'next/link';

// ⚠️ Los imports de CSS deben estar en app/layout.tsx

const slideData = [
  // Tu array de slides (lo he copiado de tu código)
  { id: 1, src: "/slider/InicioSlide.png", alt: "Jabón Malaura", logoSrc: "/logo-malaura-small.png", position: "center center"},
  { id: 2, src: "/slider/Slide2.png", alt: "Flor de mimbre", logoSrc: "/logo-malaura-small.png", position: "center center" },
  { id: 3, src: "/slider/Slide3.png", alt: "Loción Malaura", logoSrc: "/logo-malaura-small.png", position: "center center" },
];

export function HeroSlider() {
  const sliderHeightClasses = "h-[800px] md:h-[900px]"; // <-- Puedes cambiar la altura aquí

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
                  objectFit: 'cover', 
                  objectPosition: slide.position || 'center'
                }}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">

                {/* --- Banner Superior (Más alto) --- */}
                {index === 0 && (
                  <div className="absolute top-0 left-0 right-0 py-12 px-8 bg-stone-700 bg-opacity-70 flex items-center z-30">
                    <Image
                      src="/logo-malaura-banner.png" 
                      alt="Malaura Logo"
                      width={240} 
                      height={200}
                      className="object-contain" 
                    />
                    <h2 className="absolute left-1/2 -translate-x-1/2 text-4xl md:text-6xl font-bold font-serif">Jabones Artesanales</h2>
                  </div>
                )}

                {/* Contenido principal del slide */}
                {slide.mainText && ( // Esta propiedad no está en tu array, pero si la añades, aparecerá
                  <div className="flex flex-col items-center text-center -mt-16 z-20"> 
                    <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg leading-tight">
                      {slide.mainText}
                    </h1>
                  </div>
                )}

                {/* --- CAMBIO AQUÍ: Lógica condicional para el botón --- */}
                
                {/* 1. Botón en el CENTRO si es el primer slide (index === 0) */}
                {index === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <Link href="/productos" passHref>
                      <button className="px-8 py-3 bg-stone-700 text-white text-xl font-semibold rounded-lg shadow-xl hover:bg-stone-800 transition-colors transform hover:scale-105">
                        COMPRAR
                      </button>
                    </Link>
                  </div>
                )}

                {/* 2. Botón ABAJO A LA IZQUIERDA para el resto de slides (index !== 0) */}
                {index !== 0 && (
                  <div className="absolute bottom-8 left-8 z-30">
                    <Link href="/productos" passHref>
                      <button className="mt-8 px-8 py-3 bg-stone-700 text-white text-xl font-semibold rounded-lg shadow-xl hover:bg-stone-800 transition-colors transform hover:scale-105">
                        COMPRAR
                      </button>
                    </Link>
                  </div>
                )}
                {/* --- FIN DEL CAMBIO --- */}

                {/* Logo inferior derecha */}
                {slide.logoSrc && (
                  <div className="absolute bottom-8 right-8 z-30">
                    <Image src={slide.logoSrc} alt="Logo Malaura Pequeño" width={80} height={80} className="rounded-full shadow-lg" />
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