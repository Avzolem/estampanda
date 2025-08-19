"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-estampanda-light p-4">
      {/* Stickers decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          🌟
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-10 text-6xl opacity-20"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-40 right-20 text-5xl opacity-20"
        >
          🎨
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-br from-estampanda-primary to-estampanda-accent p-8 text-white">
            <Link href="/" className="inline-block mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-4xl font-bold"
              >
                ESTAMPANDA
              </motion.div>
            </Link>
            <p className="text-estampanda-cream opacity-90">Panel de Administración</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-estampanda-dark mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-estampanda-accent focus:ring-2 focus:ring-estampanda-accent/20 transition-all"
                placeholder="Ingresa tu usuario"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-estampanda-dark mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-estampanda-accent focus:ring-2 focus:ring-estampanda-accent/20 transition-all"
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full py-3.5 px-6 bg-gradient-to-r from-estampanda-primary to-estampanda-secondary text-white font-semibold rounded-xl transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </motion.button>
          </form>

        </div>

        {/* Link de regreso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link 
            href="/" 
            className="text-estampanda-primary hover:text-estampanda-secondary transition-colors text-sm"
          >
            ← Volver al sitio principal
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}