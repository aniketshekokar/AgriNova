/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
          950: '#0d3c0e',
        },
        accent: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF59D',
          400: '#FBC02D',
          500: '#F9A825',
          600: '#F57F17',
          700: '#E65100',
        },
        brandBg: '#F7FAF5',
        brandDarkText: '#1B1B1B',
        brandSecText: '#667085',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'emerald': '0 10px 25px -5px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
