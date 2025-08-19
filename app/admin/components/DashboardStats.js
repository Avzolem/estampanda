"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalOrders: 45,
    pendingOrders: 8,
    totalRevenue: 15420,
    totalCustomers: 32,
    todayOrders: 5,
    weeklyGrowth: 12.5,
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: "ORD-045", customer: "María López", amount: 299, status: "pending", time: "Hace 10 min" },
    { id: "ORD-044", customer: "Juan Pérez", amount: 450, status: "processing", time: "Hace 1 hora" },
    { id: "ORD-043", customer: "Ana García", amount: 189, status: "completed", time: "Hace 2 horas" },
  ]);

  const statCards = [
    { 
      title: "Pedidos Totales", 
      value: stats.totalOrders, 
      icon: "📦", 
      color: "from-blue-500 to-blue-600",
      change: "+12%"
    },
    { 
      title: "Pedidos Pendientes", 
      value: stats.pendingOrders, 
      icon: "⏳", 
      color: "from-yellow-500 to-yellow-600",
      change: "-3"
    },
    { 
      title: "Ingresos Totales", 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: "💰", 
      color: "from-green-500 to-green-600",
      change: "+18%"
    },
    { 
      title: "Clientes", 
      value: stats.totalCustomers, 
      icon: "👥", 
      color: "from-purple-500 to-purple-600",
      change: "+5"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-estampanda-primary to-estampanda-secondary text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
        <p className="opacity-90">Aquí está el resumen de tu negocio hoy</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-estampanda-dark">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-estampanda-dark mb-4">Ventas del Mes</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-3">📈</div>
              <p className="text-gray-500">Gráfico de ventas</p>
              <p className="text-sm text-gray-400 mt-2">Conectar con Chart.js para visualización real</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-estampanda-dark mb-4">Pedidos Recientes</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-estampanda-dark">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer} • {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-estampanda-primary">${order.amount}</p>
                  <StatusBadge status={order.status} />
                </div>
              </motion.div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 text-estampanda-primary hover:bg-estampanda-cream rounded-lg transition-colors text-sm font-medium">
            Ver todos los pedidos →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-estampanda-dark mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="➕" label="Nuevo Producto" color="bg-blue-100 text-blue-600" />
          <QuickAction icon="🎨" label="Añadir Material" color="bg-green-100 text-green-600" />
          <QuickAction icon="📸" label="Subir a Galería" color="bg-purple-100 text-purple-600" />
          <QuickAction icon="📊" label="Exportar Datos" color="bg-orange-100 text-orange-600" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const labels = {
    pending: "Pendiente",
    processing: "Procesando",
    completed: "Completado",
    cancelled: "Cancelado",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function QuickAction({ icon, label, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-4 rounded-xl ${color} transition-all`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </motion.button>
  );
}