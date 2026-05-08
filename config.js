// Import daisyui themes - using require for better compatibility
const themes = require("daisyui/theme/object");

const config = {
  // REQUIRED
  appName: "Estampanda",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Convierte tus ideas en stickers únicos. Diseña, personaliza y recibe stickers de alta calidad con envío rápido.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "estampanda.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Configuración de planes para pedidos de stickers - Por ahora usaremos checkout único
    // Los planes de suscripción se pueden agregar más adelante
    plans: [
      {
        // Este será usado para productos individuales de stickers
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_sticker_dev"
            : "price_sticker_prod",
        name: "Stickers Personalizados",
        description: "Pago por pedido de stickers",
        // El precio será calculado dinámicamente basado en material, tamaño y cantidad
        price: 0,
        priceAnchor: 0,
        features: [
          {
            name: "Diseño personalizado",
          },
          { name: "Alta calidad de impresión" },
          { name: "Múltiples materiales" },
          { name: "Envío rápido" },
        ],
      },
    ],
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "estampanda",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: "#275D5C", // Verde azulado (teal) de Estampanda
    // Paleta de colores personalizada de Estampanda
    brand: {
      primary: "#275D5C", // Teal oscuro (color principal)
      secondary: "#3B7F7E", // Teal medio
      accent: "#4FA09F", // Teal claro
      cream: "#F5E6D3", // Beige/crema para fondos
      light: "#FBF7F2", // Crema más claro
      dark: "#1A3B3A", // Versión oscura del teal
      black: "#1A1A1A", // Negro suave
    },
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
  // Configuración específica de Estampanda
  stickers: {
    materials: [
      { id: "matte", name: "Mate", multiplier: 1 },
      { id: "glossy", name: "Brillante", multiplier: 1.1 },
      { id: "transparent", name: "Transparente", multiplier: 1.3 },
      { id: "holographic", name: "Holográfico", multiplier: 1.5 },
      { id: "glow-in-dark", name: "Brilla en la oscuridad", multiplier: 1.8 },
      { id: "metallic", name: "Metálico", multiplier: 2 },
    ],
    cutTypes: [
      { id: "square", name: "Cuadrado", multiplier: 1 },
      { id: "round", name: "Redondo", multiplier: 1.1 },
      { id: "oval", name: "Ovalado", multiplier: 1.15 },
      { id: "diecut", name: "Troquelado", multiplier: 1.3 },
      { id: "custom", name: "Personalizado", multiplier: 1.5 },
    ],
    sizes: {
      min: { width: 3, height: 3 },
      max: { width: 20, height: 20 },
      unit: "cm",
    },
    pricing: {
      basePrice: 0.5, // Precio base por sticker
      volumeDiscounts: [
        { min: 50, discount: 10 },
        { min: 100, discount: 20 },
        { min: 250, discount: 30 },
        { min: 500, discount: 40 },
        { min: 1000, discount: 50 },
      ],
    },
    production: {
      standardDays: 3,
      rushDays: 1,
      rushMultiplier: 1.5,
    },
    fileRequirements: {
      minDPI: 300,
      maxFileSize: 50, // MB
      acceptedFormats: [".jpg", ".jpeg", ".png", ".svg", ".ai", ".pdf", ".eps"],
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadPreset: "estampanda-stickers",
  },
};

export default config;
