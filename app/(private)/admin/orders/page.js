"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Status configuration
const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: ClockIcon, label: "Pendiente" },
  processing: { bg: "bg-blue-100", text: "text-blue-800", icon: ClockIcon, label: "Procesando" },
  printing: { bg: "bg-purple-100", text: "text-purple-800", icon: PrinterIcon, label: "Imprimiendo" },
  cutting: { bg: "bg-orange-100", text: "text-orange-800", icon: DocumentTextIcon, label: "Cortando" },
  "quality-check": { bg: "bg-cyan-100", text: "text-cyan-800", icon: CheckCircleIcon, label: "Control Calidad" },
  shipped: { bg: "bg-indigo-100", text: "text-indigo-800", icon: TruckIcon, label: "Enviado" },
  delivered: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircleIcon, label: "Entregado" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircleIcon, label: "Cancelado" },
};

// Mock data para demostración (se eliminará cuando conectemos con API)
const mockOrders = [
  {
    id: 1,
    orderNumber: "STK-20250815-0001",
    customer: {
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "55 1234 5678",
    },
    items: {
      material: "Vinilo Brillante",
      size: "5x5 cm",
      quantity: 100,
      cutType: "Troquelado",
    },
    total: 850,
    status: "processing",
    createdAt: "2025-08-15T10:30:00",
    estimatedDelivery: "2025-08-20T10:30:00",
    designUrl: "/api/placeholder/200/200",
    notes: "Urgente para evento",
  },
  {
    id: 2,
    orderNumber: "STK-20250815-0002",
    customer: {
      name: "María García",
      email: "maria@example.com",
      phone: "55 9876 5432",
    },
    items: {
      material: "Vinilo Mate",
      size: "10x10 cm",
      quantity: 50,
      cutType: "Cuadrado",
    },
    total: 650,
    status: "pending",
    createdAt: "2025-08-15T09:15:00",
    estimatedDelivery: "2025-08-21T10:30:00",
    designUrl: "/api/placeholder/200/200",
  },
  {
    id: 3,
    orderNumber: "STK-20250814-0003",
    customer: {
      name: "Carlos López",
      email: "carlos@example.com",
      phone: "55 5555 5555",
    },
    items: {
      material: "Holográfico",
      size: "7x7 cm",
      quantity: 200,
      cutType: "Redondo",
    },
    total: 1950,
    status: "shipped",
    createdAt: "2025-08-14T14:20:00",
    estimatedDelivery: "2025-08-19T10:30:00",
    designUrl: "/api/placeholder/200/200",
    trackingNumber: "MX123456789",
  },
  {
    id: 4,
    orderNumber: "STK-20250814-0004",
    customer: {
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "55 3333 3333",
    },
    items: {
      material: "Transparente",
      size: "15x15 cm",
      quantity: 25,
      cutType: "Personalizado",
    },
    total: 475,
    status: "delivered",
    createdAt: "2025-08-14T08:45:00",
    estimatedDelivery: "2025-08-18T10:30:00",
    designUrl: "/api/placeholder/200/200",
    deliveredAt: "2025-08-18T15:30:00",
  },
  {
    id: 5,
    orderNumber: "STK-20250813-0005",
    customer: {
      name: "Luis Rodríguez",
      email: "luis@example.com",
      phone: "55 7777 7777",
    },
    items: {
      material: "Metálico",
      size: "3x3 cm",
      quantity: 500,
      cutType: "Cuadrado",
    },
    total: 2250,
    status: "printing",
    createdAt: "2025-08-13T16:00:00",
    estimatedDelivery: "2025-08-22T10:30:00",
    designUrl: "/api/placeholder/200/200",
  },
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const ordersPerPage = 10;

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        status: statusFilter,
        search: searchTerm,
        admin: 'true',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Error fetching orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
      // Use mock data as fallback
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  // Fetch orders on component mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, statusNote = '') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusNote })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Estado actualizado a ${statusColors[newStatus].label}`);
        fetchOrders(); // Refresh the list
      } else {
        throw new Error(data.error || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update multiple orders
  const updateMultipleOrders = async (newStatus) => {
    if (selectedOrders.length === 0) {
      toast.error('Selecciona al menos un pedido');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrders,
          updates: { status: newStatus }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`${data.modifiedCount} pedidos actualizados`);
        setSelectedOrders([]);
        fetchOrders();
      } else {
        throw new Error(data.error || 'Error updating orders');
      }
    } catch (error) {
      console.error('Error updating orders:', error);
      toast.error('Error al actualizar pedidos');
    } finally {
      setIsUpdating(false);
    }
  };
  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = orders.map(order => ({
      "Número de Pedido": order.orderNumber,
      "Cliente": order.userId?.name || order.shippingAddress?.fullName || "N/A",
      "Email": order.userId?.email || "N/A",
      "Teléfono": order.shippingAddress?.phone || "N/A",
      "Material": order.material,
      "Tamaño": `${order.size?.width}x${order.size?.height} ${order.size?.unit || 'cm'}`,
      "Cantidad": order.quantity,
      "Tipo de Corte": order.cutType,
      "Total": `$${order.totalPrice}`,
      "Estado": statusColors[order.status]?.label || order.status,
      "Fecha": new Date(order.createdAt).toLocaleDateString('es-MX'),
      "Entrega Estimada": order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('es-MX') : "N/A",
      "Notas": order.notes || "",
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => 
        headers.map(header => 
          `"${row[header] || ''}"`
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Pedidos exportados exitosamente");
  };


  const selectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Administra y da seguimiento a todos los pedidos
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#275D5C] text-white rounded-lg hover:bg-[#3B7F7E] transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Pedidos</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
              </div>
              <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pendientes</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              </div>
              <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">En Proceso</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats?.monthOrders || 0}</p>
              </div>
              <PrinterIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Pedidos</p>
                <p className="text-lg sm:text-2xl font-bold text-indigo-600">{stats?.totalOrders || 0}</p>
              </div>
              <TruckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Ingresos</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <CurrencyDollarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C]"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C]"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="printing">Imprimiendo</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C]"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={selectAllOrders}
                      className="w-4 h-4 text-[#275D5C] rounded focus:ring-[#275D5C]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <ArrowPathIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin" />
                      </div>
                      <p className="mt-2 text-gray-500">Cargando pedidos...</p>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron pedidos
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const StatusIcon = statusColors[order.status]?.icon || ClockIcon;
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleOrderSelection(order._id)}
                            className="w-4 h-4 text-[#275D5C] rounded focus:ring-[#275D5C]"
                            disabled={isUpdating}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.designThumbnail || order.designUrl || "/api/placeholder/200/200"}
                              alt="Diseño"
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {order.orderNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.quantity} unidades
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.userId?.name || order.shippingAddress?.fullName || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.userId?.email || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {order.material}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.size?.width}x{order.size?.height} {order.size?.unit || 'cm'} • {order.cutType}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            ${order.totalPrice}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              disabled={isUpdating}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                statusColors[order.status]?.bg || 'bg-gray-100'
                              } ${
                                statusColors[order.status]?.text || 'text-gray-800'
                              } border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#275D5C] disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="processing">Procesando</option>
                              <option value="printing">Imprimiendo</option>
                              <option value="cutting">Cortando</option>
                              <option value="quality-check">Control Calidad</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </div>
                        </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('es-MX')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString('es-MX', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowOrderDetails(order)}
                            className="p-1 text-gray-600 hover:text-[#275D5C] transition-colors"
                            title="Ver detalles"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Enviar email"
                          >
                            <EnvelopeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                            title="Imprimir"
                          >
                            <PrinterIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * ordersPerPage, stats?.totalOrders || orders.length)}
                </span>{" "}
                de <span className="font-medium">{stats?.totalOrders || orders.length}</span> pedidos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1.5 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-[#275D5C] text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Detalles del Pedido
                </h2>
                <button
                  onClick={() => setShowOrderDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Información del Pedido</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Número de pedido</p>
                    <p className="font-semibold">{showOrderDetails.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Estado</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${statusColors[showOrderDetails.status].bg} ${statusColors[showOrderDetails.status].text}`}>
                      {React.createElement(statusColors[showOrderDetails.status].icon, { className: "w-4 h-4" })}
                      {statusColors[showOrderDetails.status].label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Fecha de pedido</p>
                    <p className="font-semibold">
                      {new Date(showOrderDetails.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Entrega estimada</p>
                    <p className="font-semibold">
                      {new Date(showOrderDetails.estimatedDelivery).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Nombre</p>
                    <p className="font-semibold">{showOrderDetails.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{showOrderDetails.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Teléfono</p>
                    <p className="font-semibold">{showOrderDetails.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Detalles del Producto</h3>
                <div className="flex gap-4">
                  <img
                    src={showOrderDetails.designUrl}
                    alt="Diseño"
                    className="w-32 h-32 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Material</p>
                      <p className="font-semibold">{showOrderDetails.items.material}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Tamaño</p>
                      <p className="font-semibold">{showOrderDetails.items.size}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Cantidad</p>
                      <p className="font-semibold">{showOrderDetails.items.quantity} unidades</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Tipo de corte</p>
                      <p className="font-semibold">{showOrderDetails.items.cutType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {showOrderDetails.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Notas</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {showOrderDetails.notes}
                  </p>
                </div>
              )}

              {/* Tracking */}
              {showOrderDetails.trackingNumber && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Información de Envío</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">Número de rastreo</p>
                    <p className="font-semibold text-blue-900">{showOrderDetails.trackingNumber}</p>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-[#275D5C]">
                    ${showOrderDetails.total}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}