"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const products = [
  {
    id: 1,
    title: "Stickers troquelados",
    description: "Corte personalizado a la forma exacta de tu diseño",
    price: "Desde $0.15",
    icon: "✂️",
    popular: true,
    features: ["Corte personalizado", "Sin fondo blanco", "Cualquier forma"],
    href: "/stickers/designer?type=die-cut",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "Stickers holográficos",
    description: "Efecto arcoíris brillante que cambia con la luz",
    price: "Desde $0.20",
    icon: "🌈",
    features: ["Efecto arcoíris", "Brillo único", "Premium"],
    href: "/stickers/designer?type=holographic",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Stickers transparentes",
    description: "Sin fondo blanco, solo tu diseño",
    price: "Desde $0.25",
    icon: "💎",
    features: ["Fondo transparente", "Ideal para ventanas", "Elegante"],
    href: "/stickers/designer?type=transparent",
    color: "from-gray-400 to-gray-600",
  },
  {
    id: 4,
    title: "Stickers mate",
    description: "Acabado suave sin brillo",
    price: "Desde $0.12",
    icon: "🎨",
    features: ["Sin reflejos", "Tacto suave", "Colores sólidos"],
    href: "/stickers/designer?type=matte",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 5,
    title: "Stickers brillantes",
    description: "Laminado brillante de alta calidad",
    price: "Desde $0.18",
    icon: "✨",
    features: ["Alto brillo", "Colores vibrantes", "Protección UV"],
    href: "/stickers/designer?type=glossy",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 6,
    title: "Stickers de vinilo",
    description: "Resistentes al agua y duraderos",
    price: "Desde $0.22",
    icon: "💪",
    features: ["Resistente al agua", "Uso exterior", "5+ años duración"],
    href: "/stickers/designer?type=vinyl",
    color: "from-red-500 to-pink-500",
  },
];

const categories = [
  { id: "all", name: "Todos", icon: "🎯" },
  { id: "premium", name: "Premium", icon: "💎" },
  { id: "resistant", name: "Resistentes", icon: "🛡️" },
  { id: "special", name: "Especiales", icon: "✨" },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "premium") 
      return ["holográficos", "transparentes"].some(type => product.title.toLowerCase().includes(type));
    if (selectedCategory === "resistant") 
      return ["vinilo", "troquelados"].some(type => product.title.toLowerCase().includes(type));
    if (selectedCategory === "special") 
      return ["holográficos", "brillantes", "mate"].some(type => product.title.toLowerCase().includes(type));
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-b from-[#FBF7F2] via-white to-[#F5E6D3]">
        
        {/* Hero Title Section - Separada */}
        <section className="pt-24 pb-8 md:pt-32 md:pb-12 lg:pt-40 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6">
                Nuestros Productos
                <span className="block text-2xl sm:text-3xl md:text-4xl text-[#275D5C] mt-2">
                  Elige el sticker perfecto para tu proyecto
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Desde diseños troquelados hasta efectos holográficos, 
                tenemos el sticker ideal para cada necesidad
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter Section - Separada */}
        <section className="py-4 md:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 md:gap-4"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? "bg-[#275D5C] text-white shadow-lg"
                      : "bg-[#F5E6D3] text-[#275D5C] hover:bg-[#275D5C] hover:text-white shadow-md"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Products Grid Section - Separada */}
        <section className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="relative"
                >
                  <Link href={product.href}>
                    <div className={`relative bg-white rounded-3xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-300 ${
                      hoveredProduct === product.id ? "scale-105 shadow-2xl" : ""
                    }`}>
                      {product.popular && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                            Más popular
                          </span>
                        </div>
                      )}

                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                      {/* Content */}
                      <div className="relative p-8">
                        {/* Icon */}
                        <motion.div
                          animate={{
                            rotate: hoveredProduct === product.id ? [0, -10, 10, -10, 0] : 0,
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-6xl mb-6"
                        >
                          {product.icon}
                        </motion.div>

                        {/* Title & Description */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {product.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </div>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#275D5C] to-[#3A7F7E] bg-clip-text text-transparent">
                            {product.price}
                          </span>
                          <motion.span
                            animate={{
                              x: hoveredProduct === product.id ? 5 : 0,
                            }}
                            className="text-[#275D5C] font-semibold flex items-center"
                          >
                            Diseñar ahora
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Espaciado moderado entre secciones */}
        <div className="h-16 md:h-20 lg:h-24"></div>

        {/* Custom Request Section - Con espaciado balanceado */}
        <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-[#275D5C] to-[#4FA09F] rounded-3xl p-8 md:p-12 lg:p-16 text-white shadow-2xl">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  ¿No encuentras lo que buscas?
                </h2>
                <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                  Podemos crear stickers personalizados según tus necesidades específicas
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-8 py-2.5 sm:px-16 sm:py-3 md:px-24 md:py-3.5 bg-[#F5E6D3] text-[#275D5C] text-sm sm:text-base md:text-lg font-bold rounded-lg hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Solicitar Cotización Personalizada
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Spacer Section para separar del Footer */}
        <div className="h-12 md:h-16 lg:h-20"></div>
      </main>

      <Footer />
    </div>
  );
}