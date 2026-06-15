/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        belize: {
          blue: '#003F87',
          red: '#CE1126',
          green: {
            light: '#86BC42',
            DEFAULT: '#00843D',
            dark: '#004D29',
          },
          sand: '#F4E4C1',
        },
      },
    },
  },
  plugins: [],
}
