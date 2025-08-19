"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu when clicking outside or scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/estampandalogonobg.png" 
              alt="Estampanda" 
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-2xl md:text-3xl font-bold text-[#275D5C]">
              Estampanda.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="font-medium" style={{ color: '#275D5C' }}>
              Productos
            </Link>
            <Link href="/muestras" className="font-medium" style={{ color: '#275D5C' }}>
              Muestras
            </Link>
            <Link href="/#calculadora-precios" className="font-medium" style={{ color: '#275D5C' }}>
              Precios
            </Link>
            <Link href="/how-it-works" className="font-medium" style={{ color: '#275D5C' }}>
              Cómo Funciona
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/stickers/tracking" 
              className="flex items-center gap-2 font-medium hover:opacity-80 transition-opacity" 
              style={{ color: '#275D5C' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Rastrear pedido
            </Link>
            <Link
              href="/stickers/designer"
              className="px-8 sm:px-16 md:px-24 py-2 sm:py-3 md:py-3.5 bg-[#275D5C] text-white rounded-lg text-sm sm:text-base md:text-lg font-semibold hover:bg-[#3B7F7E] transition-all"
            >
              Crear stickers
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              />
              
              {/* Mobile Menu */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex flex-col space-y-4">
                    <Link 
                      href="/products" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between font-medium text-lg py-3 px-4 rounded-lg hover:bg-[#F5E6D3]/30 transition-colors" 
                      style={{ color: '#275D5C' }}
                    >
                      Productos
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="/muestras" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between font-medium text-lg py-3 px-4 rounded-lg hover:bg-[#F5E6D3]/30 transition-colors" 
                      style={{ color: '#275D5C' }}
                    >
                      Muestras
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="/#calculadora-precios" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between font-medium text-lg py-3 px-4 rounded-lg hover:bg-[#F5E6D3]/30 transition-colors" 
                      style={{ color: '#275D5C' }}
                    >
                      Precios
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="/how-it-works" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between font-medium text-lg py-3 px-4 rounded-lg hover:bg-[#F5E6D3]/30 transition-colors" 
                      style={{ color: '#275D5C' }}
                    >
                      Cómo Funciona
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <Link 
                        href="/stickers/tracking" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 font-medium text-lg py-3 px-4 rounded-lg border-2 border-[#275D5C] hover:bg-[#F5E6D3]/30 transition-colors mb-3" 
                        style={{ color: '#275D5C' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Rastrear pedido
                      </Link>
                      <Link
                        href="/stickers/designer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center px-8 py-2 bg-[#275D5C] text-white rounded-lg text-sm font-semibold hover:bg-[#3B7F7E] transition-all"
                      >
                        Crear stickers
                      </Link>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="border-t border-gray-200 pt-6 mt-4">
                      <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda?</p>
                      <a href="mailto:soporte@estampanda.com" className="text-[#275D5C] font-medium">
                        soporte@estampanda.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}