import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Compass,
  ExternalLink,
  GraduationCap,
  Home,
  Library,
  LogOut,
  Menu,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ShapeAccent from './ui/ShapeAccent';
import ThemeToggle from './ui/ThemeToggle';

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string }) {
  const [err, setErr] = useState(false);

  if (avatarUrl && !err) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setErr(true)}
        className="h-8 w-8 rounded-full border-2 object-cover"
        style={{ borderColor: 'var(--color-primary)' }}
      />
    );
  }

  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold"
      style={{
        backgroundColor: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        color: '#ffffff',
      }}
    >
      {getInitials(name)}
    </span>
  );
}

const navItems = [
  { to: '/', label: 'Trang Chủ', exact: true, icon: Home },
  { to: '/guides', label: 'Hướng Dẫn', exact: false, icon: Compass },
  { to: '/ai-tools', label: 'Công Cụ AI', exact: false, icon: Sparkles },
  { to: '/lessons', label: 'Bài Học', exact: false, icon: BookOpen },
];

const resourceItems = [
  { to: '/prompts', label: 'Kho Prompt', description: 'Lưu và dùng lại ý tưởng học', icon: Library },
  { to: '/textbooks', label: 'Bản đồ chương trình', description: 'Ngữ cảnh học tập lớp 10-12', icon: BookOpen },
];

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function Layout() {
  const { signOut, signInWithGoogle, user, displayName, avatarUrl, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showUser = Boolean(user) && !loading;
  const userLabel = displayName || user?.email?.split('@')[0] || 'Tài khoản';
  const resourcesActive = location.pathname === '/prompts' || location.pathname === '/textbooks';
  const isChatbotRoute = location.pathname.startsWith('/ai-tools/');

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false);
    }

    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setResourcesOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen min-h-dvh overflow-x-hidden text-text"
      style={{
        backgroundColor: 'var(--color-bg)',
        backgroundImage:
          'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-border) 55%, transparent) 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }}
    >
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
        <div
          className="mx-auto max-w-7xl border shadow-card"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 94%, transparent)',
            borderColor: 'var(--color-border-strong)',
            boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-primary) 14%, transparent)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
            <Link to="/" className="group flex min-w-0 shrink-0 items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center">
                <span
                  className="absolute inset-0 rotate-[-5deg]"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
                <span
                  className="relative flex h-9 w-9 items-center justify-center border"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-text)',
                    color: '#ffffff',
                  }}
                >
                  <GraduationCap size={18} />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-extrabold leading-none tracking-tight text-text sm:text-lg">
                  Edu-AI Hub
                </span>
                <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-text-light sm:block">
                  Sổ tay học cùng AI
                </span>
              </span>
            </Link>

            <nav
              className="hidden items-center gap-1 border px-1.5 py-1 md:flex"
              style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
              aria-label="Điều hướng chính"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-bg-card text-primary shadow-[3px_3px_0_var(--color-primary)]'
                          : 'text-text-muted hover:bg-bg-card hover:text-text'
                      }`
                    }
                  >
                    <Icon size={14} />
                    {item.label}
                  </NavLink>
                );
              })}

              <div className="relative" ref={resourcesRef}>
                <button
                  type="button"
                  onClick={() => setResourcesOpen((p) => !p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-all duration-200 ${
                    resourcesActive
                      ? 'bg-bg-card text-primary shadow-[3px_3px_0_var(--color-primary)]'
                      : 'text-text-muted hover:bg-bg-card hover:text-text'
                  }`}
                  aria-expanded={resourcesOpen}
                >
                  <Library size={14} />
                  Tài Nguyên
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200"
                    style={{ transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>

                {resourcesOpen && (
                  <div
                    className="absolute left-0 top-full mt-3 w-72 border p-2 shadow-card-hover"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      borderColor: 'var(--color-border-strong)',
                      boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-accent) 20%, transparent)',
                    }}
                  >
                    <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">
                      Góc tài liệu
                    </p>
                    {resourceItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-start gap-3 px-3 py-3 text-sm transition-colors ${
                              isActive ? 'bg-primary-light text-primary' : 'text-text hover:bg-bg-muted'
                            }`
                          }
                        >
                          <Icon className="mt-0.5 shrink-0" size={15} />
                          <span>
                            <span className="block font-bold">{item.label}</span>
                            <span className="mt-0.5 block text-xs text-text-muted">{item.description}</span>
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />

              {showUser ? (
                <div className="relative" ref={userRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className="flex items-center gap-2 border px-2 py-1.5 text-sm font-bold transition-colors hover:bg-bg-muted"
                    style={{ borderColor: 'var(--color-border)' }}
                    aria-expanded={userMenuOpen}
                  >
                    <UserAvatar name={userLabel} avatarUrl={avatarUrl} />
                    <span className="hidden max-w-[120px] truncate sm:block">{userLabel}</span>
                    <ChevronDown size={14} className="text-text-light" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-56 border p-2 shadow-card-hover"
                      style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border-strong)',
                        boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-secondary) 22%, transparent)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/profile');
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-3 text-left text-sm font-bold text-text transition-colors hover:bg-bg-muted"
                      >
                        <User size={15} />
                        Thông Tin Cá Nhân
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut();
                        }}
                        className="mt-1 flex w-full items-center gap-2.5 border-t px-3 py-3 text-left text-sm font-bold text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : loading ? (
                <div className="h-9 w-20 animate-pulse bg-bg-muted" />
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="btn-primary hidden items-center gap-2 text-sm sm:flex"
                >
                  <GoogleIcon />
                  Đăng nhập
                </button>
              )}

              <button
                type="button"
                onClick={() => setMobileOpen((p) => !p)}
                className="flex h-9 w-9 items-center justify-center border text-text-muted transition-colors hover:bg-bg-muted hover:text-text md:hidden"
                style={{ borderColor: 'var(--color-border)' }}
                aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div
              className="border-t px-3 pb-4 pt-3 md:hidden"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <nav className="space-y-2" aria-label="Điều hướng di động">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 text-sm font-bold transition-colors ${
                          isActive ? 'bg-primary-light text-primary' : 'bg-bg-muted text-text hover:bg-bg-card'
                        }`
                      }
                    >
                      <Icon size={16} />
                      {item.label}
                    </NavLink>
                  );
                })}

                <div className="pt-2">
                  <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">
                    Tài Nguyên
                  </p>
                  <div className="space-y-2">
                    {resourceItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 text-sm font-bold transition-colors ${
                              isActive ? 'bg-primary-light text-primary' : 'bg-bg-muted text-text hover:bg-bg-card'
                            }`
                          }
                        >
                          <Icon size={16} />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>

                {showUser && (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        navigate('/profile');
                      }}
                      className="flex w-full items-center gap-3 bg-bg-muted px-3 py-3 text-left text-sm font-bold text-text"
                    >
                      <User size={16} />
                      Thông Tin Cá Nhân
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-3 bg-bg-muted px-3 py-3 text-left text-sm font-bold text-text-muted"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}

                {!showUser && !loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signInWithGoogle();
                    }}
                    className="btn-primary mt-2 flex w-full items-center justify-center gap-2 text-sm"
                  >
                    <GoogleIcon />
                    Đăng nhập bằng Google
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className={isChatbotRoute ? 'relative min-w-0 overflow-hidden' : 'relative min-w-0'}>
        <Outlet />
      </main>

      {!isChatbotRoute && (
        <footer className="relative mt-10 px-3 pb-5 pt-4 sm:mt-14 sm:px-4 sm:pb-6 lg:mt-16">
        <div
          className="mx-auto max-w-7xl overflow-hidden border px-5 py-7 shadow-card sm:px-6"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border-strong)',
            boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-accent) 12%, transparent)',
          }}
        >
          <ShapeAccent variant="line" color="orange" className="mb-5" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                >
                  <GraduationCap size={16} />
                </span>
                <span className="font-display text-base font-extrabold tracking-tight text-text">
                  Edu-AI Hub
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm text-text-muted">
                Giúp học sinh Việt Nam học chủ động, viết prompt tốt hơn và dùng AI có trách nhiệm.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold uppercase tracking-[0.16em] text-text-light">Thực hành trên</span>
              {[
                ['ChatGPT', 'https://chatgpt.com'],
                ['Gemini', 'https://gemini.google.com'],
                ['Claude', 'https://claude.ai'],
              ].map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1 border px-2.5 py-1.5 font-bold text-text-muted transition-colors hover:border-primary hover:text-primary"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {name} <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>
        </div>
        </footer>
      )}
    </div>
  );
}
