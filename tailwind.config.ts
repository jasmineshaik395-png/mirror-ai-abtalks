import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12141B",
        "ink-raised": "#191C25",
        "ink-line": "#2A2E3A",
        paper: "#EDEAE3",
        "paper-dim": "#8D909C",
        insight: "#C9A15A",
        "insight-dim": "#8A754A",
        before: "#B98B7A",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "seam-gradient": "linear-gradient(180deg, transparent, rgba(201,161,90,0.35), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
