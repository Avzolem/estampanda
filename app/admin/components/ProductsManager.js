"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || mockProducts);
      setLoading(false);
    } catch (error) {
      setProducts(mockProducts);
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
      } else {
        const newProduct = {
          id: `PROD-${Date.now()}`,
          ...productData,
          createdAt: new Date().toISOString()
        };
        setProducts([...products, newProduct]);
      }
      
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await fetch(`/api/products/${productId}`, { method: "DELETE" });
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const toggleProductStatus = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStatus = !product.active;
      try {
        await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: newStatus })
        });
        setProducts(products.map(p => 
          p.id === productId ? { ...p, active: newStatus } : p
        ));
      } catch (error) {
        console.error("Error updating product status:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-spin">🏷️</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-estampanda-dark">Gestión de Productos</h2>
            <p className="text-gray-600 mt-1">Administra los productos y sus configuraciones</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors font-medium"
          >
            ➕ Nuevo Producto
          </motion.button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Product Image */}
            <div className="h-48 bg-gradient-to-br from-estampanda-cream to-estampanda-light relative">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-6xl">📦</span>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.active}
                    onChange={() => toggleProductStatus(product.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Sale Badge */}
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-estampanda-dark">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              {/* Pricing */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  {product.discount > 0 ? (
                    <>
                      <span className="text-xl font-bold text-estampanda-primary">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-estampanda-primary">
                      ${product.price}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">/{product.unit}</span>
              </div>

              {/* Stock Info */}
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500">Stock:</span>
                <span className={`font-medium ${product.stock < 100 ? "text-red-600" : "text-green-600"}`}>
                  {product.stock} unidades
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowAddModal(true);
                  }}
                  className="flex-1 px-3 py-2 bg-estampanda-cream text-estampanda-dark rounded-lg hover:bg-estampanda-cream-dark transition-colors text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
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
          <ProductModal
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => {
              setShowAddModal(false);
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "Stickers",
    description: product?.description || "",
    price: product?.price || 0,
    discount: product?.discount || 0,
    unit: product?.unit || "unidad",
    stock: product?.stock || 1000,
    minOrder: product?.minOrder || 1,
    maxOrder: product?.maxOrder || 10000,
    active: product?.active ?? true,
    materials: product?.materials || [],
    sizes: product?.sizes || [],
    features: product?.features || []
  });

  const categories = ["Stickers", "Etiquetas", "Calcomanías", "Vinilos", "Especiales"];
  const units = ["unidad", "paquete", "hoja", "metro"];
  const availableMaterials = ["Vinilo", "Papel", "Transparente", "Holográfico", "Mate", "Brillante"];
  const availableSizes = ["3x3cm", "5x5cm", "7x7cm", "10x10cm", "Personalizado"];

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
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-estampanda-dark">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="font-semibold text-estampanda-dark mb-3">Información Básica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto
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
              
              <div className="mt-4">
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
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-semibold text-estampanda-dark mb-3">Precios y Stock</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
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
            </div>

            {/* Order Limits */}
            <div>
              <h4 className="font-semibold text-estampanda-dark mb-3">Límites de Pedido</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pedido Mínimo
                  </label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({...formData, minOrder: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pedido Máximo
                  </label>
                  <input
                    type="number"
                    value={formData.maxOrder}
                    onChange={(e) => setFormData({...formData, maxOrder: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-estampanda-accent focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Materials and Sizes */}
            <div>
              <h4 className="font-semibold text-estampanda-dark mb-3">Opciones Disponibles</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materiales
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableMaterials.map(material => (
                    <label key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.materials.includes(material)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, materials: [...formData.materials, material]});
                          } else {
                            setFormData({...formData, materials: formData.materials.filter(m => m !== material)});
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaños
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, sizes: [...formData.sizes, size]});
                          } else {
                            setFormData({...formData, sizes: formData.sizes.filter(s => s !== size)});
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
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
                Producto activo (visible en la tienda)
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
              {product ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Mock data
const mockProducts = [
  {
    id: "PROD-001",
    name: "Stickers Personalizados Premium",
    category: "Stickers",
    description: "Stickers de alta calidad con acabado brillante y resistente al agua",
    price: 0.50,
    discount: 10,
    unit: "unidad",
    stock: 5000,
    minOrder: 50,
    maxOrder: 10000,
    active: true,
    materials: ["Vinilo", "Papel", "Holográfico"],
    sizes: ["3x3cm", "5x5cm", "7x7cm"],
    createdAt: new Date().toISOString()
  },
  {
    id: "PROD-002",
    name: "Etiquetas Transparentes",
    category: "Etiquetas",
    description: "Etiquetas transparentes ideales para productos y packaging",
    price: 0.35,
    discount: 0,
    unit: "unidad",
    stock: 3000,
    minOrder: 100,
    maxOrder: 5000,
    active: true,
    materials: ["Transparente"],
    sizes: ["5x5cm", "10x10cm"],
    createdAt: new Date().toISOString()
  },
  {
    id: "PROD-003",
    name: "Vinilos Decorativos XL",
    category: "Vinilos",
    description: "Vinilos de gran formato para decoración de espacios",
    price: 15.00,
    discount: 15,
    unit: "metro",
    stock: 100,
    minOrder: 1,
    maxOrder: 100,
    active: false,
    materials: ["Vinilo", "Mate"],
    sizes: ["Personalizado"],
    createdAt: new Date().toISOString()
  }
];