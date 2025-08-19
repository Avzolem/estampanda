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
    thumbnail: "/images/estampandalogonobg.png",
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
    thumbnail: "/images/estampandalogo.png",
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
    thumbnail: "/images/estampandalogonobg2.png",
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
    thumbnail: "/images/Estampanda..png",
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
  {
    id: 5,
    name: "Logo Vintage",
    thumbnail: "/images/Estampanda. (2).png",
    createdAt: "2025-08-03",
    lastUsed: "2025-08-11",
    usageCount: 5,
    likes: 34,
    isPublic: true,
    category: "business",
    tags: ["vintage", "retro", "clásico"],
    material: "Brillante",
    size: "6x6 cm",
  },
  {
    id: 6,
    name: "Ilustración Panda",
    thumbnail: "/images/panda-logo.svg",
    createdAt: "2025-08-02",
    lastUsed: "2025-08-13",
    usageCount: 8,
    likes: 67,
    isPublic: true,
    category: "art",
    tags: ["panda", "animal", "ilustración"],
    material: "Vinilo",
    size: "9x9 cm",
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
    thumbnail: "/images/estampandalogo.png",
    category: "business",
    isPremium: false,
  },
  {
    id: "t2",
    name: "Plantilla Cute",
    thumbnail: "/images/estampandalogonobg.png",
    category: "art",
    isPremium: false,
  },
  {
    id: "t3",
    name: "Plantilla Premium",
    thumbnail: "/images/estampandalogonobg2.png",
    category: "premium",
    isPremium: true,
  },
  {
    id: "t4",
    name: "Plantilla Moderna",
    thumbnail: "/images/Estampanda..png",
    category: "business",
    isPremium: false,
  },
  {
    id: "t5",
    name: "Plantilla Creativa",
    thumbnail: "/images/Estampanda. (2).png",
    category: "art",
    isPremium: true,
  },
  {
    id: "t6",
    name: "Plantilla Minimalista",
    thumbnail: "/images/menu.png",
    category: "text",
    isPremium: false,
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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#275D5C]">
                Mi Galería de Diseños
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {designs.length} diseños guardados
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`flex-1 sm:flex-none px-8 py-2.5 sm:px-12 sm:py-3 md:px-16 md:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                  showTemplates
                    ? "bg-[#F5E6D3] text-[#275D5C]"
                    : "bg-white text-[#275D5C] border-2 border-[#275D5C] hover:bg-[#F5E6D3]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Plantillas
                </span>
              </button>
              <Link
                href="/stickers/designer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 sm:px-12 sm:py-3 md:px-16 md:py-3.5 bg-[#275D5C] text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-[#3B7F7E] transition-colors"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Nuevo Diseño
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o etiqueta..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-[#275D5C] focus:outline-none"
                />
                <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-8 py-2.5 sm:px-12 sm:py-3 md:px-16 md:py-3.5 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#275D5C] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-1 sm:gap-2">
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
                className={`px-8 py-2.5 sm:px-10 sm:py-3 md:px-12 md:py-3.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#275D5C] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-8 py-2.5 sm:px-10 sm:py-3 md:px-12 md:py-3.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#275D5C] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ListBulletIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Plantillas prediseñadas
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-lg text-xs font-bold">
                          PREMIUM
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href="/stickers/designer"
                          className="px-8 py-2.5 sm:px-12 sm:py-3 md:px-16 md:py-3.5 bg-white text-[#275D5C] rounded-lg font-semibold"
                        >
                          Usar plantilla
                        </Link>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{template.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Designs Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
                            className="flex-1 px-6 py-2.5 sm:px-8 sm:py-3 bg-[#275D5C] text-white rounded-lg text-center text-xs sm:text-sm font-semibold hover:bg-[#3B7F7E] transition-colors"
                          >
                            Usar plantilla
                          </Link>
                          <button
                            onClick={() => duplicateDesign(design)}
                            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition-colors"
                            title="Duplicar diseño"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDesign(design.id)}
                            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Eliminar diseño"
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
                        <HeartSolidIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                    </button>

                    {/* Usage Badge */}
                    {design.usageCount > 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-lg text-xs font-semibold text-gray-700">
                        Usado {design.usageCount}x
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {design.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {design.material} • {design.size}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        {design.createdAt}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
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
                  className="bg-white rounded-xl shadow-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                >
                  <img
                    src={design.thumbnail}
                    alt={design.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{design.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
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
                      className="px-8 py-2.5 sm:px-12 sm:py-3 md:px-16 md:py-3.5 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
                    >
                      Usar diseño
                    </Link>
                    <button
                      onClick={() => duplicateDesign(design)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Duplicar diseño"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleLike(design.id)}
                      className="px-6 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Me gusta"
                    >
                      {likedDesigns.includes(design.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="px-6 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Eliminar diseño"
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
              className="inline-flex items-center gap-2 px-8 py-2.5 sm:px-16 sm:py-3 md:px-24 md:py-3.5 bg-[#275D5C] text-white rounded-lg font-semibold hover:bg-[#3B7F7E] transition-colors"
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