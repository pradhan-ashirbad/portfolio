import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        brand: {
          teal: "#2dd4bf",
          sky: "#38bdf8",
          violet: "#a855f7",
          pink: "#f472b6",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(60px,-40px) scale(1.1)" },
          "66%": { transform: "translate(-40px,50px) scale(0.95)" },
        },
        "float-up": {
          "0%": { transform: "translateY(100vh)", opacity: "0" },
          "10%, 90%": { opacity: "0.5" },
          "100%": { transform: "translateY(-10vh)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease both",
        drift: "drift 22s ease-in-out infinite",
        "float-up": "float-up linear infinite",
        marquee: "marquee 32s linear infinite",
        "spin-slow": "spin-slow 9s linear infinite",
        shimmer: "shimmer 6s linear infinite",
      },
      backgroundImage: {
        "brand-grad":
          "linear-gradient(135deg, #2dd4bf, #38bdf8, #a855f7)",
      },
    },
  },
  plugins: [],
};

export default config;
