import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Diseña tu sticker personalizado - Estampanda",
  description:
    "Sube tu diseño, elige material, tamaño y tipo de corte, y recibe tus stickers personalizados con calidad de impresión profesional.",
  keywords: [
    "diseñar stickers online",
    "configurador de stickers",
    "stickers personalizados",
    "subir diseño sticker",
  ],
  canonicalUrlRelative: "/stickers/designer",
});

export default function DesignerLayout({ children }) {
  return children;
}
