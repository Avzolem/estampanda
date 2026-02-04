"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CreditCardIcon,
  TruckIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [configuration, setConfiguration] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Shipping
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "México",
    
    // Notes
    notes: "",
  });

  useEffect(() => {
    // Load configuration from sessionStorage
    const savedConfig = sessionStorage.getItem("stickerConfiguration");
    if (savedConfig) {
      setConfiguration(JSON.parse(savedConfig));
    } else {
      // Redirect if no configuration
      router.push("/stickers/designer");
    }
  }, [router]);

  const steps = [
    { id: 1, name: "Datos personales", icon: UserIcon },
    { id: 2, name: "Dirección de envío", icon: TruckIcon },
    { id: 3, name: "Pago", icon: CreditCardIcon },
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "Nombre requerido";
      if (!formData.lastName) newErrors.lastName = "Apellido requerido";
      if (!formData.email) newErrors.email = "Email requerido";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
      if (!formData.phone) newErrors.phone = "Teléfono requerido";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = "Teléfono debe ser de 10 dígitos";
    }
    
    if (step === 2) {
      if (!formData.street) newErrors.street = "Dirección requerida";
      if (!formData.city) newErrors.city = "Ciudad requerida";
      if (!formData.state) newErrors.state = "Estado requerido";
      if (!formData.zipCode) newErrors.zipCode = "Código postal requerido";
      else if (!/^\d{5}$/.test(formData.zipCode)) newErrors.zipCode = "CP debe ser de 5 dígitos";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePayment = async () => {
    if (!validateStep(2)) return;
    
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        designUrl: configuration.designFile?.cloudinaryUrl || configuration.designFile?.url,
        designThumbnail: configuration.designFile?.thumbnailUrl,
        designId: configuration.designFile?.designId,
        material: configuration.material?.type,
        size: {
          width: configuration.size?.width,
          height: configuration.size?.height,
          unit: "cm"
        },
        cutType: configuration.cutType?.type,
        quantity: configuration.quantity,
        unitPrice: configuration.pricing?.unitPrice,
        totalPrice: configuration.pricing?.total,
        discount: configuration.pricing?.discount || 0,
        notes: formData.notes || configuration.notes,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: "card", // Por ahora, hasta integrar Stripe
        paymentIntentId: `temp_${Date.now()}`, // Temporal hasta integrar Stripe
      };

      // Create order in database
      const response = await fetch('/api/orders', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData) 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error creating order');
      }

      // TODO: Integrate with Stripe
      // const stripe = await stripePromise;
      // Create checkout session on backend
      // const checkoutResponse = await fetch('/api/stripe/create-checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderId: result.order._id })
      // });
      // const { sessionId } = await checkoutResponse.json();
      // const { error } = await stripe.redirectToCheckout({ sessionId });

      toast.success("¡Pedido creado exitosamente!");
      
      // Save order info for success page
      sessionStorage.setItem("lastOrder", JSON.stringify({
        orderNumber: result.order.orderNumber,
        orderId: result.order._id,
        total: result.order.totalPrice,
        email: formData.email
      }));
      
      // Clear configuration
      sessionStorage.removeItem("stickerConfiguration");
      
      // Redirect to success page
      router.push(`/stickers/success?order=${result.order.orderNumber}`);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Error al procesar el pedido. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!configuration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-[#275D5C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF7F2] via-white to-[#F5E6D3]/20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <button
              onClick={() => router.push("/stickers/designer")}
              className="self-start sm:self-auto flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Volver al diseñador</span>
            </button>

            {/* Steps */}
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8 overflow-x-auto w-full sm:w-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1 sm:gap-2 ${
                      currentStep === step.id
                        ? "text-[#275D5C] font-semibold"
                        : currentStep > step.id
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                        currentStep === step.id
                          ? "bg-[#275D5C] text-white"
                          : currentStep > step.id
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <span className="hidden sm:inline text-sm sm:text-base">{step.name}</span>
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden sm:block w-12 sm:w-16 md:w-20 h-0.5 ${
                          currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block w-24" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Data */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-[#275D5C] mb-4 sm:mb-6">
                      Datos personales
                    </h2>
                    
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Juan"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Pérez"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                              errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="juan@ejemplo.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="55 1234 5678"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C]"
                        rows="3"
                        placeholder="Instrucciones especiales para tu pedido..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <h2 className="text-2xl font-bold text-[#275D5C] mb-6">
                      Dirección de envío
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calle y número *
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => handleInputChange("street", e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                              errors.street ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Av. Insurgentes Sur 123"
                          />
                        </div>
                        {errors.street && (
                          <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                              errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Ciudad de México"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado *
                          </label>
                          <select
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                              errors.state ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Selecciona...</option>
                            <option value="CDMX">Ciudad de México</option>
                            <option value="JAL">Jalisco</option>
                            <option value="NL">Nuevo León</option>
                            <option value="MEX">Estado de México</option>
                            <option value="PUE">Puebla</option>
                            <option value="GTO">Guanajuato</option>
                            <option value="QRO">Querétaro</option>
                            <option value="VER">Veracruz</option>
                            <option value="YUC">Yucatán</option>
                          </select>
                          {errors.state && (
                            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275D5C] ${
                              errors.zipCode ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="01234"
                            maxLength="5"
                          />
                          {errors.zipCode && (
                            <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            País
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <TruckIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            Envío gratis en pedidos mayores a 100 unidades
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Tiempo estimado de entrega: 3-5 días hábiles
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <h2 className="text-2xl font-bold text-[#275D5C] mb-6">
                      Método de pago
                    </h2>

                    <div className="space-y-4">
                      {/* Stripe Payment */}
                      <div className="p-6 border-2 border-[#275D5C] rounded-xl bg-gradient-to-br from-[#F5E6D3]/10 to-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <CreditCardIcon className="w-8 h-8 text-[#275D5C]" />
                            <div>
                              <p className="font-semibold text-gray-800">
                                Pago seguro con tarjeta
                              </p>
                              <p className="text-sm text-gray-600">
                                Procesado por Stripe
                              </p>
                            </div>
                          </div>
                          <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                        </div>

                        <div className="flex gap-2 mb-4">
                          <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-8" />
                          <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-8" />
                          <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-8" />
                        </div>

                        <p className="text-xs text-gray-500">
                          Tu información de pago está protegida con encriptación SSL.
                          Stripe procesa millones de pagos seguros cada día.
                        </p>
                      </div>

                      {/* Security badges */}
                      <div className="flex items-center justify-center gap-4 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <ShieldCheckIcon className="w-5 h-5" />
                          <span className="text-sm">256-bit SSL</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="text-sm">PCI Compliant</span>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-[#275D5C] rounded focus:ring-[#275D5C]"
                            required
                          />
                          <span className="text-sm text-gray-600">
                            Al realizar este pedido, acepto los{" "}
                            <a href="#" className="text-[#275D5C] underline">
                              términos y condiciones
                            </a>{" "}
                            y la{" "}
                            <a href="#" className="text-[#275D5C] underline">
                              política de privacidad
                            </a>
                            .
                          </span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all w-full sm:w-auto order-2 sm:order-1 ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border-2 border-[#275D5C] text-[#275D5C] hover:bg-[#F5E6D3]"
                  }`}
                >
                  <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Anterior
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#275D5C] text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-[#3B7F7E] transition-colors w-full sm:w-auto order-1 sm:order-2"
                  >
                    Siguiente
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-all w-full sm:w-auto order-1 sm:order-2 ${
                      isProcessing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#275D5C] to-[#4FA09F] text-white hover:shadow-lg"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-lg h-5 w-5 border-b-2 border-white"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="w-5 h-5" />
                        Pagar ahora
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Resumen del pedido
                </h3>

                {configuration && (
                  <div className="space-y-4">
                    {/* Design preview */}
                    {configuration.designFile?.preview && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={configuration.designFile.preview}
                          alt="Tu diseño"
                          className="w-full h-32 object-contain"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-semibold">{configuration.material?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tamaño:</span>
                        <span className="font-semibold">
                          {configuration.size?.width} x {configuration.size?.height} cm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo de corte:</span>
                        <span className="font-semibold">{configuration.cutType?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cantidad:</span>
                        <span className="font-semibold">{configuration.quantity} unidades</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>${configuration.pricing?.subtotal || 0}</span>
                      </div>
                      {configuration.pricing?.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Descuento:</span>
                          <span>-${configuration.pricing?.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío:</span>
                        <span className="text-green-600">
                          {configuration.quantity >= 100 ? "Gratis" : "$50"}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-[#275D5C]">
                          ${configuration.pricing?.total || 0}
                        </span>
                      </div>
                    </div>

                    {/* Guarantee */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-900">
                            Garantía de satisfacción
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Si no estás satisfecho, te devolvemos tu dinero
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}