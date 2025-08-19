"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Componentes modulares del dashboard
import OrdersManager from "./components/OrdersManager";
import MaterialsManager from "./components/MaterialsManager";
import GalleryManager from "./components/GalleryManager";
import ProductsManager from "./components/ProductsManager";
import DashboardStats from "./components/DashboardStats";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "orders", label: "Pedidos", icon: "📦" },
    { id: "products", label: "Productos", icon: "🏷️" },
    { id: "materials", label: "Materiales", icon: "🎨" },
    { id: "gallery", label: "Galería", icon: "🖼️" },
    { id: "settings", label: "Configuración", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-estampanda-light flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-estampanda-light">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 bg-gradient-to-br from-estampanda-primary to-estampanda-secondary">
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-white">ESTAMPANDA</h1>
              <p className="text-estampanda-cream text-sm mt-1">Panel Admin</p>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-estampanda-primary text-white shadow-lg"
                    : "hover:bg-estampanda-cream text-estampanda-dark"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-medium"
            >
              Cerrar Sesión
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-estampanda-dark">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="w-10 h-10 bg-estampanda-primary rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "dashboard" && <DashboardStats />}
              {activeTab === "orders" && <OrdersManager />}
              {activeTab === "products" && <ProductsManager />}
              {activeTab === "materials" && <MaterialsManager />}
              {activeTab === "gallery" && <GalleryManager />}
              {activeTab === "settings" && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Settings Panel Component
function SettingsPanel() {
  const [settings, setSettings] = useState({
    siteName: "Estampanda",
    currency: "MXN",
    shippingFree: true,
    minOrder: 0,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-estampanda-dark mb-6">Configuración General</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
            >
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Envío Gratis
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.shippingFree}
                onChange={(e) => setSettings({...settings, shippingFree: e.target.checked})}
                className="w-5 h-5 text-estampanda-primary rounded focus:ring-estampanda-accent"
              />
              <span className="ml-2 text-sm text-gray-600">Activar envío gratuito</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pedido Mínimo
            </label>
            <input
              type="number"
              value={settings.minOrder}
              onChange={(e) => setSettings({...settings, minOrder: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors"
          >
            Guardar Cambios
          </motion.button>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-estampanda-dark mb-6">Estado de Integraciones</h3>
        
        <div className="space-y-4">
          <IntegrationItem 
            name="Cloudinary" 
            status="active" 
            description="Gestión de imágenes y uploads"
          />
          <IntegrationItem 
            name="Stripe" 
            status="pending" 
            description="Procesamiento de pagos"
          />
          <IntegrationItem 
            name="MongoDB" 
            status="active" 
            description="Base de datos"
          />
          <IntegrationItem 
            name="Resend" 
            status="pending" 
            description="Servicio de emails"
          />
        </div>
      </div>
    </div>
  );
}

function IntegrationItem({ name, status, description }) {
  const statusColors = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700"
  };

  const statusLabels = {
    active: "Activo",
    pending: "Pendiente",
    error: "Error"
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-semibold text-estampanda-dark">{name}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
}