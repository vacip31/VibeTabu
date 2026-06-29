/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./games/verses/index.html", "./games/verses/js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0C0A09",
        surface: "#16130a",
        "surface-container": "#231f15",
        "surface-container-high": "#2d2a1f",
        "surface-container-highest": "#393429",
        primary: "#efc72d",
        "on-primary": "#3b2f00",
        "primary-container": "#d1ac00",
        "on-primary-container": "#514100",
        "on-surface": "#eae2d2",
        "on-surface-variant": "#d0c6ad",
        "outline-variant": "#4d4633",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        secondary: "#ccc7a8"
      },
      spacing: {
        "container-padding": "24px",
        "gutter": "20px",
        "safe-area-bottom": "32px",
        base: "4px",
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "40px",
        xl: "64px"
      },
      fontFamily: {
        mono: ["Courier Prime", "monospace"],
        h1: ["Inter", "sans-serif"],
        "h1-mobile": ["Inter", "sans-serif"],
        h2: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        "verse-body": ["Playfair Display", "serif"],
        "verse-display": ["Playfair Display", "serif"],
        "label-caps": ["Inter", "sans-serif"],
        "mono-meta": ["Courier Prime", "monospace"]
      },
      fontSize: {
        "mono-meta": ["14px", { "lineHeight": "1.4", "fontWeight": "400" }],
        "h2": ["20px", { "lineHeight": "1.3", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "h1-mobile": ["24px", { "lineHeight": "1.2", "fontWeight": "700" }],
        "h1": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "verse-body": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "verse-display": ["24px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "label-caps": ["12px", { "lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600" }]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
};
