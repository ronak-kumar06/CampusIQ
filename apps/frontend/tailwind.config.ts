import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'blush-pink': '#FFE4E1',
        'lavender': '#E8E4F0',
        'mint': '#E4F5F0',
        'soft-yellow': '#FFF8E7',
        'soft-blue': '#E7F3FF',
        'soft-bg': '#FAFAFA',
        'soft-text': '#2D2D2D',
        'accent': '#A78BFA',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
};
export default config;
