"use client";

import { motion } from "framer-motion";

const cutTypes = [
  {
    id: "square",
    name: "Cuadrado",
    description: "Corte recto en forma cuadrada o rectangular",
    icon: "⬜",
    priceMultiplier: 1,
    preview: "M10,10 L90,10 L90,90 L10,90 Z",
  },
  {
    id: "round",
    name: "Redondo",
    description: "Corte circular perfecto para logos",
    icon: "⭕",
    priceMultiplier: 1.1,
    preview: "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10",
  },
  {
    id: "oval",
    name: "Ovalado",
    description: "Forma ovalada elegante",
    icon: "🥚",
    priceMultiplier: 1.15,
    preview: "M50,10 C75,10 90,30 90,50 C90,70 75,90 50,90 C25,90 10,70 10,50 C10,30 25,10 50,10",
  },
  {
    id: "diecut",
    name: "Troquelado",
    description: "Corte siguiendo el contorno del diseño",
    icon: "✂️",
    priceMultiplier: 1.3,
    preview: "M30,20 L70,15 L85,40 L75,70 L50,85 L25,70 L15,40 Z",
    popular: true,
  },
  {
    id: "custom",
    name: "Personalizado",
    description: "Forma personalizada según tu diseño",
    icon: "🎨",
    priceMultiplier: 1.5,
    preview: "M50,10 L65,35 L90,40 L70,60 L75,85 L50,70 L25,85 L30,60 L10,40 L35,35 Z",
  },
];

export default function CutTypeSelector({ selectedCutType, onCutTypeChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Tipo de Corte
        </h2>
        <span className="text-sm text-gray-500">Paso 4 de 5</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cutTypes.map((cutType) => (
          <motion.button
            key={cutType.id}
            onClick={() => onCutTypeChange(cutType)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedCutType?.id === cutType.id
                ? "border-estampanda-primary bg-estampanda-light/10"
                : "border-gray-200 hover:border-estampanda-primary/50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cutType.popular && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                Popular
              </span>
            )}

            <div className="flex justify-center mb-3">
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                className="transform-gpu"
              >
                <defs>
                  <pattern
                    id={`pattern-${cutType.id}`}
                    patternUnits="userSpaceOnUse"
                    width="100"
                    height="100"
                  >
                    <rect width="100" height="100" fill="url(#gradient)" opacity="0.3" />
                    <text
                      x="50"
                      y="55"
                      fontSize="40"
                      textAnchor="middle"
                      fill="#275D5C"
                    >
                      {cutType.icon}
                    </text>
                  </pattern>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#275D5C" />
                    <stop offset="100%" stopColor="#4FA09F" />
                  </linearGradient>
                </defs>
                
                <path
                  d={cutType.preview}
                  fill={`url(#pattern-${cutType.id})`}
                  stroke="#275D5C"
                  strokeWidth="2"
                  strokeDasharray={cutType.id === "diecut" ? "5,5" : "none"}
                />
              </svg>
            </div>

            <h3 className="font-bold text-gray-800 text-sm mb-1">
              {cutType.name}
            </h3>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {cutType.description}
            </p>

            <div className="text-sm font-semibold text-estampanda-primary">
              {cutType.priceMultiplier === 1 ? (
                "Incluido"
              ) : (
                `+${Math.round((cutType.priceMultiplier - 1) * 100)}%`
              )}
            </div>

            {selectedCutType?.id === cutType.id && (
              <motion.div
                className="absolute inset-0 border-2 border-estampanda-primary rounded-xl pointer-events-none"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {selectedCutType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-estampanda-light/20 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <svg width="50" height="50" viewBox="0 0 100 100">
              <path
                d={selectedCutType.preview}
                fill="none"
                stroke="#275D5C"
                strokeWidth="3"
                strokeDasharray={selectedCutType.id === "diecut" ? "5,5" : "none"}
              />
            </svg>
            <div>
              <p className="font-semibold text-gray-800">
                Corte {selectedCutType.name}
              </p>
              <p className="text-sm text-gray-600">
                {selectedCutType.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Consejo:</span> El corte troquelado
          sigue perfectamente el contorno de tu diseño, ideal para stickers con
          formas únicas.
        </p>
      </div>
    </div>
  );
}