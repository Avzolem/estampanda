"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  SwatchIcon,
  ShieldCheckIcon,
  SunIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

const materials = [
  {
    id: "matte",
    name: "Mate",
    description: "Acabado suave y elegante sin reflejos. Perfecto para diseños minimalistas y profesionales.",
    image: "https://via.placeholder.com/600x400/E5E7EB/6B7280?text=MATE",
    priceMultiplier: 1.0,
    popularFor: ["Logos empresariales", "Etiquetas de producto", "Diseños minimalistas"],
    features: {
      waterproof: true,
      uvResistant: true,
      dishwasherSafe: true,
      scratchResistant: true,
      outdoorDurable: true,
      ecofriendly: false,
      glowInDark: false,
      holographic: false,
    },
    specs: {
      thickness: "0.08mm",
      adhesive: "Permanente fuerte",
      durability: "3-5 años",
      finish: "Sin brillo",
      texture: "Suave",
    },
    pros: [
      "Sin reflejos molestos",
      "Colores suaves y elegantes",
      "Ideal para fotografía",
      "Tacto premium",
    ],
    cons: [
      "Colores menos vibrantes",
      "Puede mostrar huellas",
    ],
    bestFor: "business",
    rating: 4.7,
    reviews: 234,
  },
  {
    id: "glossy",
    name: "Brillante",
    description: "Alto brillo con colores ultra vibrantes. El favorito para diseños llamativos.",
    image: "https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=BRILLANTE",
    priceMultiplier: 1.1,
    popularFor: ["Arte colorido", "Personajes kawaii", "Stickers promocionales"],
    features: {
      waterproof: true,
      uvResistant: true,
      dishwasherSafe: true,
      scratchResistant: true,
      outdoorDurable: true,
      ecofriendly: false,
      glowInDark: false,
      holographic: false,
    },
    specs: {
      thickness: "0.08mm",
      adhesive: "Permanente fuerte",
      durability: "3-5 años",
      finish: "Alto brillo",
      texture: "Lisa",
    },
    pros: [
      "Colores súper vibrantes",
      "Brillo espectacular",
      "Muy resistente al agua",
      "Fácil de limpiar",
    ],
    cons: [
      "Puede tener reflejos",
      "Muestra huellas fácilmente",
    ],
    bestFor: "art",
    rating: 4.9,
    reviews: 567,
  },
  {
    id: "transparent",
    name: "Transparente",
    description: "Perfecto para ventanas y superficies de vidrio. Solo se ve tu diseño.",
    image: "https://via.placeholder.com/600x400/F3F4F6/9CA3AF?text=TRANSPARENTE",
    priceMultiplier: 1.3,
    popularFor: ["Logos para vidrio", "Decoración de ventanas", "Botellas y envases"],
    features: {
      waterproof: true,
      uvResistant: true,
      dishwasherSafe: false,
      scratchResistant: false,
      outdoorDurable: false,
      ecofriendly: false,
      glowInDark: false,
      holographic: false,
    },
    specs: {
      thickness: "0.06mm",
      adhesive: "Removible",
      durability: "2-3 años",
      finish: "Cristalino",
      texture: "Lisa",
    },
    pros: [
      "Efecto sin fondo",
      "Ideal para vidrio",
      "Diseño flotante",
      "Muy elegante",
    ],
    cons: [
      "Solo para superficies lisas",
      "Menos duradero",
    ],
    bestFor: "glass",
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "holographic",
    name: "Holográfico",
    description: "Efecto arcoíris espectacular que cambia con la luz. El más llamativo.",
    image: "https://via.placeholder.com/600x400/A78BFA/FFFFFF?text=HOLOGRAFICO",
    priceMultiplier: 1.5,
    popularFor: ["Ediciones especiales", "Stickers coleccionables", "Productos premium"],
    features: {
      waterproof: true,
      uvResistant: true,
      dishwasherSafe: true,
      scratchResistant: true,
      outdoorDurable: true,
      ecofriendly: false,
      glowInDark: false,
      holographic: true,
    },
    specs: {
      thickness: "0.10mm",
      adhesive: "Permanente fuerte",
      durability: "5+ años",
      finish: "Holográfico",
      texture: "Prismática",
    },
    pros: [
      "Efecto visual único",
      "Cambio de colores",
      "Premium y exclusivo",
      "Muy duradero",
    ],
    cons: [
      "Precio más alto",
      "Puede distraer del diseño",
    ],
    bestFor: "premium",
    rating: 5.0,
    reviews: 892,
  },
  {
    id: "glow",
    name: "Glow in Dark",
    description: "Brilla en la oscuridad para un efecto mágico. Perfecto para eventos.",
    image: "https://via.placeholder.com/600x400/84CC16/FFFFFF?text=GLOW",
    priceMultiplier: 1.8,
    popularFor: ["Eventos nocturnos", "Decoración infantil", "Señalización de seguridad"],
    features: {
      waterproof: true,
      uvResistant: false,
      dishwasherSafe: false,
      scratchResistant: true,
      outdoorDurable: false,
      ecofriendly: false,
      glowInDark: true,
      holographic: false,
    },
    specs: {
      thickness: "0.12mm",
      adhesive: "Permanente",
      durability: "2-3 años",
      finish: "Fosforescente",
      texture: "Lisa",
    },
    pros: [
      "Brilla sin electricidad",
      "Efecto sorprendente",
      "Se recarga con luz",
      "Diversión garantizada",
    ],
    cons: [
      "Colores limitados",
      "Necesita carga de luz",
    ],
    bestFor: "events",
    rating: 4.8,
    reviews: 445,
  },
  {
    id: "metallic",
    name: "Metálico",
    description: "Acabado metalizado premium de lujo. Para los diseños más exclusivos.",
    image: "https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=METALICO",
    priceMultiplier: 2.0,
    popularFor: ["Ediciones limitadas", "Productos de lujo", "Certificados y premios"],
    features: {
      waterproof: true,
      uvResistant: true,
      dishwasherSafe: true,
      scratchResistant: true,
      outdoorDurable: true,
      ecofriendly: false,
      glowInDark: false,
      holographic: false,
    },
    specs: {
      thickness: "0.15mm",
      adhesive: "Premium permanente",
      durability: "7+ años",
      finish: "Metalizado",
      texture: "Texturizada",
    },
    pros: [
      "Acabado ultra premium",
      "Extremadamente duradero",
      "Efecto metálico real",
      "Resistencia superior",
    ],
    cons: [
      "Precio más elevado",
      "Peso adicional",
    ],
    bestFor: "luxury",
    rating: 4.9,
    reviews: 334,
  },
];

const features = [
  { key: "waterproof", name: "Resistente al agua", icon: "💧" },
  { key: "uvResistant", name: "Resistente UV", icon: "☀️" },
  { key: "dishwasherSafe", name: "Apto lavavajillas", icon: "🍽️" },
  { key: "scratchResistant", name: "Anti-rayaduras", icon: "🛡️" },
  { key: "outdoorDurable", name: "Uso exterior", icon: "🏔️" },
  { key: "ecofriendly", name: "Eco-friendly", icon: "🌱" },
  { key: "glowInDark", name: "Brilla en oscuridad", icon: "🌟" },
  { key: "holographic", name: "Holográfico", icon: "🌈" },
];

export default function MaterialsPage() {
  const [selectedMaterials, setSelectedMaterials] = useState(["matte", "glossy"]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleMaterial = (materialId) => {
    if (selectedMaterials.includes(materialId)) {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    } else if (selectedMaterials.length < 3) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };

  const selectedMaterialsData = materials.filter(m => selectedMaterials.includes(m.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#275D5C]">
                Tipos de Materiales
              </h1>
              <p className="text-gray-600 mt-1">
                Compara y elige el material perfecto para tus stickers
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  showComparison
                    ? "bg-[#275D5C] text-white"
                    : "bg-white text-[#275D5C] border-2 border-[#275D5C] hover:bg-[#F5E6D3]"
                }`}
              >
                {showComparison ? "Ver galería" : "Comparar materiales"}
              </button>
              <Link
                href="/stickers/designer"
                className="flex items-center gap-2 px-6 py-3 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
              >
                Crear Sticker
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!showComparison ? (
          /* Gallery View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 relative">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      material.priceMultiplier === 1 
                        ? "bg-green-100 text-green-700"
                        : material.priceMultiplier < 1.5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {material.priceMultiplier === 1 
                        ? "Precio base"
                        : `+${Math.round((material.priceMultiplier - 1) * 100)}%`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#275D5C] mb-2">
                    {material.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {material.description}
                  </p>

                  {/* Features Icons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {features.filter(f => material.features[f.key]).slice(0, 4).map(feature => (
                      <span
                        key={feature.key}
                        className="text-2xl"
                        title={feature.name}
                      >
                        {feature.icon}
                      </span>
                    ))}
                  </div>

                  {/* Popular For */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Popular para:</p>
                    <div className="flex flex-wrap gap-2">
                      {material.popularFor.slice(0, 2).map((use, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#F5E6D3] text-[#275D5C] px-2 py-1 rounded"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            {i < Math.floor(material.rating) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {material.rating} ({material.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleMaterial(material.id)}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                        selectedMaterials.includes(material.id)
                          ? "bg-[#275D5C] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selectedMaterials.includes(material.id) ? "Seleccionado" : "Comparar"}
                    </button>
                    <Link
                      href="/stickers/designer"
                      className="flex-1 py-2 bg-[#4FA09F] text-white rounded-lg font-semibold text-center hover:bg-[#3B7F7E] transition-colors"
                    >
                      Elegir
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Comparison View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#275D5C] text-white">
                    <th className="p-4 text-left">Característica</th>
                    {selectedMaterialsData.map(material => (
                      <th key={material.id} className="p-4 text-center min-w-[200px]">
                        <div>
                          <div className="text-xl font-bold mb-1">{material.name}</div>
                          <div className="text-sm opacity-80">
                            {material.priceMultiplier === 1 
                              ? "Precio base"
                              : `+${Math.round((material.priceMultiplier - 1) * 100)}%`}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Features */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-semibold" colSpan={selectedMaterialsData.length + 1}>
                      Características
                    </td>
                  </tr>
                  {features.map((feature, idx) => (
                    <tr key={feature.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{feature.icon}</span>
                          {feature.name}
                        </span>
                      </td>
                      {selectedMaterialsData.map(material => (
                        <td key={material.id} className="p-4 text-center">
                          {material.features[feature.key] ? (
                            <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Specs */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-semibold" colSpan={selectedMaterialsData.length + 1}>
                      Especificaciones técnicas
                    </td>
                  </tr>
                  {Object.keys(materials[0].specs).map((spec, idx) => (
                    <tr key={spec} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 capitalize">{spec.replace(/([A-Z])/g, ' $1').trim()}</td>
                      {selectedMaterialsData.map(material => (
                        <td key={material.id} className="p-4 text-center">
                          {material.specs[spec]}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Action Row */}
                  <tr className="bg-[#F5E6D3]">
                    <td className="p-4">Acción</td>
                    {selectedMaterialsData.map(material => (
                      <td key={material.id} className="p-4 text-center">
                        <Link
                          href="/stickers/designer"
                          className="inline-block px-6 py-2 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
                        >
                          Elegir {material.name}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <SwatchIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Para interiores</h3>
            <p className="text-sm text-gray-600">
              Los materiales mate y brillante son perfectos para uso en interiores con excelente durabilidad.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <SunIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Para exteriores</h3>
            <p className="text-sm text-gray-600">
              Holográfico y metálico resisten mejor las condiciones extremas y los rayos UV.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Para eventos</h3>
            <p className="text-sm text-gray-600">
              Glow in dark y holográfico son ideales para eventos especiales y ediciones limitadas.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}