"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MaterialsManager() {
  const [materials, setMaterials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      const data = await res.json();
      setMaterials(data.materials || mockMaterials);
      setLoading(false);
    } catch (error) {
      setMaterials(mockMaterials);
      setLoading(false);
    }
  };

  const handleSaveMaterial = async (materialData) => {
    try {
      if (editingMaterial) {
        // Update existing
        await fetch(`/api/materials/${editingMaterial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(materialData)
        });
        setMaterials(materials.map(m => 
          m.id === editingMaterial.id ? { ...m, ...materialData } : m
        ));
      } else {
        // Create new
        const newMaterial = {
          id: `MAT-${Date.now()}`,
          ...materialData,
          createdAt: new Date().toISOString()
        };
        setMaterials([...materials, newMaterial]);
      }
      
      setShowAddModal(false);
      setEditingMaterial(null);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (confirm("¿Estás seguro de eliminar este material?")) {
      try {
        await fetch(`/api/materials/${materialId}`, { method: "DELETE" });
        setMaterials(materials.filter(m => m.id !== materialId));
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-spin">🎨</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-estampanda-dark">Gestión de Materiales</h2>
            <p className="text-gray-600 mt-1">Administra los tipos de materiales disponibles para los stickers</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors font-medium"
          >
            ➕ Añadir Material
          </motion.button>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Material Image */}
            <div className="h-48 bg-gradient-to-br from-estampanda-cream to-estampanda-light flex items-center justify-center">
              {material.image ? (
                <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-6xl">{material.icon || "🎨"}</div>
              )}
            </div>

            {/* Material Info */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-estampanda-dark">{material.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{material.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  material.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {material.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{material.description}</p>

              {/* Properties */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Precio base:</span>
                  <span className="font-semibold text-estampanda-primary">${material.basePrice}/unidad</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Durabilidad:</span>
                  <span className="font-medium">{material.durability}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock:</span>
                  <span className={`font-medium ${material.stock < 100 ? "text-red-600" : "text-green-600"}`}>
                    {material.stock} unidades
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingMaterial(material);
                    setShowAddModal(true);
                  }}
                  className="flex-1 px-3 py-2 bg-estampanda-cream text-estampanda-dark rounded-lg hover:bg-estampanda-cream-dark transition-colors text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <MaterialModal
            material={editingMaterial}
            onSave={handleSaveMaterial}
            onClose={() => {
              setShowAddModal(false);
              setEditingMaterial(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MaterialModal({ material, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: material?.name || "",
    category: material?.category || "Estándar",
    description: material?.description || "",
    basePrice: material?.basePrice || 0.50,
    durability: material?.durability || "Alta",
    stock: material?.stock || 1000,
    active: material?.active ?? true,
    icon: material?.icon || "✨",
    features: material?.features || []
  });

  const categories = ["Estándar", "Premium", "Ecológico", "Especial"];
  const durabilities = ["Baja", "Media", "Alta", "Muy Alta"];
  const availableIcons = ["✨", "🌟", "💎", "🎨", "🌈", "⚡", "💪", "🌱"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-estampanda-dark">
              {material ? "Editar Material" : "Nuevo Material"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Material
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                rows="3"
                required
              />
            </div>

            {/* Price, Durability, Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durabilidad
                </label>
                <select
                  value={formData.durability}
                  onChange={(e) => setFormData({...formData, durability: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                >
                  {durabilities.map(dur => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Inicial
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono
              </label>
              <div className="flex gap-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({...formData, icon})}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === icon 
                        ? "border-estampanda-primary bg-estampanda-cream" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="w-5 h-5 text-estampanda-primary rounded focus:ring-estampanda-accent"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                Material activo (visible para clientes)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors"
            >
              {material ? "Guardar Cambios" : "Crear Material"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Mock data
const mockMaterials = [
  {
    id: "MAT-001",
    name: "Vinilo Mate",
    category: "Estándar",
    description: "Material resistente al agua con acabado mate elegante",
    basePrice: 0.45,
    durability: "Alta",
    stock: 500,
    active: true,
    icon: "✨",
    createdAt: new Date().toISOString()
  },
  {
    id: "MAT-002",
    name: "Holográfico Premium",
    category: "Premium",
    description: "Material con efecto holográfico y brillo especial",
    basePrice: 0.75,
    durability: "Muy Alta",
    stock: 200,
    active: true,
    icon: "🌈",
    createdAt: new Date().toISOString()
  },
  {
    id: "MAT-003",
    name: "Transparente",
    category: "Especial",
    description: "Material transparente ideal para superficies de vidrio",
    basePrice: 0.60,
    durability: "Media",
    stock: 350,
    active: true,
    icon: "💎",
    createdAt: new Date().toISOString()
  }
];