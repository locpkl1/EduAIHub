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
      className={`border bg-bg-card px-6 py-10 text-center ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      {icon && (
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-text">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
