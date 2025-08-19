"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PlusIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalSpent: 0,
    totalDesigns: 0,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user orders
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
        
        // Calculate stats
        const active = ordersData.orders?.filter(o => 
          !['delivered', 'cancelled'].includes(o.status)
        ).length || 0;
        
        const spent = ordersData.orders?.reduce((sum, o) => 
          sum + (o.totalPrice || 0), 0
        ) || 0;
        
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.orders?.length || 0,
          activeOrders: active,
          totalSpent: spent,
        }));
      }

      // Fetch user designs
      const designsRes = await fetch("/api/upload/design");
      const designsData = await designsRes.json();
      
      if (designsData.success) {
        setDesigns(designsData.designs || []);
        setStats(prev => ({
          ...prev,
          totalDesigns: designsData.designs?.length || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: ClockIcon, label: "Pendiente" },
    processing: { bg: "bg-blue-100", text: "text-blue-800", icon: ClockIcon, label: "Procesando" },
    shipped: { bg: "bg-indigo-100", text: "text-indigo-800", icon: TruckIcon, label: "Enviado" },
    delivered: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircleIcon, label: "Entregado" },
    cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelado" },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#275D5C]">
                Mi Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {session?.user?.name || "Usuario"}
              </p>
            </div>
            <ButtonAccount />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-[#275D5C]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Activos</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.activeOrders}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mis Diseños</p>
                <p className="text-2xl font-bold text-[#4FA09F]">{stats.totalDesigns}</p>
              </div>
              <PhotoIcon className="w-8 h-8 text-[#4FA09F]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gastado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalSpent.toLocaleString()}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/stickers/designer"
            className="bg-gradient-to-r from-[#275D5C] to-[#4FA09F] rounded-xl p-6 text-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Crear Nuevo Sticker</h3>
                <p className="text-white/90 text-sm">
                  Diseña y personaliza tus propios stickers
                </p>
              </div>
              <PlusIcon className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            href="/stickers/gallery"
            className="bg-white border-2 border-[#275D5C] rounded-xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#275D5C] mb-2">Mi Galería</h3>
                <p className="text-gray-600 text-sm">
                  Ver y gestionar todos tus diseños
                </p>
              </div>
              <PhotoIcon className="w-10 h-10 text-[#275D5C] group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            href="/stickers/tracking"
            className="bg-[#F5E6D3] rounded-xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#275D5C] mb-2">Rastrear Pedido</h3>
                <p className="text-gray-700 text-sm">
                  Sigue el estado de tus pedidos
                </p>
              </div>
              <TruckIcon className="w-10 h-10 text-[#275D5C] group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pedidos Recientes</h2>
              <Link
                href="/orders"
                className="text-sm text-[#275D5C] hover:text-[#3B7F7E] font-medium"
              >
                Ver todos →
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#275D5C] mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando pedidos...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.quantity} stickers
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('es-MX')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                          statusColors[order.status]?.bg || 'bg-gray-100'
                        } ${
                          statusColors[order.status]?.text || 'text-gray-800'
                        }`}>
                          {statusColors[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          ${order.totalPrice}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/orders/${order._id}`}
                          className="text-sm text-[#275D5C] hover:text-[#3B7F7E] font-medium"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes pedidos aún
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza creando tu primer diseño de sticker
              </p>
              <Link
                href="/stickers/designer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Crear mi primer sticker
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}