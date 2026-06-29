/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/hub.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        surface: "#161e31",
        primary: "#00f2fe",
        secondary: "#ff7a00",
        accent: "#8b5cf6",
        fuchsia: "#d946ef",
        neutral: "#a6abc0",
        error: "#ff7a00",
        warning: "#00f2fe",
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
