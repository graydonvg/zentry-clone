import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "circular-web": ["circular-web", "sans-serif"],
        general: ["general", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
        zentry: ["zentry", "sans-serif"],
      },
      fontSize: {
        "h1-lg": "var(--h1-lg)",
        "h1-sm": "var(--h1-sm)",
        "h2-lg": "var(--h2-lg)",
        "h2-sm": "var(--h2-sm)",
        h3: "var(--h3)",
        "body-lg": "var(--body-lg)",
        "body-sm": "var(--body-sm)",
        caption: "var(--caption)",
      },
      colors: {
        blue: {
          50: "#DFDFF0",
          75: "#dfdff2",
          100: "#F0F2FA",
          200: "#010101",
          300: "#4FB7DD",
        },
        violet: {
          300: "#5724ff",
        },
        yellow: {
          100: "#8e983f",
          300: "#edff66",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
