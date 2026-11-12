import { useEffect, useRef, useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { copyText } from '../../lib/clipboard';

export default function CopyButton({ text, label = 'Sao chép prompt', className = '' }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await copyText(text);
      setState('copied');
      timer.current = setTimeout(() => setState('idle'), 2200);
    } catch {
      setState('error');
    }
  }
  return (
    <div className={className}>
      <button type="button" onClick={copy} className="btn-outline w-full sm:w-auto">
        {state === 'copied' ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}
        {state === 'copied' ? 'Đã sao chép' : label}
      </button>
      <span className="sr-only" role="status">{state === 'copied' ? 'Đã sao chép vào bộ nhớ tạm.' : ''}</span>
      {state === 'error' && <p role="alert" className="mt-2 text-sm text-accent">Chưa sao chép được. Hãy chọn nội dung và sao chép thủ công.</p>}
    </div>
  );
}
