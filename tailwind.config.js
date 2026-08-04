/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { government: { 50: '#f1f7fb', 100: '#dcecf7', 200: '#bfdced', 600: '#135d8d', 700: '#0d4974', 800: '#093b60', 900: '#082c49' } },
      boxShadow: { card: '0 12px 35px -18px rgba(8, 44, 73, .28)' }
    }
  },
  plugins: []
};

