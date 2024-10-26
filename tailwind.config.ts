import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customColor: '#efc0b2',
        customColor2: '#efc0b2',
        customfontColor: '#9b4831',
        customfontColor2: '#7e3c2e',
      },
    },
  },
  plugins: [],
};
export default config;
