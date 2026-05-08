"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FileUploader from "@/components/stickers/FileUploader";
import MaterialSelector from "@/components/stickers/MaterialSelector";
import SizeSelector from "@/components/stickers/SizeSelector";
import CutTypeSelector from "@/components/stickers/CutTypeSelector";
import DesignPreview from "@/components/stickers/DesignPreview";
import { useCart } from "@/libs/use-cart";
import {
  calculateUnitPrice,
  calculateTotalPrice,
  getVolumeDiscount,
} from "@/libs/pricing";

const QUICK_QUANTITIES = [50, 100, 250, 500, 1000];

export default function StickerDesignerPage() {
  const [design, setDesign] = useState(null);
  const [material, setMaterial] = useState(null);
  const [size, setSize] = useState({
    width: 5,
    height: 5,
    label: "Estándar",
    custom: false,
  });
  const [cutType, setCutType] = useState(null);
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const canAdd = design && material && size && cutType && quantity > 0;

  const unitPrice = canAdd
    ? calculateUnitPrice({ size, material, cutType, quantity })
    : 0;
  const totalPrice = canAdd
    ? calculateTotalPrice({ size, material, cutType, quantity })
    : 0;
  const discountPct = Math.round(getVolumeDiscount(quantity) * 100);

  const handleAdd = async () => {
    if (!canAdd) return;
    setIsAdding(true);
    try {
      await addItem({
        designId: design.designId,
        material: { id: material.id },
        size: {
          width: size.width,
          height: size.height,
          label: size.label,
          custom: !!size.custom,
        },
        cutType: { id: cutType.id },
        quantity,
      });
      toast.success("Añadido al carrito");
    } catch (e) {
      toast.error(e.message || "No se pudo añadir");
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartOver = () => {
    setDesign(null);
    setMaterial(null);
    setCutType(null);
    setSize({ width: 5, height: 5, label: "Estándar", custom: false });
    setQuantity(50);
  };

  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4 space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          Diseña tu sticker
        </h1>
        {design && (
          <button
            onClick={handleStartOver}
            className="text-sm text-gray-500 hover:text-[#275D5C] underline underline-offset-4"
          >
            ← Subir otro diseño
          </button>
        )}
      </div>

      {!design ? (
        <FileUploader onFileUpload={setDesign} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="lg:sticky lg:top-24 self-start">
            <DesignPreview
              designFile={design}
              material={material}
              size={size}
              cutType={cutType}
              unitPrice={unitPrice}
              totalPrice={totalPrice}
              quantity={quantity}
              onAddToCart={handleAdd}
              isAdding={isAdding}
              onProcessed={(updated) =>
                setDesign({ ...design, ...updated })
              }
            />
          </div>
          <div className="space-y-6">
            <MaterialSelector
              selectedMaterial={material}
              onMaterialChange={setMaterial}
            />
            <SizeSelector selectedSize={size} onSizeChange={setSize} />
            <CutTypeSelector
              selectedCutType={cutType}
              onCutTypeChange={setCutType}
            />

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-2xl font-bold text-gray-800">
                  Cantidad
                </label>
                <span className="text-sm text-gray-500">Paso 5 de 5</span>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {QUICK_QUANTITIES.map((q) => {
                  const d = Math.round(getVolumeDiscount(q) * 100);
                  const active = quantity === q;
                  return (
                    <motion.button
                      key={q}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(q)}
                      className={`relative rounded-xl py-3 border-2 text-sm transition-all ${
                        active
                          ? "border-[#275D5C] bg-[#F5E6D3]/30"
                          : "border-gray-200 hover:border-[#275D5C]/50"
                      }`}
                    >
                      {d > 0 && (
                        <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{d}%
                        </span>
                      )}
                      <p className="font-bold text-gray-800">{q}</p>
                      <p className="text-[10px] text-gray-500">unidades</p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 10))}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:border-[#275D5C] font-bold text-gray-600"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:border-[#275D5C] focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 10)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:border-[#275D5C] font-bold text-gray-600"
                >
                  +
                </button>
              </div>

              {discountPct > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm text-green-700 font-medium text-center"
                >
                  🎉 Descuento por volumen aplicado: −{discountPct}%
                </motion.p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
