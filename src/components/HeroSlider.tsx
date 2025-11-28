// src/components/HeroSlider.tsx

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from 'next/link';

// ⚠️ Los imports de CSS deben estar en app/layout.tsx

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
  // AJUSTE 1: Altura más pequeña en móvil (500px), grande en PC (700px)
  const sliderHeightClasses = "h-[500px] md:h-[700px]";

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

                {/* --- Banner Superior --- */}
                {index === 0 && (
                  // AJUSTE 2: Padding más pequeño en móvil (py-4) y grande en PC (md:py-8)
                  <div className="absolute top-0 left-0 right-0 py-4 px-4 md:py-8 md:px-8 bg-stone-700 bg-opacity-70 flex items-center z-30">
                    
                    {/* AJUSTE 3: Logo responsive. w-auto h-10 en móvil, w-auto h-20 en PC */}
                    <div className="relative h-10 w-32 md:h-16 md:w-60">
                      <Image
                        src="/logo-malaura-banner.png" 
                        alt="Malaura Logo"
                        fill
                        className="object-contain object-left" 
                      />
                    </div>

                    {/* AJUSTE 4: Texto Malaura más pequeño en móvil */}
                    <h2 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-6xl font-bold font-serif">
                      Jabones Artesanales
                    </h2>
                  </div>
                )}

                {/* Contenido principal del slide */}
                {slide.mainText && (
                  <div className="flex flex-col items-center text-center -mt-16 z-20"> 
                    {/* AJUSTE 5: Texto principal responsive */}
                    <h1 className="text-4xl md:text-7xl font-bold drop-shadow-lg leading-tight px-2">
                      {slide.mainText}
                    </h1>
                  </div>
                )}

                {/* --- Botones --- */}
                
                {/* 1. Botón en el CENTRO (Slide 1) */}
                {index === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <Link href="/productos" passHref>
                      <button className="px-6 py-2 text-lg md:px-8 md:py-3 md:text-xl bg-stone-700 text-white font-semibold rounded-lg shadow-xl hover:bg-stone-800 transition-colors transform hover:scale-105">
                        COMPRAR
                      </button>
                    </Link>
                  </div>
                )}

                {/* 2. Botón ABAJO IZQUIERDA (Resto de slides) */}
                {index !== 0 && (
                  // AJUSTE 6: Margen izquierdo más pequeño en móvil
                  <div className="absolute bottom-8 left-4 md:left-8 z-30">
                    <Link href="/productos" passHref>
                      <button className="px-6 py-2 text-lg md:px-8 md:py-3 md:text-xl bg-stone-700 text-white font-semibold rounded-lg shadow-xl hover:bg-stone-800 transition-colors transform hover:scale-105">
                        COMPRAR
                      </button>
                    </Link>
                  </div>
                )}

                {/* Logo inferior derecha */}
                {slide.logoSrc && (
                  // AJUSTE 7: Logo pequeño un poco más pequeño en móvil
                  <div className="absolute bottom-8 right-4 md:right-8 z-30">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
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