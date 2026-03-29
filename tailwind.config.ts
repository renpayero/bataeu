import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        phase1: { DEFAULT: '#fca5a5', dark: '#7f1d1d', text: '#7f1d1d' },
        phase2: { DEFAULT: '#bbf7d0', dark: '#14532d', text: '#14532d' },
        phase3: { DEFAULT: '#f9a8d4', dark: '#831843', text: '#831843' },
        phase4: { DEFAULT: '#ddd6fe', dark: '#3b0764', text: '#3b0764' },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
