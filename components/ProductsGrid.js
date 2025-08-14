"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const products = [
  {
    name: "Stickers troquelados",
    description: "Corte personalizado a la forma exacta de tu diseño",
    price: "Desde $0.15",
    emoji: "✂️",
    popular: true,
  },
  {
    name: "Stickers holográficos",
    description: "Efecto arcoíris brillante que cambia con la luz",
    price: "Desde $0.20",
    emoji: "🌈",
  },
  {
    name: "Stickers transparentes",
    description: "Sin fondo blanco, solo tu diseño",
    price: "Desde $0.25",
    emoji: "💎",
  },
  {
    name: "Stickers mate",
    description: "Acabado suave sin brillo",
    price: "Desde $0.12",
    emoji: "🎨",
  },
  {
    name: "Stickers brillantes",
    description: "Laminado brillante de alta calidad",
    price: "Desde $0.18",
    emoji: "✨",
  },
  {
    name: "Stickers de vinilo",
    description: "Resistentes al agua y duraderos",
    price: "Desde $0.22",
    emoji: "💪",
  },
];

export default function ProductsGrid() {
  return (
    <section className="py-20" style={{ backgroundColor: '#FBF7F2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#275D5C' }}>
            Todos nuestros productos
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Elige el tipo de sticker perfecto para tu proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/productos/${product.name.toLowerCase().replace(/ /g, '-')}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all cursor-pointer h-full hover:scale-105">
                  {product.popular && (
                    <div className="text-white text-center py-1 text-sm font-medium" style={{ backgroundColor: '#275D5C' }}>
                      Más popular
                    </div>
                  )}
                  
                  {/* Product Image/Emoji Area */}
                  <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#F5E6D3' }}>
                    <div className="text-6xl">{product.emoji}</div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: '#275D5C' }}>
                        {product.price}
                      </span>
                      <span className="font-medium hover:underline" style={{ color: '#275D5C' }}>
                        Ver más →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            ¿No encuentras lo que buscas?
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white rounded-md transition-all hover:shadow-lg"
            style={{ backgroundColor: '#275D5C' }}
          >
            Contacta con nosotros
          </Link>
        </div>
      </div>
    </section>
  );
}