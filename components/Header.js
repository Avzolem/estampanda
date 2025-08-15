"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/images/estampandalogonobg.png" 
              alt="Estampanda" 
              className="h-12"
              style={{ height: '48px', width: 'auto' }}
            />
            <span className="text-2xl md:text-3xl font-bold" style={{ color: '#275D5C' }}>
              Estampanda.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/productos" className="font-medium" style={{ color: '#275D5C' }}>
              Productos
            </Link>
            <Link href="/muestras" className="font-medium" style={{ color: '#275D5C' }}>
              Muestras
            </Link>
            <Link href="/precios" className="font-medium" style={{ color: '#275D5C' }}>
              Precios
            </Link>
            <Link href="/ayuda" className="font-medium" style={{ color: '#275D5C' }}>
              Ayuda
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="font-medium" style={{ color: '#275D5C' }}>
              Iniciar sesión
            </Link>
            <Link
              href="/stickers/designer"
              className="font-medium"
              style={{ 
                backgroundColor: '#275D5C', 
                color: 'white', 
                padding: '0.5rem 1.5rem',
                borderRadius: '0.375rem'
              }}
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
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/productos" className="font-medium" style={{ color: '#275D5C' }}>
                Productos
              </Link>
              <Link href="/muestras" className="font-medium" style={{ color: '#275D5C' }}>
                Muestras
              </Link>
              <Link href="/precios" className="font-medium" style={{ color: '#275D5C' }}>
                Precios
              </Link>
              <Link href="/ayuda" className="font-medium" style={{ color: '#275D5C' }}>
                Ayuda
              </Link>
              <Link href="/login" className="font-medium" style={{ color: '#275D5C' }}>
                Iniciar sesión
              </Link>
              <Link
                href="/stickers/designer"
                className="text-white px-6 py-2 rounded-md font-medium text-center transition-all hover:shadow-lg"
                style={{ backgroundColor: '#275D5C' }}
              >
                Crear stickers
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}