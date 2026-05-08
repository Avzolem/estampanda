import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Cómo funciona - Estampanda",
  description:
    "Conoce el proceso de Estampanda: sube tu diseño, configura material y tamaño, y recibe tus stickers personalizados de alta calidad en pocos días.",
  keywords: [
    "stickers personalizados",
    "cómo hacer stickers",
    "proceso de impresión",
    "vinilo holográfico",
  ],
  canonicalUrlRelative: "/how-it-works",
});

export default function HowItWorksLayout({ children }) {
  return children;
}
