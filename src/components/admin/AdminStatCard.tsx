import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent?: 'blue' | 'orange' | 'green';
}

const accentStyles = {
  blue: {
    bg: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    shadow: 'color-mix(in srgb, var(--color-primary) 16%, transparent)',
  },
  orange: {
    bg: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    shadow: 'color-mix(in srgb, var(--color-accent) 16%, transparent)',
  },
  green: {
    bg: 'var(--color-secondary-light)',
    color: 'var(--color-secondary)',
    shadow: 'color-mix(in srgb, var(--color-secondary) 16%, transparent)',
  },
};

export default function AdminStatCard({
  label,
  value,
  helper,
  icon: Icon,
  accent = 'blue',
}: AdminStatCardProps) {
  const style = accentStyles[accent];

  return (
    <section
      className="relative overflow-hidden rounded-xl border p-4 shadow-card"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-50"
        style={{ backgroundColor: style.shadow }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-light">{label}</p>
          <p className="mt-3 font-display text-3xl font-extrabold leading-none text-text">{value}</p>
          <p className="mt-2 text-sm text-text-muted">{helper}</p>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          <Icon size={19} />
        </span>
      </div>
    </section>
  );
}
