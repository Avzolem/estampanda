"use client";

import apiClient from "@/libs/api";
import { useState, useEffect } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  TruckIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PrinterIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: stats } = await apiClient.get("/admin/dashboard");
        setStats(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock data para el dashboard
  const dashboardStats = [
    {
      title: "Ventas Totales",
      value: "$12,450",
      change: "+12.5%",
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "green",
    },
    {
      title: "Pedidos",
      value: "145",
      change: "+8.2%",
      trend: "up",
      icon: DocumentTextIcon,
      color: "blue",
    },
    {
      title: "Clientes",
      value: stats?.usersCount || "89",
      change: "+4.3%",
      trend: "up",
      icon: UserGroupIcon,
      color: "purple",
    },
    {
      title: "Envíos Pendientes",
      value: "12",
      change: "-2.1%",
      trend: "down",
      icon: TruckIcon,
      color: "yellow",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      orderNumber: "STK-20250815-0001",
      customer: "Juan Pérez",
      amount: "$850",
      status: "processing",
      time: "Hace 2 horas",
    },
    {
      id: 2,
      orderNumber: "STK-20250815-0002",
      customer: "María García",
      amount: "$650",
      status: "pending",
      time: "Hace 3 horas",
    },
    {
      id: 3,
      orderNumber: "STK-20250814-0003",
      customer: "Carlos López",
      amount: "$1,950",
      status: "shipped",
      time: "Ayer",
    },
  ];

  const topProducts = [
    { name: "Vinilo Brillante 5x5cm", sales: 45, revenue: "$3,825" },
    { name: "Holográfico 7x7cm", sales: 38, revenue: "$4,180" },
    { name: "Transparente 10x10cm", sales: 32, revenue: "$2,880" },
    { name: "Metálico 3x3cm", sales: 28, revenue: "$1,680" },
  ];

  const statusColors = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pendiente" },
    processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Procesando" },
    printing: { bg: "bg-purple-100", text: "text-purple-800", label: "Imprimiendo" },
    shipped: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Enviado" },
    delivered: { bg: "bg-green-100", text: "text-green-800", label: "Entregado" },
  };

  const quickActions = [
    {
      title: "Ver Pedidos",
      description: "Gestionar todos los pedidos",
      icon: ClockIcon,
      href: "/admin/orders",
      color: "bg-[#275D5C]",
    },
    {
      title: "Clientes",
      description: "Administrar clientes",
      icon: UserGroupIcon,
      href: "/admin/dashboard/users",
      color: "bg-[#4FA09F]",
    },
    {
      title: "Materiales",
      description: "Configurar materiales",
      icon: SparklesIcon,
      href: "/admin/materials",
      color: "bg-[#3B7F7E]",
    },
    {
      title: "Analytics",
      description: "Ver análisis detallado",
      icon: ChartBarIcon,
      href: "/admin/analytics",
      color: "bg-[#275D5C]",
    },
  ];

  // Datos para el gráfico (mock)
  const chartData = {
    week: [
      { day: 'Lun', ventas: 1200 },
      { day: 'Mar', ventas: 1900 },
      { day: 'Mié', ventas: 1500 },
      { day: 'Jue', ventas: 2800 },
      { day: 'Vie', ventas: 2200 },
      { day: 'Sáb', ventas: 3100 },
      { day: 'Dom', ventas: 1650 },
    ],
    month: [
      { day: 'Semana 1', ventas: 8500 },
      { day: 'Semana 2', ventas: 12000 },
      { day: 'Semana 3', ventas: 10500 },
      { day: 'Semana 4', ventas: 14200 },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingCircle />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Estampanda
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido al panel de administración
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {new Date().toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="block p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 ${action.color} rounded-lg text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
            const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Resumen de Ventas</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    period === 'week'
                      ? 'bg-[#275D5C] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    period === 'month'
                      ? 'bg-[#275D5C] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Mes
                </button>
              </div>
            </div>
            
            {/* Simple bar chart visualization */}
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData[period].map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.ventas / 3500) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-[#275D5C] to-[#4FA09F] rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      ${item.ventas}
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600">{item.day}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total del período</p>
                <p className="text-2xl font-bold text-[#275D5C]">$14,250</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Promedio diario</p>
                <p className="text-2xl font-bold text-gray-800">$2,035</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Productos Top</h2>
              <SparklesIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F5E6D3] rounded-lg flex items-center justify-center text-sm font-bold text-[#275D5C]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} ventas
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {product.revenue}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pedidos Recientes</h2>
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-[#275D5C] hover:text-[#3B7F7E] flex items-center gap-1"
              >
                Ver todos
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {order.customer}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {order.amount}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                        statusColors[order.status].bg
                      } ${
                        statusColors[order.status].text
                      }`}>
                        {statusColors[order.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {order.time}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
