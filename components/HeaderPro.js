"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingCartIcon, 
  Bars3Icon, 
  XMarkIcon
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Productos", href: "/productos" },
  { name: "Muestras", href: "/muestras" },
  { name: "Precios", href: "/precios" },
  { name: "Blog", href: "/blog" },
];

export default function HeaderPro() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white shadow-sm" 
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Estampanda</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-xs rounded-lg flex items-center justify-center">
                  0
                </span>
              </button>

              <Link 
                href="/designer"
                className="hidden md:inline-flex px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Diseñar Ahora
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                href="/designer"
                className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Diseñar Ahora
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}