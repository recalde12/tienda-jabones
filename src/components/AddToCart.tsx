// src/components/AddToCart.tsx
// Selectores de color/acabado + botón "Añadir al carrito". Se usa en la tarjeta
// del catálogo y en la página de cada producto.

"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, type Product } from "@/lib/products";

export function AddToCart({
  product,
  className = "",
  withQuantity = false,
}: {
  product: Product;
  className?: string;
  /** Muestra el selector de cantidad (ficha de producto). */
  withQuantity?: boolean;
}) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [errorColor, setErrorColor] = useState(false);
  const [errorFinish, setErrorFinish] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    let hasError = false;

    // Validación de Color
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorColor(true);
      hasError = true;
    }

    // Validación de Acabado
    if (product.finishes && product.finishes.length > 0 && !selectedFinish) {
      setErrorFinish(true);
      hasError = true;
    }

    if (hasError) return; // Si falta algo, no añadimos

    // Todo OK: Resetear errores y añadir
    setErrorColor(false);
    setErrorFinish(false);
    addToCart(product, selectedColor, selectedFinish, withQuantity ? quantity : 1);

    // Confirmación visual breve
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={className}>
      {/* --- SELECTOR DE COLORES --- */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-cocoa mb-2 uppercase">Color:</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => { setSelectedColor(color); setErrorColor(false); }}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  selectedColor === color
                    ? 'bg-espresso text-cream border-espresso'
                    : 'bg-cream text-espresso border-edge hover:border-espresso'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          {errorColor && <p className="text-red-500 text-xs mt-1">Selecciona un color.</p>}
        </div>
      )}

      {/* --- SELECTOR DE ACABADOS (Mate / Transparente) --- */}
      {product.finishes && product.finishes.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-cocoa mb-2 uppercase">Acabado:</p>
          <div className="flex flex-wrap gap-2">
            {product.finishes.map((finish) => (
              <button
                key={finish}
                onClick={() => { setSelectedFinish(finish); setErrorFinish(false); }}
                className={`px-3 py-1 text-sm rounded-lg border transition-all ${
                  selectedFinish === finish
                    ? 'bg-espresso text-cream border-espresso'
                    : 'bg-cream text-espresso border-edge hover:border-espresso'
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
          {errorFinish && <p className="text-red-500 text-xs mt-1">Selecciona un acabado.</p>}
        </div>
      )}

      <div className={withQuantity ? "flex flex-wrap items-center gap-3" : ""}>
        {withQuantity && (
          <div role="group" aria-label="Cantidad" className="flex items-center border-2 border-edge rounded-full">
            <button
              type="button"
              aria-label="Quitar una unidad"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 text-2xl text-espresso disabled:text-edge"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center font-bold text-lg" aria-live="polite">{quantity}</span>
            <button
              type="button"
              aria-label="Añadir una unidad"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="w-12 h-12 text-2xl text-espresso"
            >
              +
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`${withQuantity ? "flex-1 basis-[220px] min-h-[52px] text-[17px]" : "w-full py-2.5"} inline-flex items-center justify-center gap-2 bg-espresso text-cream px-4 rounded-full font-semibold shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-[0.98]`}
        >
          {added ? (
            '✓ Añadido al carrito'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {withQuantity ? `Añadir al carrito · ${formatPrice(Number(product.price) * quantity)}` : 'Añadir al carrito'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
