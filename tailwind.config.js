// This Tailwind configuration defines where utility classes are scanned and extends the design system used by the app.
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Inter var', ...defaultTheme.fontFamily.sans],
        arabic: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        gold:  '0 4px 20px rgba(212, 175, 55, 0.3)',
        green: '0 4px 20px rgba(21, 128, 61, 0.3)',
      },
      colors: {
        primary: {
          DEFAULT: '#15803d',
          hover:   '#166534',
          light:   '#dcfce7',
          dark:    '#14532d',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light:   '#F5E6A3',
          dark:    '#B8960C',
          hover:   '#C9A227',
        },
        // Warm light palette
        warm: {
          50:  '#faf7f2',
          100: '#f2ede6',
          200: '#ede8e0',
          300: '#ddd6c8',
          400: '#c8bea8',
          500: '#a8987e',
          600: '#7a6c56',
          700: '#5a4e38',
          800: '#3a2e20',
          900: '#2c2416',
        },
      },
      spacing: {
        'form-field': '16px',
      },
    },
  },
};
