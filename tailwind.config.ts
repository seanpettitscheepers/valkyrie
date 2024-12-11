import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF5D8F",
          foreground: "#FFFFFF",
          50: "#FFF0F5",
          100: "#FFE1EB",
          200: "#FFC3D7",
          300: "#FFA5C3",
          400: "#FF87AF",
          500: "#FF5D8F",
          600: "#FF2E6F",
          700: "#FF004F",
          800: "#D1003F",
          900: "#A3002F",
        },
        secondary: {
          DEFAULT: "#FF8F5D",
          foreground: "#FFFFFF",
          50: "#FFF4F0",
          100: "#FFE9E1",
          200: "#FFD3C3",
          300: "#FFBDA5",
          400: "#FFA787",
          500: "#FF8F5D",
          600: "#FF772E",
          700: "#FF5F00",
          800: "#D14D00",
          900: "#A33C00",
        },
        accent: {
          DEFAULT: "#FF7171",
          foreground: "#FFFFFF",
          50: "#FFF2F2",
          100: "#FFE6E6",
          200: "#FFCCCC",
          300: "#FFB3B3",
          400: "#FF9999",
          500: "#FF7171",
          600: "#FF4747",
          700: "#FF1F1F",
          800: "#E60000",
          900: "#B30000",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        slideIn: "slideIn 0.3s ease-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #FF5D8F 0%, #FF8F5D 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #FFF0F5 0%, #FFF4F0 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;