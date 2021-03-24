module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Rajdhani', 'sans-serif']
    },
    extend: {
      colors: {
        blauw: "#001F48",
        rood: "#CB4B3D",
        
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
