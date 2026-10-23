/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          50: '#FFF9FB',
          100: '#FDF2F6',
          200: '#FCE7EF',
          300: '#F8D0DF',
          400: '#F2B1C9',
          500: '#E58BAE',
          600: '#CE6B93',
          700: '#B05077',
          800: '#8F3F60',
          900: '#5C283E',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FDFBF7',
          200: '#F9F5ED',
          300: '#F1EAE0',
        },
        rosewood: {
          900: '#3D2B32',
          700: '#5E4750',
          500: '#8C737D',
          400: '#B099A2',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'bloom-sm': '0 2px 12px -2px rgba(180, 110, 140, 0.06)',
        'bloom': '0 8px 30px -4px rgba(180, 110, 140, 0.08)',
        'bloom-lg': '0 14px 40px -6px rgba(180, 110, 140, 0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
