/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0d0b09",
          900: "#17130f",
        },
        copper: {
          300: "#e0975a",
          500: "#b8632f",
        },
        verdigris: {
          400: "#6b9080",
        },
        bone: {
          100: "#ede7dd",
          300: "#c9bfae",
          400: "#a89c8a",
          500: "#7a6f60",
        },
      },
    },
  },
  plugins: [],
}