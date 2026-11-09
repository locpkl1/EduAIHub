import { Moon, Sun } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
export type { ThemeMode } from '../../hooks/useThemeMode';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useThemeMode();
  const label = isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${className}`}
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
      {showLabel && <span className="hidden sm:inline">{isDark ? 'Sáng' : 'Tối'}</span>}
    </button>
  );
}
