import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export default function LoadingState({ label = 'Đang tải...', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center py-10 text-sm font-medium text-text-muted ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="inline-flex min-h-11 items-center gap-3 border bg-bg-card px-4 py-3 shadow-card"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            boxShadow: '3px 3px 0 color-mix(in srgb, var(--color-accent) 14%, transparent)',
          }}
        >
          <Loader2 className="h-4 w-4 motion-safe:animate-spin motion-reduce:animate-none" />
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
}
