import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function PageShell({ children, className = '', narrow = false }: PageShellProps) {
  return (
    <div className={`min-h-screen bg-bg text-text ${className}`}>
      <div className={`${narrow ? 'max-w-4xl' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </div>
  );
}
