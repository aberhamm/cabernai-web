const { fontFamily } = require('tailwindcss/defaultTheme')
const { addVariablesForColors } = require('./src/lib/tailwind-plugins')
const svgToDataUri = require('mini-svg-data-uri')
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundImage: {
        'primary-gradient': 'var(--primary-gradient)',
        'secondary-gradient': 'var(--secondary-gradient)',
        'tertiary-gradient': 'var(--tertiary-gradient)',
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'var(--destructive-foreground)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'var(--warning-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        'cabernet-red': {
          DEFAULT: '#7b2c2f',
          100: '#edcdce',
          200: '#db9b9d',
          300: '#c9686c',
          400: '#ae3f42',
          500: '#7b2c2f',
          600: '#632426',
          700: '#4a1b1c',
          800: '#311213',
          900: '#190909',
        },
        'ivory-white': {
          DEFAULT: '#fdfdf5',
          100: '#fffffd',
          200: '#fefefc',
          300: '#fefefa',
          400: '#fefef8',
          500: '#fdfdf5',
          600: '#ededa3',
          700: '#dcdc50',
          800: '#a7a721',
          900: '#535310',
        },
        'muted-gold': {
          DEFAULT: '#c9a66b',
          100: '#f4ede1',
          200: '#e9dbc3',
          300: '#dfc9a5',
          400: '#d4b887',
          500: '#c9a66b',
          600: '#b48a41',
          700: '#876731',
          800: '#5a4520',
          900: '#2d2210',
        },
        'flint-gray': {
          DEFAULT: '#4a4a48',
          100: '#F5F5F5',
          200: '#b7b7b6',
          300: '#939391',
          400: '#6f6f6d',
          500: '#4a4a48',
          600: '#3c3c3b',
          700: '#2d2d2c',
          800: '#1e1e1d',
          900: '#0f0f0f',
        },
        'mega-purple': {
          DEFAULT: '#3c2f41',
          100: '#dad1de',
          200: '#b5a3bc',
          300: '#90759b',
          400: '#67516f',
          500: '#3c2f41',
          600: '#302634',
          700: '#241c27',
          800: '#18131a',
          900: '#0c090d',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        aurora: {
          aurora: 'aurora 60s linear infinite',
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
        shimmer: {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      transitionProperty: {
        height: 'height',
      },
      fontFamily: {
        sans: [
          // 'var(--font-epilogue)',
          // 'var(--font-roboto)',
          // 'var(--font-inter)',
          ...fontFamily.sans,
        ],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    addVariablesForColors,
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-dot-thick': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      )
    },
  ],
  safelist: [
    {
      pattern: /grid-cols-([1-8])/,
      variants: ['lg', 'md', 'sm'],
    },
    {
      pattern: /space-(x|y)-([0-1]?[0-9]|20)/,
      variants: ['lg', 'md', 'sm'],
    },
    {
      pattern: /rounded-(sm|md|lg|xl|full)/,
      variants: ['lg', 'md', 'sm'],
    },
  ],
}
