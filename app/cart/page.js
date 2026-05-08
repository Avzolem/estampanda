import CartDrawer from "@/components/cart/CartDrawer";

export const metadata = { title: "Tu carrito - Estampanda" };

export default function CartPage() {
  return (
    <main className="max-w-3xl mx-auto pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-8">Tu carrito</h1>
      <CartDrawer />
    </main>
  );
}
