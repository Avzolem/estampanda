"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import FileUploader from "@/components/stickers/FileUploader";
import MaterialSelector from "@/components/stickers/MaterialSelector";
import SizeSelector from "@/components/stickers/SizeSelector";
import CutTypeSelector from "@/components/stickers/CutTypeSelector";
import DesignPreview from "@/components/stickers/DesignPreview";
import { useCart } from "@/libs/use-cart";
import { calculateTotalPrice } from "@/libs/pricing";

export default function StickerDesignerPage() {
  const [design, setDesign] = useState(null);
  const [material, setMaterial] = useState(null);
  const [size, setSize] = useState({ width: 5, height: 5, label: "Estándar" });
  const [cutType, setCutType] = useState(null);
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const canAdd = design && material && size && cutType && quantity > 0;

  const totalPrice = canAdd
    ? calculateTotalPrice({ size, material, cutType, quantity })
    : 0;

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

  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4 space-y-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
        Diseña tu sticker
      </h1>

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
              totalPrice={totalPrice}
              onAddToCart={handleAdd}
              isAdding={isAdding}
              onProcessed={(updated) => setDesign({ ...design, ...updated })}
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
              <label className="block text-sm font-semibold mb-2">
                Cantidad
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
