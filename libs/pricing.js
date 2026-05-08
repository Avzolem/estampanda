/**
 * Lógica única de cálculo de precios.
 * Usada en frontend (preview en vivo) y backend (POST /api/cart/items).
 *
 * Valores extraídos del configurador actual (components/stickers/PricingCalculator.js).
 */

// MXN por cm²
export const BASE_PRICE_PER_CM2 = 0.05;

/**
 * Tabla de descuentos por volumen (de PricingCalculator.js original).
 */
export const VOLUME_DISCOUNTS = [
  { min: 50, max: 99, discount: 0 },
  { min: 100, max: 249, discount: 0.10 },
  { min: 250, max: 499, discount: 0.20 },
  { min: 500, max: 999, discount: 0.30 },
  { min: 1000, max: null, discount: 0.40 },
];

/**
 * Devuelve la fracción de descuento por volumen [0..1).
 */
export function getVolumeDiscount(qty) {
  const tier = VOLUME_DISCOUNTS.find(
    (d) => qty >= d.min && (d.max === null || qty <= d.max)
  );
  return tier?.discount ?? 0;
}

/**
 * Calcula el precio unitario (1 sticker) según config.
 * @param {Object} args
 * @param {{width:number, height:number}} args.size - en cm
 * @param {{priceMultiplier:number}} args.material
 * @param {{priceMultiplier:number}} args.cutType
 * @param {number} args.quantity
 * @returns {number} precio unitario en MXN
 */
export function calculateUnitPrice({ size, material, cutType, quantity }) {
  const area = size.width * size.height;
  const base = area * BASE_PRICE_PER_CM2;
  const withMaterial = base * (material?.priceMultiplier ?? 1);
  const withCut = withMaterial * (cutType?.priceMultiplier ?? 1);
  const discount = getVolumeDiscount(quantity);
  return Math.round(withCut * (1 - discount) * 100) / 100;
}

export function calculateTotalPrice(args) {
  return Math.round(calculateUnitPrice(args) * args.quantity * 100) / 100;
}
