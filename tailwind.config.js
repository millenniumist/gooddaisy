// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#AD8B73',
        secondary: '#E3CAA5'
      },
      boxShadow: {
        top: '0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
