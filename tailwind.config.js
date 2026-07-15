/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FEFDFB',
          100: '#FDFBF7',
          200: '#FAF5ED',
          300: '#F5EDDF',
          400: '#EDE2CC',
          500: '#E0D3B8',
        },
        sage: {
          50: '#F4F8F4',
          100: '#E8F0E8',
          200: '#D1E1D1',
          300: '#B3CDB3',
          400: '#8DB58D',
          500: '#6B9E6B',
          600: '#528052',
          700: '#3D613D',
        },
        ocean: {
          50: '#F1F5FB',
          100: '#E3EDF7',
          200: '#C7DAEF',
          300: '#A3C1E3',
          400: '#7BA5D4',
          500: '#5A8BC2',
          600: '#4270A8',
          700: '#355A89',
        },
        lavender: {
          50: '#F8F5FC',
          100: '#F0EBF8',
          200: '#E1D7F1',
          300: '#CEBDE6',
          400: '#B59DD8',
          500: '#9B7EC8',
          600: '#7E5FB0',
        },
        peach: {
          50: '#FEF8F3',
          100: '#FDF0E8',
          200: '#FADDD0',
          300: '#F5C4AD',
          400: '#EEA582',
          500: '#E5875A',
          600: '#D66A35',
        },
        navy: {
          50: '#F0F2F5',
          100: '#D5DAE3',
          200: '#ABB5C7',
          300: '#8090AB',
          400: '#566B8F',
          500: '#3B5278',
          600: '#2D3F5C',
          700: '#1F2D42',
          800: '#1B2B4B',
          900: '#111D33',
          950: '#0A1220',
        },
        health: {
          green: '#4CAF82',
          blue: '#5B8FD4',
          amber: '#E5A54B',
          rose: '#D4625B',
          purple: '#8B6CC2',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(27, 43, 75, 0.06), 0 1px 2px rgba(27, 43, 75, 0.04)',
        'card': '0 2px 8px rgba(27, 43, 75, 0.06), 0 1px 3px rgba(27, 43, 75, 0.04)',
        'elevated': '0 4px 16px rgba(27, 43, 75, 0.08), 0 2px 6px rgba(27, 43, 75, 0.04)',
        'modal': '0 8px 32px rgba(27, 43, 75, 0.12), 0 4px 12px rgba(27, 43, 75, 0.06)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
