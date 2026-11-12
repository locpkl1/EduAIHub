import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';

interface SlidingPanelProps {
  id: string;
  title: string;
  side: 'left' | 'right';
  desktop: boolean;
  open: boolean;
  onClose: () => void;
  trigger: RefObject<HTMLButtonElement>;
  children: ReactNode;
}

/** One persistent subtree: a dock on desktop, a modal sheet on small screens. */
export default function SlidingPanel({ id, title, side, desktop, open, onClose, trigger, children }: SlidingPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const [shown, setShown] = useState(false);

  function unlockDocument() {
    if (previousOverflow.current === null) return;
    document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (desktop && dialog.matches(':modal')) { dialog.close(); unlockDocument(); }
    if (open) {
      dialog.inert = false;
      if (desktop) dialog.open = true;
      else if (!dialog.matches(':modal')) {
        dialog.close();
        previousOverflow.current = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => {
        setShown(true);
        if (!desktop) frame = requestAnimationFrame(() => {
          if (dialog.open && !dialog.inert && (!dialog.contains(document.activeElement) || document.activeElement === dialog)) dialog.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
        });
      }); });
    } else {
      const returnFocus = dialog.contains(document.activeElement) || dialog.matches(':modal');
      dialog.inert = true;
      setShown(false);
      const finish = () => {
        dialog.close();
        unlockDocument();
        if (returnFocus && trigger.current?.getClientRects().length) trigger.current.focus({ preventScroll: true });
      };
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      timer = setTimeout(finish, reduced ? 0 : 220);
    }
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [open, desktop, trigger]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => { dialog?.close(); unlockDocument(); };
  }, []);

  return <div className="chat-panel-slot" data-side={side}>
    <dialog ref={dialogRef} id={id} role={desktop ? 'region' : 'dialog'} aria-label={title} aria-hidden={!open || undefined} className="chat-sliding-panel" data-side={side} data-shown={shown} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
      if (desktop) {
        if (event.key === 'Escape') { event.preventDefault(); onClose(); }
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex]:not([tabindex="-1"])')).filter(node => node.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (!controls.includes(document.activeElement as HTMLElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault(); (event.shiftKey ? last : first)?.focus();
      }
    }} onClick={event => {
      if (desktop || event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2"><h2 className="text-lg font-bold">{title}</h2><button type="button" className="btn-ghost shrink-0 px-3" onClick={onClose} aria-label={`Đóng ${title.toLowerCase()}`}><X size={18} aria-hidden="true" /></button></header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </dialog>
  </div>;
}
