"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  CloudArrowUpIcon,
  PaintBrushIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    id: 1,
    title: "Sube tu diseño",
    description: "Arrastra tu imagen o selecciona un archivo. Aceptamos JPG, PNG, SVG y más formatos.",
    icon: CloudArrowUpIcon,
    color: "from-purple-500 to-pink-500",
    delay: 0,
  },
  {
    id: 2,
    title: "Personaliza tu sticker",
    description: "Elige material, tamaño y tipo de corte. Ve el preview en tiempo real.",
    icon: PaintBrushIcon,
    color: "from-[#275D5C] to-[#4FA09F]",
    delay: 0.1,
  },
  {
    id: 3,
    title: "Revisa el precio",
    description: "Obtén descuentos automáticos por volumen. Sin costos ocultos.",
    icon: CurrencyDollarIcon,
    color: "from-green-500 to-emerald-500",
    delay: 0.2,
  },
  {
    id: 4,
    title: "Confirmamos tu pedido",
    description: "Revisamos tu diseño y te enviamos un proof digital en 24 horas.",
    icon: CheckBadgeIcon,
    color: "from-blue-500 to-cyan-500",
    delay: 0.3,
  },
  {
    id: 5,
    title: "Producción express",
    description: "Imprimimos y cortamos tus stickers con la mejor calidad del mercado.",
    icon: SparklesIcon,
    color: "from-yellow-500 to-orange-500",
    delay: 0.4,
  },
  {
    id: 6,
    title: "Recibe en tu puerta",
    description: "Envío gratis en pedidos mayores a 100 unidades. Tracking en tiempo real.",
    icon: TruckIcon,
    color: "from-indigo-500 to-purple-500",
    delay: 0.5,
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FBF7F2]" ref={containerRef}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#275D5C] mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crear tus stickers personalizados es más fácil que nunca. 
            Solo 6 pasos para tener tus diseños en tus manos.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                custom={index}
                className="relative"
              >
                {/* Connection Line (visible on larger screens) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"
                    style={{
                      transform: index % 3 === 2 ? "rotate(90deg) translateX(100%)" : "translateX(50%)",
                      transformOrigin: "left center",
                      width: index % 3 === 2 ? "200%" : "100%",
                    }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  {/* Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ 
                      delay: step.delay + 0.2, 
                      type: "spring", 
                      stiffness: 200 
                    }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#275D5C] to-[#4FA09F] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
                  >
                    {step.id}
                  </motion.div>

                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: isEven ? 10 : -10 }}
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative Element */}
                  <motion.div
                    className="absolute bottom-0 right-0 w-24 h-24 opacity-5"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Icon className="w-full h-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            ¿Listo para crear tus stickers personalizados?
          </p>
          <motion.a
            href="/stickers/designer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#275D5C] to-[#4FA09F] text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <SparklesIcon className="w-6 h-6" />
            Empezar Ahora
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-gray-200"
        >
          {[
            { number: "50,000+", label: "Stickers creados" },
            { number: "48hrs", label: "Tiempo de producción" },
            { number: "4.9/5", label: "Calificación promedio" },
            { number: "100%", label: "Satisfacción garantizada" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold text-[#275D5C] mb-2"
                animate={isInView ? { 
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ 
                  delay: 1.2 + index * 0.1,
                  duration: 0.5,
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}