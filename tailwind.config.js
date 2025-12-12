// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This array tells Tailwind where your component files are located
    // so it can scan them and only include the necessary CSS.
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- Custom Animations Defined Here ---
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        pulseBorder: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(199, 210, 254, 0.4)' }, // Indigo-200 shadow
          '50%': { boxShadow: '0 0 0 4px rgba(199, 210, 254, 0.6)' },
        },
      },
      animation: {
        // Apply the keyframes with specific duration and count
        shake: 'shake 0.3s ease-in-out 3',
        'pulse-border': 'pulseBorder 1.5s infinite',
      },
      // -------------------------------------
    },
  },
  plugins: [],
}