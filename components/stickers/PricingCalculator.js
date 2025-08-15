"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";

const volumeDiscounts = [
  { min: 50, max: 99, discount: 0 },
  { min: 100, max: 249, discount: 10 },
  { min: 250, max: 499, discount: 20 },
  { min: 500, max: 999, discount: 30 },
  { min: 1000, max: null, discount: 40 },
];

export default function PricingCalculator({ 
  material, 
  size, 
  cutType, 
  quantity, 
  onQuantityChange,
  onPriceCalculated 
}) {
  const [rushOrder, setRushOrder] = useState(false);
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    if (material && size && cutType && quantity) {
      calculatePrice();
    }
  }, [material, size, cutType, quantity, rushOrder]);

  const calculatePrice = () => {
    // Precio base por cm²
    const basePrice = 0.05;
    const area = size.width * size.height;
    
    // Calcular precio base
    let unitPrice = area * basePrice;
    
    // Aplicar multiplicadores
    unitPrice *= material.priceMultiplier || 1;
    unitPrice *= cutType.priceMultiplier || 1;
    
    // Aplicar descuento por volumen
    const discount = volumeDiscounts.find(
      d => quantity >= d.min && (d.max === null || quantity <= d.max)
    );
    
    if (discount) {
      unitPrice *= (100 - discount.discount) / 100;
    }
    
    // Rush order
    if (rushOrder) {
      unitPrice *= 1.5;
    }
    
    // Calcular totales
    const subtotal = unitPrice * quantity;
    const shipping = quantity >= 100 ? 0 : 5.99;
    const tax = subtotal * 0.16; // IVA México
    const total = subtotal + shipping + tax;
    
    const calculatedPricing = {
      unitPrice: unitPrice.toFixed(2),
      originalPrice: (area * basePrice * quantity).toFixed(2),
      subtotal: subtotal.toFixed(2),
      discount: discount ? discount.discount : 0,
      discountAmount: discount ? ((area * basePrice * quantity) - subtotal).toFixed(2) : 0,
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
    
    setPricing(calculatedPricing);
    if (onPriceCalculated) {
      onPriceCalculated(calculatedPricing);
    }
  };

  const handleQuantityChange = (value) => {
    const qty = parseInt(value);
    if (qty >= 50 && qty <= 10000) {
      onQuantityChange(qty);
    }
  };

  const quickQuantities = [50, 100, 250, 500, 1000];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Cantidad y Precio
        </h2>
        <span className="text-sm text-gray-500">Paso 5 de 5</span>
      </div>

      {/* Selector de cantidad */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ¿Cuántos stickers necesitas?
        </label>
        
        <div className="flex gap-2 mb-4">
          {quickQuantities.map((qty) => {
            const discount = volumeDiscounts.find(
              d => qty >= d.min && (d.max === null || qty <= d.max)
            );
            
            return (
              <motion.button
                key={qty}
                onClick={() => onQuantityChange(qty)}
                className={`flex-1 py-3 px-2 rounded-lg border-2 transition-all relative ${
                  quantity === qty
                    ? "border-estampanda-primary bg-estampanda-light/10"
                    : "border-gray-200 hover:border-estampanda-primary/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {discount && discount.discount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    -{discount.discount}%
                  </span>
                )}
                <p className="font-bold text-gray-800">{qty}</p>
                <p className="text-xs text-gray-500">unidades</p>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="50"
            max="2000"
            step="10"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #275D5C 0%, #275D5C ${(quantity - 50) / 19.5}%, #e5e7eb ${(quantity - 50) / 19.5}%, #e5e7eb 100%)`
            }}
          />
          <input
            type="number"
            min="50"
            max="10000"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:border-estampanda-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Rush Order */}
      <div className="mb-6 p-4 bg-orange-50 rounded-xl">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-semibold text-gray-800">Pedido Express</p>
              <p className="text-sm text-gray-600">Producción en 24-48 horas</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={rushOrder}
              onChange={(e) => setRushOrder(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-14 h-8 rounded-full transition-colors ${
              rushOrder ? "bg-orange-500" : "bg-gray-300"
            }`}>
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: rushOrder ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ marginTop: "4px" }}
              />
            </div>
          </div>
        </label>
        {rushOrder && (
          <p className="text-xs text-orange-600 mt-2">
            +50% sobre el precio base
          </p>
        )}
      </div>

      {/* Desglose de precios */}
      <AnimatePresence>
        {pricing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Descuento por volumen */}
            {pricing.discount > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckIcon className="w-5 h-5" />
                  <span className="font-semibold">
                    ¡{pricing.discount}% de descuento por volumen aplicado!
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 py-4 border-t border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio unitario:</span>
                <span className="font-semibold">${pricing.unitPrice}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cantidad:</span>
                <span className="font-semibold">x{quantity}</span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento ({pricing.discount}%):</span>
                  <span className="font-semibold">-${pricing.discountAmount}</span>
                </div>
              )}

              {rushOrder && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Express (50%):</span>
                  <span className="font-semibold">Incluido</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${pricing.subtotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío:</span>
                <span className="font-semibold">
                  {pricing.shipping === "0.00" ? (
                    <span className="text-green-600">GRATIS</span>
                  ) : (
                    `$${pricing.shipping}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (16%):</span>
                <span className="font-semibold">${pricing.tax}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-estampanda-primary to-estampanda-secondary bg-clip-text text-transparent"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ${pricing.total}
              </motion.span>
            </div>

            {/* Tabla de descuentos */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                📊 Tabla de descuentos por volumen:
              </p>
              <div className="space-y-1">
                {volumeDiscounts.map((tier, index) => (
                  <div
                    key={index}
                    className={`flex justify-between text-xs py-1 px-2 rounded ${
                      quantity >= tier.min && (tier.max === null || quantity <= tier.max)
                        ? "bg-estampanda-primary/10 font-semibold"
                        : ""
                    }`}
                  >
                    <span>
                      {tier.min}-{tier.max || "+"} unidades
                    </span>
                    <span className={tier.discount > 0 ? "text-green-600" : ""}>
                      {tier.discount > 0 ? `-${tier.discount}%` : "Precio base"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}