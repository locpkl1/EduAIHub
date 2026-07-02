import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export default function LoadingState({ label = 'Dang tai...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center gap-3 py-12 text-sm font-medium text-text-muted ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}
