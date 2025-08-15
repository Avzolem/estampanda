"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const predefinedSizes = [
  { width: 3, height: 3, label: "Pequeño", popular: false },
  { width: 5, height: 5, label: "Estándar", popular: true },
  { width: 7, height: 7, label: "Mediano", popular: false },
  { width: 10, height: 10, label: "Grande", popular: true },
  { width: 15, height: 15, label: "Extra Grande", popular: false },
];

export default function SizeSelector({ selectedSize, onSizeChange }) {
  const [customSize, setCustomSize] = useState(false);
  const [width, setWidth] = useState(selectedSize?.width || 5);
  const [height, setHeight] = useState(selectedSize?.height || 5);
  const [error, setError] = useState("");

  const handleSizeSelect = (size) => {
    setCustomSize(false);
    setError("");
    onSizeChange(size);
  };

  const handleCustomSize = () => {
    setCustomSize(true);
    setError("");
    // No llamar onSizeChange aquí, esperar a que el usuario guarde
  };

  const updateCustomSize = (dimension, value) => {
    // Permitir string vacío o solo números
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      if (dimension === "width") {
        setWidth(value);
      } else {
        setHeight(value);
      }
      setError(""); // Limpiar error al escribir
    }
  };

  const saveCustomSize = () => {
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    
    // Validaciones
    if (!width || !height || widthNum <= 0 || heightNum <= 0) {
      setError("Por favor ingresa medidas válidas");
      return;
    }
    
    if (widthNum < 3 || heightNum < 3) {
      setError("El tamaño mínimo es 3x3 cm");
      return;
    }
    
    if (widthNum > 50 || heightNum > 50) {
      setError("El tamaño máximo es 50x50 cm");
      return;
    }
    
    setError("");
    onSizeChange({ width: widthNum, height: heightNum, label: "Personalizado", custom: true });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Selecciona el Tamaño
        </h2>
        <span className="text-sm text-gray-500">Paso 3 de 5</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {predefinedSizes.map((size, index) => (
          <motion.button
            key={index}
            onClick={() => handleSizeSelect(size)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              !customSize && selectedSize?.width === size.width && selectedSize?.height === size.height
                ? "border-[#275D5C] bg-[#F5E6D3]/20"
                : "border-gray-200 hover:border-[#275D5C]/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {size.popular && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Popular
              </span>
            )}

            <div className="flex justify-center mb-3">
              <div
                className="bg-gradient-to-br from-[#275D5C]/20 to-[#4FA09F]/20 rounded-lg flex items-center justify-center"
                style={{
                  width: `${Math.min(size.width * 8, 80)}px`,
                  height: `${Math.min(size.height * 8, 80)}px`,
                }}
              >
                <span className="text-2xl">📐</span>
              </div>
            </div>

            <p className="font-bold text-gray-800">
              {size.width} x {size.height} cm
            </p>
            <p className="text-sm text-gray-600">{size.label}</p>
          </motion.button>
        ))}

        <motion.button
          onClick={handleCustomSize}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            customSize
              ? "border-[#275D5C] bg-[#F5E6D3]/20"
              : "border-gray-200 hover:border-[#275D5C]/50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✏️</span>
            </div>
          </div>
          <p className="font-bold text-gray-800">Personalizado</p>
          <p className="text-sm text-gray-600">3-50 cm</p>
        </motion.button>
      </div>

      {customSize && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4 mb-6"
        >
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Ingresa las dimensiones (cm):
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Ancho (cm)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ej: 10"
                value={width}
                onChange={(e) => updateCustomSize("width", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  error && (parseFloat(width) > 50 || parseFloat(width) < 3 || !width)
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#275D5C]"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Alto (cm)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ej: 10"
                value={height}
                onChange={(e) => updateCustomSize("height", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  error && (parseFloat(height) > 50 || parseFloat(height) < 3 || !height)
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#275D5C]"
                }`}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Mínimo: 3x3 cm | Máximo: 50x50 cm
          </p>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-500 mt-2 font-semibold"
            >
              ⚠️ {error}
            </motion.p>
          )}
          
          <button
            onClick={saveCustomSize}
            className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
              width && height && parseFloat(width) <= 50 && parseFloat(height) <= 50 
                && parseFloat(width) >= 3 && parseFloat(height) >= 3
                ? "bg-[#275D5C] text-white hover:bg-[#3B7F7E]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!width || !height || parseFloat(width) > 50 || parseFloat(height) > 50 
              || parseFloat(width) < 3 || parseFloat(height) < 3}
          >
            Guardar tamaño personalizado
          </button>
        </motion.div>
      )}

      {selectedSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#F5E6D3]/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="bg-white rounded-lg border-2 border-[#275D5C] flex items-center justify-center"
                style={{
                  width: "60px",
                  height: `${(selectedSize.height / selectedSize.width) * 60}px`,
                }}
              >
                <span className="text-sm font-bold text-[#275D5C]">
                  {selectedSize.width}x{selectedSize.height}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {selectedSize.label}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedSize.width} x {selectedSize.height} cm
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Área</p>
              <p className="font-bold text-[#275D5C]">
                {(selectedSize.width * selectedSize.height).toFixed(1)} cm²
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}