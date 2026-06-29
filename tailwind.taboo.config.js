/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./games/taboo/index.html", "./games/taboo/js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#121420",
        surface: "#2d3047",
        primary: "#1b998b",
        secondary: "#ff9b71",
        error: "#ed217c",
        warning: "#fffd82",
        "on-surface-variant": "#a6abc0"
      },
      spacing: {
        "container-padding": "24px",
        "gutter": "16px",
        "safe-area-bottom": "32px"
      },
      fontFamily: {
        display: ["Inter"],
        body: ["Inter"]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
};
