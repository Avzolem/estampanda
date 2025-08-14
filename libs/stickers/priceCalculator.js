import config from "@/config";

/**
 * Calcula el precio de un pedido de stickers basado en múltiples factores
 * @param {Object} params - Parámetros del cálculo
 * @param {number} params.width - Ancho en cm
 * @param {number} params.height - Alto en cm
 * @param {number} params.quantity - Cantidad de stickers
 * @param {string} params.material - Tipo de material
 * @param {string} params.cutType - Tipo de corte
 * @param {boolean} params.isRush - Si es pedido urgente
 * @returns {Object} Desglose del precio
 */
export function calculateStickerPrice({
  width,
  height,
  quantity,
  material = "matte",
  cutType = "square",
  isRush = false,
}) {
  const { stickers } = config;
  
  // Calcular área del sticker
  const area = width * height;
  
  // Precio base por área (precio por cm²)
  const basePricePerCm2 = stickers.pricing.basePrice / 25; // Base es para 5x5cm = 25cm²
  let basePrice = area * basePricePerCm2;
  
  // Aplicar multiplicador del material
  const materialConfig = stickers.materials.find(m => m.id === material);
  if (materialConfig) {
    basePrice *= materialConfig.multiplier;
  }
  
  // Aplicar multiplicador del tipo de corte
  const cutConfig = stickers.cutTypes.find(c => c.id === cutType);
  if (cutConfig) {
    basePrice *= cutConfig.multiplier;
  }
  
  // Calcular precio total sin descuento
  let subtotal = basePrice * quantity;
  
  // Aplicar descuento por volumen
  let discountPercentage = 0;
  const applicableDiscount = stickers.pricing.volumeDiscounts
    .sort((a, b) => b.min - a.min)
    .find(discount => quantity >= discount.min);
  
  if (applicableDiscount) {
    discountPercentage = applicableDiscount.discount;
  }
  
  const discountAmount = (subtotal * discountPercentage) / 100;
  const discountedTotal = subtotal - discountAmount;
  
  // Aplicar multiplicador de pedido urgente
  let finalPrice = discountedTotal;
  let rushCharge = 0;
  if (isRush) {
    rushCharge = discountedTotal * (stickers.production.rushMultiplier - 1);
    finalPrice = discountedTotal + rushCharge;
  }
  
  // Redondear a 2 decimales
  const round = (num) => Math.round(num * 100) / 100;
  
  return {
    unitPrice: round(basePrice),
    subtotal: round(subtotal),
    discountPercentage,
    discountAmount: round(discountAmount),
    rushCharge: round(rushCharge),
    total: round(finalPrice),
    estimatedDays: isRush ? stickers.production.rushDays : stickers.production.standardDays,
    breakdown: {
      area,
      basePricePerUnit: round(area * basePricePerCm2),
      materialMultiplier: materialConfig?.multiplier || 1,
      cutTypeMultiplier: cutConfig?.multiplier || 1,
      quantity,
      isRush,
    },
  };
}

/**
 * Calcula el precio de envío basado en cantidad y destino
 * @param {Object} params - Parámetros del cálculo
 * @param {number} params.quantity - Cantidad de stickers
 * @param {string} params.country - País de destino
 * @param {boolean} params.express - Envío express
 * @returns {Object} Información de envío
 */
export function calculateShipping({ quantity, country = "MX", express = false }) {
  // Precio base de envío
  let baseShipping = 5;
  
  // Ajuste por cantidad (más stickers = más peso)
  if (quantity > 100) baseShipping += 2;
  if (quantity > 500) baseShipping += 3;
  if (quantity > 1000) baseShipping += 5;
  
  // Ajuste por país
  const domesticCountries = ["MX", "MEX", "MEXICO"];
  const isDomestic = domesticCountries.includes(country.toUpperCase());
  
  if (!isDomestic) {
    baseShipping *= 3; // Envío internacional
  }
  
  // Envío express
  if (express) {
    baseShipping *= 2;
  }
  
  // Envío gratis en pedidos grandes
  const freeShippingThreshold = 100;
  const isFreeShipping = quantity >= freeShippingThreshold && isDomestic && !express;
  
  return {
    cost: isFreeShipping ? 0 : Math.round(baseShipping * 100) / 100,
    isFreeShipping,
    estimatedDays: express ? 1-2 : (isDomestic ? 3-5 : 7-15),
    method: express ? "Express" : "Standard",
  };
}

/**
 * Valida si un cupón es aplicable al pedido
 * @param {Object} coupon - Objeto del cupón
 * @param {Object} orderDetails - Detalles del pedido
 * @returns {Object} Resultado de la validación
 */
export function validateCoupon(coupon, orderDetails) {
  const { subtotal, quantity, material, cutType } = orderDetails;
  
  if (!coupon || !coupon.isActive) {
    return { valid: false, reason: "Cupón inválido o inactivo" };
  }
  
  const now = new Date();
  if (new Date(coupon.validFrom) > now) {
    return { valid: false, reason: "Cupón aún no válido" };
  }
  
  if (new Date(coupon.validUntil) < now) {
    return { valid: false, reason: "Cupón expirado" };
  }
  
  if (coupon.minimumPurchase && subtotal < coupon.minimumPurchase) {
    return { 
      valid: false, 
      reason: `Compra mínima requerida: $${coupon.minimumPurchase}` 
    };
  }
  
  if (coupon.conditions?.minimumQuantity && quantity < coupon.conditions.minimumQuantity) {
    return { 
      valid: false, 
      reason: `Cantidad mínima requerida: ${coupon.conditions.minimumQuantity} stickers` 
    };
  }
  
  // Validar productos aplicables
  if (coupon.applicableProducts?.materials?.length > 0) {
    if (!coupon.applicableProducts.materials.includes(material)) {
      return { valid: false, reason: "Cupón no válido para este material" };
    }
  }
  
  if (coupon.excludedProducts?.materials?.length > 0) {
    if (coupon.excludedProducts.materials.includes(material)) {
      return { valid: false, reason: "Material excluido del cupón" };
    }
  }
  
  return { valid: true };
}

/**
 * Aplica un cupón al precio total
 * @param {Object} pricing - Objeto con información de precios
 * @param {Object} coupon - Objeto del cupón
 * @returns {Object} Precio actualizado con descuento
 */
export function applyCouponToPrice(pricing, coupon) {
  if (!coupon) return pricing;
  
  let discount = 0;
  
  if (coupon.discountType === "percentage") {
    discount = (pricing.total * coupon.discountValue) / 100;
    if (coupon.maximumDiscount) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
  } else if (coupon.discountType === "fixed") {
    discount = coupon.discountValue;
  }
  
  // No permitir que el descuento sea mayor que el total
  discount = Math.min(discount, pricing.total);
  
  return {
    ...pricing,
    couponCode: coupon.code,
    couponDiscount: Math.round(discount * 100) / 100,
    finalTotal: Math.round((pricing.total - discount) * 100) / 100,
  };
}

/**
 * Genera un resumen del pedido
 * @param {Object} orderData - Datos completos del pedido
 * @returns {Object} Resumen formateado
 */
export function generateOrderSummary(orderData) {
  const {
    design,
    width,
    height,
    quantity,
    material,
    cutType,
    isRush,
    shipping,
    coupon,
  } = orderData;
  
  // Calcular precio base
  const pricing = calculateStickerPrice({
    width,
    height,
    quantity,
    material,
    cutType,
    isRush,
  });
  
  // Calcular envío
  const shippingInfo = calculateShipping({
    quantity,
    country: shipping?.country || "MX",
    express: shipping?.express || false,
  });
  
  // Aplicar cupón si existe
  let finalPricing = pricing;
  if (coupon) {
    const validation = validateCoupon(coupon, {
      subtotal: pricing.total,
      quantity,
      material,
      cutType,
    });
    
    if (validation.valid) {
      finalPricing = applyCouponToPrice(pricing, coupon);
    }
  }
  
  // Calcular total final con envío
  const grandTotal = (finalPricing.finalTotal || finalPricing.total) + shippingInfo.cost;
  
  return {
    items: {
      design: design?.name || "Diseño personalizado",
      size: `${width}x${height} cm`,
      material: config.stickers.materials.find(m => m.id === material)?.name || material,
      cutType: config.stickers.cutTypes.find(c => c.id === cutType)?.name || cutType,
      quantity,
      unitPrice: pricing.unitPrice,
    },
    pricing: {
      subtotal: pricing.subtotal,
      discount: {
        percentage: pricing.discountPercentage,
        amount: pricing.discountAmount,
      },
      rush: {
        applied: isRush,
        charge: pricing.rushCharge,
      },
      coupon: coupon ? {
        code: finalPricing.couponCode,
        discount: finalPricing.couponDiscount,
      } : null,
      shipping: shippingInfo.cost,
      total: Math.round(grandTotal * 100) / 100,
    },
    production: {
      estimatedDays: pricing.estimatedDays,
      isRush,
    },
    shipping: shippingInfo,
  };
}

export default {
  calculateStickerPrice,
  calculateShipping,
  validateCoupon,
  applyCouponToPrice,
  generateOrderSummary,
};