"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import FloatingStickers from "./FloatingStickers";
import QuickUploader from "./QuickUploader";
import { ArrowRightIcon, SparklesIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

const materials = [
  { name: "Mate", icon: "🎨", color: "from-purple-400 to-pink-400" },
  { name: "Brillante", icon: "✨", color: "from-blue-400 to-cyan-400" },
  { name: "Holográfico", icon: "🌈", color: "from-pink-400 to-yellow-400" },
  { name: "Transparente", icon: "💎", color: "from-gray-300 to-gray-400" },
];

const stats = [
  { number: "50,000+", label: "Stickers Creados", icon: "🎨" },
  { number: "48hrs", label: "Producción", icon: "⚡" },
  { number: "100%", label: "Satisfacción", icon: "⭐" },
];

export default function HeroStickers() {
  const [selectedMaterial, setSelectedMaterial] = useState(0);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <FloatingStickers />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6"
              >
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Envío GRATIS en pedidos +100 unidades
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Convierte tus ideas
                </span>
                <span className="block mt-2">
                  en stickers únicos
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8"
              >
                Diseña, personaliza y recibe tus stickers en días. 
                Calidad premium, precios justos, satisfacción garantizada.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-shadow">
                  <span className="flex items-center justify-center gap-2">
                    Crear Mi Sticker
                    <ArrowRightIcon className="w-5 h-5" />
                  </span>
                </button>

                <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  Ver Catálogo
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-8 mt-12"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Upload Box */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200 to-purple-200 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10">
                  <QuickUploader />
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Elige tu material:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {materials.map((material, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedMaterial(index)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedMaterial === index
                              ? "border-purple-500 bg-gradient-to-r " + material.color + " text-white"
                              : "border-gray-200 hover:border-purple-300 bg-white"
                          }`}
                        >
                          <div className="text-2xl mb-1">{material.icon}</div>
                          <div className="text-sm font-medium">
                            {material.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Precio desde:</p>
                        <p className="text-2xl font-bold text-purple-600">$0.15</p>
                        <p className="text-xs text-gray-500">por sticker</p>
                      </div>
                      <RocketLaunchIcon className="w-10 h-10 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-yellow-400 text-black p-3 rounded-full shadow-lg font-bold text-sm"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                NUEVO
              </motion.div>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-20 text-center"
          >
            <p className="text-sm text-gray-600 mb-4">Confían en nosotros:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Nike", "Spotify", "Uber", "Airbnb", "Netflix"].map((brand, i) => (
                <div key={i} className="text-2xl font-bold text-gray-400">
                  {brand}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}