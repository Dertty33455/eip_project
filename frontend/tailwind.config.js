const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs africaines chaudes
        primary: {
          50: '#fef9f3',
          100: '#fdf0e1',
          200: '#fbe0c3',
          300: '#f7c896',
          400: '#f2a857',
          500: '#e88c2a', // Ocre principal
          600: '#d47318',
          700: '#b05a15',
          800: '#8f4918',
          900: '#743d17',
          950: '#3f1e09',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#1b5e20', // Vert profond africain
          600: '#166534',
          700: '#15803d',
          800: '#14532d',
          900: '#052e16',
          950: '#022c12',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f9bc15', // Jaune chaud africain
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        earth: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524', // Noir élégant
          900: '#1c1917',
          950: '#0c0a09',
        },
        cream: {
          50: '#fffef7', // Blanc cassé
          100: '#fffceb',
          200: '#fff8d6',
          300: '#fff1b8',
          400: '#ffe58f',
          500: '#ffd666',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-playfair)', ...fontFamily.serif],
        african: ['var(--font-ubuntu)', ...fontFamily.sans],
      },
      backgroundImage: {
        'african-pattern': "url('/patterns/african-pattern.svg')",
        'kente-pattern': "url('/patterns/kente.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #e88c2a 0%, #1b5e20 50%, #f9bc15 100%)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-rotate': 'float-rotate 5s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-rotate': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(2deg)' },
          '75%': { transform: 'translateY(-4px) rotate(-1deg)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-16px) scale(1.02)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 140, 42, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(232, 140, 42, 0.3), 0 0 60px rgba(232, 140, 42, 0.1)' },
        },
      },
      boxShadow: {
        'african': '0 4px 20px -2px rgba(232, 140, 42, 0.25)',
        'african-lg': '0 8px 30px -4px rgba(232, 140, 42, 0.35)',
        'card': '0 1px 3px -1px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 40px -12px rgba(232, 140, 42, 0.2), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'glow': '0 0 20px rgba(232, 140, 42, 0.2)',
        'glow-lg': '0 0 40px rgba(232, 140, 42, 0.3)',
        'inner-glow': 'inset 0 1px 2px rgba(232, 140, 42, 0.1)',
      },
      borderRadius: {
        'african': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
