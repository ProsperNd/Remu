/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7F00',
        'primary-dark': '#E67300',
        secondary: {
          DEFAULT: '#FFFFFF',
          100: '#F5F5F5',
          200: '#EEEEEE',
        }
      },
    },
  },
  plugins: [],
} 