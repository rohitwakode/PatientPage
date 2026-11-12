/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        primary: '#0071E3',
        brand: {
          DEFAULT: '#0071E3',
          dark: '#0066CC',
          soft: '#F5F5F7',
        },
        ink: '#1D1D1F',
        steel: '#6E6E73',
        mist: '#F5F5F7',
        line: '#D2D2D7',
        warm: '#0071E3',
      }
    },
  },
  plugins: [],
}