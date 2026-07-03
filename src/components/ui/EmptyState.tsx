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
      className={`paper-surface relative overflow-hidden border px-5 py-9 text-center shadow-card sm:px-6 sm:py-10 ${className}`}
      style={{
        borderColor: 'var(--color-border-strong)',
        boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-primary) 10%, transparent)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-6 top-0 h-2 w-20 -translate-y-1/2 rotate-[-1.5deg]"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 32%, var(--color-bg-card))' }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-5 right-5 h-12 w-12 rotate-6 border opacity-70"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-border-strong) 42%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--color-secondary-light) 58%, transparent)',
        }}
      />

      <div className="relative mx-auto max-w-2xl">
        {icon && (
          <div
            className="mx-auto mb-5 flex h-14 w-14 rotate-[-2deg] items-center justify-center border"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-primary)',
              boxShadow: '4px 4px 0 color-mix(in srgb, var(--color-accent) 16%, transparent)',
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
