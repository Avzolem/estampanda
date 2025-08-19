"use client";

import { motion } from "framer-motion";
import {
  CloudArrowUpIcon,
  PaintBrushIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "1",
    title: "Sube tu diseño",
    description: "Arrastra tu imagen o selecciona desde tu dispositivo",
    icon: CloudArrowUpIcon,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    number: "2",
    title: "Personaliza",
    description: "Elige el material, tamaño y tipo de corte",
    icon: PaintBrushIcon,
    bgColor: "bg-[#F5E6D3]",
    iconColor: "text-[#275D5C]",
  },
  {
    number: "3",
    title: "Recibe tu pedido",
    description: "Envío gratis en pedidos mayores a 100 unidades",
    icon: TruckIcon,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FBF7F2]">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-[#FBF7F2] py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#275D5C] mb-6">
                Cómo Funciona
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                Crear tus stickers personalizados es tan fácil como 1, 2, 3
              </p>
            </motion.div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="space-y-8 sm:space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-8 ${
                    index % 2 === 1 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon Section */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-32 h-32 sm:w-40 sm:h-40 ${step.bgColor} rounded-2xl flex items-center justify-center relative`}
                    >
                      <step.icon className={`w-16 h-16 sm:w-20 sm:h-20 ${step.iconColor}`} />
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#275D5C] text-white rounded-lg flex items-center justify-center font-bold text-xl">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`flex-1 text-center sm:text-left ${
                    index % 2 === 1 ? "sm:text-right" : ""
                  }`}>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#275D5C] mb-3">
                      {step.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center mt-16 sm:mt-20"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-[#275D5C] mb-6">
                ¿Listo para empezar?
              </h3>
              <a
                href="/stickers/designer"
                className="inline-block px-8 py-2 sm:px-16 sm:py-3 md:px-24 md:py-3.5 bg-gradient-to-r from-[#275D5C] to-[#4FA09F] text-white font-semibold rounded-lg hover:shadow-xl transition-all"
              >
                Crear mis stickers
              </a>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#275D5C] mb-2">
                  48hrs
                </div>
                <p className="text-gray-600">Tiempo de producción</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#275D5C] mb-2">
                  100%
                </div>
                <p className="text-gray-600">Satisfacción garantizada</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#275D5C] mb-2">
                  Gratis
                </div>
                <p className="text-gray-600">Envío en pedidos +100</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}