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
    color: 'var(--color-primary-text)',
  },
  orange: {
    bg: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
  },
  green: {
    bg: 'var(--color-secondary-light)',
    color: 'var(--color-secondary)',
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
      className="relative overflow-hidden rounded-card border p-4"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-light">{label}</p>
          <p className="mt-3 font-display text-3xl font-bold leading-none text-text">{value}</p>
          <p className="mt-2 text-sm text-text-muted">{helper}</p>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          <Icon size={19} />
        </span>
      </div>
    </section>
  );
}
