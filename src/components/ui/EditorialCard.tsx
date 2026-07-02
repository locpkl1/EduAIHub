import type { ReactNode } from 'react';

interface EditorialCardProps {
  children: ReactNode;
  className?: string;
  accent?: 'blue' | 'green' | 'orange' | 'ink';
  interactive?: boolean;
}

const accentMap = {
  blue: 'var(--color-primary)',
  green: 'var(--color-secondary)',
  orange: 'var(--color-accent)',
  ink: 'var(--color-text)',
};

export default function EditorialCard({
  children,
  className = '',
  accent = 'blue',
  interactive = false,
}: EditorialCardProps) {
  return (
    <div
      className={`relative border bg-bg-card p-5 shadow-card transition-all duration-200 ${interactive ? 'hover:-translate-y-1 hover:shadow-card-hover' : ''} ${className}`}
      style={{
        borderColor: 'var(--color-border)',
        boxShadow: `8px 8px 0 color-mix(in srgb, ${accentMap[accent]} 16%, transparent)`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -left-px top-5 h-8 w-1"
        style={{ backgroundColor: accentMap[accent] }}
      />
      {children}
    </div>
  );
}
