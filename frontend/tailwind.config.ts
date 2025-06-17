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
        // Light theme colors
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F1F5F9",
        },
        text: {
          primary: "#334155",
          secondary: "#64748B",
        },
        border: {
          DEFAULT: "#E2E8F0",
          light: "#F1F5F9",
        },
        // Admin theme colors (dark)
        admin: {
          background: "#121212",
          surface: "#1E1E1E",
          text: {
            primary: "#FFFFFF",
            secondary: "#B0B0B0",
          },
          border: "#374151",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        heading: ["var(--font-montserrat)", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/images/hero-bg.jpg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, rgba(255, 87, 34, 0.9) 0%, rgba(33, 150, 243, 0.8) 100%)",
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        large: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}

export default config
