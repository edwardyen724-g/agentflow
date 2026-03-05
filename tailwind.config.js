const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, './app/**/*.{tsx,ts,jsx,js}'),
    join(__dirname, './components/**/*.{tsx,ts,jsx,js}'),
    join(__dirname, './pages/**/*.{tsx,ts,jsx,js}'),
    join(__dirname, './public/**/*.{html,js}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        secondary: '#7F8C8D',
        accent: '#E74C3C',
        background: '#F4F6F8',
        text: {
          light: '#BDC3C7',
          DEFAULT: '#2C3E50',
        },
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}