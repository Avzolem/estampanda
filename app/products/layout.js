import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Productos - Estampanda",
  description:
    "Catálogo de stickers personalizados: vinilo mate, brillante, holográfico, transparente, glow in dark y metálico. Encuentra el material ideal para tu marca.",
  keywords: [
    "stickers vinilo",
    "stickers holográficos",
    "stickers transparentes",
    "stickers glow",
    "stickers metálicos",
  ],
  canonicalUrlRelative: "/products",
});

export default function ProductsLayout({ children }) {
  return children;
}
