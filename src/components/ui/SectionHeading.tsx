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
        <h2 className="font-display text-2xl font-bold leading-tight text-text sm:text-[2rem]">
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
