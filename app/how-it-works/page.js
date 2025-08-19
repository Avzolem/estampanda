"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CloudArrowUpIcon,
  PaintBrushIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  CreditCardIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const steps = [
  {
    number: "01",
    title: "Sube tu diseño",
    description: "Carga tu imagen o crea un diseño desde cero con nuestro editor",
    icon: CloudArrowUpIcon,
    color: "bg-purple-100 text-purple-600",
    details: [
      "Formatos: PNG, JPG, SVG, AI",
      "Resolución mínima: 300 DPI",
      "Editor de diseño incluido"
    ]
  },
  {
    number: "02",
    title: "Personaliza",
    description: "Elige material, tamaño, tipo de corte y cantidad",
    icon: PaintBrushIcon,
    color: "bg-blue-100 text-blue-600",
    details: [
      "8 tipos de materiales",
      "Tamaños personalizados",
      "Corte preciso con láser"
    ]
  },
  {
    number: "03",
    title: "Revisión y pago",
    description: "Revisa tu diseño y procesa el pago de forma segura",
    icon: CreditCardIcon,
    color: "bg-green-100 text-green-600",
    details: [
      "Vista previa en 3D",
      "Pago seguro con Stripe",
      "Facturación disponible"
    ]
  },
  {
    number: "04",
    title: "Recibe tu pedido",
    description: "Producción express y envío a todo México",
    icon: TruckIcon,
    color: "bg-orange-100 text-orange-600",
    details: [
      "Producción en 24-48 hrs",
      "Envío gratis nacional",
      "Rastreo en tiempo real"
    ]
  }
];

const features = [
  {
    title: "Sin pedido mínimo",
    description: "Ordena desde 1 sticker",
    icon: "🎯"
  },
  {
    title: "Calidad premium",
    description: "Materiales duraderos y resistentes",
    icon: "⭐"
  },
  {
    title: "Prueba digital gratis",
    description: "Ve cómo quedará antes de pagar",
    icon: "👁️"
  },
  {
    title: "Soporte 24/7",
    description: "Te ayudamos en cada paso",
    icon: "💬"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20">
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#275D5C] mb-6">
              ¿Cómo funciona?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Crear tus stickers personalizados es más fácil de lo que piensas. 
              Solo necesitas 4 pasos para tener tus diseños en tus manos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-6xl font-bold text-gray-200">
                      {step.number}
                    </span>
                    <div className={`p-4 rounded-xl ${step.color}`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-[#275D5C] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#275D5C]/10 to-[#4FA09F]/10 rounded-3xl blur-3xl" />
                    <div className="relative bg-white rounded-3xl shadow-xl p-12 text-center">
                      <step.icon className="w-32 h-32 mx-auto text-[#275D5C] mb-4" />
                      <div className="flex justify-center gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-12 rounded-full ${
                              i <= index ? "bg-[#275D5C]" : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#275D5C] mb-4">
              Ventajas de trabajar con nosotros
            </h2>
            <p className="text-lg text-gray-600">
              Más que stickers, una experiencia completa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#F5E6D3]/50 to-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#275D5C] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold text-[#275D5C] mb-8 text-center">
              Línea de tiempo de tu pedido
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#275D5C] text-white rounded-full flex items-center justify-center font-bold">
                  0h
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Pedido recibido</h4>
                  <p className="text-sm text-gray-600">Confirmación instantánea por email</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3B7F7E] text-white rounded-full flex items-center justify-center font-bold">
                  2h
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Revisión de diseño</h4>
                  <p className="text-sm text-gray-600">Nuestro equipo valida tu archivo</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4FA09F] text-white rounded-full flex items-center justify-center font-bold">
                  24h
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Producción</h4>
                  <p className="text-sm text-gray-600">Impresión y corte de alta precisión</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  48h
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">En camino</h4>
                  <p className="text-sm text-gray-600">Tu pedido está en ruta de entrega</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#275D5C] to-[#4FA09F]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <SparklesIcon className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para crear tus stickers?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Empieza ahora y recibe tus stickers en 48 horas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stickers/designer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#275D5C] rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Crear mis stickers
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/muestras"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                Solicitar muestras gratis
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}