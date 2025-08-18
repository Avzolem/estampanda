"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function HeroSimple() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium mb-6"
            >
              ✨ Envío GRATIS en pedidos +100 unidades
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Convierte tus ideas
              </span>
              <br />
              <span className="text-gray-800">en stickers únicos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Diseña, personaliza y recibe tus stickers en días.
              Calidad premium, precios justos, satisfacción garantizada.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  Crear Mi Sticker
                  <ArrowRightIcon className="w-5 h-5" />
                </span>
              </button>
              <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all">
                Ver Catálogo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-2xl font-bold text-gray-800">50,000+</div>
                <div className="text-sm text-gray-600">Stickers Creados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-gray-800">48hrs</div>
                <div className="text-sm text-gray-600">Producción</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-gray-800">100%</div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-20 text-center"
          >
            <p className="text-sm text-gray-600 mb-4">Confían en nosotros:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Nike", "Spotify", "Uber", "Airbnb", "Netflix"].map((brand, i) => (
                <span key={i} className="text-xl font-bold text-gray-400">
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}