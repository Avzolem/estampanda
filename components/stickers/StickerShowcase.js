"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const showcaseStickers = [
  {
    id: 1,
    title: "Logo Empresa",
    category: "Corporativo",
    material: "Holográfico",
    image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Logo",
    price: "$0.25",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 2,
    title: "Mascota Kawaii",
    category: "Arte",
    material: "Brillante",
    image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Kawaii",
    price: "$0.20",
    color: "from-pink-400 to-red-400",
  },
  {
    id: 3,
    title: "Meme Viral",
    category: "Humor",
    material: "Mate",
    image: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=Meme",
    price: "$0.15",
    color: "from-green-400 to-blue-400",
  },
  {
    id: 4,
    title: "Texto Motivacional",
    category: "Inspiración",
    material: "Transparente",
    image: "https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=Quote",
    price: "$0.18",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: 5,
    title: "Ilustración",
    category: "Arte Digital",
    material: "Metálico",
    image: "https://via.placeholder.com/400x400/6366F1/FFFFFF?text=Art",
    price: "$0.30",
    color: "from-indigo-400 to-purple-400",
  },
  {
    id: 6,
    title: "Patrón Geométrico",
    category: "Diseño",
    material: "Glow in Dark",
    image: "https://via.placeholder.com/400x400/EF4444/FFFFFF?text=Pattern",
    price: "$0.35",
    color: "from-red-400 to-pink-400",
  },
];

export default function StickerShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        handleNext();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseStickers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? showcaseStickers.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stickers Populares
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Descubre los diseños más vendidos de nuestra comunidad
          </p>
        </motion.div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {showcaseStickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className={`relative bg-gradient-to-br ${sticker.color} rounded-2xl shadow-2xl overflow-hidden`}>
                    <div className="p-8 md:p-12">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-white">
                          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                            {sticker.category}
                          </span>
                          <h3 className="text-3xl font-bold mb-2">{sticker.title}</h3>
                          <p className="text-lg mb-4 opacity-90">Material: {sticker.material}</p>
                          <div className="text-4xl font-bold mb-6">{sticker.price}</div>
                          <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-50 transition-colors">
                            Ver Diseño
                          </button>
                        </div>
                        <div className="relative">
                          <div className="bg-white rounded-2xl shadow-xl p-4">
                            <img
                              src={sticker.image}
                              alt={sticker.title}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          {currentIndex === sticker.id - 1 && (
                            <motion.div
                              className="absolute -top-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring" }}
                            >
                              TOP
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeftIcon className="w-6 h-6 text-purple-600" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRightIcon className="w-6 h-6 text-purple-600" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {showcaseStickers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all ${
                index === currentIndex
                  ? "w-8 h-2 bg-purple-600 rounded-full"
                  : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:shadow-xl transition-shadow">
            Ver Toda la Galería
          </button>
        </motion.div>
      </div>
    </section>
  );
}