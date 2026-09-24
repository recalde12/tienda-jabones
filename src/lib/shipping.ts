// src/lib/shipping.ts
// Condiciones de envío. Se usan en el checkout y en las páginas de producto,
// así que cualquier cambio aquí se refleja en toda la web.

/** Coste del envío a domicilio en euros. */
export const SHIPPING_COST = 4.5;

/** Los pedidos que SUPERAN este importe (en euros) tienen el envío gratis. */
export const FREE_SHIPPING_OVER = 40;
