/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#FE0000",
          cream: "#ECF1E5",
          light: "#6EAD50",
          dark: "#0D6628",
        },
      },
    },
  },
  plugins: [],
};
