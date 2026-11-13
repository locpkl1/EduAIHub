import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BookOpen, Compass, Home, Library, Sparkles, X } from 'lucide-react';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';

const destinations = [
  { to: '/', label: 'Trang chủ', icon: Home, end: true },
  { to: '/guides', label: 'Cẩm nang', icon: Compass },
  { to: '/ai-tools', label: 'Công cụ AI', icon: Sparkles },
  { to: '/lessons', label: 'Bài học', icon: BookOpen },
];
export default function MobileNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setResourcesOpen(false); }, [location.pathname]);
  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => setKeyboardOpen(Boolean(document.activeElement?.matches('input,textarea,[contenteditable="true"]') && viewport && viewport.height < window.innerHeight - 120));
    viewport?.addEventListener('resize', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    return () => { viewport?.removeEventListener('resize', update); document.removeEventListener('focusin', update); document.removeEventListener('focusout', update); };
  }, []);
  useEffect(() => {
    const tablet = window.matchMedia('(min-width: 768px)');
    const closeForTablet = () => { if (tablet.matches && resourcesOpen) { setResourcesOpen(false); requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true })); } };
    tablet.addEventListener('change', closeForTablet);
    return () => tablet.removeEventListener('change', closeForTablet);
  }, [resourcesOpen]);
  if (!user || location.pathname.startsWith('/ai-tools/')) return null;
  const resourcesActive = ['/prompts', '/textbooks'].includes(location.pathname);
  return <>
    <nav aria-label="Điều hướng dưới" className={`mobile-navigation ${keyboardOpen ? 'hidden' : 'grid'} md:hidden`}>
      {destinations.map((destination, index) => { const { to, label, icon: Icon, end } = index === 0 && user ? { ...destination, to: '/dashboard', label: 'Tổng quan' } : destination; return <NavLink key={to} to={to} end={end} className={({ isActive }) => `mobile-navigation-item ${isActive ? 'active' : ''}`}><Icon size={20} aria-hidden="true" /><span>{label}</span></NavLink>; })}
      <button ref={trigger} type="button" className={`mobile-navigation-item ${resourcesActive ? 'active' : ''}`} aria-current={resourcesActive ? 'page' : undefined} aria-expanded={resourcesOpen} aria-haspopup="dialog" onClick={() => setResourcesOpen(true)}><Library size={20} aria-hidden="true" /><span>Tài nguyên</span></button>
    </nav>
    <Modal isOpen={resourcesOpen} onClose={() => setResourcesOpen(false)} showCloseButton={false} size="md" label="Tài nguyên học tập">
      <div className="p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-bold">Tài nguyên học tập</h2><button type="button" className="btn-ghost px-3" aria-label="Đóng tài nguyên" onClick={() => setResourcesOpen(false)}><X size={20} /></button></div><nav className="mt-4 space-y-2" aria-label="Chọn tài nguyên"><Link className="nav-link flex w-full gap-3" to="/prompts" onClick={() => setResourcesOpen(false)}><Library size={20} />Kho Prompt</Link><Link className="nav-link flex w-full gap-3" to="/textbooks" onClick={() => setResourcesOpen(false)}><BookOpen size={20} />Tài nguyên học tập</Link></nav></div>
    </Modal>
  </>;
}
