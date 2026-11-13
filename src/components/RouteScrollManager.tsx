import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Restore document scrolling only; chatbot panes manage their own scrolling. */
export default function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const previousPath = useRef(location.pathname);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    const saved = navigationType === 'POP' ? positions.current.get(location.key) : undefined;
    // Local selectors may update their URL without moving the document. POP and
    // navigation to a different page keep the existing restoration behavior.
    const requestedScroll = location.state?.preserveDocumentScroll;
    const keepScroll = navigationType !== 'POP' && previousPath.current === location.pathname && requestedScroll && Number.isFinite(requestedScroll.x) && Number.isFinite(requestedScroll.y);
    previousPath.current = location.pathname;
    const target = saved ?? (keepScroll ? { x: Math.max(0, requestedScroll.x), y: Math.max(0, requestedScroll.y) } : { x: 0, y: 0 });
    let hash = location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* Keep malformed fragments literal. */ }
    let restoring = true;
    let frame = 0;
    const restore = () => {
      if (!restoring) return;
      if (saved || !hash) {
        window.scrollTo({ left: target.x, top: target.y, behavior: 'instant' });
        if (document.documentElement.scrollHeight - innerHeight >= target.y) restoring = false;
      } else {
        const anchor = document.getElementById(hash) || document.getElementsByName(hash)[0];
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
          restoring = false;
        }
      }
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(restore); };
    const remember = () => {
      if (!restoring) positions.current.set(location.key, { x: window.scrollX, y: window.scrollY });
    };
    const interrupt = () => { restoring = false; };
    const observer = new MutationObserver(schedule);
    const resize = new ResizeObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    resize.observe(document.body);
    restore();
    remember();
    const timeout = window.setTimeout(() => { restoring = false; observer.disconnect(); resize.disconnect(); }, 10000);
    window.addEventListener('scroll', remember, { passive: true });
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interrupt);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', remember);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', interrupt);
    };
  }, [location.key, location.pathname, location.hash, location.state, navigationType]);

  return null;
}
