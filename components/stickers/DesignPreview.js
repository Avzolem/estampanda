"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DesignPreview({ 
  designFile, 
  material, 
  size, 
  cutType 
}) {
  const [previewMode, setPreviewMode] = useState("flat");
  const [rotation, setRotation] = useState(0);

  const mockupViews = [
    { id: "flat", name: "Plano", icon: "📄" },
    { id: "laptop", name: "Laptop", icon: "💻" },
    { id: "bottle", name: "Botella", icon: "🍶" },
    { id: "phone", name: "Móvil", icon: "📱" },
  ];

  // Simular efecto del material
  const getMaterialEffect = () => {
    if (!material) return {};
    
    const effects = {
      matte: { filter: "saturate(0.9)" },
      glossy: { filter: "saturate(1.2) brightness(1.1)" },
      transparent: { opacity: 0.9 },
      holographic: {
        background: "linear-gradient(45deg, #ff0080, #ff8000, #00ff00, #0080ff, #8000ff)",
        backgroundSize: "200% 200%",
        animation: "shimmer 3s ease infinite",
        mixBlendMode: "overlay",
      },
      glow: { filter: "brightness(1.2) contrast(1.1)" },
      metallic: { filter: "contrast(1.2) brightness(1.05)" },
    };
    
    return effects[material?.id] || {};
  };

  // Simular forma de corte
  const getCutPath = () => {
    if (!cutType) return "none";
    
    const paths = {
      square: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      round: "circle(50%)",
      oval: "ellipse(50% 40%)",
      diecut: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)",
      custom: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    };
    
    return paths[cutType?.id] || "none";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Vista Previa
        </h2>
        <div className="flex gap-2">
          {mockupViews.map((view) => (
            <button
              key={view.id}
              onClick={() => setPreviewMode(view.id)}
              className={`px-3 py-2 rounded-lg transition-all ${
                previewMode === view.id
                  ? "bg-estampanda-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              title={view.name}
            >
              <span className="text-xl">{view.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Área de preview */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
        {(designFile?.preview || designFile) ? (
          <motion.div
            className="relative"
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {/* Preview según el modo */}
            {previewMode === "flat" && (
              <div className="relative">
                {/* Sombra del sticker */}
                <div
                  className="absolute inset-0 bg-black/20 blur-xl"
                  style={{
                    clipPath: getCutPath(),
                    transform: "translate(4px, 4px)",
                  }}
                />
                
                {/* Sticker */}
                <div
                  className="relative bg-white p-2"
                  style={{
                    clipPath: getCutPath(),
                    width: `${size?.width * 20}px`,
                    height: `${size?.height * 20}px`,
                  }}
                >
                  {/* Efecto del material */}
                  {material?.id === "holographic" && (
                    <div
                      className="absolute inset-0"
                      style={getMaterialEffect()}
                    />
                  )}
                  
                  {/* Imagen del diseño */}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={material?.id !== "holographic" ? getMaterialEffect() : {}}
                  >
                    {(designFile?.preview || designFile) ? (
                      <img
                        src={designFile?.preview || designFile}
                        alt="Diseño"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-6xl">🎨</div>
                    )}
                  </div>
                  
                  {/* Brillo para material glossy */}
                  {material?.id === "glossy" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                  )}
                </div>
                
                {/* Borde blanco del sticker */}
                <div
                  className="absolute inset-0 border-4 border-white"
                  style={{
                    clipPath: getCutPath(),
                  }}
                />
              </div>
            )}

            {previewMode === "laptop" && (
              <div className="relative">
                <div className="w-80 h-48 bg-gray-800 rounded-t-lg flex items-center justify-center">
                  <div className="w-72 h-40 bg-gray-900 rounded flex items-center justify-center">
                    <div
                      className="bg-white p-1"
                      style={{
                        clipPath: getCutPath(),
                        width: `${size?.width * 10}px`,
                        height: `${size?.height * 10}px`,
                      }}
                    >
                      {typeof designFile === "string" ? (
                        <img
                          src={designFile}
                          alt="Diseño"
                          className="w-full h-full object-contain"
                          style={getMaterialEffect()}
                        />
                      ) : (
                        <div className="text-4xl text-center">🎨</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-96 h-4 bg-gray-700 rounded-b-lg" />
              </div>
            )}

            {previewMode === "bottle" && (
              <div className="relative">
                <div className="w-32 h-64 bg-gradient-to-b from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center">
                  <div
                    className="bg-white p-1"
                    style={{
                      clipPath: getCutPath(),
                      width: `${Math.min(size?.width * 8, 80)}px`,
                      height: `${Math.min(size?.height * 8, 80)}px`,
                    }}
                  >
                    {typeof designFile === "string" ? (
                      <img
                        src={designFile}
                        alt="Diseño"
                        className="w-full h-full object-contain"
                        style={getMaterialEffect()}
                      />
                    ) : (
                      <div className="text-3xl text-center">🎨</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {previewMode === "phone" && (
              <div className="relative">
                <div className="w-40 h-80 bg-gray-900 rounded-3xl p-2">
                  <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                    <div
                      className="bg-white p-1"
                      style={{
                        clipPath: getCutPath(),
                        width: `${Math.min(size?.width * 10, 100)}px`,
                        height: `${Math.min(size?.height * 10, 100)}px`,
                      }}
                    >
                      {typeof designFile === "string" ? (
                        <img
                          src={designFile}
                          alt="Diseño"
                          className="w-full h-full object-contain"
                          style={getMaterialEffect()}
                        />
                      ) : (
                        <div className="text-4xl text-center">🎨</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-30">📸</div>
            <p className="text-gray-500">
              Sube un diseño para ver la vista previa
            </p>
          </div>
        )}
      </div>

      {/* Controles de rotación */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setRotation(rotation - 90)}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ↺ Rotar izquierda
        </button>
        <button
          onClick={() => setRotation(0)}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ⟲ Restablecer
        </button>
        <button
          onClick={() => setRotation(rotation + 90)}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ↻ Rotar derecha
        </button>
      </div>

      {/* Información del sticker */}
      {material && size && cutType && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">
            Especificaciones:
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Material:</p>
              <p className="font-semibold">{material.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Tamaño:</p>
              <p className="font-semibold">{size.width} x {size.height} cm</p>
            </div>
            <div>
              <p className="text-gray-500">Corte:</p>
              <p className="font-semibold">{cutType.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}