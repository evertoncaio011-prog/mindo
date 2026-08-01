import type { Config } from "tailwindcss";

// Paleta calma e de baixo estímulo, pensada para foco e legibilidade (TDAH).
// Evitamos vermelhos fortes e contrastes agressivos: prioridade alta usa âmbar, não vermelho puro.
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Superfícies
        base: {
          DEFAULT: "#F7F8FA", // fundo claro — cinza-azulado bem suave
          dark: "#12151A",    // fundo escuro — quase-preto azulado, não puro preto
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1E25",
        },
        surfaceMuted: {
          DEFAULT: "#EEF1F5",
          dark: "#20252D",
        },
        border: {
          DEFAULT: "#E2E6EC",
          dark: "#2A2F38",
        },
        // Marca / foco
        focus: {
          50: "#EEF3FF",
          100: "#DCE7FF",
          400: "#7CA3F5",
          500: "#5B8DEF", // azul calmo — cor de assinatura do Mindo
          600: "#4472D6",
          700: "#345BB0",
        },
        // Conclusão / positivo
        calm: {
          100: "#DFF5EE",
          400: "#5FC4A7",
          500: "#3FB08E", // verde-menta — "concluído"
          600: "#2F8F72",
        },
        // Prioridade
        priority: {
          alta: "#E8955C",   // âmbar quente — chama atenção sem alarmar
          media: "#5B8DEF",  // azul de foco
          baixa: "#8B93A1",  // neutro
        },
        ink: {
          DEFAULT: "#1E2430",
          soft: "#5B6472",
          dark: "#E7EAF0",
          darkSoft: "#9AA3B2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.375rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(30, 36, 48, 0.06), 0 1px 2px rgba(30,36,48,0.04)",
        softLg: "0 12px 32px -12px rgba(30, 36, 48, 0.16)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.96)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "pop": "pop 0.18s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
