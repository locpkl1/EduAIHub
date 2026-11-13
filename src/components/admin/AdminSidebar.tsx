import Modal from '../Modal';
import { NavLink } from 'react-router-dom';
import {
  BookMarked,
  FileText,
  Home,
  Library,
  MessageSquareText,
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
];

function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-5 py-5" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="font-display text-lg font-bold leading-none text-text">Admin Center</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-control border text-text-muted lg:hidden"
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
                `flex items-center gap-3 rounded-nav px-3 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary'
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
        <div className="rounded-card border p-3" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-light">EduAI-Hub CMS</p>
          <p className="mt-1 text-sm font-bold text-text">Quản lý nội dung học AI</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Quản lý bài viết, prompt mẫu, chương trình học và tài nguyên học tập.
          </p>
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

      <Modal isOpen={mobileOpen} onClose={onClose} size="md" showCloseButton={false} label="Điều hướng quản trị">
        <SidebarContent onClose={onClose} />
      </Modal>
    </>
  );
}
