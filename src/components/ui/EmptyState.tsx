import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`rounded-card border border-border bg-bg-card px-5 py-8 text-center sm:px-6 ${className}`}
      style={{
        borderColor: 'var(--color-border-strong)',
      }}
    >

      <div className="relative mx-auto max-w-2xl">
        {icon && (
          <div
            className="mx-auto mb-4 flex h-11 w-11 items-center justify-center"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-primary)',
            }}
          >
            {icon}
          </div>
        )}
        <h3 className="font-display text-xl font-bold leading-snug text-text">{title}</h3>
        {description && <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">{description}</p>}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
