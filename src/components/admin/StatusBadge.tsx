import { Archive, CircleDot, Sparkles } from 'lucide-react';
import type { ContentStatus } from '../../types/database';

interface StatusBadgeProps {
  status: ContentStatus;
}

const labels: Record<ContentStatus, string> = {
  draft: 'Đang nháp',
  published: 'Đã xuất bản',
  archived: 'Đã lưu trữ',
};

const styles: Record<ContentStatus, { bg: string; color: string; border: string }> = {
  draft: {
    bg: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    border: 'color-mix(in srgb, var(--color-accent) 28%, transparent)',
  },
  published: {
    bg: 'var(--color-secondary-light)',
    color: 'var(--color-secondary)',
    border: 'color-mix(in srgb, var(--color-secondary) 30%, transparent)',
  },
  archived: {
    bg: 'var(--color-bg-muted)',
    color: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  },
};

const icons = {
  draft: CircleDot,
  published: Sparkles,
  archived: Archive,
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const Icon = icons[status];
  const style = styles[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
    >
      <Icon size={12} />
      {labels[status]}
    </span>
  );
}
