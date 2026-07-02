import { NavLink } from 'react-router-dom';
import {
  BookMarked,
  FileText,
  Home,
  Library,
  MessageSquareText,
  Settings,
  Users,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin', label: 'Tổng quan', icon: Home, end: true },
  { to: '/admin/posts', label: 'Bài viết', icon: FileText },
  { to: '/admin/prompts', label: 'Prompt mẫu', icon: MessageSquareText },
  { to: '/admin/curriculum', label: 'Chương trình học', icon: BookMarked },
  { to: '/admin/resources', label: 'Tài nguyên', icon: Library },
  { to: '/admin/users', label: 'Người dùng', icon: Users },
  { to: '/admin/settings', label: 'Cài đặt', icon: Settings },
];

function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-5 py-5" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="font-display text-lg font-extrabold leading-none text-text">Admin Center</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-text-light">EduAI-Hub</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border text-text-muted lg:hidden"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Đóng menu quản trị"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Điều hướng quản trị">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-[4px_4px_0_color-mix(in_srgb,var(--color-accent)_30%,transparent)]'
                    : 'text-text-muted hover:bg-bg-muted hover:text-text'
                }`
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-light">Phase 3</p>
          <p className="mt-1 text-sm font-bold text-text">Khung quản trị</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">CRUD và phân quyền admin sẽ được nối ở các phase tiếp theo.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r lg:block"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <SidebarContent onClose={onClose} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={onClose}
            aria-label="Đóng lớp phủ menu"
          />
          <aside
            className="relative h-full w-[min(86vw,20rem)] border-r shadow-card-hover"
            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
