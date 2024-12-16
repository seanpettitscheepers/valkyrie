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
          DEFAULT: "#496946",
          foreground: "#EBE5D5",
          50: "#F2F7F2",
          100: "#E5EFE5",
          200: "#CCDFCC",
          300: "#B2CFB2",
          400: "#99BF99",
          500: "#496946",
          600: "#3A543A",
          700: "#2C402C",
          800: "#1D2B1D",
          900: "#0F160F",
        },
        secondary: {
          DEFAULT: "#858071",
          foreground: "#EBE5D5",
          50: "#F5F4F2",
          100: "#EBEAE6",
          200: "#D6D4CD",
          300: "#C2BEB4",
          400: "#ADA89B",
          500: "#858071",
          600: "#6A665A",
          700: "#504D44",
          800: "#35332D",
          900: "#1B1A17",
        },
        accent: {
          DEFAULT: "#C2B8B0",
          foreground: "#1F1E1B",
          50: "#FAF9F8",
          100: "#F5F3F2",
          200: "#EBE7E5",
          300: "#E1DBD8",
          400: "#D7CFCB",
          500: "#C2B8B0",
          600: "#9B8D82",
          700: "#746A61",
          800: "#4D4641",
          900: "#272320",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#C2B8B0",
          foreground: "#858071",
        },
        card: {
          DEFAULT: "#EBE5D5",
          foreground: "#1F1E1B",
        },
        popover: {
          DEFAULT: "#EBE5D5",
          foreground: "#1F1E1B",
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
        'gradient-brand': 'linear-gradient(135deg, #496946 0%, #858071 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #EBE5D5 0%, #C2B8B0 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;