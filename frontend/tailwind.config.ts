import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme version of your Deep Purple palette
        background: "#c5c3c4",
        surface: "#b7a2c9",
        primary: "#4b3a70",
        text: {
          DEFAULT: "#322f42",
          strong: "#212531",
        },
      },
    },
  },
  plugins: [],
};

export default config;
