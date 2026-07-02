import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { theme, isDark: theme === 'dark', setTheme, toggleTheme };
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useThemeMode();
  const label = isDark ? 'Chuyen sang che do sang' : 'Chuyen sang che do toi';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-muted)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
      aria-label={label}
      title={label}
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          backgroundColor: isDark ? 'var(--color-primary)' : 'var(--color-bg-card)',
          color: isDark ? '#ffffff' : 'var(--color-primary)',
          boxShadow: '0 1px 8px color-mix(in srgb, var(--color-primary) 18%, transparent)',
        }}
      >
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
      </span>
      {showLabel && <span className="hidden sm:inline">{isDark ? 'Sang' : 'Toi'}</span>}
    </button>
  );
}
