/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': { 'max': '500px' },    // mobile até 499px
      'md': { 'max': '768px' },    // tablet até 767px
      'lg': { 'max': '1023px' },   // desktop até 1023px
      'xl': { 'max': '1279px' },   // large desktop até 1279px
      '2xl': { 'max': '1535px' },  // extra large até 1535px
    },
  },
  plugins: [],
}
