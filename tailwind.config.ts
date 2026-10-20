// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Simplificamos la ruta de 'content'
  ],
  theme: {
    extend: {
      // Paleta de marca "panal" (miel y café sobre crema)
      colors: {
        cream: '#FBF7F0',       // fondo principal
        sand: '#F3E9DC',        // fondo de secciones alternas
        espresso: '#2A201A',    // texto principal y bloques oscuros
        cocoa: '#5A4B40',       // texto secundario (contraste AA sobre crema)
        honey: '#E9B96A',       // acento (rellenos, insignias; texto oscuro encima)
        'honey-dark': '#8A5A12', // acento para TEXTO sobre fondo claro
        line: '#E4D6C5',        // bordes suaves
        edge: '#CDB9A3',        // bordes de controles
        latte: '#DCCDBB',       // texto secundario sobre fondo oscuro
      },
    },
  },
  plugins: [],
};
