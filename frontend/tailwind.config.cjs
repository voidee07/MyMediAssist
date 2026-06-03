/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts,js,jsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#34d399', // teal-400 – bright for light mode
        'primary-dark': '#059669', // teal-600 – for dark mode
      },
    },
  },
  plugins: [],
};
