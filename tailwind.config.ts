import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#bfddf9",
        secondary: "#d2fcb2",
        background: "#ffffff",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        header: ["var(--font-header)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
