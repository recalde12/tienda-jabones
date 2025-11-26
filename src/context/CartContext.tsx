// src/context/CartContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Definimos cómo se ve un producto en el carrito
interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

// Definimos qué valores y funciones tendrá nuestro contexto
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  totalPrice: number;
}

// Creamos el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Creamos el "Proveedor" del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // --- FUNCIÓN DE AÑADIR ---
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // --- NUEVA FUNCIÓN DE QUITAR ---
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // --- NUEVA FUNCIÓN DE ACTUALIZAR CANTIDAD ---
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menos, quitar el producto
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- NUEVO CÁLCULO DE PRECIO TOTAL ---
  // Usamos useMemo para que solo se recalcule si el carrito cambia
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