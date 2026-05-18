import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0F0F0F',
        'surface-2': '#141414',
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.08)',
        light: 'rgba(255,255,255,0.12)',
      },
      animation: {
        'message-in': 'messageSlide 0.3s ease forwards',
        'fade-up': 'fadeInUp 0.5s ease forwards',
      },
      keyframes: {
        messageSlide: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;