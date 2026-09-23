/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rose: { 50: '#fff1f2', 100: '#ffe4e6', 600: '#e11d48', 700: '#be123c' },
        gold: { DEFAULT: '#D4AF37', light: '#F0D060' }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
