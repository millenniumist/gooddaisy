const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  // Existing configuration goes here
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Your existing content paths
  ],
  theme: {
    extend: {
      colors: {
        primary: '#AD8B73',
        secondary: '#E3CAA5',
      },
      boxShadow: {
        top: '0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    },
    fontFamily: {
      sans: ["Quicksand", "sans-serif"],
    },
  },
  plugins: [],
});

