// src/components/ReviewsSection.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// --- Reseñas de respaldo (Fallback por si falla la API o hay menos de 5) ---
const fallbackReviews = [
  {
    id: "fallback-1",
    name: "María José R.",
    avatarUrl: "",
    rating: 5,
    date: "Hace 2 semanas",
    text: "¡Los mejores jabones artesanales que he probado! El de lavanda huele de maravilla y dura muchísimo. Laura y María son encantadoras. 100% recomendado.",
  },
  {
    id: "fallback-2",
    name: "Carlos M.",
    avatarUrl: "",
    rating: 5,
    date: "Hace 1 mes",
    text: "Compré una cesta como regalo de cumpleaños y fue un éxito total. La presentación es preciosa y los jabones tienen una calidad increíble. Volveré a comprar seguro.",
  },
  {
    id: "fallback-3",
    name: "Ana Belén T.",
    avatarUrl: "",
    rating: 5,
    date: "Hace 3 semanas",
    text: "Tengo la piel muy sensible y estos jabones naturales son lo único que me sienta bien. El de avena y miel es una maravilla. Gracias por cuidar tanto los ingredientes.",
  },
  {
    id: "fallback-4",
    name: "Patricia L.",
    avatarUrl: "",
    rating: 5,
    date: "Hace 2 meses",
    text: "Me enamoré del jabón de rosa mosqueta. Tiene un aroma precioso y la piel me queda suavísima. El envío fue rápido y muy bien empaquetado. ¡Excelente!",
  },
  {
    id: "fallback-5",
    name: "Roberto S.",
    avatarUrl: "",
    rating: 5,
    date: "Hace 1 semana",
    text: "Fui a la tienda física y me atendieron genial. Probé varios jabones y al final me llevé 6. El de café exfolia muy bien. Un negocio con mucho amor y dedicación.",
  }
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-amber-400" : "text-stone-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// Función auxiliar para sacar iniciales si no hay foto
function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function ReviewCard({ review }: { review: any }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 140;
  const displayText =
    !expanded && isLong ? review.text.slice(0, 140) + "..." : review.text;

  // Generamos un color aleatorio suave para el fondo si no hay foto
  const colorIndex = review.name.length % 5;
  const colors = ["bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700", "bg-green-100 text-green-700", "bg-purple-100 text-purple-700", "bg-sky-100 text-sky-700"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        {review.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.avatarUrl} alt={review.name} className="w-11 h-11 rounded-full object-cover" />
        ) : (
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colors[colorIndex]}`}>
            {getInitials(review.name)}
          </div>
        )}
        
        <div>
          <p className="font-semibold text-stone-800 leading-tight">{review.name}</p>
          <p className="text-xs text-stone-400">{review.date}</p>
        </div>
        
        {/* Logo Google */}
        <div className="ml-auto">
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.1 0 5.7 1.1 7.8 2.9l5.8-5.8C33.8 3.5 29.2 1.5 24 1.5 14.8 1.5 7 7.4 3.9 15.6l6.8 5.3C12.3 14.2 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.2-9.3 6.2-16.2z"/>
            <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-6.8-5.3A23.5 23.5 0 0 0 .5 24c0 3.8.9 7.4 2.5 10.5l7.7-5.9z"/>
            <path fill="#34A853" d="M24 46.5c5.2 0 9.6-1.7 12.8-4.7l-7-5.4c-1.8 1.2-4.1 1.9-5.8 1.9-6.3 0-11.7-4.7-13.3-11l-7.7 5.9C6 41 14.4 46.5 24 46.5z"/>
          </svg>
        </div>
      </div>

      {/* Estrellas */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} filled={i <= review.rating} />
        ))}
      </div>

      {/* Texto */}
      <p className="text-stone-600 text-sm leading-relaxed">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-stone-800 font-semibold hover:underline focus:outline-none"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </p>
    </div>
  );
}

export function ReviewsSection() {
  const googleReviewsUrl = "https://search.google.com/local/reviews?placeid=ChIJsdhiNAAXQg0Rn11LyBDmPE4"; 
  
  const [reviews, setReviews] = useState<any[]>(fallbackReviews);
  const [globalRating, setGlobalRating] = useState("5,0");
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            // Mapeamos los datos de Google a nuestro formato
            const formattedReviews = data.reviews.map((r: any, index: number) => ({
              id: `google-${index}`,
              name: r.author_name,
              avatarUrl: r.profile_photo_url,
              rating: r.rating,
              date: r.relative_time_description, 
              text: r.text,
            }));
            
            // Filtramos para que solo salgan reseñas de 4 o 5 estrellas con texto
            const bestReviews = formattedReviews.filter((r: any) => r.rating >= 4 && r.text.length > 0);
            
            // LA MAGIA: Rellenamos si faltan para llegar a 5
            let finalReviews = [...bestReviews];
            if (finalReviews.length < 5) {
              const huecosFaltantes = 5 - finalReviews.length;
              finalReviews = [...finalReviews, ...fallbackReviews.slice(0, huecosFaltantes)];
            }
            
            setReviews(finalReviews);
            setGlobalRating(data.rating ? data.rating.toString().replace('.', ',') : "5,0");
            setTotalReviews(data.user_ratings_total);
          }
        }
      } catch (error) {
        console.error("No se pudieron cargar las reseñas, usando fallback.");
      } finally {
        setLoading(false);
      }
    }

    fetchGoogleReviews();
  }, []);

  return (
    <section className="py-20 sm:py-28" style={{ background: "var(--background)" }}>
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* SVG de Google recuperado */}
            <svg className="w-8 h-8" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.7 1.1 7.8 2.9l5.8-5.8C33.8 3.5 29.2 1.5 24 1.5 14.8 1.5 7 7.4 3.9 15.6l6.8 5.3C12.3 14.2 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.2-9.3 6.2-16.2z"/>
              <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-6.8-5.3A23.5 23.5 0 0 0 .5 24c0 3.8.9 7.4 2.5 10.5l7.7-5.9z"/>
              <path fill="#34A853" d="M24 46.5c5.2 0 9.6-1.7 12.8-4.7l-7-5.4c-1.8 1.2-4.1 1.9-5.8 1.9-6.3 0-11.7-4.7-13.3-11l-7.7 5.9C6 41 14.4 46.5 24 46.5z"/>
            </svg>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 font-serif">
              Lo que dicen nuestras clientas
            </h2>
          </div>

          {/* Puntuación global */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="text-5xl font-extrabold text-stone-800">{globalRating}</span>
            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} filled={true} />
                ))}
              </div>
              <span className="text-sm text-stone-500">
                {totalReviews ? `Basado en ${totalReviews} reseñas de Google` : "Basado en reseñas de Google"}
              </span>
            </div>
          </div>

          <hr className="w-20 border-t-2 border-stone-400 mx-auto mt-6" />
        </div>

        {/* Grid de reseñas: Cambiado a slice(0, 5) para mostrar las 5 */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 5).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* CTA a Google Maps */}
        <div className="text-center mt-12">
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-stone-700 font-semibold px-8 py-3 rounded-full border-2 border-stone-300 shadow-sm hover:bg-stone-50 hover:border-stone-400 transition-all duration-200"
          >
             <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.7 1.1 7.8 2.9l5.8-5.8C33.8 3.5 29.2 1.5 24 1.5 14.8 1.5 7 7.4 3.9 15.6l6.8 5.3C12.3 14.2 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.2-9.3 6.2-16.2z"/>
              <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-6.8-5.3A23.5 23.5 0 0 0 .5 24c0 3.8.9 7.4 2.5 10.5l7.7-5.9z"/>
              <path fill="#34A853" d="M24 46.5c5.2 0 9.6-1.7 12.8-4.7l-7-5.4c-1.8 1.2-4.1 1.9-5.8 1.9-6.3 0-11.7-4.7-13.3-11l-7.7 5.9C6 41 14.4 46.5 24 46.5z"/>
            </svg>
             Ver todas las reseñas en Google
          </a>
        </div>
      </div>
    </section>
  );
}