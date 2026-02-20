/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          200: '#c4b5fd',
          400: '#8b5cf6',
          500: '#7c3aed',
          700: '#5b21b6',
        },
        sand: {
          50: '#fffaf2',
          100: '#f5f1ea',
          200: '#efe8dc',
          300: '#e7dccb',
          500: '#a38e78',
          700: '#6b6258',
          900: '#2f2a24',
        },
        wood: {
          300: '#b18b68',
          400: '#9a7657',
          500: '#8d6b4f',
          600: '#7a5b42',
        },
      },
      boxShadow: {
        glow: '0 0 35px rgba(139, 92, 246, 0.35)',
        warm: '0 16px 42px rgba(91, 74, 53, 0.16)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '50%': { transform: 'translateX(8px) translateY(-8px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 5s ease-in-out infinite',
        drift: 'drift 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

