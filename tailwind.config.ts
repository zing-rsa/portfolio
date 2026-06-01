import type { Config } from "tailwindcss";

/**
 * Black-and-white terminal palette. Everything is expressed as shades of a
 * single ink/paper pair so the whole site stays strictly monochrome; "accent"
 * shades are only used for low-/high-lighting, never colour.
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./site.config.ts",
  ],
  theme: {
    extend: {
      colors: {
        // ink = foreground, paper = background; every component themes from these.
        ink: {
          DEFAULT: "#e8e8e8",
          muted: "#8a8a8a",
          faint: "#5a5a5a",
        },
        paper: {
          DEFAULT: "#0a0a0a",
          faint: "#141414",
          muted: "#1f1f1f",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
