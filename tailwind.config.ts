import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cad: {
          950: "#060911",
          900: "#0B0F19",
          850: "#101625",
          800: "#151D30",
          750: "#1C263E",
          700: "#243252",
          600: "#32446D",
          500: "#495F93",
          400: "#7089BD",
          300: "#9EB2DD",
          200: "#C8D5F0",
          100: "#E6EDFA",
          50: "#F3F7FD",
        },
        cyan: {
          DEFAULT: "#00F0FF",
          50: "#F0FDFF",
          100: "#CBF7FD",
          200: "#97EEFA",
          300: "#5CE2F5",
          400: "#18D1EE",
          500: "#00F0FF",
          600: "#00B4D8",
          700: "#0088A3",
          800: "#005E72",
          900: "#023E4C",
        },
        electric: {
          DEFAULT: "#0EA5E9",
          glow: "rgba(14, 165, 233, 0.2)",
          bright: "#38BDF8",
          deep: "#0284C7",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "cad-grid-pattern": "linear-gradient(to right, rgba(0, 240, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px)",
        "cad-blueprint": "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 70%)",
        "glass-gradient": "linear-gradient(135deg, rgba(21, 29, 48, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
      },
      boxShadow: {
        "cyan-glow": "0 0 20px -3px rgba(0, 240, 255, 0.3)",
        "cyan-glow-sm": "0 0 10px -2px rgba(0, 240, 255, 0.25)",
        "blue-glow": "0 0 25px -4px rgba(14, 165, 233, 0.35)",
        "cad-panel": "0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(36, 50, 82, 0.6)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 8s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

