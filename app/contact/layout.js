import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Contacto - Estampanda",
  description:
    "¿Necesitas ayuda con tu pedido o tienes una cotización especial? Contáctanos por correo, teléfono o WhatsApp.",
  canonicalUrlRelative: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
