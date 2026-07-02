import type { ReactNode } from 'react';

interface CTASectionProps {
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export default function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}: CTASectionProps) {
  return (
    <section
      className={`relative overflow-hidden border px-6 py-10 sm:px-8 lg:px-10 ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-40"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      />
      <div className="relative max-w-3xl">
        <h2 className="font-display text-3xl font-semibold leading-[1.18] tracking-normal text-text sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-4 text-sm leading-7 text-text-muted sm:text-base">{description}</p>}
        {(primaryAction || secondaryAction) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </section>
  );
}
