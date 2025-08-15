"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  PrinterIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon
} from "@heroicons/react/24/solid";

// Datos de ejemplo - En producción vendría de la base de datos
const mockOrders = {
  "STK-20250815-0001": {
    orderNumber: "STK-20250815-0001",
    status: "shipped",
    customerName: "Juan Pérez",
    email: "juan@ejemplo.com",
    phone: "55 1234 5678",
    quantity: 100,
    material: "Holográfico",
    size: "5x5 cm",
    cutType: "Troquelado",
    totalAmount: "$75.00",
    orderDate: "2025-08-13",
    estimatedDelivery: "2025-08-18",
    trackingNumber: "MX123456789",
    carrier: "DHL",
    shippingAddress: {
      street: "Av. Insurgentes Sur 123",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: "01234",
      country: "México"
    },
    timeline: [
      { 
        status: "Pedido confirmado", 
        date: "2025-08-13 10:30", 
        description: "Tu pedido ha sido recibido y confirmado",
        completed: true 
      },
      { 
        status: "En producción", 
        date: "2025-08-13 14:00", 
        description: "Tus stickers están siendo impresos",
        completed: true 
      },
      { 
        status: "Control de calidad", 
        date: "2025-08-14 09:00", 
        description: "Verificando la calidad de impresión",
        completed: true 
      },
      { 
        status: "Cortando", 
        date: "2025-08-14 15:00", 
        description: "Aplicando el corte troquelado",
        completed: true 
      },
      { 
        status: "Enviado", 
        date: "2025-08-15 10:00", 
        description: "Tu pedido ha sido enviado con DHL",
        completed: true,
        current: true 
      },
      { 
        status: "En tránsito", 
        date: "Estimado: 2025-08-16", 
        description: "Tu paquete está en camino",
        completed: false 
      },
      { 
        status: "Entregado", 
        date: "Estimado: 2025-08-18", 
        description: "Tu pedido será entregado",
        completed: false 
      },
    ]
  }
};

const statusInfo = {
  pending: { label: "Pendiente", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: <ClockIcon className="w-5 h-5" /> },
  processing: { label: "Procesando", color: "text-blue-600", bgColor: "bg-blue-100", icon: <CubeIcon className="w-5 h-5" /> },
  printing: { label: "Imprimiendo", color: "text-purple-600", bgColor: "bg-purple-100", icon: <PrinterIcon className="w-5 h-5" /> },
  cutting: { label: "Cortando", color: "text-orange-600", bgColor: "bg-orange-100", icon: <ScissorsIcon className="w-5 h-5" /> },
  "quality-check": { label: "Control de calidad", color: "text-indigo-600", bgColor: "bg-indigo-100", icon: <ShieldCheckIcon className="w-5 h-5" /> },
  shipped: { label: "Enviado", color: "text-cyan-600", bgColor: "bg-cyan-100", icon: <TruckIcon className="w-5 h-5" /> },
  delivered: { label: "Entregado", color: "text-green-600", bgColor: "bg-green-100", icon: <CheckCircleIcon className="w-5 h-5" /> },
  cancelled: { label: "Cancelado", color: "text-red-600", bgColor: "bg-red-100", icon: <ClockIcon className="w-5 h-5" /> },
};

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError("Por favor ingresa un número de pedido");
      return;
    }

    setIsSearching(true);
    setError("");
    
    // Simular búsqueda en base de datos
    setTimeout(() => {
      const order = mockOrders[searchQuery.toUpperCase()];
      
      if (order) {
        setOrderData(order);
        setError("");
      } else {
        setOrderData(null);
        setError("No se encontró ningún pedido con ese número. Verifica e intenta de nuevo.");
      }
      
      setIsSearching(false);
    }, 1000);
  };

  const copyTrackingNumber = () => {
    if (orderData?.trackingNumber) {
      navigator.clipboard.writeText(orderData.trackingNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#275D5C]">
                Rastrear Pedido
              </h1>
              <p className="text-gray-600 mt-1">
                Ingresa tu número de pedido para ver el estado
              </p>
            </div>
            <Link
              href="/stickers/designer"
              className="flex items-center gap-2 px-6 py-3 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
            >
              Nuevo Pedido
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de pedido
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: STK-20250815-0001"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#275D5C] focus:outline-none text-lg"
                  />
                  <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  isSearching
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#275D5C] text-white hover:bg-[#3B7F7E]"
                }`}
              >
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Buscando...
                  </span>
                ) : (
                  "Buscar pedido"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                El número de pedido fue enviado a tu email al confirmar la compra
              </p>
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        <AnimatePresence>
          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status Header */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Número de pedido</p>
                        <p className="text-2xl font-bold text-[#275D5C]">
                          {orderData.orderNumber}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full ${statusInfo[orderData.status].bgColor}`}>
                        <span className={`flex items-center gap-2 font-semibold ${statusInfo[orderData.status].color}`}>
                          {statusInfo[orderData.status].icon}
                          {statusInfo[orderData.status].label}
                        </span>
                      </div>
                    </div>

                    {orderData.trackingNumber && (
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Número de guía ({orderData.carrier})</p>
                            <p className="font-mono font-semibold text-blue-600">
                              {orderData.trackingNumber}
                            </p>
                          </div>
                          <button
                            onClick={copyTrackingNumber}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Historial del pedido
                    </h2>
                    
                    <div className="relative">
                      <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6">
                        {orderData.timeline.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4"
                          >
                            <div
                              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                                step.completed
                                  ? step.current
                                    ? "bg-gradient-to-br from-[#275D5C] to-[#4FA09F] text-white animate-pulse"
                                    : "bg-[#275D5C] text-white"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircleIcon className="w-6 h-6" />
                              ) : (
                                <ClockIcon className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold ${
                                step.completed ? "text-gray-800" : "text-gray-500"
                              }`}>
                                {step.status}
                              </p>
                              <p className="text-sm text-gray-500">{step.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Dirección de entrega
                    </h2>
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-[#275D5C] mt-1" />
                      <div>
                        <p className="font-semibold text-gray-800">{orderData.customerName}</p>
                        <p className="text-gray-600">
                          {orderData.shippingAddress.street}
                        </p>
                        <p className="text-gray-600">
                          {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                        </p>
                        <p className="text-gray-600">
                          {orderData.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Detalles del pedido
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cantidad:</span>
                        <span className="font-semibold">{orderData.quantity} unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-semibold">{orderData.material}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tamaño:</span>
                        <span className="font-semibold">{orderData.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Corte:</span>
                        <span className="font-semibold">{orderData.cutType}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total pagado:</span>
                          <span className="text-xl font-bold text-[#275D5C]">
                            {orderData.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="bg-gradient-to-br from-[#275D5C] to-[#4FA09F] text-white rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">
                      Fechas importantes
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/80 text-sm">Fecha de pedido:</p>
                        <p className="font-semibold">
                          {new Date(orderData.orderDate).toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Entrega estimada:</p>
                        <p className="font-semibold">
                          {new Date(orderData.estimatedDelivery).toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Información de contacto
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{orderData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{orderData.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        ¿Necesitas ayuda? Contáctanos en soporte@estampanda.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example Order for Testing */}
        {!orderData && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-500 mb-4">
              Para probar, usa este número de pedido de ejemplo:
            </p>
            <button
              onClick={() => setSearchQuery("STK-20250815-0001")}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-mono hover:bg-gray-200 transition-colors"
            >
              STK-20250815-0001
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}