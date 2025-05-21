import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5722",
          dark: "#E64A19",
          light: "#FFCCBC",
        },
        secondary: {
          DEFAULT: "#2196F3",
          dark: "#1976D2",
          light: "#BBDEFB",
        },
        accent: {
          DEFAULT: "#FFC107",
          dark: "#FFA000",
          light: "#FFECB3",
        },
        background: "#121212",
        surface: "#1E1E1E",
        text: {
          primary: "#FFFFFF",
          secondary: "#B0B0B0",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        heading: ["var(--font-montserrat)", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/images/hero-bg.jpg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}

export default config
