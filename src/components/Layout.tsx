import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import WorkspaceShell from './workspace/WorkspaceShell';
import LoadingState from './ui/LoadingState';
import BrandLink from './BrandLink';
import StartLearningAction from './StartLearningAction';
import DesktopLearningAssistant from './learning-assistant/DesktopLearningAssistant';

const publicItems = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/textbooks', label: 'Tài nguyên', end: false },
  { to: '/about', label: 'Giới thiệu', end: false },
];

export default function Layout() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading && !user) return <main id="main-content" tabIndex={-1}><LoadingState label="Đang xác minh phiên đăng nhập…" /></main>;
  const normalizedPath = pathname.replace(/\/+$/, '').toLowerCase();
  const publicPage = normalizedPath === '' || normalizedPath === '/about';
  return <>{user && !publicPage ? <WorkspaceShell><Outlet /></WorkspaceShell> : <PublicShell />}<DesktopLearningAssistant /></>;
}

function PublicShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    function changeLayout() {
      const active = document.activeElement;
      if (desktop.matches && active === menuButton.current) {
        requestAnimationFrame(() => (navigation.current?.querySelector<HTMLAnchorElement>('a[aria-current="page"]') ?? navigation.current?.querySelector<HTMLAnchorElement>('a'))?.focus({ preventScroll: true }));
      } else if (!desktop.matches && navigation.current?.contains(active)) {
        requestAnimationFrame(() => menuButton.current?.focus({ preventScroll: true }));
      }
      setMenuOpen(false);
    }
    desktop.addEventListener('change', changeLayout);
    return () => desktop.removeEventListener('change', changeLayout);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true }));
    function outside(event: Event) {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault(); setMenuOpen(false); menuButton.current?.focus({ preventScroll: true });
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);

  return <div className="public-shell min-h-screen min-h-dvh bg-bg text-text">
    <a href="#main-content" className="skip-link">Đến nội dung chính</a>
    <header ref={header} className="public-header sticky top-0 z-50">
      <div className="site-header-shell public-header-shell">
        <BrandLink className="public-header-brand" subtitle />
        <nav ref={navigation} id="public-navigation" aria-label="Điều hướng chính" data-open={menuOpen} className="signature-navigation public-navigation">
          {publicItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={event => {
            setMenuOpen(false);
            if (!window.matchMedia('(min-width: 1024px)').matches && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
              requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
            }
          }} className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? 'active' : ''}`}>{item.label}</NavLink>)}
        </nav>
        <div className="public-header-actions">
          <div className="hidden sm:block"><ThemeToggle /></div>
          <StartLearningAction compact />
          <button ref={menuButton} type="button" className="public-menu-toggle btn-ghost" aria-label={menuOpen ? 'Đóng menu công khai' : 'Mở menu công khai'} aria-expanded={menuOpen} aria-controls="public-navigation" onClick={() => setMenuOpen(value => !value)}><Menu size={22} aria-hidden="true" /></button>
        </div>
      </div>
    </header>
    <main id="main-content" tabIndex={-1} className="relative min-w-0"><Outlet /></main>
    <footer className="mt-8 border-t border-border"><div className="page-container flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-end"><div><p className="font-display text-lg font-bold">EduAI-Hub</p><p className="mt-2 max-w-lg text-sm leading-7 text-text-muted">Rèn kỹ năng học cùng AI cho học sinh THPT.</p></div><div className="flex flex-wrap items-center gap-4"><div className="sm:hidden"><ThemeToggle /></div>{[['ChatGPT','https://chatgpt.com'],['Gemini','https://gemini.google.com'],['Claude','https://claude.ai']].map(([name,href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-sm text-text-muted hover:text-primary">{name}<ExternalLink size={12} aria-hidden="true" /><span className="sr-only"> (mở tab mới)</span></a>)}</div></div></footer>
  </div>;
}
