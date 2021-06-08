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
        blauw2: "#193459",
        rood: "#CB4B3D",
        
      },
      width: {
        '128': '32rem',
      },
      height: {
        '128': '32rem',
      },
      screens: {
        '3xl': '1840px'
      },
      maxWidth: {
        'max-w-screen-3xl': '1840px'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
