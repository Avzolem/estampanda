"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const materials = [
  {
    id: "vinyl",
    name: "Vinilo Premium",
    description: "El más resistente y duradero",
    emoji: "💪",
    image: "🏆",
    features: [
      { text: "Resistente al agua", highlight: true },
      { text: "Duración 5+ años", highlight: true },
      { text: "Apto para exteriores" },
      { text: "Colores vibrantes" },
      { text: "Laminado UV" }
    ],
    gradient: "from-purple-500 to-indigo-600",
    best: true
  },
  {
    id: "paper",
    name: "Papel Mate",
    description: "Económico y versátil",
    emoji: "📄",
    image: "✨",
    features: [
      { text: "Mejor precio" },
      { text: "Acabado elegante" },
      { text: "Sin reflejos" },
      { text: "Ideal para interiores" },
      { text: "Escritura amigable" }
    ],
    gradient: "from-gray-400 to-gray-600"
  },
  {
    id: "holographic",
    name: "Holográfico",
    description: "Efecto arcoíris único",
    emoji: "🌈",
    image: "💎",
    features: [
      { text: "Efecto iridiscente", highlight: true },
      { text: "Cambia con la luz" },
      { text: "Premium quality" },
      { text: "Resistente al agua" },
      { text: "Máximo impacto visual" }
    ],
    gradient: "from-pink-500 via-purple-500 to-cyan-500"
  },
  {
    id: "transparent",
    name: "Transparente",
    description: "Profesional sin fondo",
    emoji: "👻",
    image: "🔮",
    features: [
      { text: "Sin fondo blanco" },
      { text: "Ideal para ventanas" },
      { text: "Look profesional" },
      { text: "Alta definición" },
      { text: "Vinilo cristal" }
    ],
    gradient: "from-cyan-400 to-blue-500"
  }
];

export default function MaterialsSection() {
  const [selectedMaterial, setSelectedMaterial] = useState("vinyl");
  const selected = materials.find(m => m.id === selectedMaterial);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold mb-4"
          >
            <span>🎯</span>
            Materiales Premium
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-4">
            Calidad que se 
            <span className="gradient-text"> nota y dura</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Todos nuestros materiales están probados para garantizar la mejor calidad y durabilidad
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Material Selector */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {materials.map((material, index) => (
                <motion.button
                  key={material.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMaterial(material.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    selectedMaterial === material.id
                      ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  {material.best && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-lg font-bold">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="text-4xl mb-2">{material.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{material.name}</h3>
                  <p className="text-sm text-gray-600">{material.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selected Material Details */}
          <motion.div
            key={selectedMaterial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className={`bg-gradient-to-br ${selected.gradient} rounded-3xl p-8 text-white shadow-2xl`}>
              {/* Decorative Background */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-lg blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-lg blur-3xl" />
              </div>

              <div className="relative z-10">
                {/* Material Image */}
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-8xl mb-6 inline-block"
                >
                  {selected.image}
                </motion.div>

                <h3 className="text-3xl font-bold mb-2">{selected.name}</h3>
                <p className="text-lg mb-6 opacity-90">{selected.description}</p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {selected.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        feature.highlight ? "bg-yellow-400" : "bg-white/20"
                      }`}>
                        <CheckIcon className={`w-4 h-4 ${
                          feature.highlight ? "text-gray-900" : "text-white"
                        }`} />
                      </div>
                      <span className={`${feature.highlight ? "font-bold text-lg" : ""}`}>
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <button className="w-full bg-white text-gray-900 font-bold py-4 rounded-lg hover:bg-yellow-400 transition-colors">
                  Pedir Muestra Gratis
                </button>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-bold shadow-xl"
            >
              🚚 Envío Gratis
            </motion.div>
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-white rounded-3xl shadow-xl p-8 overflow-hidden"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Comparación Rápida</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4">Característica</th>
                  {materials.map(m => (
                    <th key={m.id} className="text-center py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-sm font-medium">{m.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Resistente al agua", vinyl: true, paper: false, holographic: true, transparent: true },
                  { feature: "Uso exterior", vinyl: true, paper: false, holographic: true, transparent: true },
                  { feature: "Precio económico", vinyl: false, paper: true, holographic: false, transparent: false },
                  { feature: "Efecto especial", vinyl: false, paper: false, holographic: true, transparent: true },
                  { feature: "Duración 5+ años", vinyl: true, paper: false, holographic: true, transparent: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    {Object.entries(row).filter(([key]) => key !== 'feature').map(([key, value]) => (
                      <td key={key} className="text-center py-4 px-4">
                        {value ? (
                          <span className="text-green-500 text-2xl">✓</span>
                        ) : (
                          <span className="text-gray-300 text-2xl">×</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}