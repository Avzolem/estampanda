"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  SparklesIcon, 
  FireIcon,
  HeartIcon,
  StarIcon
} from "@heroicons/react/24/solid";

const products = [
  {
    id: 1,
    name: "Stickers Holográficos",
    description: "Efecto arcoíris brillante que cambia con la luz",
    price: "Desde $0.20",
    image: "🌈",
    gradient: "from-purple-400 via-pink-400 to-cyan-400",
    features: ["Resistente al agua", "Acabado premium", "Colores vibrantes"],
    badge: "Popular",
    badgeColor: "bg-purple-600"
  },
  {
    id: 2,
    name: "Stickers Troquelados",
    description: "Corte personalizado siguiendo el contorno de tu diseño",
    price: "Desde $0.15",
    image: "✂️",
    gradient: "from-pink-400 to-red-400",
    features: ["Cualquier forma", "Sin bordes blancos", "Perfecto para logos"],
    badge: "Mejor Precio",
    badgeColor: "bg-green-600"
  },
  {
    id: 3,
    name: "Stickers Transparentes",
    description: "Diseño sin fondo para un look profesional",
    price: "Desde $0.25",
    image: "💎",
    gradient: "from-cyan-400 to-blue-400",
    features: ["Sin fondo", "Alta definición", "Ideal para ventanas"],
    badge: "Premium",
    badgeColor: "bg-yellow-600"
  },
  {
    id: 4,
    name: "Stickers Mate",
    description: "Acabado suave sin brillo para un look elegante",
    price: "Desde $0.12",
    image: "🎨",
    gradient: "from-gray-400 to-gray-600",
    features: ["Sin reflejos", "Tacto suave", "Colores sólidos"],
    badge: "Clásico",
    badgeColor: "bg-gray-600"
  },
  {
    id: 5,
    name: "Stickers Metálicos",
    description: "Acabado brillante con efecto metalizado",
    price: "Desde $0.30",
    image: "⚡",
    gradient: "from-yellow-400 to-orange-400",
    features: ["Efecto espejo", "Ultra brillante", "Máxima durabilidad"],
    badge: "Exclusivo",
    badgeColor: "bg-orange-600"
  },
  {
    id: 6,
    name: "Stickers Glow in Dark",
    description: "Brillan en la oscuridad para máximo impacto",
    price: "Desde $0.35",
    image: "🌟",
    gradient: "from-green-400 to-emerald-400",
    features: ["Brilla de noche", "Recargable con luz", "Efecto sorpresa"],
    badge: "Nuevo",
    badgeColor: "bg-pink-600"
  }
];

export default function ProductShowcase() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
          >
            <SparklesIcon className="w-4 h-4" />
            Productos Destacados
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-4">
            Elige tu tipo de 
            <span className="gradient-text"> sticker favorito</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde clásicos hasta holográficos, tenemos el sticker perfecto para tu proyecto
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-hover">
                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-4 right-4 ${product.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold z-10`}>
                    {product.badge}
                  </div>
                )}

                {/* Product Image Area */}
                <div className={`h-48 bg-gradient-to-br ${product.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <motion.div
                    animate={hoveredCard === product.id ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-8xl sticker-shadow"
                  >
                    {product.image}
                  </motion.div>
                  
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
                    }} />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-2xl font-bold gradient-text">{product.price}</span>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">¿No encuentras lo que buscas?</p>
          <button className="btn-primary text-lg px-8 py-4">
            Ver Catálogo Completo
          </button>
        </motion.div>
      </div>
    </section>
  );
}