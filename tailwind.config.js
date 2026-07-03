/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        display: ['Aleo', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      colors: {
        bg: 'var(--color-bg)',
        'bg-card': 'var(--color-bg-card)',
        'bg-muted': 'var(--color-bg-muted)',
        'bg-accent': 'var(--color-bg-accent)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-light': 'var(--color-text-light)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        secondary: 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        theme: 'var(--radius)',
      },
      boxShadow: {
        card: '0 1px 0 0 var(--color-border), 0 12px 28px -24px color-mix(in srgb, var(--color-text) 42%, transparent)',
        'card-hover': '0 16px 36px -26px color-mix(in srgb, var(--color-primary) 52%, var(--color-text))',
        glow: '0 0 32px -8px var(--color-primary)',
      },
      letterSpacing: {
        display: '0',
        tight: '0',
      },
    },
  },
  plugins: [],
};
