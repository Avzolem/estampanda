"use client";
import Link from "next/link";
import { useCart } from "@/libs/use-cart";
import CartItemCard from "./CartItemCard";

export default function CartDrawer() {
  const { items, subtotal, isLoading } = useCart();

  if (isLoading) return <div className="p-6 text-center">Cargando carrito…</div>;

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-600 mb-4">Tu carrito está vacío</p>
        <Link href="/stickers/designer" className="px-6 py-3 bg-[#275D5C] text-white rounded-lg">
          Diseña tu primer sticker
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {items.map((item) => <CartItemCard key={item._id} item={item} />)}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">Subtotal</span>
          <span className="text-2xl font-bold text-[#275D5C]">${subtotal.toFixed(2)} MXN</span>
        </div>
        <Link
          href="/stickers/checkout"
          className="block w-full text-center px-6 py-3 sm:px-8 sm:py-4 bg-[#275D5C] text-white rounded-lg font-semibold"
        >
          Continuar a pago
        </Link>
      </div>
    </div>
  );
}
