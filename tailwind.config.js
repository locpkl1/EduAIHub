const themeColor = (name) => ({ opacityValue }) => opacityValue === undefined
  ? `var(--color-${name})`
  : `color-mix(in srgb, var(--color-${name}) calc(${opacityValue} * 100%), transparent)`;

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
        bg: themeColor('bg'),
        'bg-card': themeColor('bg-card'),
        'bg-muted': themeColor('bg-muted'),
        'bg-accent': themeColor('bg-accent'),
        border: themeColor('border'),
        'border-strong': themeColor('border-strong'),
        text: themeColor('text'),
        'text-muted': themeColor('text-muted'),
        'text-light': themeColor('text-light'),
        primary: themeColor('primary'),
        'primary-hover': themeColor('primary-hover'),
        'primary-light': themeColor('primary-light'),
        'primary-text': themeColor('primary-text'),
        'border-interactive': 'var(--border-interactive)',
        'text-subtle': 'var(--text-subtle)',
        'surface-muted': 'var(--surface-muted)',
        'surface-interactive': 'var(--surface-interactive)',
        secondary: themeColor('secondary'),
        'secondary-light': themeColor('secondary-light'),
        accent: themeColor('accent'),
        'accent-light': themeColor('accent-light'),
        success: themeColor('success'),
        warning: themeColor('warning'),
        'on-primary': 'var(--foreground-on-primary)',
        'on-accent': 'var(--foreground-on-accent)',
        'on-success': 'var(--foreground-on-success)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        card: '6px',
        control: '4px',
        input: '6px',
        nav: '8px',
        theme: 'var(--radius)',
      },
      boxShadow: {
        card: 'none',
        'card-hover': '0 2px 8px rgb(0 0 0 / 0.08)',
        glow: 'none',
      },
      letterSpacing: {
        display: '0',
        tight: '0',
      },
    },
  },
  plugins: [],
};
