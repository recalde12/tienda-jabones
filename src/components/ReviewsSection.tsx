// src/components/ReviewsSection.tsx

"use client";

import { useState, useEffect } from "react";
import { GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL } from "@/lib/site";

// NOTA: No usamos reseñas de ejemplo/ficticias. Mostrar reseñas falsas es engañoso
// y contrario a la normativa de protección al consumidor. Solo se muestran reseñas
// REALES obtenidas de Google; si no hay, la sección se oculta por completo.

const MAX_REVIEWS = 3;
const MAX_CHARS = 220;

type Review = { id: string; name: string; text: string };

function Stars({ size = 18 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#C98A1E">
          <path d="m12 2 3 6.6 7 .7-5.3 4.8 1.6 7L12 17.5 5.7 21.1l1.6-7L2 9.3l7-.7z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > MAX_CHARS;
  const text = !expanded && isLong ? `${review.text.slice(0, MAX_CHARS).trimEnd()}…` : review.text;

  return (
    <figure className="flex-1 basis-[300px] min-w-0 m-0 bg-cream rounded-[22px] p-7 flex flex-col gap-4">
      <Stars size={16} />
      <blockquote className="m-0 font-serif text-lg sm:text-xl leading-relaxed text-espresso">
        «{text}»
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="ml-2 font-sans text-sm font-bold text-honey-dark underline underline-offset-4"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </blockquote>
      <figcaption className="text-[15px] font-bold text-cocoa">{review.name} · Google</figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [globalRating, setGlobalRating] = useState<string | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            // Solo reseñas reales de 4-5 estrellas con texto. Sin rellenos ni datos ficticios.
            const best: Review[] = data.reviews
              .filter((r: any) => r.rating >= 4 && r.text?.length > 0)
              .map((r: any, index: number) => ({ id: `google-${index}`, name: r.author_name, text: r.text }));
            setReviews(best);
            if (data.rating) setGlobalRating(Number(data.rating).toFixed(1).replace(".", ","));
            setTotalReviews(data.user_ratings_total ?? null);
          }
        }
      } catch {
        console.error("No se pudieron cargar las reseñas de Google.");
      } finally {
        setLoading(false);
      }
    }

    fetchGoogleReviews();
  }, []);

  // Sin reseñas REALES no mostramos nada (nunca datos falsos).
  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-sand py-16 sm:py-20 px-4">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-honey-dark">Reseñas reales</span>
            <h2 className="font-serif text-3xl sm:text-[42px] font-semibold leading-tight">Lo que dicen de nosotras</h2>
          </div>
          {globalRating && (
            <span className="inline-flex items-center gap-3 text-base">
              <Stars />
              <span>
                <strong>{globalRating}</strong>
                {totalReviews ? ` · ${totalReviews} reseñas en Google` : " en Google"}
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          {reviews.slice(0, MAX_REVIEWS).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[48px] px-7 rounded-full border-2 border-espresso text-espresso font-bold hover:bg-espresso hover:text-cream transition-colors"
          >
            Ver todas las reseñas en Google
          </a>
          {/* Las reseñas son lo que más pesa en Google Maps: ponerlo fácil a quien ya ha comprado */}
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[48px] px-7 rounded-full bg-espresso text-cream font-bold hover:bg-black transition-colors"
          >
            ¿Ya nos conoces? Déjanos tu reseña
          </a>
        </div>
      </div>
    </section>
  );
}
