// src/app/productos/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProductTabs } from '@/components/ProductTabs'; // <-- Importamos el nuevo componente

// La interfaz de Producto debe incluir la nueva categoría
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string; // <-- Nueva propiedad
}

export default async function ProductosPage() {
  
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // 1. Obtenemos TODOS los productos
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return <p className="container mx-auto p-4">Error al cargar los productos: {error.message}</p>;
  }

  // 2. Filtramos los productos por categoría aquí, en el servidor
  const allProducts = (products as Product[]) || [];
  
  const panales = allProducts.filter(p => p.category === 'panales');
  const alCorte = allProducts.filter(p => p.category === 'al_corte');
  const cestas = allProducts.filter(p => p.category === 'cestas');
  const ProductosEspeciales = allProducts.filter(p => p.category === 'ProductosEspeciales');

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-stone-800 mb-12 font-serif">
          Nuestro Catálogo
        </h1>
        
        {/* 3. Renderizamos el componente de Pestañas y le pasamos los productos filtrados */}
        <ProductTabs 
          panales={panales} 
          alCorte={alCorte} 
          cestas={cestas}
          ProductosEspeciales={ProductosEspeciales}
        />
        
      </div>
    </div>
  );
}