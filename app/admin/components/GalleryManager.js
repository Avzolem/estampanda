"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || mockImages);
    } catch {
      setImages(mockImages);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload/design", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        
        if (data.success) {
          const newImage = {
            id: `IMG-${Date.now()}-${i}`,
            url: data.url || URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            category: "uncategorized",
            uploadedAt: new Date().toISOString(),
            views: 0,
            used: false
          };
          
          setImages(prev => [newImage, ...prev]);
        }
        
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    setLoading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImages = async () => {
    if (selectedImages.length === 0) return;
    
    if (!confirm(`¿Eliminar ${selectedImages.length} imagen(es)?`)) return;

    for (const imageId of selectedImages) {
      try {
        await fetch(`/api/gallery/${imageId}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    setImages(images.filter(img => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const filteredImages = filter === "all" 
    ? images 
    : images.filter(img => img.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-estampanda-dark">Galería de Imágenes</h2>
            <p className="text-gray-600 mt-1">Gestiona las imágenes de productos y diseños</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-6 py-3 bg-estampanda-primary text-white rounded-lg hover:bg-estampanda-secondary transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "📤 Subir Imágenes"}
            </motion.button>
            
            {selectedImages.length > 0 && (
              <button
                onClick={handleDeleteImages}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Eliminar ({selectedImages.length})
              </button>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {loading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subiendo imágenes...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-estampanda-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters and View Options */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all" 
                  ? "bg-estampanda-primary text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Todas ({images.length})
            </button>
            <button
              onClick={() => setFilter("products")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "products" 
                  ? "bg-estampanda-primary text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setFilter("designs")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "designs" 
                  ? "bg-estampanda-primary text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Diseños
            </button>
            <button
              onClick={() => setFilter("uncategorized")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "uncategorized" 
                  ? "bg-estampanda-primary text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Sin categoría
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-estampanda-cream" : "hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list" ? "bg-estampanda-cream" : "hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div
                  className={`absolute top-2 left-2 z-10 ${
                    selectedImages.includes(image.id) ? "block" : "hidden group-hover:block"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-5 h-5 text-estampanda-primary rounded focus:ring-estampanda-accent"
                  />
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                     onClick={() => toggleImageSelection(image.id)}>
                  <div className="aspect-square bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-estampanda-dark truncate">{image.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{image.size}</span>
                      {image.used && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          En uso
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-estampanda-cream">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages(filteredImages.map(img => img.id));
                      } else {
                        setSelectedImages([]);
                      }
                    }}
                    className="w-5 h-5 text-estampanda-primary rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase">Vista previa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase">Tamaño</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-estampanda-dark uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredImages.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      className="w-5 h-5 text-estampanda-primary rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={image.url} alt={image.name} fill className="object-cover" sizes="64px" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{image.name}</td>
                  <td className="px-6 py-4 text-gray-500">{image.size}</td>
                  <td className="px-6 py-4">
                    <select
                      value={image.category}
                      onChange={(e) => {
                        // Update category
                        setImages(images.map(img => 
                          img.id === image.id ? {...img, category: e.target.value} : img
                        ));
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="uncategorized">Sin categoría</option>
                      <option value="products">Productos</option>
                      <option value="designs">Diseños</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {image.used ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">En uso</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Mock data
const mockImages = [
  {
    id: "IMG-001",
    url: "/images/sticker-1.png",
    name: "sticker-holografico.png",
    size: "2.4 MB",
    category: "products",
    uploadedAt: new Date().toISOString(),
    views: 145,
    used: true
  },
  {
    id: "IMG-002",
    url: "/images/sticker-2.png",
    name: "sticker-transparente.png",
    size: "1.8 MB",
    category: "products",
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    views: 89,
    used: true
  },
  {
    id: "IMG-003",
    url: "/images/sticker-3.png",
    name: "diseno-personalizado.png",
    size: "3.1 MB",
    category: "designs",
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    views: 234,
    used: false
  }
];