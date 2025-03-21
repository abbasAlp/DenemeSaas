/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        turkcell: {
          blue: {
            dark: '#001c54',
            DEFAULT: '#2855ac',
            light: '#5f7acd',
          },
          yellow: '#ffc72c',
        },
      },
    },
  },
  plugins: [],
};