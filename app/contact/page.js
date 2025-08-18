"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
        <p className="text-lg mb-8 text-gray-600">
          Estamos aquí para ayudarte con tus stickers personalizados
        </p>
        
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">WhatsApp</h2>
            <p className="text-gray-600 mb-4">Respuesta inmediata</p>
            <a 
              href="https://wa.me/523322330281?text=Hola!%20Quiero%20información%20sobre%20stickers%20personalizados"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Enviar WhatsApp
            </a>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-gray-600">
              <a href="mailto:info@estampanda.com" className="text-blue-600 hover:underline">
                info@estampanda.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}