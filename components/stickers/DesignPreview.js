"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  removeBackgroundFromUrl,
  isBackgroundRemovalSupported,
} from "@/libs/background-removal";
import { uploadProcessedToCloudinary } from "@/libs/cloudinary-client";

export default function DesignPreview({
  designFile,
  material,
  size,
  cutType,
  totalPrice,
  unitPrice,
  quantity,
  onAddToCart,
  onProcessed,
  isAdding = false,
}) {
  // "original" | "processed" — qué versión mostrar cuando ambas existen
  const [activeView, setActiveView] = useState("original");

  const hasProcessed = !!designFile?.processedFileUrl;

  // Si llega una versión procesada por primera vez, saltar a verla
  useEffect(() => {
    if (hasProcessed) setActiveView("processed");
  }, [hasProcessed]);

  const dpi = useMemo(() => {
    if (!designFile?.dimensions || !size?.width) return null;
    return Math.round((designFile.dimensions.width / size.width) * 2.54);
  }, [designFile, size]);

  const dpiStatus = useMemo(() => {
    if (dpi === null) return null;
    if (dpi >= 300) {
      return {
        tone: "green",
        label: `${dpi} DPI`,
        msg: "Calidad de impresión excelente",
      };
    }
    if (dpi >= 200) {
      return {
        tone: "amber",
        label: `${dpi} DPI`,
        msg: "Calidad aceptable. Para mejor resultado usa al menos 300 DPI.",
      };
    }
    return {
      tone: "red",
      label: `${dpi} DPI`,
      msg: "Tu diseño puede verse pixelado a este tamaño. Considera reducir las dimensiones del sticker.",
    };
  }, [dpi]);

  const displayUrl = useMemo(() => {
    if (!designFile) return null;
    if (activeView === "processed" && hasProcessed) {
      return designFile.processedFileUrl;
    }
    return designFile.originalUrl || designFile.preview;
  }, [designFile, activeView, hasProcessed]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vista Previa</h2>

        {hasProcessed && (
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-xs">
            <button
              onClick={() => setActiveView("original")}
              className={`px-3 py-1.5 transition-colors ${
                activeView === "original"
                  ? "bg-[#275D5C] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setActiveView("processed")}
              className={`px-3 py-1.5 transition-colors ${
                activeView === "processed"
                  ? "bg-[#275D5C] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Sin fondo
            </button>
          </div>
        )}
      </div>

      <div className="relative aspect-square bg-[conic-gradient(at_50%_50%,_#f3f4f6_0_25%,_#ffffff_25%_50%,_#f3f4f6_50%_75%,_#ffffff_75%)] bg-[length:24px_24px] rounded-xl flex items-center justify-center overflow-hidden">
        {displayUrl ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${cutType?.id ?? ""}-${material?.id ?? ""}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                clipPath: getCutPath(cutType),
                width: "70%",
                height: "70%",
                background: `url(${displayUrl}) center/contain no-repeat`,
                ...getMaterialEffect(material),
              }}
            />
          </AnimatePresence>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">
            Sube un diseño para previsualizarlo
          </p>
        )}

        {dpiStatus && (
          <motion.div
            key={dpiStatus.tone}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
              dpiStatus.tone === "green"
                ? "bg-green-100 text-green-800 border border-green-200"
                : dpiStatus.tone === "amber"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {dpiStatus.label}
          </motion.div>
        )}

        {size && (
          <div className="absolute bottom-3 left-3 right-3 text-center text-[11px] sm:text-xs text-gray-500 bg-white/70 rounded-md py-1">
            ← {size.width} cm × {size.height} cm →
          </div>
        )}
      </div>

      {dpiStatus && dpiStatus.tone !== "green" && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`mt-3 text-xs sm:text-sm ${
            dpiStatus.tone === "amber" ? "text-amber-700" : "text-red-700"
          }`}
        >
          ⚠ {dpiStatus.msg}
        </motion.p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-xs text-gray-500">Precio unitario</p>
            <p className="text-base font-semibold text-gray-700">
              ${unitPrice ? unitPrice.toFixed(2) : "0.00"} MXN
              {quantity > 1 && (
                <span className="text-xs text-gray-400 ml-1">× {quantity}</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <motion.p
              key={totalPrice}
              initial={{ scale: 1.1, color: "#3B7F7E" }}
              animate={{ scale: 1, color: "#275D5C" }}
              className="text-2xl sm:text-3xl font-bold text-[#275D5C]"
            >
              ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
            </motion.p>
          </div>
        </div>

        <BackgroundRemovalButton
          design={designFile}
          onProcessed={onProcessed}
          hasProcessed={hasProcessed}
        />

        <button
          onClick={onAddToCart}
          disabled={!designFile || !material || !size || !cutType || isAdding}
          className="w-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-[#275D5C] hover:bg-[#3B7F7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
        >
          {isAdding ? "Añadiendo…" : "Añadir al carrito"}
        </button>

        {(!material || !size || !cutType) && designFile && (
          <p className="text-xs text-center text-gray-400">
            Completa material, tamaño y tipo de corte para continuar
          </p>
        )}
      </div>
    </div>
  );
}

function BackgroundRemovalButton({ design, onProcessed, hasProcessed }) {
  const [state, setState] = useState("idle"); // idle | loading | uploading | error
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("");

  if (!design) return null;

  // Si ya hay versión procesada, ofrecer reprocesar (re-runs el modelo).
  // Si no soporta WASM SIMD, no mostrar el botón.
  const supported = isBackgroundRemovalSupported();
  if (!supported) {
    return (
      <p className="text-xs text-center text-gray-400">
        Tu navegador no soporta procesamiento de imagen avanzado.
      </p>
    );
  }

  const handleClick = async () => {
    setState("loading");
    setPercent(0);
    try {
      setPhase("Preparando herramienta…");
      const blob = await removeBackgroundFromUrl(
        design.originalUrl,
        (key, pct) => {
          setPercent(pct);
          if (key.startsWith("fetch:")) setPhase("Descargando IA (1ª vez ~10s)…");
          else if (key.startsWith("compute:")) setPhase("Quitando fondo…");
        }
      );

      setState("uploading");
      setPhase("Guardando resultado…");
      const { publicId, url } = await uploadProcessedToCloudinary(
        blob,
        design.name || "sticker"
      );

      const res = await fetch(`/api/designs/${design.designId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processedFileUrl: url,
          processedPublicId: publicId,
          backgroundRemoved: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to save processed");
      const data = await res.json();

      setState("idle");
      setPercent(0);
      onProcessed?.({ ...data.design, preview: url });
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  if (state === "loading" || state === "uploading") {
    return (
      <div className="rounded-lg bg-[#F5E6D3]/40 border border-[#F5E6D3] p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">{phase}</p>
          <p className="text-sm font-bold text-[#275D5C]">{percent}%</p>
        </div>
        <div className="w-full bg-white/70 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-[#275D5C]"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          🔒 Tu imagen no sale de tu navegador
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
        <p className="text-sm text-red-700 mb-2">
          No pudimos procesar. Intenta con un PNG transparente o reintenta.
        </p>
        <button
          onClick={handleClick}
          className="text-xs underline text-red-700 hover:text-red-900"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-white border-2 border-[#275D5C] text-[#275D5C] rounded-lg font-semibold hover:bg-[#F5E6D3]/30 transition-colors"
    >
      {hasProcessed ? "🔄 Procesar de nuevo" : "✨ Quitar fondo"}
    </button>
  );
}

function getCutPath(cutType) {
  if (!cutType) return "none";
  const paths = {
    square: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    round: "circle(50%)",
    oval: "ellipse(50% 40%)",
    diecut: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)",
    custom:
      "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  };
  return paths[cutType.id] || "none";
}

function getMaterialEffect(material) {
  if (!material) return {};
  const effects = {
    matte: { filter: "saturate(0.9)" },
    glossy: { filter: "saturate(1.2) brightness(1.1)" },
    transparent: { opacity: 0.9 },
    holographic: {
      filter: "saturate(1.3) hue-rotate(15deg)",
      mixBlendMode: "overlay",
    },
    glow: { filter: "brightness(1.2) contrast(1.1)" },
    metallic: { filter: "contrast(1.2) brightness(1.05)" },
  };
  return effects[material.id] || {};
}
