"use client";

// NOTE: este componente es la calculadora marketing del homepage. Para el cálculo real del configurador ver libs/pricing.js + components/stickers/PricingCalculator.js (este último está siendo retirado).

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PriceCalculator() {
  const [quantity, setQuantity] = useState(100);
  const [selectedSize, setSelectedSize] = useState("7x7cm");
  const [selectedMaterial, setSelectedMaterial] = useState("vinyl");
  
  // Cálculo de precio por unidad basado en cantidad
  const pricePerUnit = quantity >= 1000 ? 0.12 : quantity >= 500 ? 0.15 : quantity >= 100 ? 0.18 : 0.25;
  const total = (quantity * pricePerUnit).toFixed(2);

  return (
    <section id="calculadora-precios" className="py-20" style={{ backgroundColor: '#FBF7F2' }}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#275D5C' }}>
            Calcula tu precio al instante
          </h2>
          <p className="text-xl text-gray-600">
            Personaliza tu pedido y obtén un precio inmediato
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
        >
          <div className="space-y-8">
            {/* Tamaño */}
            <div>
              <label className="text-lg font-semibold text-gray-800 mb-4 block">
                📏 Tamaño del sticker
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["5x5cm", "7x7cm", "10x10cm"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all transform hover:scale-105 ${
                      selectedSize === size
                        ? "text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={selectedSize === size ? { backgroundColor: '#275D5C' } : {}}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="text-lg font-semibold text-gray-800 mb-4 block">
                🎨 Material
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "paper", name: "Papel", emoji: "📄", desc: "Económico" },
                  { id: "vinyl", name: "Vinilo", emoji: "✨", desc: "Resistente" },
                  { id: "holo", name: "Holográfico", emoji: "🌈", desc: "Premium" },
                  { id: "clear", name: "Transparente", emoji: "💎", desc: "Elegante" }
                ].map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 rounded-xl text-sm sm:text-base md:text-lg transition-all transform hover:scale-105 ${
                      selectedMaterial === material.id
                        ? "text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={selectedMaterial === material.id ? { backgroundColor: '#275D5C' } : {}}
                  >
                    <div className="text-2xl mb-1">{material.emoji}</div>
                    <div className="text-sm font-medium">{material.name}</div>
                    <div className="text-xs opacity-75">{material.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-lg font-semibold text-gray-800 mb-4 block">
                🔢 Cantidad
              </label>
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Unidades:</span>
                  <span className="text-3xl font-bold" style={{ color: '#275D5C' }}>
                    {quantity.toLocaleString()}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #275D5C 0%, #3a7b7a ${(quantity / 10000) * 100}%, #e5e7eb ${(quantity / 10000) * 100}%, #e5e7eb 100%)`
                  }}
                />
                
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>50</span>
                  <span>500</span>
                  <span>1,000</span>
                  <span>5,000</span>
                  <span>10,000</span>
                </div>

                {/* Descuentos por cantidad */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {quantity >= 1000 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-medium">
                      🎉 Descuento por volumen aplicado
                    </span>
                  )}
                  {quantity >= 100 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium">
                      🚚 Envío gratis incluido
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Precio Total */}
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#F5E6D3' }}>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Precio por unidad:</span>
                  <span className="font-bold text-gray-800">${pricePerUnit.toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-gray-300"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold text-gray-800">Total:</span>
                  <motion.span 
                    key={total}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold"
                    style={{ color: '#275D5C' }}
                  >
                    ${total}
                  </motion.span>
                </div>

                {/* Información adicional */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>Sin pedido mínimo</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>Prueba digital gratis</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>Garantía de calidad</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/stickers/designer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-8 px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#275D5C' }}
                >
                  Ordenar Ahora - Entrega en 48hrs
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-600"
        >
          <p className="flex items-center justify-center gap-2 mb-6">
            <span>💡</span>
            <span>¿Necesitas ayuda? Contáctanos para cotizaciones especiales en pedidos grandes</span>
          </p>
          
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#275D5C' }}
            >
              Contactar Ahora
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}