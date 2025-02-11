const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", flowbite.content()],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [flowbite.plugin()],
};
