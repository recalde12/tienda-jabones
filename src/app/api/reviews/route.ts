import { NextResponse } from 'next/server';

export const revalidate = 3600; 

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Faltan credenciales de Google' }, { status: 500 });
  }

  try {
    // AQUÍ ESTÁ EL CAMBIO: Hemos añadido &reviews_sort=newest al final de la URL
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}&language=es&reviews_sort=newest`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      // Chivato para la terminal de tu ordenador:
      console.log(`✅ Google ha devuelto ${data.result.reviews?.length || 0} reseñas.`);
      return NextResponse.json(data.result);
    } else {
      // error_message explica la causa exacta (API no habilitada, facturación, restricción de clave...)
      console.error("Error de Google:", data.status, "-", data.error_message);
      return NextResponse.json(
        { error: data.status, error_message: data.error_message ?? null },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}