/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#30567D',    // Header, Active Tabs
          secondary: '#1B3C5F',  // Sub-header, Footer, Bottom Nav
          background: '#E7EEF6', // Main content background
          red: '#DC2626',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        yantramanav: ['Yantramanav', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulseRed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker': 'ticker 45s linear infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 0 8px rgba(220, 38, 38, 0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}