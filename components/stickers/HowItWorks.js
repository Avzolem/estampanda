"use client";

import { motion } from "framer-motion";
import { 
  CloudArrowUpIcon,
  PaintBrushIcon,
  CreditCardIcon,
  TruckIcon
} from "@heroicons/react/24/outline";

const steps = [
  {
    number: "01",
    title: "Sube tu diseño",
    description: "Carga tu archivo en formato PNG, JPG, SVG o AI. También puedes usar nuestro diseñador online.",
    icon: CloudArrowUpIcon,
    color: "from-purple-400 to-purple-600",
    image: "📤"
  },
  {
    number: "02",
    title: "Personaliza",
    description: "Elige el tamaño, material, acabado y cantidad. Ve el precio en tiempo real.",
    icon: PaintBrushIcon,
    color: "from-pink-400 to-pink-600",
    image: "🎨"
  },
  {
    number: "03",
    title: "Confirma tu pedido",
    description: "Revisa tu diseño, aprueba la prueba digital y realiza el pago seguro.",
    icon: CreditCardIcon,
    color: "from-yellow-400 to-orange-400",
    image: "💳"
  },
  {
    number: "04",
    title: "Recibe en 48hrs",
    description: "Producimos y enviamos tu pedido. Rastrea tu paquete hasta la puerta de tu casa.",
    icon: TruckIcon,
    color: "from-green-400 to-emerald-400",
    image: "📦"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold mb-4"
          >
            <span className="text-lg">⚡</span>
            Proceso Simple
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-4">
            De tu idea a tus manos
            <span className="gradient-text"> en 4 pasos</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hacer stickers personalizados nunca fue tan fácil
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 origin-left"
                  />
                </div>
              )}

              <div className="relative bg-white rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>

                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-24 h-24 mx-auto bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                >
                  <span className="text-5xl">{step.image}</span>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video/Demo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Mira qué fácil es crear tus stickers
              </h3>
              <p className="text-gray-600 mb-6">
                En menos de 5 minutos puedes tener tu pedido listo. 
                Nuestro sistema te guía paso a paso para que obtengas exactamente lo que necesitas.
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  "Sin pedido mínimo para comenzar",
                  "Prueba digital gratis antes de imprimir",
                  "Garantía de satisfacción 100%"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary">
                Comenzar Ahora
              </button>
            </div>

            <div className="relative">
              {/* Video Placeholder */}
              <div className="relative bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl aspect-video flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 bg-black/20 rounded-2xl" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-xl"
                >
                  <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold shadow-lg"
              >
                Demo 2 min
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}