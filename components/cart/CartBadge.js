"use client";
import Link from "next/link";
import { useCart } from "@/libs/use-cart";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function CartBadge() {
  const { items, isLoading } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Link href="/cart" className="relative flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
      <ShoppingBagIcon className="w-6 h-6" />
      {!isLoading && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#275D5C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
