import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  label?: string;
  className?: string;
}
const sizeClasses = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ isOpen, onClose, children, size = 'lg', showCloseButton = true, label = 'Chi tiết', className = '' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return <dialog ref={dialogRef} aria-label={label} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), details > summary:first-of-type, [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'))
      .filter(control => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!controls.includes(document.activeElement as HTMLElement)) {
      event.preventDefault(); (event.shiftKey ? last : first)?.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }} className={`m-auto w-[calc(100%-2rem)] ${sizeClasses[size]} max-h-[90dvh] overflow-y-auto overscroll-contain rounded-nav border border-border bg-bg-card p-0 text-text shadow-xl backdrop:bg-black/50 ${className}`}>
    {showCloseButton && <button type="button" onClick={onClose} className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-control text-text-muted hover:bg-bg-muted" aria-label="Đóng"><X size={18} /></button>}
    {children}
  </dialog>;
}
