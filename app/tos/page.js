import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// Términos y Condiciones para Estampanda
// Actualizado para el sitio de stickers personalizados

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Última actualización: 19 de Agosto, 2025

¡Bienvenido a Estampanda!

Estos Términos de Servicio ("Términos") rigen el uso del sitio web de Estampanda en https://estampanda.com ("Sitio") y los servicios proporcionados por Estampanda. Al usar nuestro Sitio y servicios, aceptas estos Términos.

1. Descripción de Estampanda

Estampanda es una plataforma de comercio electrónico especializada en la creación y venta de stickers personalizados de alta calidad con envío rápido en México.

2. Productos y Servicios

Ofrecemos stickers personalizados en diversos materiales, tamaños y acabados. Los precios incluyen diseño, producción y envío según las especificaciones seleccionadas por el cliente.

3. Pedidos y Pagos

- Los pedidos se procesan tras la confirmación del pago
- Aceptamos pagos mediante tarjeta de crédito/débito a través de Stripe
- Los precios están en pesos mexicanos (MXN)
- Ofrecemos garantía de satisfacción con reembolso completo en los primeros 7 días si el producto no cumple con las especificaciones acordadas

4. Envíos y Entregas

- Tiempo de producción estándar: 3-5 días hábiles
- Envío express disponible con costo adicional
- Enviamos a toda la República Mexicana
- Los tiempos de entrega pueden variar según la ubicación

5. Propiedad Intelectual

Los clientes son responsables de asegurar que tienen los derechos necesarios sobre las imágenes y diseños que suben. Estampanda no se hace responsable por violaciones de derechos de autor.

6. Datos del Usuario y Privacidad

Recopilamos y almacenamos datos del usuario, incluyendo nombre, email e información de pago, según sea necesario para proporcionar nuestros servicios. Para detalles sobre cómo manejamos tus datos, consulta nuestra Política de Privacidad en https://estampanda.com/privacy-policy.

7. Cookies y Datos No Personales

Usamos cookies web para recopilar datos no personales con el propósito de mejorar nuestros servicios y experiencia del usuario.

8. Ley Aplicable

Estos Términos se rigen por las leyes de México.

9. Actualizaciones de los Términos

Podemos actualizar estos Términos ocasionalmente. Los usuarios serán notificados de cualquier cambio vía email.

Para preguntas o inquietudes sobre estos Términos de Servicio, contáctanos en hola@estampanda.com.

¡Gracias por usar Estampanda!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
