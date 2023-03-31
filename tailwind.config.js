/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // "background" : "#242933",
        // "background-light" : "#2a303c",
        // "primary" : "#6219e2",
        // "primary-dark" : "#5014b8",
        // "secondary" : "#fbbd26",
        // "accent" : "#a6adba",
        // "accent-dark" : "#3e444e",
        "modal" : "#00000088",

      }
    },
  },
  plugins: [
    require("daisyui"),
    require('tailwind-scrollbar')
  ],
  daisyui: {
    themes: ["dark"],
  },
}