/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./LandingPage.jsx", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        orange: {
          50: "#effafa",
          100: "#d9f3f0",
          300: "#7dd3c7",
          400: "#2fb5aa",
          500: "#0f8b8d",
          600: "#0b6e70",
          700: "#115e59",
        },
      },
      keyframes: {
        "offer-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "offer-in": "offer-in .35s ease-out both",
      },
    },
  },
  plugins: [],
};
