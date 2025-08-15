"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircleIcon,
  EnvelopeIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  SparklesIcon,
  TruckIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const order = searchParams.get("order");
    if (order) {
      setOrderNumber(order);
      
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#275D5C', '#4FA09F', '#F5E6D3', '#3B7F7E']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#275D5C', '#4FA09F', '#F5E6D3', '#3B7F7E']
        });
      }, 250);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextSteps = [
    {
      icon: EnvelopeIcon,
      title: "Revisa tu email",
      description: "Te enviamos la confirmación con todos los detalles",
    },
    {
      icon: ClockIcon,
      title: "Procesando tu diseño",
      description: "Nuestro equipo revisará tu diseño en las próximas 24 horas",
    },
    {
      icon: TruckIcon,
      title: "Envío en camino",
      description: "Recibirás un email cuando tu pedido sea enviado",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#275D5C] to-[#4FA09F] p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              className="inline-block"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-16 h-16 text-green-500" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              ¡Pedido Confirmado!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg"
            >
              Tu pedido de stickers ha sido recibido exitosamente
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#F5E6D3]/30 to-white rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Número de pedido</span>
                <button
                  onClick={copyOrderNumber}
                  className="flex items-center gap-1 text-[#275D5C] hover:text-[#3B7F7E] transition-colors"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  <span className="text-sm">{copied ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>
              <div className="text-2xl font-bold text-[#275D5C] font-mono">
                {orderNumber}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Guarda este número para rastrear tu pedido
              </p>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                ¿Qué sigue?
              </h2>
              <div className="space-y-4">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-[#F5E6D3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#275D5C]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Estimated Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-blue-50 rounded-xl p-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <TruckIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">
                    Entrega estimada
                  </p>
                  <p className="text-sm text-blue-700">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/stickers/tracking"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
              >
                <TruckIcon className="w-5 h-5" />
                Rastrear pedido
              </Link>
              
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#275D5C] text-[#275D5C] rounded-lg font-semibold hover:bg-[#F5E6D3] transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                Volver al inicio
              </Link>
            </motion.div>

            {/* Extra message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-600">
                ¿Tienes preguntas? Contáctanos en{" "}
                <a href="mailto:soporte@estampanda.com" className="text-[#275D5C] underline">
                  soporte@estampanda.com
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center gap-4 mt-8"
        >
          <div className="text-4xl animate-bounce" style={{ animationDelay: "0s" }}>
            🎉
          </div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: "0.2s" }}>
            🎨
          </div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: "0.4s" }}>
            ✨
          </div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: "0.6s" }}>
            📦
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}