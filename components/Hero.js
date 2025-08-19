"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-20" style={{ backgroundColor: '#FBF7F2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            style={{ color: '#275D5C' }}
          >
            Stickers personalizados
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4"
          >
            Impresión de la más alta calidad. Sin pedido mínimo. Envío gratis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <Link
              href="/stickers/designer"
              className="inline-flex items-center justify-center px-8 py-2.5 sm:px-16 sm:py-3 md:px-24 md:py-3.5 text-base sm:text-base md:text-lg font-semibold text-white rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: '#275D5C' }}
            >
              Empieza a diseñar
            </Link>
            <Link
              href="/muestras"
              className="inline-flex items-center justify-center px-8 py-2.5 sm:px-16 sm:py-3 md:px-24 md:py-3.5 text-base sm:text-base md:text-lg font-semibold rounded-lg transition-all hover:opacity-90"
              style={{ color: '#275D5C', backgroundColor: '#F5E6D3' }}
            >
              Muestras gratis
            </Link>
          </motion.div>
        </div>

        {/* Hero Image/Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 sm:mt-16 relative"
        >
          <div className="rounded-2xl p-2" style={{ background: 'linear-gradient(to bottom right, #F5E6D3, #FBF7F2)' }}>
            <div className="bg-white rounded-xl p-4 sm:p-8 md:p-12">
              {/* Sticker Grid Showcase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {[
                  { name: "Troquelados", emoji: "✂️", color: "bg-purple-100" },
                  { name: "Holográficos", emoji: "🌈", color: "bg-pink-100" },
                  { name: "Transparentes", emoji: "💎", color: "bg-blue-100" },
                  { name: "Mate", emoji: "🎨", color: "bg-green-100" },
                  { name: "Brillantes", emoji: "✨", color: "bg-yellow-100" },
                  { name: "Metálicos", emoji: "⚡", color: "bg-orange-100" },
                  { name: "Vinilo", emoji: "💪", color: "bg-red-100" },
                  { name: "Ecológicos", emoji: "🌱", color: "bg-emerald-100" },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                    className={`${item.color} rounded-xl p-4 sm:p-6 text-center transition-all cursor-pointer hover:scale-105`}
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">{item.emoji}</div>
                    <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800">{item.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center"
        >
          <div>
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900">Envío Gratis</h3>
            <p className="mt-2 text-gray-600">En todos los pedidos</p>
          </div>
          <div>
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900">Producción Rápida</h3>
            <p className="mt-2 text-gray-600">Entrega en 48-72 horas</p>
          </div>
          <div>
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-gray-900">Calidad Garantizada</h3>
            <p className="mt-2 text-gray-600">100% satisfacción</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}