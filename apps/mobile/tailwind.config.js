/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#271D2A",
        plum: "#4A294F",
        berry: "#A23D72",
        rose: "#D96C8A",
        petal: "#FBE4EC",
        coral: "#D97861",
        peach: "#FFE2D1",
        lavender: "#DCD3F7",
        lilac: "#F0EAFE",
        teal: "#357C7C",
        aqua: "#DFF4F1",
        sage: "#8DAE9B",
        mint: "#E6F4EA",
        amber: "#D79A2B",
        honey: "#FFF0C9",
        blush: "#F8E6E2",
        linen: "#FFF7F1",
        cream: "#FFFDF9",
      },
      borderRadius: {
        ui: "8px",
      },
    },
  },
  plugins: [],
};
