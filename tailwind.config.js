/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "modal" : "#00000088",

      }
    },
  },
  plugins: [
    require("daisyui"),
    require('tailwind-scrollbar')
  ],
  daisyui: {
    themes: ["light"],
  },
}