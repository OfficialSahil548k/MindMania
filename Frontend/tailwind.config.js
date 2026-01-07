/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B00", // Orange
        secondary: "#FFFFFF", // White
      },
      fontFamily: {
        stylish: ["'Playfair Display'", "serif"], // For the logo
        sans: ["'Outfit'", "sans-serif"], // General text
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // Move by 50% because we duplicate the content
        },
      },
    },
  },
  plugins: [],
}

