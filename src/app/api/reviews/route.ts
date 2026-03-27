// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Faltan credenciales de Google' }, { status: 500 });
  }

  try {
    // Llamada a la API de Google Places (pedimos nombre, puntuación global y reseñas, en español)
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}&language=es`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return NextResponse.json(data.result);
    } else {
      return NextResponse.json({ error: data.status }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}