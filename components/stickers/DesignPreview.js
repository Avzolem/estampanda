"use client";
import { useMemo, useState } from "react";
import { removeBackgroundFromUrl, isBackgroundRemovalSupported } from "@/libs/background-removal";
import { uploadProcessedToCloudinary } from "@/libs/cloudinary-client";

export default function DesignPreview({
  designFile,
  material,
  size,
  cutType,
  totalPrice,
  onAddToCart,
  onProcessed,
  isAdding = false,
}) {
  const dpi = useMemo(() => {
    if (!designFile?.dimensions || !size?.width) return null;
    return Math.round((designFile.dimensions.width / size.width) * 2.54);
  }, [designFile, size]);

  const dpiStatus = useMemo(() => {
    if (dpi === null) return null;
    if (dpi >= 300) return { color: "green", label: `${dpi} DPI · Excelente` };
    if (dpi >= 200) return { color: "amber", label: `${dpi} DPI · Aceptable` };
    return { color: "red", label: `${dpi} DPI · Puede pixelarse` };
  }, [dpi]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vista Previa</h2>

      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        {designFile?.preview ? (
          <div
            style={{
              clipPath: getCutPath(cutType),
              width: "70%",
              height: "70%",
              background: `url(${designFile.preview}) center/contain no-repeat`,
              ...getMaterialEffect(material),
            }}
          />
        ) : (
          <p className="text-gray-400">Sube un diseño para previsualizarlo</p>
        )}

        {dpiStatus && (
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              dpiStatus.color === "green"
                ? "bg-green-100 text-green-800"
                : dpiStatus.color === "amber"
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {dpiStatus.label}
          </div>
        )}

        {size && (
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-gray-600">
            ← {size.width} cm × {size.height} cm →
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex justify-between text-lg">
          <span>Total:</span>
          <span className="font-bold text-[#275D5C]">
            ${totalPrice ? totalPrice.toFixed(2) : "0.00"} MXN
          </span>
        </div>

        <BackgroundRemovalButton design={designFile} onProcessed={onProcessed} />

        <button
          onClick={onAddToCart}
          disabled={!designFile || !material || !size || !cutType || isAdding}
          className="w-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-[#275D5C] hover:bg-[#3B7F7E] disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
        >
          {isAdding ? "Añadiendo…" : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}

function BackgroundRemovalButton({ design, onProcessed }) {
  const [state, setState] = useState("idle"); // idle | loading | uploading | done | error
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("");

  if (!design || !isBackgroundRemovalSupported()) return null;

  const handleClick = async () => {
    setState("loading");
    try {
      setPhase("Preparando herramienta…");
      const blob = await removeBackgroundFromUrl(design.originalUrl, (key, pct) => {
        setPercent(pct);
        if (key.startsWith("fetch:")) setPhase("Descargando IA…");
        else if (key.startsWith("compute:")) setPhase("Quitando fondo…");
      });

      setState("uploading");
      setPhase("Guardando resultado…");
      const { publicId, url } = await uploadProcessedToCloudinary(blob, design.name || "sticker");

      // Notificar al server
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

      setState("done");
      onProcessed?.({ ...data.design, preview: url });
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <button
        onClick={handleClick}
        className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-white border-2 border-[#275D5C] text-[#275D5C] rounded-lg font-semibold hover:bg-[#F5E6D3]/30"
      >
        ✨ Quitar fondo
      </button>
    );
  }
  if (state === "error") {
    return <p className="text-sm text-red-600">No pudimos procesar. Intenta con un PNG transparente.</p>;
  }
  return (
    <div className="text-center py-4">
      <p className="text-sm font-semibold text-gray-700">{phase} {percent > 0 ? `${percent}%` : ""}</p>
      <p className="text-xs text-gray-500 mt-1">🔒 Tu imagen no sale de tu navegador</p>
    </div>
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
