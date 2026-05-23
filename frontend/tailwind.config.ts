import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: 'var(--af-bg-base)',
        card: 'var(--af-bg-card)',
        'card-hover': 'var(--af-bg-muted)',
        'af-blue': 'var(--af-accent-blue)',
        'af-purple': 'var(--af-accent-purple)',
        'af-cyan': 'var(--af-accent-cyan)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        af: 'var(--af-radius-lg)',
      },
      boxShadow: {
        glow: 'var(--af-shadow-glow)',
        'af-md': 'var(--af-shadow-md)',
      },
      transitionDuration: {
        fast: 'var(--af-duration-fast)',
        normal: 'var(--af-duration-normal)',
        slow: 'var(--af-duration-slow)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s var(--af-ease-out) forwards',
        'slide-in': 'slideIn 0.25s var(--af-ease-out) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
