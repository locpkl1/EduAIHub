import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, ShieldCheck } from 'lucide-react';

interface AdminTopbarProps {
  title: string;
  userLabel: string;
  onMenuClick: () => void;
}

export default function AdminTopbar({ title, userLabel, onMenuClick }: AdminTopbarProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b px-4 py-3 sm:px-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control border text-text-muted lg:hidden"
            style={{ borderColor: 'var(--color-border)' }}
            aria-label="Mở menu quản trị"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold text-text sm:text-2xl">{title}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className="hidden items-center gap-2 rounded-card border px-3 py-2 text-sm font-bold text-text-muted sm:flex"
            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <ShieldCheck size={15} style={{ color: 'var(--color-secondary)' }} />
            <span className="max-w-[12rem] truncate">{userLabel}</span>
          </div>
          <Link to="/" className="btn-outline gap-2 rounded-control px-3 py-2 text-sm">
            <span className="hidden sm:inline">Quay lại website</span>
            <span className="sm:hidden">Website</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
