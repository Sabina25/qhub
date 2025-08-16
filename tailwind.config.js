/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'], 
        heading: ['Raleway', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              textDecorationThickness: '2px',
              '&:hover': { color: theme('colors.blue.700') },
            },
          },
        },
      }),
    },
  },
  plugins: [],
};