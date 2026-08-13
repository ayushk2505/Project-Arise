/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "rgb(var(--color-void) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        cardhi: "rgb(var(--color-cardhi) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          secondary: "rgb(var(--color-accent-2) / <alpha-value>)",
          purple: "#8B5CF6",
          blue: "#3B82F6",
          cyan: "#22D3EE",
        },
        xp: "#22D3EE",
        danger: "#EF4444",
        gold: "#F5C453",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(139, 92, 246, 0.35), 0 0 40px rgba(34, 211, 238, 0.15)",
        "glow-cyan": "0 0 16px rgba(34, 211, 238, 0.45)",
        "glow-gold": "0 0 16px rgba(245, 196, 83, 0.45)",
        "glow-accent": "0 0 20px rgb(var(--color-accent) / 0.35), 0 0 36px rgb(var(--color-accent-2) / 0.18)",
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)",
        "system-gradient": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #22D3EE 100%)",
        "accent-gradient":
          "linear-gradient(135deg, rgb(var(--color-accent)) 0%, rgb(var(--color-accent-2)) 100%)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "counter-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "counter-pop": "counter-pop 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
