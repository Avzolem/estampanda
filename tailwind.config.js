/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores de Estampanda
        estampanda: {
          primary: "#275D5C", // Teal oscuro principal
          secondary: "#3B7F7E", // Teal medio
          accent: "#4FA09F", // Teal claro
          cream: "#F5E6D3", // Beige/crema para fondos
          light: "#FBF7F2", // Crema más claro
          dark: "#1A3B3A", // Versión oscura del teal
          black: "#1A1A1A", // Negro suave para texto
          // Variaciones adicionales
          'primary-light': "#368B8A",
          'primary-dark': "#1C4544",
          'cream-dark': "#E8D4BB",
        },
      },
      backgroundImage: {
        gradient:
          "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)",
        'estampanda-gradient': 
          "linear-gradient(135deg, #275D5C 0%, #4FA09F 50%, #F5E6D3 100%)",
        'estampanda-radial':
          "radial-gradient(circle at top right, #F5E6D3 0%, #FBF7F2 50%, #FFFFFF 100%)",
      },
      animation: {
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
        // Animaciones para stickers
        float: "float 6s ease-in-out infinite",
        peel: "peel 0.6s ease-out",
        stick: "stick 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        rotate3d: "rotate3d 8s linear infinite",
        bounce: "bounce 2s ease-in-out infinite",
      },
      keyframes: {
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)",
          },
          "30%, 60%": {
            transform: "rotate(-2deg)",
          },
          "40%, 70%": {
            transform: "rotate(2deg)",
          },
          "45%": {
            transform: "rotate(-4deg)",
          },
          "55%": {
            transform: "rotate(4deg)",
          },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        peel: {
          "0%": { 
            transform: "rotate3d(0, 0, 1, 0deg) scale(1)",
            opacity: "1",
          },
          "100%": { 
            transform: "rotate3d(1, 1, 0, 90deg) scale(0.8)",
            opacity: "0",
          },
        },
        stick: {
          "0%": { 
            transform: "scale(1.2) rotate(-5deg)",
            opacity: "0",
          },
          "50%": { 
            transform: "scale(0.9) rotate(3deg)",
          },
          "100%": { 
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
        },
        rotate3d: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // Light & dark themes are added by default (it switches automatically based on OS settings)
    // You can add another theme among the list of 30+
    // Add "data-theme='theme_name" to any HTML tag to enable the 'theme_name' theme.
    // https://daisyui.com/
    themes: [
      {
        estampanda: {
          primary: "#275D5C",
          "primary-focus": "#1C4544",
          "primary-content": "#FFFFFF",
          secondary: "#3B7F7E",
          "secondary-focus": "#2F6665",
          "secondary-content": "#FFFFFF",
          accent: "#4FA09F",
          "accent-focus": "#3E8786",
          "accent-content": "#FFFFFF",
          neutral: "#1A3B3A",
          "neutral-focus": "#0F2322",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#FBF7F2",
          "base-300": "#F5E6D3",
          "base-content": "#1A1A1A",
          info: "#4FA09F",
          success: "#4CAF50",
          warning: "#FFA726",
          error: "#EF5350",
        },
      },
      "light",
      "dark",
    ],
  },
};
