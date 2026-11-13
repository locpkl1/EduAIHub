import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, LayoutDashboard, Library, LogOut, PanelLeftClose, PanelLeftOpen, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import MobileNavigation from '../MobileNavigation';
import Modal from '../Modal';
import BrandLink from '../BrandLink';

const groups = [
  { label: 'Học tập', items: [{ to: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard }, { to: '/guides', label: 'Cẩm nang AI', icon: Compass }, { to: '/ai-tools', label: 'Công cụ AI', icon: Sparkles }, { to: '/lessons', label: 'Kinh nghiệm học', icon: BookOpen }] },
  { label: 'Tài nguyên', items: [{ to: '/prompts', label: 'Kho Prompt', icon: Library }, { to: '/textbooks', label: 'Tài nguyên học tập', icon: BookOpen }] },
  { label: 'Cá nhân', items: [{ to: '/profile', label: 'Hồ sơ', icon: User }] },
];
export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [chatNavExpanded, setChatNavExpanded] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const focusMode = location.pathname.startsWith('/ai-tools/');
  const navigationCollapsed = focusMode ? !chatNavExpanded : collapsed;
  const name = displayName || user?.email?.split('@')[0] || 'Học sinh';
  useEffect(() => { setAccountOpen(false); }, [location.pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const close = () => { if (desktop.matches && accountOpen) { setAccountOpen(false); requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true })); } };
    desktop.addEventListener('change', close); return () => desktop.removeEventListener('change', close);
  }, [accountOpen]);
  async function leave() {
    try { await signOut(); setAccountOpen(false); navigate('/', { replace: true }); }
    catch { setSignOutError(true); }
  }
  return <div className={`workspace-shell ${focusMode ? 'workspace-focus' : ''}`} data-collapsed={navigationCollapsed}>
    <a href="#main-content" className="skip-link">Đến nội dung chính</a>
    {!focusMode && <header className="workspace-mobile-header md:hidden">
      <BrandLink />
      <button type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border" aria-label={`Tài khoản: ${name}`} aria-haspopup="dialog" onClick={() => setAccountOpen(true)}>{avatarUrl && !avatarFailed ? <img alt="" width={40} height={40} referrerPolicy="no-referrer" src={avatarUrl} onError={() => setAvatarFailed(true)} className="h-10 w-10 rounded-full object-cover" /> : <User size={22} />}</button>
    </header>}
    <aside className="workspace-sidebar" aria-label="Không gian học tập">
      <BrandLink className="workspace-brand" textClassName="workspace-nav-text" />
      <button type="button" onClick={() => focusMode ? setChatNavExpanded(value => !value) : setCollapsed(value => !value)} className="workspace-collapse" aria-controls="workspace-navigation" aria-expanded={!navigationCollapsed} title={navigationCollapsed ? 'Mở rộng điều hướng' : 'Thu gọn điều hướng'} aria-label={navigationCollapsed ? 'Mở rộng điều hướng' : 'Thu gọn điều hướng'}>{navigationCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}<span className="workspace-nav-text text-sm">Thu gọn</span></button>
      <nav id="workspace-navigation" aria-label="Điều hướng workspace" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2 py-3">
        {groups.map(group => <div key={group.label}><p className="workspace-nav-text mb-2 px-3 text-xs font-semibold text-text-muted">{group.label}</p><div className="space-y-1">{group.items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} title={label} aria-label={label} className={({ isActive }) => `workspace-nav-item ${isActive ? 'active' : ''}`}><Icon size={20} aria-hidden="true" className="shrink-0" /><span className="workspace-nav-text">{label}</span></NavLink>)}</div></div>)}
      </nav>
      <div className="space-y-2 border-t border-border p-2"><ThemeToggle className="w-full" /><button type="button" onClick={leave} title="Đăng xuất" aria-label="Đăng xuất" className="workspace-nav-item w-full"><LogOut size={20} className="shrink-0" /><span className="workspace-nav-text">Đăng xuất</span></button>{signOutError && <p role="alert" className="text-xs text-accent">Chưa đăng xuất được. Hãy thử lại.</p>}</div>
    </aside>
    <main id="main-content" tabIndex={-1} className="min-w-0">{children}</main>
    <MobileNavigation />
    <Modal isOpen={accountOpen} onClose={() => setAccountOpen(false)} label="Tài khoản học tập" size="md"><div className="p-5 pt-14"><h2 className="text-2xl font-bold">{name}</h2><Link to="/profile" onClick={() => setAccountOpen(false)} className="nav-link mt-4 flex w-full gap-2"><User size={18} />Hồ sơ học tập</Link><ThemeToggle className="mt-4 w-full" /><button className="btn-outline mt-4 w-full" type="button" onClick={leave}><LogOut size={18} />Đăng xuất</button>{signOutError && <p role="alert" className="mt-3 text-sm text-accent">Chưa đăng xuất được. Hãy thử lại.</p>}</div></Modal>
  </div>;
}
