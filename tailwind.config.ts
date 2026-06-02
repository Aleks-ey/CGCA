// Tailwind v4 uses CSS-first configuration.
// This file is kept for tooling compatibility (e.g. prettier-plugin-tailwindcss).
// Primary configuration lives in src/styles/globals.css via @theme directive.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
