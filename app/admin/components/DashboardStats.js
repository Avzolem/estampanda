"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/**
 * Dashboard del admin con stats reales del sistema.
 * Consume /api/admin/dashboard.
 *
 * NOTA: la sección de "Pedidos" e "Ingresos" será implementada cuando
 * se complete el sub-proyecto #2 (Stripe checkout). Hoy mostramos las
 * stats que SÍ tenemos: designs subidos y carts activos.
 */
export default function DashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/dashboard")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-estampanda-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-semibold mb-1">No se pudieron cargar los datos</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const { designs, carts, recentDesigns } = data;

  const statCards = [
    {
      title: "Diseños subidos",
      value: designs.total,
      icon: "🖼️",
      color: "from-blue-500 to-blue-600",
      sub: `${designs.last24h} en últimas 24h · ${designs.lastWeek} en la semana`,
    },
    {
      title: "Carritos activos",
      value: carts.active,
      icon: "🛒",
      color: "from-emerald-500 to-emerald-600",
      sub: `${carts.empty} carritos vacíos en sesión`,
    },
    {
      title: "Stickers en carritos",
      value: carts.totalItems.toLocaleString(),
      icon: "📦",
      color: "from-amber-500 to-amber-600",
      sub: "Cantidad acumulada en items pendientes",
    },
    {
      title: "Valor potencial",
      value: `$${carts.totalValue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`,
      icon: "💰",
      color: "from-purple-500 to-purple-600",
      sub: "MXN. Suma de carritos sin pagar",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-estampanda-primary to-estampanda-secondary text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Resumen del sistema</h1>
        <p className="opacity-90">
          Estado en tiempo real. Pedidos pagados aparecerán cuando se complete
          el sub-proyecto Stripe.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-5 shadow-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{c.icon}</span>
            </div>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm opacity-90 mt-1">{c.title}</p>
            <p className="text-xs opacity-75 mt-2">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Insights row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Background-removal usage */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-sm text-gray-500 mb-1">Uso de &quot;Quitar fondo&quot;</p>
          <p className="text-3xl font-bold text-estampanda-primary mb-1">
            {designs.total
              ? Math.round((designs.withBgRemoved / designs.total) * 100)
              : 0}
            %
          </p>
          <p className="text-sm text-gray-600">
            {designs.withBgRemoved} de {designs.total} diseños procesados
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Modelo open-source en browser. Costo: $0
          </p>
        </div>

        {/* Conversion placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-sm text-gray-500 mb-1">Conversión a pedido</p>
          <p className="text-3xl font-bold text-gray-400 mb-1">—</p>
          <p className="text-sm text-gray-500">Pendiente de Stripe</p>
          <Link
            href="#"
            className="text-xs text-estampanda-primary underline-offset-4 hover:underline mt-3 inline-block"
          >
            Ver sub-proyecto #2 →
          </Link>
        </div>

        {/* System health */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-sm text-gray-500 mb-1">Cron de limpieza</p>
          <p className="text-3xl font-bold text-emerald-600 mb-1">Activo</p>
          <p className="text-sm text-gray-600">
            Diario 03:00 UTC · TTL 24h en carts
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Logs en Vercel → Functions
          </p>
        </div>
      </div>

      {/* Recent designs */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Diseños recientes
          </h2>
          <span className="text-xs text-gray-400">
            últimos {recentDesigns.length}
          </span>
        </div>

        {recentDesigns.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">
            Sin diseños subidos aún. Cuando un cliente suba algo, aparecerá aquí.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {recentDesigns.map((d) => (
              <div
                key={d.id}
                className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
                title={`${d.name} · sesión ${d.sessionPrefix ?? "—"}`}
              >
                {d.thumbnailUrl ? (
                  <Image
                    src={d.thumbnailUrl}
                    alt={d.name}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 640px) 50vw, 12vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                    ?
                  </div>
                )}
                {d.backgroundRemoved && (
                  <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    sin fondo
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
