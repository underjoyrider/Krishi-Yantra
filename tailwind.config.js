/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#065F46',      // Deep forest green
          primary: '#047857',   // Primary emerald green
          accent: '#10B981',    // Vibrant leaf green
          mint: '#ECFDF5',      // Light mint background
          soft: '#F0FDF4',      // Soft green background
          surface: '#F8FAFC',   // Off-white / light slate background
          charcoal: '#1F2937',  // Dark charcoal text
          muted: '#64748B',     // Secondary slate text
          amber: '#F59E0B',     // Warm amber for waiting times
          yellow: '#FBBF24',
          danger: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -4px rgba(6, 95, 70, 0.08)',
        'hero': '0 10px 30px -5px rgba(6, 95, 70, 0.25)',
      },
    },
  },
  plugins: [],
};
