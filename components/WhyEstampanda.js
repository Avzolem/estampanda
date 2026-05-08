"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    icon: "🔒",
    title: "Tu diseño nunca sale de tu navegador",
    desc: "Cuando quitamos el fondo, lo hacemos con IA que corre en tu computadora. Cero servidores, cero exposición. Privacidad real.",
  },
  {
    icon: "📐",
    title: "Avisamos si tu calidad va a fallar",
    desc: "Calculamos en vivo el DPI según el tamaño que pidas. Si te vas a pixelar, te lo decimos antes de cobrarte — no después.",
  },
  {
    icon: "💸",
    title: "Sin pedido mínimo, descuentos reales",
    desc: "Desde 50 stickers. Descuento del 10% a 100, 20% a 250, 30% a 500 y 40% a partir de 1,000. Sin trampas en letra chica.",
  },
  {
    icon: "🇲🇽",
    title: "Producción 100% en México",
    desc: "Imprimimos aquí, enviamos aquí. Soportes en español, factura disponible y entrega en 48-72 horas a CDMX y zona metropolitana.",
  },
  {
    icon: "🎨",
    title: "6 materiales premium en una orden",
    desc: "Mezcla mate, brillante, holográfico, transparente, glow in dark y metálico en el mismo pedido. Cada sticker con su propia configuración.",
  },
  {
    icon: "✂️",
    title: "Cortes a medida — incluido troquelado",
    desc: "Cuadrado, redondo, ovalado, troquelado al contorno o forma personalizada. El corte se aplica automáticamente al subir tu diseño.",
  },
];

export default function WhyEstampanda() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#FBF7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-[#4FA09F] font-semibold mb-3">
            Por qué Estampanda
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#275D5C" }}
          >
            La calidad que tu marca merece
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            No somos los más baratos. Somos los más honestos: te decimos qué
            esperas antes de pagar, no después de recibir.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{r.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {r.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
