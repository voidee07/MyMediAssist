// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#28a745', // green for light mode
        'primary-dark': '#06b6d4', // teal for dark mode accent
      },
    },
  },
  plugins: [],
};
