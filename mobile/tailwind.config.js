/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#070707',
          secondary: '#111111',
          card: '#181818',
          surface: '#202020',
        },
        accent: {
          primary: '#F5A623',
          gold: '#FFB938',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
      },
      borderRadius: {
        card: '24px',
        button: '18px',
        input: '16px',
        'bottom-sheet': '32px',
      },
    },
  },
  plugins: [],
};
