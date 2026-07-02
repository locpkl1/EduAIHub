interface ShapeAccentProps {
  variant?: 'blob' | 'stamp' | 'line' | 'dot';
  color?: 'blue' | 'green' | 'orange' | 'muted';
  className?: string;
}

const colorMap = {
  blue: 'var(--color-primary)',
  green: 'var(--color-secondary)',
  orange: 'var(--color-accent)',
  muted: 'var(--color-bg-muted)',
};

export default function ShapeAccent({
  variant = 'blob',
  color = 'blue',
  className = '',
}: ShapeAccentProps) {
  const backgroundColor = colorMap[color];

  if (variant === 'line') {
    return <span aria-hidden="true" className={`block h-1 w-16 ${className}`} style={{ backgroundColor }} />;
  }

  if (variant === 'dot') {
    return <span aria-hidden="true" className={`block h-3 w-3 rounded-full ${className}`} style={{ backgroundColor }} />;
  }

  if (variant === 'stamp') {
    return (
      <span
        aria-hidden="true"
        className={`block h-12 w-12 rotate-[-8deg] ${className}`}
        style={{
          backgroundColor,
          clipPath: 'polygon(10% 0, 90% 0, 100% 18%, 90% 100%, 12% 100%, 0 82%)',
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`block h-24 w-24 rounded-[42%_58%_55%_45%/45%_42%_58%_55%] ${className}`}
      style={{ backgroundColor }}
    />
  );
}
