import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PriceCalculator from "@/components/PriceCalculator";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PriceCalculator />
      </main>
      <Footer />
    </>
  );
}