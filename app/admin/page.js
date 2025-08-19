"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Simular carga de datos
    setOrders([
      {
        id: "ORD-001",
        customer: "Juan Pérez",
        email: "juan@example.com",
        product: "Stickers Personalizados 5x5cm",
        quantity: 100,
        total: 45.99,
        status: "pending",
        date: "2025-08-19",
        image: "/images/sticker-1.png"
      },
      {
        id: "ORD-002",
        customer: "María García",
        email: "maria@example.com",
        product: "Stickers Holográficos 7x7cm",
        quantity: 50,
        total: 35.50,
        status: "processing",
        date: "2025-08-19",
        image: "/images/sticker-2.png"
      },
      {
        id: "ORD-003",
        customer: "Carlos López",
        email: "carlos@example.com",
        product: "Stickers Mate 10x10cm",
        quantity: 200,
        total: 89.99,
        status: "completed",
        date: "2025-08-18",
        image: "/images/sticker-3.png"
      }
    ]);

    setStats({
      totalOrders: 3,
      pendingOrders: 1,
      completedOrders: 1,
      totalRevenue: 171.48
    });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const exportToCSV = () => {
    const csv = [
      ["ID", "Cliente", "Email", "Producto", "Cantidad", "Total", "Estado", "Fecha"],
      ...orders.map(order => [
        order.id,
        order.customer,
        order.email,
        order.product,
        order.quantity,
        order.total,
        order.status,
        order.date
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      processing: "badge-info",
      completed: "badge-success",
      cancelled: "badge-error"
    };
    return badges[status] || "badge-ghost";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pendiente",
      processing: "Procesando",
      completed: "Completado",
      cancelled: "Cancelado"
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary px-4">ESTAMPANDA ADMIN</h1>
        </div>
        <div className="flex-none">
          <button onClick={handleLogout} className="btn btn-ghost">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Total Pedidos</div>
            <div className="stat-value text-primary">{stats.totalOrders}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Pendientes</div>
            <div className="stat-value text-warning">{stats.pendingOrders}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Completados</div>
            <div className="stat-value text-success">{stats.completedOrders}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Ingresos</div>
            <div className="stat-value text-info">${stats.totalRevenue}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <a 
            className={`tab ${activeTab === "orders" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Pedidos
          </a>
          <a 
            className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Productos
          </a>
          <a 
            className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Configuración
          </a>
        </div>

        {/* Content */}
        {activeTab === "orders" && (
          <div className="bg-base-100 rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">Gestión de Pedidos</h2>
              <button onClick={exportToCSV} className="btn btn-sm btn-primary">
                Exportar CSV
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono">{order.id}</td>
                      <td>
                        <div>
                          <div className="font-bold">{order.customer}</div>
                          <div className="text-sm opacity-50">{order.email}</div>
                        </div>
                      </td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td className="font-bold">${order.total}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <select 
                          className="select select-sm select-bordered"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="completed">Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title text-sm">{order.id}</h3>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-bold">Cliente:</span> {order.customer}</p>
                      <p><span className="font-bold">Email:</span> {order.email}</p>
                      <p><span className="font-bold">Producto:</span> {order.product}</p>
                      <p><span className="font-bold">Cantidad:</span> {order.quantity}</p>
                      <p><span className="font-bold">Total:</span> ${order.total}</p>
                      <p><span className="font-bold">Fecha:</span> {order.date}</p>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <select 
                        className="select select-sm select-bordered w-full"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
            <p className="text-base-content/60">Próximamente: configuración de productos y precios</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Configuración</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Integraciones</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-base-200 rounded">
                    <span>Cloudinary</span>
                    <span className="badge badge-success">Configurado</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-200 rounded">
                    <span>Stripe</span>
                    <span className="badge badge-warning">Pendiente</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-200 rounded">
                    <span>MongoDB</span>
                    <span className="badge badge-error">No conectado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}