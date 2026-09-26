/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bar: {
          950: '#07090e',
          900: '#0d111a',
          850: '#121723',
          800: '#181f2f',
          750: '#1f273b',
          700: '#263148',
          600: '#384666',
          border: '#232d42',
        },
        neon: {
          amber: '#f59e0b',
          gold: '#fbbf24',
          emerald: '#10b981',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon-emerald': '0 0 15px -2px rgba(16, 185, 129, 0.35)',
        'neon-amber': '0 0 15px -2px rgba(245, 158, 11, 0.35)',
        'neon-rose': '0 0 15px -2px rgba(244, 63, 94, 0.35)',
        'neon-cyan': '0 0 15px -2px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
}
