import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyEstampanda from "@/components/WhyEstampanda";
import PriceCalculator from "@/components/PriceCalculator";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";

export const metadata = getSEOTags({
  title: "Estampanda - Stickers Personalizados de Alta Calidad en México",
  description: "Crea stickers únicos con diseños personalizados. Múltiples materiales, tamaños a medida y envío rápido en todo México. ¡Cotiza ahora!",
  keywords: ["stickers personalizados", "calcomanías", "pegatinas", "impresión de stickers", "stickers México", "diseño personalizado", "vinilo adhesivo"],
  canonicalUrlRelative: "/",
});

export default function Page() {
  return (
    <>
      {renderSchemaTags()}
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhyEstampanda />
        <PriceCalculator />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}