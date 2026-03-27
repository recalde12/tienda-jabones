"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  // --- LÓGICA DE ENVÍO ---
  const COSTO_ENVIO = 4.50;
  const UMBRAL_ENVIO_GRATIS = 40;
  const precioEnvio = totalPrice > UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;

  // --- ESTADO CÓDIGO DE DESCUENTO ---
  const [codeInput, setCodeInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discountAmount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');

  const handleValidateCode = async () => {
    if (!codeInput.trim()) return;
    setIsValidating(true);
    setDiscountError('');
    setDiscountSuccess('');
    setDiscountInfo(null);

    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput.trim(), cartTotal: totalPrice }),
      });
      const data = await res.json();

      if (data.valid) {
        setDiscountInfo(data.discount);
        setDiscountSuccess(data.message);
      } else {
        setDiscountError(data.message);
      }
    } catch {
      setDiscountError('Error al validar el código. Inténtalo de nuevo.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountInfo(null);
    setCodeInput('');
    setDiscountSuccess('');
    setDiscountError('');
  };

  const discountAmount = discountInfo?.discountAmount ?? 0;
  const precioFinal = Math.max(totalPrice - discountAmount + precioEnvio, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-stone-800 mb-12">
          Tu Carrito de Compras
        </h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-stone-600">Tu carrito está vacío.</p>
            <Link
              href="/productos"
              className="mt-6 inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Lista de productos ── */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${item.selectedFinish}`}
                  className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                    <Image src={item.image_url} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  </div>

                  <div className="flex-grow w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <div className="flex flex-col text-sm text-stone-500 mt-1">
                      {item.selectedColor && (
                        <span>Color: <span className="font-semibold text-stone-700">{item.selectedColor}</span></span>
                      )}
                      {item.selectedFinish && (
                        <span>Acabado: <span className="font-semibold text-stone-700">{item.selectedFinish}</span></span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{fmt(item.price)}</p>
                  </div>

                  <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedFinish, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 h-8 w-8 rounded-full font-bold hover:bg-gray-300 flex items-center justify-center"
                    >-</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedFinish, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 h-8 w-8 rounded-full font-bold hover:bg-gray-300 flex items-center justify-center"
                    >+</button>
                  </div>

                  <div className="md:ml-6">
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedFinish)}
                      className="text-red-500 hover:text-red-700 font-semibold border border-red-200 md:border-none px-4 py-1 rounded md:p-0"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Resumen ── */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28 space-y-4">
                <h2 className="text-2xl font-semibold">Resumen del Pedido</h2>

                {/* Subtotal */}
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{fmt(totalPrice)}</span>
                </div>

                {/* Descuento aplicado */}
                {discountInfo && (
                  <div className="flex justify-between text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    <span className="flex items-center gap-1 text-sm font-medium">
                      🏷️ {discountInfo.code}
                      <button
                        onClick={handleRemoveDiscount}
                        className="ml-1 text-green-500 hover:text-red-500 text-xs font-bold"
                        title="Quitar descuento"
                      >✕</button>
                    </span>
                    <span className="font-semibold">−{fmt(discountAmount)}</span>
                  </div>
                )}

                {/* Envío */}
                <div className="flex justify-between text-stone-600">
                  <span>Envío</span>
                  <span className={`font-semibold ${precioEnvio === 0 ? 'text-green-600' : ''}`}>
                    {precioEnvio === 0 ? 'Gratis' : fmt(precioEnvio)}
                  </span>
                </div>
                {precioEnvio > 0 && (
                  <p className="text-xs text-stone-400 text-right -mt-2">
                    Te faltan {fmt(UMBRAL_ENVIO_GRATIS - totalPrice)} para envío gratis.
                  </p>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">{fmt(precioFinal)}</span>
                </div>

                {/* ── Campo código de descuento ── */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-stone-600 mb-2">¿Tienes un código de descuento?</p>
                  {!discountInfo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleValidateCode()}
                        placeholder="CÓDIGO"
                        className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm uppercase font-mono focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <button
                        onClick={handleValidateCode}
                        disabled={isValidating || !codeInput.trim()}
                        className="bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isValidating ? '...' : 'Aplicar'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
                      <span>✅</span>
                      <span className="font-semibold">{discountSuccess}</span>
                    </div>
                  )}

                  {discountError && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span>⚠️</span>{discountError}
                    </p>
                  )}
                </div>

                <Link
                  href={`/checkout${discountInfo ? `?code=${discountInfo.code}` : ''}`}
                  className="mt-2 w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors text-center inline-block"
                >
                  Proceder al Pago
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}