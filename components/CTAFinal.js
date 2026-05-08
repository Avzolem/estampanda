"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTAFinal() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-[#275D5C] to-[#3B7F7E] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          Tu primera idea ya tiene sticker.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Sube un diseño, configura, y en 3 minutos tienes la cotización
          exacta. Sin compromiso, sin registro.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/stickers/designer"
            className="inline-flex items-center justify-center px-8 py-3 sm:px-12 sm:py-4 md:px-16 md:py-5 text-base sm:text-lg font-semibold text-[#275D5C] bg-white hover:bg-[#F5E6D3] rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Empezar a diseñar
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 sm:px-12 sm:py-4 md:px-16 md:py-5 text-base sm:text-lg font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg border border-white/30 transition-all"
          >
            Tengo una pregunta
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-sm sm:text-base text-white/70"
        >
          Sin pedido mínimo · Producción en 48-72h · Envío gratis desde 100 unidades
        </motion.p>
      </div>
    </section>
  );
}
