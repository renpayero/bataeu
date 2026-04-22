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
        reading: {
          cream: '#fff5f7',
          paper: '#fde4ea',
          ink: '#7f1d1d',
          'ink-soft': '#9f1239',
          terracotta: '#be185d',
          'rose-old': '#9f1239',
          sage: '#84a98c',
          gold: '#c68b5a',
          bronze: '#a16207',
          border: '#fbcfe8',
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'cinematic-drift': 'cinematic-drift 8s ease-in-out infinite',
        'cinematic-glow': 'cinematic-glow 2s ease-in-out infinite',
        'cinematic-twinkle': 'cinematic-twinkle 3s ease-in-out infinite',
        'gold-shimmer': 'gold-shimmer 2.8s linear infinite',
        'ink-blink': 'ink-blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}

export default config
