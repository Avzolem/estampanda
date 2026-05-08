"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    n: "1",
    icon: "📤",
    title: "Sube tu diseño",
    desc: "Arrastra tu imagen o logo. Aceptamos JPG, PNG, WebP y SVG. ¿No tiene fondo transparente? Lo quitamos al instante en tu navegador, sin costo.",
  },
  {
    n: "2",
    icon: "🎨",
    title: "Configura tu sticker",
    desc: "Elige material (mate, brillante, holográfico, glow…), tamaño exacto en cm, tipo de corte y cantidad. Verás el precio actualizándose en vivo.",
  },
  {
    n: "3",
    icon: "📬",
    title: "Recíbelo en tu puerta",
    desc: "Producción en 48-72 horas. Envío gratis a partir de 100 stickers. Te llega listo para pegar en tus laptops, botellas, productos o donde se te ocurra.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#275D5C" }}
          >
            En 3 pasos tienes tus stickers
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Sin diseñador, sin mínimos imposibles, sin sorpresas. Tan simple que
            puedes ordenar desde el celular.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-[#FBF7F2] rounded-2xl p-6 sm:p-8 md:p-10 hover:shadow-lg transition-shadow"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#275D5C] text-white text-xl font-bold flex items-center justify-center shadow-md">
                {s.n}
              </div>
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {s.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link
            href="/stickers/designer"
            className="inline-flex items-center justify-center px-8 py-3 sm:px-12 sm:py-4 md:px-16 md:py-5 text-base sm:text-lg font-semibold text-white bg-[#275D5C] hover:bg-[#3B7F7E] rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Empezar ahora →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
