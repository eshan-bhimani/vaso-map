/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':     '#030712',
        'bg-surface':  '#0d1117',
        'bg-elevated': '#161b22',
        'bg-overlay':  '#1c2128',
        'artery':      '#e11d48',
        'vein':        '#2563eb',
        'capillary':   '#7c3aed',
        'path-accent': '#22d3ee',
        'selected':    '#f59e0b',
        'text-pri':    '#f0f6fc',
        'text-sec':    '#8b949e',
        'text-dim':    '#484f58',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%':       { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(24px)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-24px)', opacity: '0' },
          to:   { transform: 'translateX(0)',     opacity: '1' },
        },
      },
      animation: {
        'pulse-glow':      'pulse-glow 2s ease-in-out infinite',
        'slide-in-right':  'slide-in-right 0.35s ease-out',
        'slide-in-left':   'slide-in-left 0.35s ease-out',
      },
      boxShadow: {
        'glow-artery':    '0 0 24px rgba(225,29,72,0.5)',
        'glow-vein':      '0 0 24px rgba(37,99,235,0.5)',
        'glow-capillary': '0 0 24px rgba(124,58,237,0.5)',
        'glow-accent':    '0 0 20px rgba(34,211,238,0.4)',
        'glass':          '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}
