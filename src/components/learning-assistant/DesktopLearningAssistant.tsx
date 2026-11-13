import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, X } from 'lucide-react';
import AssistantWindow from './AssistantWindow';
import AssistantGreeting from './AssistantGreeting';
import { staticGuidance, type GuidanceActionId, type GuidanceReply } from './guidance';
import { useAuth } from '../../contexts/AuthContext';
import { hasSeenAssistantWelcome, rememberAssistantWelcome } from './onboardingSession';

/** Website help, independent of the application sidebar and the learning chatbots. */
export default function DesktopLearningAssistant() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const root = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const greeting = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const openRef = useRef(false);
  useEffect(() => { openRef.current = open; }, [open]);
  const [reply, setReply] = useState<GuidanceReply | null>(null);
  const [placement, setPlacement] = useState({ bottom: 20, blocked: false, greetingBlocked: false });
  const audience = user ? 'member' : 'guest';
  const excluded = location.pathname.startsWith('/ai-tools/') || location.pathname.startsWith('/admin');

  useEffect(() => { setOpen(false); setShowGreeting(false); }, [location.pathname, location.search, location.hash]);
  useEffect(() => { setReply(null); setShowGreeting(false); }, [user?.id]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      const enabled = media.matches && window.innerHeight >= 320;
      setDesktop(enabled);
      setPlacement(previous => previous.bottom > Math.max(20, window.innerHeight - 300) ? { bottom: 20, blocked: false, greetingBlocked: false } : previous);
      if (!enabled) {
        if (root.current?.contains(document.activeElement)) requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
        setOpen(false);
      }
    };
    update(); media.addEventListener('change', update); window.addEventListener('resize', update);
    return () => { media.removeEventListener('change', update); window.removeEventListener('resize', update); };
  }, []);
  useEffect(() => {
    const update = () => {
      const blocked = Boolean(document.querySelector('dialog[open], [aria-modal="true"]'));
      setSuspended(blocked);
      if (blocked) setOpen(false);
    };
    const observer = new MutationObserver(update);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'aria-modal'] });
    update(); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => {
      const active = document.activeElement;
      const own = Boolean(root.current?.contains(active));
      setEditing(!own && active instanceof HTMLElement && Boolean(active.closest('form') || active.matches('input,textarea,select,[contenteditable="true"]')));
      if (!own && active !== document.body) {
        if (openRef.current) rememberAssistantWelcome(true);
        setOpen(false);
      }
    };
    const focusOut = () => queueMicrotask(update);
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { if (openRef.current) rememberAssistantWelcome(true); setOpen(false); } };
    document.addEventListener('focusin', update); document.addEventListener('focusout', focusOut); document.addEventListener('pointerdown', outside);
    update(); return () => { document.removeEventListener('focusin', update); document.removeEventListener('focusout', focusOut); document.removeEventListener('pointerdown', outside); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => document.getElementById('learning-assistant-close')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    const active = document.activeElement;
    if (placement.blocked && root.current?.contains(active)) document.getElementById('main-content')?.focus({ preventScroll: true });
    else if (placement.greetingBlocked && greeting.current?.contains(active)) launcher.current?.focus({ preventScroll: true });
  }, [placement.blocked, placement.greetingBlocked]);

  // Stay at the viewport's right edge, yielding locally when a page action is underneath.
  // This never reads the sidebar width or places the helper inside the sidebar.
  useEffect(() => {
    if (!desktop || excluded || suspended || editing || open) return;
    let frame = 0;
    const measure = () => {
      if (!root.current) return;
      const right = parseFloat(getComputedStyle(root.current).right) || 20;
      const controls = Array.from(document.querySelectorAll<HTMLElement>('a,button,input,textarea,select,summary,[role="button"],[role="tab"]'))
        .filter(node => !root.current?.contains(node) && node.getClientRects().length)
        .map(node => node.getBoundingClientRect());
      const candidates = (showGreeting ? [20, 36, 52, 68, 84, 100, 116, 132, 148] : [20, 84, 148]).filter(value => value <= Math.max(20, innerHeight - 300));
      const launcherClear = (value: number) => {
        const left = innerWidth - right - 56, top = innerHeight - value - 56;
        return !controls.some(rect => rect.left < left + 64 && rect.right > left - 8 && rect.top < top + 64 && rect.bottom > top - 8);
      };
      const bubble = greeting.current?.querySelector('.assistant-greeting')?.getBoundingClientRect();
      const greetingClear = (value: number) => {
        if (!showGreeting || !bubble) return true;
        const left = innerWidth - right - bubble.width, bottom = innerHeight - value - 68, top = bottom - bubble.height;
        return top >= 8 && !controls.some(rect => rect.left < left + bubble.width + 8 && rect.right > left - 8 && rect.top < bottom + 8 && rect.bottom > top - 8);
      };
      const preferred = candidates.find(value => launcherClear(value) && greetingClear(value));
      const bottom = preferred ?? candidates.find(launcherClear);
      const greetingBlocked = showGreeting && preferred === undefined;
      setPlacement(previous => previous.bottom === (bottom ?? 20) && previous.blocked === (bottom === undefined) && previous.greetingBlocked === greetingBlocked ? previous : { bottom: bottom ?? 20, blocked: bottom === undefined, greetingBlocked });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new MutationObserver(schedule);
    const resize = new ResizeObserver(schedule);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-collapsed', 'hidden'] });
    resize.observe(document.body);
    const greetingElement = greeting.current?.querySelector('.assistant-greeting');
    if (greetingElement) resize.observe(greetingElement);
    window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); document.addEventListener('transitionend', schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('transitionend', schedule); };
  }, [desktop, excluded, suspended, editing, open, showGreeting, location.pathname, location.search, location.hash]);
  useEffect(() => {
    const pathname = location.pathname.replace(/\/+$/, '').toLowerCase();
    const welcomeRoute = pathname === '' || (audience === 'member' && pathname === '/dashboard');
    if (!desktop || excluded || suspended || editing || placement.blocked || loading || open || !welcomeRoute || hasSeenAssistantWelcome(audience)) return;
    const frame = requestAnimationFrame(() => {
      if (hasSeenAssistantWelcome(audience)) return;
      rememberAssistantWelcome(false, audience); setShowGreeting(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [desktop, excluded, suspended, editing, placement.blocked, loading, open, audience, location.pathname]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !root.current || document.querySelector('dialog[open], [aria-modal="true"]')) return;
      event.preventDefault();
      rememberAssistantWelcome(true);
      setOpen(false);
      requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);

  function close() { rememberAssistantWelcome(true); setOpen(false); requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true })); }
  function openGuide() { rememberAssistantWelcome(false, audience); setShowGreeting(false); setReply(null); setOpen(true); }
  function dismissGreeting() {
    const restoreFocus = greeting.current?.contains(document.activeElement);
    rememberAssistantWelcome(true, audience); setShowGreeting(false);
    if (restoreFocus) requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
  }
  function choose(action: GuidanceActionId) { setReply(staticGuidance[action]); requestAnimationFrame(() => document.getElementById('assistant-reply-title')?.focus({ preventScroll: true })); }
  function back() { setReply(null); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('.assistant-quick-action')?.focus({ preventScroll: true })); }

  if (!desktop || excluded || suspended || editing) return null;
  return <div ref={root} className="learning-assistant-root" aria-hidden={placement.blocked && !open || undefined} style={{ '--assistant-bottom': `${placement.bottom}px`, visibility: placement.blocked && !open ? 'hidden' : undefined } as CSSProperties}>
    {showGreeting && !open && <div ref={greeting} aria-hidden={placement.greetingBlocked || undefined} style={{ visibility: placement.greetingBlocked ? 'hidden' : undefined }}><AssistantGreeting audience={audience} onOpen={openGuide} onDismiss={dismissGreeting} /></div>}
    {open && <AssistantWindow reply={reply} onChoose={choose} onBack={back} onClose={close} />}
    <button ref={launcher} type="button" className="learning-assistant-launcher" tabIndex={placement.blocked && !open ? -1 : 0} aria-label={open ? 'Thu gọn trợ lý EduAI-Hub' : 'Mở trợ lý EduAI-Hub'} aria-expanded={open} aria-controls={open ? 'learning-assistant-window' : undefined} aria-haspopup="dialog" onClick={() => { if (open) close(); else openGuide(); }}>{open ? <X size={24} aria-hidden="true" /> : <Bot size={26} aria-hidden="true" />}</button>
  </div>;
}
