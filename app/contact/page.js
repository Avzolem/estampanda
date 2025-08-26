"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-[#F5E6D3] via-[#FBF7F2] to-[#F5E6D3]">
        
        {/* Hero Section con espaciado mejorado */}
        <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#275D5C] mb-4 sm:mb-6 md:mb-8">
                Contáctanos
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#3B7F7E] mt-3 sm:mt-4">
                  Estamos aquí para ayudarte
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
                ¿Tienes preguntas sobre tu pedido? ¿Necesitas ayuda con el diseño? 
                Estamos disponibles para resolver todas tus dudas sobre stickers personalizados
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards Section con mejor espaciado */}
        <section className="pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Cards Grid - Solo WhatsApp y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-12 md:mb-16">
              
              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 sm:p-8 md:p-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mx-auto">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                </div>
                <div className="p-6 sm:p-8 md:p-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
                    WhatsApp
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 text-center">
                    Respuesta inmediata
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-[#275D5C] font-semibold mb-6 sm:mb-8 text-center">
                    +52 625 121 7055
                  </p>
                  <a 
                    href="https://wa.me/526251217055?text=¡Hola%20Estampanda!%20Me%20gustaría%20crear%20stickers%20personalizados.%20¿Me%20pueden%20ayudar?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    Iniciar Chat
                  </a>
                </div>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-[#275D5C] to-[#3B7F7E] p-6 sm:p-8 md:p-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mx-auto">
                    <EnvelopeIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                  </div>
                </div>
                <div className="p-6 sm:p-8 md:p-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
                    Email
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 text-center">
                    Te respondemos en 24 hrs
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-[#275D5C] font-semibold mb-6 sm:mb-8 text-center">
                    hola@estampanda.com
                  </p>
                  <a 
                    href="mailto:hola@estampanda.com?subject=Consulta%20sobre%20stickers%20personalizados"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-[#275D5C] to-[#3B7F7E] text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:from-[#3B7F7E] hover:to-[#275D5C] transition-all transform hover:scale-105"
                  >
                    <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    Enviar Email
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Horario Section - Centrado y con mejor espaciado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-12 lg:p-16 pb-10 sm:pb-12 md:pb-16 lg:pb-20 mb-12 sm:mb-16 md:mb-20 lg:mb-24 max-w-2xl mx-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#F5E6D3] rounded-xl flex items-center justify-center mb-6 sm:mb-8">
                  <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#275D5C]" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Horario de Atención
                </h3>
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <p className="text-base sm:text-lg md:text-xl text-gray-600">
                    <span className="font-semibold">Lunes a Viernes:</span> 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600">
                    <span className="font-semibold">Sábado:</span> 10:00 AM - 2:00 PM
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600">
                    <span className="font-semibold">Domingo:</span> Cerrado
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 w-full">
                  <p className="text-sm sm:text-base md:text-lg text-[#275D5C] font-semibold">
                    Respondemos todos los mensajes en menos de 24 horas
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}