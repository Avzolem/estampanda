"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HeartIcon,
  SparklesIcon,
  StarIcon,
  ArrowRightIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";

const categories = [
  { id: "all", name: "Todos", emoji: "🎨" },
  { id: "business", name: "Negocios", emoji: "💼" },
  { id: "cute", name: "Kawaii", emoji: "🦄" },
  { id: "gaming", name: "Gaming", emoji: "🎮" },
  { id: "music", name: "Música", emoji: "🎵" },
  { id: "nature", name: "Naturaleza", emoji: "🌿" },
];

const products = [
  {
    id: 1,
    name: "Logo Empresarial Holográfico",
    image: "https://via.placeholder.com/400x400/275D5C/FFFFFF?text=Logo",
    category: "business",
    material: "Holográfico",
    size: "7x7 cm",
    price: "$45",
    originalPrice: "$60",
    discount: 25,
    rating: 4.9,
    reviews: 127,
    bestseller: true,
    likes: 342,
  },
  {
    id: 2,
    name: "Pack Gatos Kawaii",
    image: "https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Kawaii",
    category: "cute",
    material: "Mate",
    size: "5x5 cm",
    price: "$35",
    originalPrice: "$40",
    discount: 12,
    rating: 5.0,
    reviews: 89,
    bestseller: false,
    likes: 567,
  },
  {
    id: 3,
    name: "Set Gaming RGB",
    image: "https://via.placeholder.com/400x400/7C3AED/FFFFFF?text=Gaming",
    category: "gaming",
    material: "Glow in Dark",
    size: "10x10 cm",
    price: "$55",
    originalPrice: "$70",
    discount: 21,
    rating: 4.8,
    reviews: 203,
    bestseller: true,
    likes: 891,
  },
  {
    id: 4,
    name: "Banda Favorita Metalizado",
    image: "https://via.placeholder.com/400x400/DC2626/FFFFFF?text=Music",
    category: "music",
    material: "Metálico",
    size: "8x8 cm",
    price: "$50",
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviews: 56,
    bestseller: false,
    likes: 234,
  },
  {
    id: 5,
    name: "Plantas Minimalistas",
    image: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=Nature",
    category: "nature",
    material: "Transparente",
    size: "6x6 cm",
    price: "$38",
    originalPrice: "$45",
    discount: 15,
    rating: 4.9,
    reviews: 178,
    bestseller: false,
    likes: 445,
  },
  {
    id: 6,
    name: "Startup Tech Pack",
    image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Tech",
    category: "business",
    material: "Brillante",
    size: "5x5 cm",
    price: "$42",
    originalPrice: "$50",
    discount: 16,
    rating: 4.8,
    reviews: 92,
    bestseller: true,
    likes: 678,
  },
];

export default function PopularProducts() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedProducts, setLikedProducts] = useState([]);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const toggleLike = (productId) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#275D5C]/10 to-[#4FA09F]/10 text-[#275D5C] rounded-lg text-sm font-semibold mb-4">
            <SparklesIcon className="w-4 h-4" />
            Los más vendidos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#275D5C] mb-3 sm:mb-4">
            Diseños Populares
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Inspírate con los stickers más vendidos de nuestra comunidad
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 px-2"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-[#275D5C] to-[#4FA09F] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base sm:text-lg">{category.emoji}</span>
                {category.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.bestseller && (
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-lg"
                      >
                        BESTSELLER
                      </motion.span>
                    )}
                    {product.discount > 0 && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-all"
                  >
                    {likedProducts.includes(product.id) ? (
                      <HeartIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartOutlineIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Quick Actions Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link
                        href="/stickers/designer"
                        className="px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 bg-white text-[#275D5C] rounded-lg text-sm sm:text-base md:text-lg font-semibold hover:bg-[#F5E6D3] transition-all"
                      >
                        Personalizar este diseño
                      </Link>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Specs */}
                    <div className="flex gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#4FA09F] rounded-lg"></span>
                        {product.material}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#275D5C] rounded-lg"></span>
                        {product.size}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#275D5C]">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-[#275D5C] text-white rounded-lg hover:bg-[#3B7F7E] transition-colors"
                      >
                        <ArrowRightIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 sm:mt-12 md:mt-16"
        >
          <Link
            href="/stickers/gallery"
            className="inline-flex items-center gap-2 sm:gap-3 px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 bg-white border-2 border-[#275D5C] text-[#275D5C] text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-[#275D5C] hover:text-white transition-all"
          >
            Ver todos los diseños
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}