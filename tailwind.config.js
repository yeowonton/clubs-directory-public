module.exports = {
  content: ["./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      fontFamily: { display: ['"Playfair Display"', 'serif'] },
      colors: {
        brand:   '#dc143c', // classic crimson
        brand500:'#c11235',
        brand600:'#a50f2d',
        brand700:'#8b0c25',
        brand800:'#72081d',
      }
    },
  },
  plugins: [],
};