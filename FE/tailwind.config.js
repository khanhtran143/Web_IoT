/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#f2fbf7",
          100: "#e1f6ee",
          200: "#c3edd9",
          300: "#9ee1c0",
          400: "#79d5ab",
          500: "#6ec8a2",
          600: "#62c199", // EXACT LX 2735 T color
          700: "#4fae86",
          800: "#3d916e",
          900: "#2d7054",
          950: "#163f2e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(16, 185, 129, 0.2), 0 0 10px rgba(16, 185, 129, 0.2)" },
          "100%": { boxShadow: "0 0 15px rgba(16, 185, 129, 0.5), 0 0 25px rgba(16, 185, 129, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};
