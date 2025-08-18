"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

const footerLinks = {
  productos: [
    { name: "Stickers Troquelados", href: "#", emoji: "✂️" },
    { name: "Stickers Holográficos", href: "#", emoji: "🌈" },
    { name: "Stickers Transparentes", href: "#", emoji: "💎" },
    { name: "Stickers Vinilo", href: "#", emoji: "💪" },
    { name: "Ver Todos", href: "#", emoji: "👉" }
  ],
  empresa: [
    { name: "Sobre Nosotros", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Trabajos", href: "#" },
    { name: "Sostenibilidad", href: "#" },
    { name: "Prensa", href: "#" }
  ],
  ayuda: [
    { name: "Centro de Ayuda", href: "#" },
    { name: "Contacto", href: "#" },
    { name: "Envíos", href: "#" },
    { name: "Devoluciones", href: "#" },
    { name: "FAQs", href: "#" }
  ],
  legal: [
    { name: "Términos de Servicio", href: "#" },
    { name: "Política de Privacidad", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "Licencias", href: "#" }
  ]
};

const socialLinks = [
  { name: "Facebook", icon: "📘", href: "#" },
  { name: "Instagram", icon: "📷", href: "#" },
  { name: "Twitter", icon: "🐦", href: "#" },
  { name: "LinkedIn", icon: "💼", href: "#" },
  { name: "TikTok", icon: "🎵", href: "#" }
];

export default function FooterPro() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 -mt-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
              }} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  📧 Únete a nuestra comunidad
                </h3>
                <p className="text-lg opacity-90">
                  Recibe ofertas exclusivas, tips de diseño y novedades. 
                  ¡Además, 10% de descuento en tu primera compra!
                </p>
              </div>
              
              <div>
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-6 py-4 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30 transition-all"
                  />
                  <button className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all">
                    Suscribirme
                  </button>
                </form>
                <p className="text-sm mt-3 opacity-75">
                  *No spam, puedes cancelar cuando quieras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h2 className="font-black text-2xl">Estampanda</h2>
                  <p className="text-xs text-gray-400">Stickers Premium</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Creamos stickers de alta calidad que hacen brillar tu marca. 
                Diseño fácil, producción rápida, resultados increíbles.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+521234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <PhoneIcon className="w-5 h-5" />
                <span className="text-sm">+52 123 456 7890</span>
              </a>
              <a href="mailto:hola@estampanda.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
                <span className="text-sm">hola@estampanda.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPinIcon className="w-5 h-5" />
                <span className="text-sm">México</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4">Productos</h3>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <span>{link.emoji}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-lg mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-sm font-semibold">Pago Seguro</div>
            <div className="text-xs text-gray-400">SSL Encriptado</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <div className="text-sm font-semibold">Envío Rápido</div>
            <div className="text-xs text-gray-400">48-72 horas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-sm font-semibold">Garantía</div>
            <div className="text-xs text-gray-400">100% Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-sm font-semibold">Eco-Friendly</div>
            <div className="text-xs text-gray-400">Materiales sostenibles</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Estampanda. Todos los derechos reservados.
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-2xl hover:opacity-80 transition-opacity"
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Aceptamos:</span>
              <div className="flex gap-2 text-2xl">
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
                <span title="PayPal">💰</span>
                <span title="Stripe">💎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}