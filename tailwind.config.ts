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
        general: ["var(--general)"],
        roobert: ["var(--roobert)"],
        zentry: ["var(--zentry)"],
      },
      fontSize: {
        "h1-desktop": "var(--h1-desktop)",
        "h1-mobile": "var(--h1-mobile)",
        "h2-desktop": "var(--h2-desktop)",
        "h2-mobile": "var(--h2-mobile)",
        h3: "var(--h3)",
        "body-desktop": "var(--body-desktop)",
        "body-mobile": "var(--body-mobile)",
        caption: "var(--caption)",
      },
      colors: {
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        // blue: {
        //   50: "#DFDFF0",
        //   75: "#dfdff2",
        //   100: "#F0F2FA",
        //   200: "#010101",
        //   300: "#4FB7DD",
        // },
        // violet: {
        //   // accent
        //   300: "#5724ff",
        // },
        // yellow: {
        //   100: "#8e983f",

        //   // primary
        //   300: "#edff66",
        // },
      },
    },
  },
  plugins: [],
} satisfies Config;
