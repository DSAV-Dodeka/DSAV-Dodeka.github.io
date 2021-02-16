const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dsav_blauw: "#001F48",
        tartan_rood: "#BB4B3D",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
