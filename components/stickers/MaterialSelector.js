"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const materials = [
  {
    id: "matte",
    name: "Mate",
    description: "Acabado suave sin reflejos, ideal para diseños elegantes",
    icon: "🎨",
    priceMultiplier: 1,
    features: ["Sin reflejos", "Tacto suave", "Colores suaves"],
    popular: false,
    image: "/images/materials/matte.jpg",
  },
  {
    id: "glossy",
    name: "Brillante",
    description: "Alto brillo con colores vibrantes que resaltan",
    icon: "✨",
    priceMultiplier: 1.1,
    features: ["Alto brillo", "Colores vivos", "Resistente al agua"],
    popular: true,
    image: "/images/materials/glossy.jpg",
  },
  {
    id: "transparent",
    name: "Transparente",
    description: "Perfecto para ventanas y superficies de vidrio",
    icon: "💎",
    priceMultiplier: 1.3,
    features: ["Transparente", "Para vidrio", "Adhesivo fuerte"],
    popular: false,
    image: "/images/materials/transparent.jpg",
  },
  {
    id: "holographic",
    name: "Holográfico",
    description: "Efecto arcoíris espectacular que cambia con la luz",
    icon: "🌈",
    priceMultiplier: 1.5,
    features: ["Efecto arcoíris", "Premium", "Llamativo"],
    popular: true,
    image: "/images/materials/holographic.jpg",
  },
  {
    id: "glow",
    name: "Glow in Dark",
    description: "Brilla en la oscuridad para un efecto mágico",
    icon: "🌟",
    priceMultiplier: 1.8,
    features: ["Brilla de noche", "Recargable", "Duradero"],
    popular: false,
    image: "/images/materials/glow.jpg",
  },
  {
    id: "metallic",
    name: "Metálico",
    description: "Acabado metalizado premium de alta calidad",
    icon: "⚡",
    priceMultiplier: 2,
    features: ["Acabado metal", "Ultra premium", "Muy duradero"],
    popular: false,
    image: "/images/materials/metallic.jpg",
  },
];

export default function MaterialSelector({ selectedMaterial, onMaterialChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Elige el Material
        </h2>
        <span className="text-sm text-gray-500">Paso 2 de 5</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {materials.map((material) => (
          <motion.button
            key={material.id}
            onClick={() => onMaterialChange(material)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedMaterial?.id === material.id
                ? "border-[#275D5C] bg-[#F5E6D3]/20"
                : "border-gray-200 hover:border-[#275D5C]/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {material.popular && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Popular
              </span>
            )}

            <div className="text-4xl mb-3">{material.icon}</div>
            
            <h3 className="font-bold text-gray-800 mb-1">{material.name}</h3>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {material.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {material.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="text-sm font-semibold text-[#275D5C]">
              {material.priceMultiplier === 1 ? (
                "Precio base"
              ) : (
                `+${Math.round((material.priceMultiplier - 1) * 100)}%`
              )}
            </div>

            {selectedMaterial?.id === material.id && (
              <motion.div
                className="absolute inset-0 border-2 border-[#275D5C] rounded-xl pointer-events-none"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {selectedMaterial && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#F5E6D3]/30 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedMaterial.icon}</span>
            <div>
              <p className="font-semibold text-gray-800">
                {selectedMaterial.name} seleccionado
              </p>
              <p className="text-sm text-gray-600">
                {selectedMaterial.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}