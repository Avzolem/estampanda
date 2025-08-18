"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ArrowRightIcon,
  CheckIcon,
  StarIcon
} from "@heroicons/react/24/solid";

export default function HeroPro() {
  const [email, setEmail] = useState("");

  const features = [
    "Envío gratis en pedidos +$500",
    "Prueba digital gratuita",
    "Producción en 48 horas",
    "Garantía de satisfacción"
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  +10,000 clientes felices
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Stickers personalizados
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  para tu marca
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              >
                Crea stickers de alta calidad con corte personalizado. 
                Sin pedido mínimo, envío gratis y producción express en 48 horas.
              </motion.p>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Email form */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 whitespace-nowrap">
                    Obtener Muestra Gratis
                  </button>
                </div>

                {/* Or divider */}
                <div className="flex items-center gap-4">
                  <div className="h-px bg-gray-300 flex-1" />
                  <span className="text-gray-500 text-sm">o</span>
                  <div className="h-px bg-gray-300 flex-1" />
                </div>

                {/* Secondary CTA */}
                <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2">
                  Diseñar Ahora
                  <ArrowRightIcon className="w-5 h-5" />
                </button>

                {/* Features list */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 pt-4"
                >
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:pl-8"
            >
              <div className="relative">
                {/* Main image container */}
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 overflow-hidden">
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                  </div>

                  {/* Sticker showcase grid */}
                  <div className="relative grid grid-cols-3 gap-4">
                    {[
                      { emoji: "🌈", rotate: -15, scale: 1.1 },
                      { emoji: "⭐", rotate: 10, scale: 0.9 },
                      { emoji: "🎨", rotate: -5, scale: 1 },
                      { emoji: "💜", rotate: 15, scale: 1.2 },
                      { emoji: "✨", rotate: -10, scale: 0.8 },
                      { emoji: "🦄", rotate: 5, scale: 1.1 },
                      { emoji: "🌟", rotate: -8, scale: 0.95 },
                      { emoji: "💎", rotate: 12, scale: 1.05 },
                      { emoji: "🎯", rotate: -3, scale: 1 }
                    ].map((sticker, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: sticker.scale }}
                        transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                        whileHover={{ scale: sticker.scale * 1.2, rotate: 0 }}
                        className="bg-white rounded-2xl p-4 shadow-lg cursor-pointer transform transition-all duration-200 hover:shadow-xl"
                        style={{ transform: `rotate(${sticker.rotate}deg)` }}
                      >
                        <div className="text-5xl text-center">{sticker.emoji}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg"
                >
                  <span className="text-sm">Sin pedido mínimo</span>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
                >
                  <span className="text-sm">Envío en 48hrs</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 border-t border-gray-100 pt-12"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-sm text-gray-500 mb-8">Empresas que confían en nosotros</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale">
              {["🏢", "🏪", "🏬", "🏭", "🏨"].map((icon, i) => (
                <div key={i} className="text-4xl">{icon}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}