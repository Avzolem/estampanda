"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || mockOrders);
      setLoading(false);
    } catch (error) {
      // Usar datos mock si falla la API
      setOrders(mockOrders);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (filter !== "all") {
      filtered = filtered.filter(order => order.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Cliente", "Email", "Teléfono", "Producto", "Cantidad", "Total", "Estado", "Fecha"];
    const rows = filteredOrders.map(order => [
      order.id,
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.items[0]?.name || "N/A",
      order.items[0]?.quantity || 0,
      order.total,
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-spin">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
          <h2 className="text-xl font-bold text-estampanda-dark">Gestión de Pedidos</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors"
            >
              📥 Exportar CSV
            </button>
            <button className="px-4 py-2 bg-estampanda-cream text-estampanda-dark rounded-lg hover:bg-estampanda-cream-dark transition-colors">
              🖨️ Imprimir
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por ID, cliente o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
          
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Total: {filteredOrders.length} pedidos</span>
          </div>
        </div>
      </div>

      {/* Orders Table/Cards */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-estampanda-cream">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item, idx) => (
                        <p key={idx}>{item.quantity}x {item.name}</p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-estampanda-primary">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-estampanda-primary hover:text-estampanda-secondary mr-3"
                    >
                      Ver
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-estampanda-dark">{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="space-y-2 mb-3">
                <p className="text-sm"><span className="font-medium">Cliente:</span> {order.customer.name}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {order.customer.email}</p>
                <p className="text-sm"><span className="font-medium">Total:</span> <span className="font-bold text-estampanda-primary">${order.total}</span></p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 px-3 py-2 bg-estampanda-cream text-estampanda-dark rounded-lg text-sm font-medium"
                >
                  Ver Detalles
                </button>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={updateOrderStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const labels = {
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-estampanda-dark">Pedido {order.id}</h3>
              <p className="text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-estampanda-cream/30 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-estampanda-dark mb-3">Información del Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><span className="font-medium">Nombre:</span> {order.customer.name}</p>
              <p><span className="font-medium">Email:</span> {order.customer.email}</p>
              <p><span className="font-medium">Teléfono:</span> {order.customer.phone}</p>
              <p><span className="font-medium">Dirección:</span> {order.customer.address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-estampanda-dark mb-3">Productos</h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} unidades</p>
                  </div>
                  <p className="font-bold text-estampanda-primary">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total and Status */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">Total:</p>
              <p className="text-2xl font-bold text-estampanda-primary">${order.total}</p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="pending">Pendiente</option>
                <option value="processing">Procesando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregado</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mock data para pruebas
const mockOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "María López",
      email: "maria@example.com",
      phone: "+52 555 123 4567",
      address: "Calle Principal 123, CDMX"
    },
    items: [
      { name: "Stickers Holográficos 5x5cm", quantity: 100, price: 0.45 }
    ],
    total: 45.00,
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "ORD-002",
    customer: {
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+52 555 987 6543",
      address: "Av. Reforma 456, CDMX"
    },
    items: [
      { name: "Stickers Mate 7x7cm", quantity: 50, price: 0.60 },
      { name: "Stickers Transparentes 3x3cm", quantity: 200, price: 0.25 }
    ],
    total: 80.00,
    status: "processing",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];