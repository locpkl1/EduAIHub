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
      className={`relative rounded-card border bg-bg-card p-5 transition-colors ${interactive ? 'hover:border-primary' : ''} ${className}`}
      style={{
        borderColor: 'var(--color-border)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -left-px top-5 h-8 w-px"
        style={{ backgroundColor: accentMap[accent] }}
      />
      {children}
    </div>
  );
}
