"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "@/components/stickers/FileUploader";
import MaterialSelector from "@/components/stickers/MaterialSelector";
import SizeSelector from "@/components/stickers/SizeSelector";
import CutTypeSelector from "@/components/stickers/CutTypeSelector";
import PricingCalculator from "@/components/stickers/PricingCalculator";
import DesignPreview from "@/components/stickers/DesignPreview";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function StickerDesigner() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [designFile, setDesignFile] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCutType, setSelectedCutType] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [pricing, setPricing] = useState(null);
  const [notes, setNotes] = useState("");

  const steps = [
    { id: 1, name: "Diseño", icon: "🎨", completed: designFile !== null },
    { id: 2, name: "Material", icon: "✨", completed: selectedMaterial !== null },
    { id: 3, name: "Tamaño", icon: "📐", completed: selectedSize !== null },
    { id: 4, name: "Corte", icon: "✂️", completed: selectedCutType !== null },
    { id: 5, name: "Cantidad", icon: "📦", completed: pricing !== null },
  ];

  const handleFileUpload = (fileData) => {
    if (fileData) {
      // Store the complete file data including Cloudinary URLs
      setDesignFile({
        ...fileData,
        cloudinaryUrl: fileData.url || fileData.processedFileUrl,
        thumbnailUrl: fileData.thumbnailUrl,
        previewUrl: fileData.previewUrl,
        designId: fileData.designId,
      });
      if (currentStep === 1) {
        setTimeout(() => setCurrentStep(2), 1000); // Auto advance after successful upload
      }
    } else {
      setDesignFile(null);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProceedToCheckout = () => {
    const configuration = {
      designFile,
      material: selectedMaterial,
      size: selectedSize,
      cutType: selectedCutType,
      quantity,
      pricing,
      notes,
    };
    
    // Guardar en sessionStorage para el checkout
    sessionStorage.setItem("stickerConfiguration", JSON.stringify(configuration));
    router.push("/stickers/checkout");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return designFile !== null;
      case 2: return selectedMaterial !== null;
      case 3: return selectedSize !== null;
      case 4: return selectedCutType !== null;
      case 5: return pricing !== null;
      default: return false;
    }
  };

  const allStepsCompleted = steps.every(step => step.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-estampanda-light via-white to-estampanda-cream">
      {/* Header con progreso */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
            <button
              onClick={() => router.push("/")}
              className="self-start sm:self-auto flex items-center gap-2 px-8 py-2.5 sm:px-16 sm:py-3 md:px-24 md:py-3.5 text-sm sm:text-base text-white bg-[#275D5C] hover:bg-[#3B7F7E] rounded-lg transition-all font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Volver</span>
            </button>

            {/* Progress Steps */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => step.completed && setCurrentStep(step.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all ${
                      currentStep === step.id
                        ? "bg-estampanda-primary text-white"
                        : step.completed
                        ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    disabled={!step.completed && currentStep !== step.id}
                  >
                    {step.completed && currentStep !== step.id ? (
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span>{step.icon}</span>
                    )}
                    <span className="hidden sm:inline font-medium">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-2 ${
                      step.completed ? "bg-green-400" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs sm:text-sm text-gray-500 self-end sm:self-auto">
              Paso {currentStep} de {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Panel izquierdo - Configuración */}
          <div>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <FileUploader 
                    onFileUpload={handleFileUpload}
                    uploadedFile={designFile}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <MaterialSelector
                    selectedMaterial={selectedMaterial}
                    onMaterialChange={setSelectedMaterial}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SizeSelector
                    selectedSize={selectedSize}
                    onSizeChange={setSelectedSize}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <CutTypeSelector
                    selectedCutType={selectedCutType}
                    onCutTypeChange={setSelectedCutType}
                  />
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <PricingCalculator
                    material={selectedMaterial}
                    size={selectedSize}
                    cutType={selectedCutType}
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    onPriceCalculated={setPricing}
                  />

                  {/* Campo de notas */}
                  <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Notas adicionales (opcional)
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="¿Alguna instrucción especial para tu pedido?"
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-estampanda-primary focus:outline-none"
                      rows="3"
                      maxLength="500"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {notes.length}/500 caracteres
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all w-full sm:w-auto order-2 sm:order-1 ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-[#275D5C] hover:bg-[#F5E6D3] border-2 border-[#275D5C]"
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Anterior
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all w-full sm:w-auto order-1 sm:order-2 ${
                    canProceed()
                      ? "bg-[#275D5C] text-white hover:bg-[#3B7F7E] shadow-md hover:shadow-lg"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Siguiente
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <motion.button
                  onClick={handleProceedToCheckout}
                  disabled={!allStepsCompleted}
                  className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-bold transition-all w-full sm:w-auto order-1 sm:order-2 ${
                    allStepsCompleted
                      ? "bg-gradient-to-r from-[#275D5C] to-[#4FA09F] text-white hover:from-[#3B7F7E] hover:to-[#4FA09F] shadow-lg"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  whileHover={allStepsCompleted ? { scale: 1.05 } : {}}
                  whileTap={allStepsCompleted ? { scale: 0.95 } : {}}
                >
                  Proceder al Checkout
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Panel derecho - Preview */}
          <div className="order-first lg:order-last lg:sticky lg:top-24 h-fit">
            <DesignPreview
              designFile={designFile}
              material={selectedMaterial}
              size={selectedSize}
              cutType={selectedCutType}
            />

            {/* Resumen rápido */}
            {allStepsCompleted && pricing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 sm:mt-6 bg-gradient-to-r from-estampanda-primary to-estampanda-secondary text-white rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Resumen del pedido</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span className="font-semibold">{selectedMaterial.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamaño:</span>
                    <span className="font-semibold">
                      {selectedSize.width} x {selectedSize.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Corte:</span>
                    <span className="font-semibold">{selectedCutType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span className="font-semibold">{quantity} unidades</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 mt-2">
                    <div className="flex justify-between text-lg sm:text-xl">
                      <span>Total:</span>
                      <span className="font-bold">${pricing.total}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}