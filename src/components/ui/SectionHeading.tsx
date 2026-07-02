import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start'} sm:flex-row sm:justify-between sm:gap-6 ${className}`}
    >
      <div className={centered ? 'max-w-3xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-semibold leading-[1.18] tracking-normal text-text sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm leading-7 text-text-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
