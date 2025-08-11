/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    'dark:bg-red-400',
    'dark:bg-[#00113D]',
    // Add other dark mode classes you're using
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
}