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
      className={`border-t px-0 py-8 sm:py-10 ${className}`}
      style={{
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="relative max-w-3xl">
        <h2 className="font-display text-2xl font-bold leading-tight text-text sm:text-[2rem]">
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
