// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Permite cargar imágenes de cualquier proyecto Supabase
      },
    ],
  },
};

module.exports = nextConfig;