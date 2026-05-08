"use client";
import { useState } from "react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/libs/use-cart";

const MATERIALS = ["matte","glossy","transparent","holographic","glow","metallic"];
const CUT_TYPES = ["square","round","oval","diecut","custom"];

export default function CartItemCard({ item }) {
  const { updateItem, removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  const design = item.design;

  const change = async (patch) => {
    setBusy(true);
    try {
      await updateItem(item._id, patch);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        {design?.thumbnailUrl ? (
          <Image src={design.thumbnailUrl} alt={design.name} fill className="object-contain p-1" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">?</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{design?.name || "Diseño eliminado"}</p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <select value={item.material.id} onChange={(e) => change({ material: { id: e.target.value } })} disabled={busy} className="border rounded px-2 py-1">
            {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={item.cutType.id} onChange={(e) => change({ cutType: { id: e.target.value } })} disabled={busy} className="border rounded px-2 py-1">
            {CUT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="col-span-2 text-xs text-gray-500">
            {item.size.width}×{item.size.height} cm — DPI {item.dpi ?? "?"}
            {item.dpiWarning && <span className="text-amber-600 ml-1">⚠ baja resolución</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => change({ quantity: Math.max(1, item.quantity - 1) })} disabled={busy || item.quantity <= 1} className="border rounded w-7 h-7">−</button>
            <span className="w-10 text-center">{item.quantity}</span>
            <button onClick={() => change({ quantity: item.quantity + 1 })} disabled={busy} className="border rounded w-7 h-7">+</button>
          </div>
          <p className="text-right font-bold text-[#275D5C]">${item.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <button onClick={() => removeItem(item._id)} disabled={busy} className="self-start p-2 text-gray-400 hover:text-red-500">
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
