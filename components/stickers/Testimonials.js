"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";

const testimonials = [
  {
    id: 1,
    name: "María García",
    role: "Dueña de Café Artesanal",
    avatar: "👩‍💼",
    rating: 5,
    text: "Los stickers para mi café quedaron increíbles! La calidad es superior y mis clientes los aman. El proceso fue súper fácil y rápido.",
    product: "Stickers Holográficos",
    image: "☕"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Diseñador Freelance",
    avatar: "👨‍🎨",
    rating: 5,
    text: "Como diseñador, la calidad de impresión es crucial. Estampanda superó mis expectativas. Los colores son vibrantes y el corte es perfecto.",
    product: "Stickers Troquelados",
    image: "🎨"
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Emprendedora",
    avatar: "👩‍💻",
    rating: 5,
    text: "Pedí stickers para mi marca de cosméticos y el resultado fue profesional. El envío llegó antes de lo esperado. 100% recomendado!",
    product: "Stickers Transparentes",
    image: "💄"
  },
  {
    id: 4,
    name: "Luis Fernández",
    role: "Organizador de Eventos",
    avatar: "👨‍🎤",
    rating: 5,
    text: "Usamos los stickers para un festival de música. Resistieron perfectamente el sol y la lluvia. Excelente durabilidad.",
    product: "Vinilo Premium",
    image: "🎵"
  },
  {
    id: 5,
    name: "Sofia López",
    role: "Influencer",
    avatar: "👩‍🦰",
    rating: 5,
    text: "Mis seguidores enloquecieron con los stickers personalizados. La plataforma es muy intuitiva y el soporte al cliente es de 10.",
    product: "Stickers Metálicos",
    image: "📱"
  },
  {
    id: 6,
    name: "Diego Morales",
    role: "Dueño de Tienda",
    avatar: "👨‍💼",
    rating: 5,
    text: "Pedimos stickers para nuestros productos y han sido un éxito. La relación calidad-precio es inmejorable. Ya somos clientes frecuentes.",
    product: "Papel Mate",
    image: "🛍️"
  }
];

const stats = [
  { number: "10,000+", label: "Clientes Felices", icon: "😊" },
  { number: "4.9/5", label: "Calificación", icon: "⭐" },
  { number: "1M+", label: "Stickers Impresos", icon: "🎯" },
  { number: "48hrs", label: "Tiempo de Entrega", icon: "🚀" }
];

export default function Testimonials() {
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4"
          >
            <span>💬</span>
            Testimonios Reales
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-4">
            Lo que dicen nuestros
            <span className="gradient-text"> clientes felices</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de empresas y emprendedores confían en nosotros para sus stickers
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black gradient-text mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow relative"
            >
              {/* Product Badge */}
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                {testimonial.product}
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>

              {/* Product Icon */}
              <div className="absolute bottom-4 right-4 text-4xl opacity-10">
                {testimonial.image}
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
          className="text-center mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para unirte a miles de clientes satisfechos?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Crea tus stickers personalizados hoy y recibe 50% de descuento en tu primera orden
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-accent text-lg px-8 py-4">
              Crear Mis Stickers
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur text-white font-bold rounded-full border-2 border-white/50 hover:bg-white/30 transition-all">
              Ver Más Reseñas
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}