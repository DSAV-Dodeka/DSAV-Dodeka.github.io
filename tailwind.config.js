const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Rajdhani', 'sans-serif']
    },
    extend: {
      colors: {
        dsav_blauw: "#001F48",
        tartan_rood: "#CB4B3D",
        
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
