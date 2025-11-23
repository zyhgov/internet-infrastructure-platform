/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['OpenAI Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'apple-bg': '#f5f5f7',
        'apple-bg-light': '#f5f5f8',
        'apple-bg-card': '#f3f3f5',
        'apple-text': '#1d1d1f',
        'apple-blue': '#0071e3',
      },
    },
  },
  plugins: [],
}