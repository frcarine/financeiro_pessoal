/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f3ff',
          100: '#eee7ff',
          200: '#ddd3ff',
          500: '#a78bfa',
          600: '#8b7cf6',
          700: '#7467df'
        },
        pastel: {
          mint: '#c8f7dc',
          mintText: '#237553',
          rose: '#ffd6df',
          roseText: '#9f3f55',
          peach: '#ffe4c7',
          lilac: '#e8ddff',
          sky: '#d9f0ff',
          ink: '#51465f',
          muted: '#8a7f94',
          paper: '#fffaf6',
          line: '#eadff2'
        }
      }
    }
  },
  plugins: []
};
