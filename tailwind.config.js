module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Arboria', 'sans-serif']
    },
    extend: {
      colors: {
        blauw: "#001F48",
        rood: "#CB4B3D",
        
      },
      width: {
        '128': '32rem',
      },
      height: {
        '128': '32rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
