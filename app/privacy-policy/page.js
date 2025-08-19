import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// Política de privacidad para Estampanda
// Actualizada para el sitio de stickers personalizados

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Última actualización: 2025-08-19

Gracias por visitar Estampanda ("nosotros", "nuestro"). Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestro sitio web https://estampanda.com (el "Sitio").

Al acceder o usar el Sitio, aceptas los términos de esta Política de Privacidad. Si no estás de acuerdo con estas prácticas, por favor no uses el Sitio.

1. Información que Recopilamos

1.1 Datos Personales

Recopilamos la siguiente información personal:

Nombre: Para personalizar tu experiencia y comunicarnos contigo efectivamente.
Email: Para enviarte información importante sobre tus pedidos, actualizaciones y comunicación.
Información de Pago: Para procesar tus pedidos de forma segura. No almacenamos tu información de pago en nuestros servidores. Los pagos son procesados por Stripe.

1.2 Datos No Personales

Podemos usar cookies y tecnologías similares para recopilar información no personal como tu dirección IP, tipo de navegador, información del dispositivo y patrones de navegación. Esta información nos ayuda a mejorar tu experiencia, analizar tendencias y mejorar nuestros servicios.

2. Propósito de la Recopilación de Datos

Recopilamos y usamos tus datos personales para el procesamiento de pedidos. Esto incluye procesar tus pedidos de stickers, enviar confirmaciones, proporcionar soporte al cliente y mantenerte actualizado sobre el estado de tus pedidos.

3. Compartir Datos

No compartimos tus datos personales con terceros excepto cuando es necesario para procesar pedidos (por ejemplo, compartir tu información con procesadores de pago). No vendemos, intercambiamos o alquilamos tu información personal.

4. Privacidad de Menores

Estampanda no está dirigido a menores de 13 años. No recopilamos conscientemente información personal de niños. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos.

5. Actualizaciones a la Política de Privacidad

Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por razones operativas, legales o regulatorias. Las actualizaciones serán publicadas en esta página.

6. Información de Contacto

Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad, contáctanos en:

Email: hola@estampanda.com
WhatsApp: +52 555 123 4567

Para otras consultas, visita nuestra página de Contacto en el Sitio.

Al usar Estampanda, consientes los términos de esta Política de Privacidad.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
