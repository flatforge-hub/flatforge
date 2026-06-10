/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#d4d4d8',
            a: { color: '#a78bfa' },
            strong: { color: '#f4f4f5' },
            code: { color: '#a78bfa' },
          },
        },
      },
    },
  },
  plugins: [],
}
