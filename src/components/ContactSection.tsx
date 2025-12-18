// src/components/ContactSection.tsx

export function ContactSection() {
  // --- ¡Personaliza esta información! ---
  const storeAddress = "Nueva Imagen Peluqueros, Av. del Alcalde Antonio Chapado, 29, S.M de la Vega Madrid";
  const contactEmail = "laflordemalaura@gmail.com";
  
  // Teléfonos
  const phoneStore = "669 78 85 74";      // Teléfono 1
  const phoneStore2 = "619 32 64 49";     // <--- PON AQUÍ EL SEGUNDO TELÉFONO
  const phoneWhatsApp = "669 78 85 74";   // Teléfono para WhatsApp
  const phoneWhatsApp2 = "619 32 64 49";
  // Instagram
  const instagramHandle = "flordemalaura"; // <--- PON AQUÍ TU USUARIO DE INSTAGRAM (sin @)
  const instagramUrl = `https://instagram.com/${instagramHandle}`;

  const mapEmbedCode = `
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1902.4359717900354!2d-3.575681434833237!3d40.20747049350152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42177c087963f5%3A0xaa1ff7a205e0ac6b!2sNueva%20Imagen%20Peluqueros!5e1!3m2!1ses!2ses!4v1761570020529!5m2!1ses!2ses" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  `;

  return (
    <section className="bg-stone-300 py-16 sm:py-24 text-stone-800">
      <div className="container mx-auto px-4">
        {/* Layout de 2 columnas en escritorio, 1 en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* --- Columna 1: Mapa y Dirección --- */}
          <div>
            <h2 className="text-3xl font-bold text-gray-600 mb-6">
             ¡Visita nuestra tienda!
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Nos encantaría verte en persona. Encuéntranos en:
            </p>
            <p className="text-lg text-gray-800 font-semibold mb-6">
              {storeAddress}
            </p>
            
            {/* Contenedor del Mapa */}
            <div 
              className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg border border-gray-200"
              dangerouslySetInnerHTML={{ __html: mapEmbedCode }}
            />
          </div>
          
          {/* --- Columna 2: Info de Contacto --- */}
          <div>
            <h2 className="text-3xl font-bold text-gray-600 mb-6">
             Contáctanos...
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Para cualquier duda sobre tus pedidos, ingredientes o talleres, no dudes en escribirnos o llamarnos.
            </p>
            
            <div className="space-y-8">
              {/* Email */}
              <div>
                <h3 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                  📧 Email
                </h3>
                <p className="text-lg text-gray-600 mt-1 mb-2">
                  Respondemos en menos de 24h:
                </p>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-lg text-green-600 hover:text-green-700 font-medium"
                >
                  {contactEmail}
                </a>
              </div>
              
              {/* Teléfonos */}
              <div>
                <h3 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                  📱 Teléfonos
                </h3>
                <p className="text-lg text-gray-600 mt-1 mb-2">
                  Llámanos (L-V de 10h a 18h):
                </p>
                
                <div className="flex flex-col gap-2">
                  {/* Teléfono 1 */}
                  <a 
                    href={`tel:${phoneStore.replace(/\s/g, '')}`}
                    className="text-lg text-green-600 hover:text-green-700 font-medium w-fit"
                  >
                    {phoneStore}
                  </a>

                  {/* Teléfono 2 (Nuevo) */}
                  <a 
                    href={`tel:${phoneStore2.replace(/\s/g, '')}`}
                    className="text-lg text-green-600 hover:text-green-700 font-medium w-fit"
                  >
                    {phoneStore2}
                  </a>

                  {/* WhatsApp */}
                  <a 
                    href={`https://wa.me/${phoneWhatsApp.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-lg text-green-600 hover:text-green-700 font-medium mt-2 w-fit"
                  >
                    {/* Icono pequeño de WhatsApp opcional si quieres, o solo texto */}
                    <span>WhatsApp: {phoneWhatsApp}</span>
                  </a>
                                    <a 
                    href={`https://wa.me/${phoneWhatsApp2.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-lg text-green-600 hover:text-green-700 font-medium mt-2 w-fit"
                  >
                    {/* Icono pequeño de WhatsApp opcional si quieres, o solo texto */}
                    <span>WhatsApp: {phoneWhatsApp2}</span>
                  </a>
                </div>
              </div>

              {/* Redes Sociales (Nuevo) */}
              <div>
                <h3 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                  ❤️ Redes Sociales
                </h3>
                <p className="text-lg text-gray-600 mt-1 mb-2">
                  Síguenos para novedades y sorteos:
                </p>
                
                <a 
                  href={instagramUrl}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-lg text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  @{instagramHandle}
                </a>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}