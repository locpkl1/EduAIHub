import { ArrowRight, Bot, X } from 'lucide-react';
import { greetingMessages } from './guidance';
import type { WelcomeAudience } from './onboardingSession';

interface AssistantGreetingProps {
  audience: WelcomeAudience;
  onOpen: () => void;
  onDismiss: () => void;
}

/** Passive website guidance: no live announcement and no automatic focus. */
export default function AssistantGreeting({ audience, onOpen, onDismiss }: AssistantGreetingProps) {
  return <aside className="assistant-greeting" aria-label="Lời chào của trợ lý EduAI-Hub" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onDismiss(); } }}>
    <div className="flex items-center gap-2"><Bot size={18} className="shrink-0 text-primary-text" aria-hidden="true" /><p className="min-w-0 flex-1 text-sm font-semibold">Trợ lý EduAI-Hub</p><button type="button" className="assistant-greeting-dismiss" aria-label="Đóng lời chào của trợ lý" onClick={onDismiss}><X size={16} aria-hidden="true" /></button></div>
    <button type="button" className="assistant-greeting-open" aria-label="Mở hướng dẫn EduAI-Hub" aria-describedby="assistant-greeting-message" onClick={onOpen}>
      <span id="assistant-greeting-message" className="block space-y-2 text-sm leading-6"><span className="block font-semibold">{greetingMessages[audience][0]}</span><span className="block text-text-muted">{greetingMessages[audience][1]}</span></span>
      <span className="mt-3 flex min-h-8 items-center gap-2 text-sm font-semibold text-primary-text">Mở hướng dẫn<ArrowRight size={15} aria-hidden="true" /></span>
    </button>
  </aside>;
}
