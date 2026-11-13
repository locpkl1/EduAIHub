import { ArrowLeft, ArrowRight, Bot, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import { guidanceActions, guestWelcome, memberWelcome, type GuidanceActionId, type GuidanceReply } from './guidance';
import { useAuth } from '../../contexts/AuthContext';
import StartLearningAction from '../StartLearningAction';

interface AssistantWindowProps {
  reply: GuidanceReply | null;
  onChoose: (action: GuidanceActionId) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function AssistantWindow({ reply, onChoose, onBack, onClose }: AssistantWindowProps) {
  const { user } = useAuth();
  const welcome = user ? memberWelcome : guestWelcome;
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { content.current?.scrollTo(0, 0); }, [reply, user]);
  return <section id="learning-assistant-window" className="learning-assistant-window" role="dialog" aria-modal="false" aria-labelledby="learning-assistant-title">
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3"><Bot size={22} className="shrink-0 text-primary-text" aria-hidden="true" /><div className="min-w-0 flex-1"><h2 id="learning-assistant-title" className="text-lg font-bold">Trợ lý EduAI-Hub</h2><p className="mt-1 text-xs text-text-muted">Hướng dẫn sử dụng có sẵn</p></div><button id="learning-assistant-close" type="button" className="btn-ghost shrink-0 px-3" aria-label="Đóng cửa sổ hướng dẫn" onClick={onClose}><X size={18} aria-hidden="true" /></button></header>
    <div ref={content} className="min-h-0 overflow-y-auto overscroll-contain p-4">
      {user && reply ? <>
        <button type="button" className="btn-ghost mb-3 px-0" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" />Xem lựa chọn khác</button>
        <h3 id="assistant-reply-title" tabIndex={-1} className="text-xl font-bold">{reply.title}</h3>
        <div className="mt-3 space-y-3 text-sm leading-7 text-text-muted">{reply.paragraphs.map(text => <p key={text}>{text}</p>)}</div>
        <ul className="mt-4 divide-y divide-border border-y border-border">{reply.links.map(link => <li key={link.to}><Link className="flex min-h-11 items-center justify-between gap-3 py-3 text-sm font-semibold text-primary-text" to={link.to}>{link.label}<ArrowRight size={15} className="shrink-0" aria-hidden="true" /></Link></li>)}</ul>
      </> : <>
        <h3 className="text-xl font-bold">{welcome.title}</h3>
        <div className="mt-3 space-y-3 text-sm leading-7 text-text-muted">{welcome.paragraphs.map(text => <p key={text}>{text}</p>)}</div>
        {!user && <div className="mt-4"><StartLearningAction className="w-full" /></div>}
        <ul className="mt-4 divide-y divide-border border-y border-border">{welcome.links.map(link => <li key={link.to}><Link className="flex min-h-11 items-center justify-between gap-3 py-3 text-sm font-semibold text-primary-text" to={link.to}>{link.label}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}</ul>
        {user && <div className="mt-5 space-y-2">{guidanceActions.map(action => <button key={action.id} type="button" className="assistant-quick-action flex min-h-11 w-full items-center justify-between gap-3 rounded-nav border border-border-interactive px-3 py-3 text-left text-sm font-semibold hover:border-primary hover:bg-primary-light" onClick={() => onChoose(action.id)}>{action.label}<ArrowRight size={16} className="shrink-0 text-primary-text" aria-hidden="true" /></button>)}</div>}
      </>}
    </div>
  </section>;
}
