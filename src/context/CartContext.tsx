"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Definimos cómo se ve un producto en el carrito
interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  selectedColor?: string | null;
  selectedFinish?: string | null; // <--- NUEVO CAMPO: Guardamos el acabado (Mate/Transparente)
}

// Definimos qué valores y funciones tendrá nuestro contexto
interface CartContextType {
  cart: CartItem[];
  // Actualizamos las funciones para que acepten el color Y el acabado
  addToCart: (product: any, color?: string | null, finish?: string | null) => void;
  removeFromCart: (productId: number, color?: string | null, finish?: string | null) => void;
  updateQuantity: (
    productId: number, 
    color: string | null | undefined, 
    finish: string | null | undefined, 
    newQuantity: number
  ) => void;
  clearCart: () => void;
  totalPrice: number;
}

// Creamos el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Creamos el "Proveedor" del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // --- FUNCIÓN DE AÑADIR (Actualizada) ---
  const addToCart = (product: any, color: string | null = null, finish: string | null = null) => {
    setCart((prevCart) => {
      // Buscamos si ya existe un item con el MISMO id, MISMO color Y MISMO acabado
      const existingItem = prevCart.find((item) => 
        item.id === product.id && 
        item.selectedColor === color && 
        item.selectedFinish === finish
      );

      if (existingItem) {
        // Si existe la combinación exacta, aumentamos cantidad
        return prevCart.map((item) =>
          (item.id === product.id && item.selectedColor === color && item.selectedFinish === finish)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es una combinación nueva, lo añadimos
        return [...prevCart, { 
          ...product, 
          quantity: 1, 
          selectedColor: color, 
          selectedFinish: finish 
        }];
      }
    });
  };

  // --- FUNCIÓN DE QUITAR (Actualizada) ---
  const removeFromCart = (productId: number, color: string | null = null, finish: string | null = null) => {
    // Filtramos para quitar solo el que coincida en ID, Color y Acabado
    setCart((prevCart) => prevCart.filter((item) => 
      !(item.id === productId && item.selectedColor === color && item.selectedFinish === finish)
    ));
  };

  // --- FUNCIÓN DE ACTUALIZAR CANTIDAD (Actualizada) ---
  const updateQuantity = (
    productId: number, 
    color: string | null = null, 
    finish: string | null = null, 
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color, finish);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          (item.id === productId && item.selectedColor === color && item.selectedFinish === finish)
            ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // --- FUNCIÓN DE VACIAR CARRITO ---
  const clearCart = () => {
    setCart([]);
  };

  // --- CÁLCULO DE PRECIO TOTAL ---
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);


  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}