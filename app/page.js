import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PopularProducts from "@/components/PopularProducts";
import PriceCalculator from "@/components/PriceCalculator";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <PopularProducts />
        <PriceCalculator />
        <ProductsGrid />
      </main>
      <Footer />
    </>
  );
}