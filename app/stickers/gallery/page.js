"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  SparklesIcon,
  Squares2X2Icon,
  ListBulletIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Datos de ejemplo - En producción vendría de la base de datos
const mockDesigns = [
  {
    id: 1,
    name: "Logo Empresa",
    thumbnail: "https://via.placeholder.com/300x300/275D5C/FFFFFF?text=Logo",
    createdAt: "2025-08-10",
    lastUsed: "2025-08-14",
    usageCount: 3,
    likes: 12,
    isPublic: true,
    category: "business",
    tags: ["logo", "empresa", "profesional"],
    material: "Transparente",
    size: "7x7 cm",
  },
  {
    id: 2,
    name: "Mascota Kawaii",
    thumbnail: "https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Kawaii",
    createdAt: "2025-08-08",
    lastUsed: "2025-08-12",
    usageCount: 1,
    likes: 45,
    isPublic: true,
    category: "art",
    tags: ["kawaii", "cute", "mascota"],
    material: "Holográfico",
    size: "5x5 cm",
  },
  {
    id: 3,
    name: "Texto Motivacional",
    thumbnail: "https://via.placeholder.com/300x300/4FA09F/FFFFFF?text=Motivación",
    createdAt: "2025-08-05",
    lastUsed: "2025-08-05",
    usageCount: 1,
    likes: 8,
    isPublic: false,
    category: "text",
    tags: ["texto", "motivación", "frase"],
    material: "Mate",
    size: "10x5 cm",
  },
  {
    id: 4,
    name: "Patrón Geométrico",
    thumbnail: "https://via.placeholder.com/300x300/F5E6D3/275D5C?text=Patrón",
    createdAt: "2025-08-01",
    lastUsed: "2025-08-10",
    usageCount: 2,
    likes: 23,
    isPublic: true,
    category: "pattern",
    tags: ["patrón", "geométrico", "abstracto"],
    material: "Metálico",
    size: "8x8 cm",
  },
];

const categories = [
  { id: "all", name: "Todos", icon: "🎨" },
  { id: "business", name: "Negocios", icon: "💼" },
  { id: "art", name: "Arte", icon: "🎭" },
  { id: "text", name: "Texto", icon: "📝" },
  { id: "pattern", name: "Patrones", icon: "🔷" },
  { id: "photo", name: "Fotos", icon: "📸" },
];

const templates = [
  {
    id: "t1",
    name: "Plantilla Negocio",
    thumbnail: "https://via.placeholder.com/300x300/1A3B3A/FFFFFF?text=Business",
    category: "business",
    isPremium: false,
  },
  {
    id: "t2",
    name: "Plantilla Cute",
    thumbnail: "https://via.placeholder.com/300x300/FFB6C1/FFFFFF?text=Cute",
    category: "art",
    isPremium: false,
  },
  {
    id: "t3",
    name: "Plantilla Premium",
    thumbnail: "https://via.placeholder.com/300x300/FFD700/000000?text=Premium",
    category: "premium",
    isPremium: true,
  },
];

export default function GalleryPage() {
  const [designs, setDesigns] = useState(mockDesigns);
  const [filteredDesigns, setFilteredDesigns] = useState(mockDesigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showTemplates, setShowTemplates] = useState(false);
  const [likedDesigns, setLikedDesigns] = useState([]);

  useEffect(() => {
    // Filtrar diseños
    let filtered = designs;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredDesigns(filtered);
  }, [designs, selectedCategory, searchQuery]);

  const toggleLike = (designId) => {
    if (likedDesigns.includes(designId)) {
      setLikedDesigns(likedDesigns.filter(id => id !== designId));
      setDesigns(designs.map(d => 
        d.id === designId ? { ...d, likes: d.likes - 1 } : d
      ));
    } else {
      setLikedDesigns([...likedDesigns, designId]);
      setDesigns(designs.map(d => 
        d.id === designId ? { ...d, likes: d.likes + 1 } : d
      ));
    }
  };

  const deleteDesign = (designId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este diseño?")) {
      setDesigns(designs.filter(d => d.id !== designId));
    }
  };

  const duplicateDesign = (design) => {
    const newDesign = {
      ...design,
      id: Date.now(),
      name: `${design.name} (copia)`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      likes: 0,
    };
    setDesigns([newDesign, ...designs]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#275D5C]">
                Mi Galería de Diseños
              </h1>
              <p className="text-gray-600 mt-1">
                {designs.length} diseños guardados
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  showTemplates
                    ? "bg-[#F5E6D3] text-[#275D5C]"
                    : "bg-white text-[#275D5C] border-2 border-[#275D5C] hover:bg-[#F5E6D3]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Plantillas
                </span>
              </button>
              <Link
                href="/stickers/designer"
                className="flex items-center gap-2 px-6 py-3 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Diseño
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o etiqueta..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-[#275D5C] focus:outline-none"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#275D5C] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#275D5C] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#275D5C] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Plantillas prediseñadas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      {template.isPremium && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                          PREMIUM
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href="/stickers/designer"
                          className="px-4 py-2 bg-white text-[#275D5C] rounded-lg font-semibold"
                        >
                          Usar plantilla
                        </Link>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-800">{template.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Designs Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence>
              {filteredDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={design.thumbnail}
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex gap-2">
                          <Link
                            href="/stickers/designer"
                            className="flex-1 py-2 bg-[#275D5C] text-white rounded-lg text-center text-sm font-semibold hover:bg-[#3B7F7E] transition-colors"
                          >
                            Usar
                          </Link>
                          <button
                            onClick={() => duplicateDesign(design)}
                            className="p-2 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition-colors"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDesign(design.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(design.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-all"
                    >
                      {likedDesigns.includes(design.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>

                    {/* Usage Badge */}
                    {design.usageCount > 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-lg text-xs font-semibold text-gray-700">
                        Usado {design.usageCount}x
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {design.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {design.material} • {design.size}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(design.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <HeartIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{design.likes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4"
                >
                  <img
                    src={design.thumbnail}
                    alt={design.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{design.name}</h3>
                    <p className="text-sm text-gray-500">
                      {design.material} • {design.size} • Usado {design.usageCount} veces
                    </p>
                    <div className="flex gap-2 mt-2">
                      {design.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/stickers/designer"
                      className="px-4 py-2 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
                    >
                      Usar diseño
                    </Link>
                    <button
                      onClick={() => duplicateDesign(design)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleLike(design.id)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {likedDesigns.includes(design.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No se encontraron diseños
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "Prueba con otros filtros de búsqueda"
                : "Comienza creando tu primer diseño"}
            </p>
            <Link
              href="/stickers/designer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Crear nuevo diseño
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}