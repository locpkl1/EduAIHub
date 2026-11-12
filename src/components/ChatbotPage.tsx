import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  BookmarkPlus,
  Loader2,
  LogIn,
  MessageSquare,
  PanelLeft,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  callCoze,
  type CozeBotKey,
  type StudyContext,
  type UserLearningContext,
} from '../lib/cozeClient';
import { formatAiText, parseEduAiMessage, stripEduAiPromptMarkers } from '../lib/formatAiText';
import { copyText } from '../lib/clipboard';
import SlidingPanel from './chat/SlidingPanel';

type ChatMessage = { id: string; role: 'user' | 'ai'; text: string };

const CHAT_RAIL_CLASS =
  'mx-auto w-full md:w-[94%] lg:w-[calc(100%-2rem)] lg:max-w-[920px] xl:w-[calc(100%-3rem)] xl:max-w-[960px]';
type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  conversationId: string | null;
  createdAt: string;
  updatedAt?: string;
};

type PromptSaveState = {
  status: 'saving' | 'success' | 'error';
  message?: string;
};

type StoredChatMessage = {
  id?: unknown;
  role: 'user' | 'ai';
  text: string;
};

type StoredChatSession = Partial<Omit<ChatSession, 'messages'>> & {
  messages?: unknown;
  convId?: unknown;
  conversationId?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const MAX_SESSIONS = 20;
const MAX_MESSAGES_PER_SESSION = 80;

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

function nowIso() {
  return new Date().toISOString();
}

function readStoredDate(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  return nowIso();
}

function readStoredConversationId(source: StoredChatSession) {
  const value = source.conversationId ?? source.convId;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isStoredChatMessage(value: unknown): value is StoredChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<StoredChatMessage>;
  return (message.role === 'user' || message.role === 'ai') && typeof message.text === 'string';
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

function trimSession(session: ChatSession): ChatSession {
  return {
    ...session,
    messages: session.messages.slice(-MAX_MESSAGES_PER_SESSION),
  };
}

function trimSessions(sessions: ChatSession[]): ChatSession[] {
  return sessions.slice(0, MAX_SESSIONS).map(trimSession);
}

function loadStoredSessions(raw: unknown): ChatSession[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .slice(0, MAX_SESSIONS)
    .map((item): ChatSession | null => {
      if (!item || typeof item !== 'object') return null;
      const source = item as StoredChatSession;
      const rawMessages = Array.isArray(source.messages) ? source.messages : [];
      const messages = rawMessages
        .filter(isStoredChatMessage)
        .slice(-MAX_MESSAGES_PER_SESSION)
        .map((msg) => ({
          id: typeof msg.id === 'string' && msg.id.trim() ? msg.id : genId(),
          role: msg.role,
          text: msg.text,
        }));

      const createdAt = readStoredDate(source.createdAt);
      return {
        id: typeof source.id === 'string' && source.id.trim() ? source.id : genId(),
        title: typeof source.title === 'string' && source.title.trim() ? source.title : 'Cuộc trò chuyện',
        messages,
        conversationId: readStoredConversationId(source),
        createdAt,
        updatedAt: readStoredDate(source.updatedAt ?? createdAt),
      };
    })
    .filter((session): session is ChatSession => Boolean(session));
}

function serializeSessions(sessions: ChatSession[]) {
  return trimSessions(sessions).map((session) => ({
    id: session.id,
    title: session.title,
    messages: session.messages.map((message) => ({
      id: message.id,
      role: message.role,
      text: message.text,
    })),
    conversationId: session.conversationId,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }));
}

export interface ChatbotPageProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor?: string;
  systemContext?: string;
  starterPrompts: string[];
  sidebar?: ReactNode;
  botKey: CozeBotKey;
  saveSubject?: string;
  saveBookSeries?: string;
  saveChapter?: string;
  userContext?: UserLearningContext;
  studyContext?: StudyContext;
}

export default function ChatbotPage({
  title,
  subtitle,
  icon,
  accentColor,
  starterPrompts,
  sidebar,
  botKey,
  saveSubject = '',
  saveBookSeries = '',
  saveChapter = '',
  userContext,
  studyContext,
}: ChatbotPageProps) {
  const { user, isGuest, displayName, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const primaryColor = accentColor || 'var(--color-primary)';
  const userInitials = getInitials(displayName || 'Bạn');

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [desktopPanels, setDesktopPanels] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [desktopContextOpen, setDesktopContextOpen] = useState(true);
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const contextOpen = Boolean(sidebar) && (desktopPanels ? desktopContextOpen : mobileContextOpen);
  const contextToggleRef = useRef<HTMLButtonElement>(null);
  function setContextOpen(value: boolean) {
    if (desktopPanels) setDesktopContextOpen(value);
    else { setMobileContextOpen(value); if (value) setSidebarOpen(false); }
  }
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => { setDesktopPanels(media.matches); setMobileContextOpen(false); setSidebarOpen(media.matches); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const chatViewportRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = useMemo(() => activeSession?.messages ?? [], [activeSession]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [historySaveError, setHistorySaveError] = useState(false);
  const [hasUnreadResponse, setHasUnreadResponse] = useState(false);
  const [promptSaveStates, setPromptSaveStates] = useState<Record<string, PromptSaveState>>({});

  const messageScrollRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const previousSessionRef = useRef<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef(false);
  const savingPromptIdsRef = useRef(new Set<string>());
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  const storageKey = `eduaihub_chat_sessions_${botKey}_${user?.id || 'guest'}`;
  const sidebarToggleLabel = sidebarOpen ? 'Ẩn lịch sử trò chuyện' : 'Hiện lịch sử trò chuyện';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setSessionsLoaded(false);
    try {
      const raw = window.localStorage.getItem(storageKey);
      const stored = raw ? loadStoredSessions(JSON.parse(raw)) : [];
      setSessions(stored);
      setActiveSessionId(stored[0]?.id ?? null);
    } catch {
      setSessions([]);
      setActiveSessionId(null);
    } finally {
      setSessionsLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!sessionsLoaded || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(serializeSessions(sessions)));
      setHistorySaveError(false);
    } catch {
      setHistorySaveError(true);
    }
  }, [sessions, sessionsLoaded, storageKey]);

  useEffect(() => {
    const pane = messageScrollRef.current;
    const changedSession = previousSessionRef.current !== activeSessionId;
    previousSessionRef.current = activeSessionId;
    if (changedSession) nearBottomRef.current = true;
    if (!pane) return;
    if (nearBottomRef.current) {
      pane.scrollTo({ top: pane.scrollHeight, behavior: 'instant' });
      setHasUnreadResponse(false);
    } else if (!loading && messages[messages.length - 1]?.role === 'ai') {
      setHasUnreadResponse(true);
    }
  }, [messages, loading, activeSessionId]);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => chatViewportRef.current?.style.setProperty('--chat-viewport-height', `${Math.floor(viewport?.height ?? window.innerHeight)}px`);
    update(); viewport?.addEventListener('resize', update);
    return () => viewport?.removeEventListener('resize', update);
  }, []);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function selectSession(id: string) {
    setActiveSessionId(id);
    closeSidebar();
  }

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [input]);

  function createNewSession() {
    const id = genId();
    const session: ChatSession = {
      id,
      title: 'Cuộc trò chuyện mới',
      messages: [],
      conversationId: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    setSessions((prev) => trimSessions([session, ...prev]));
    setActiveSessionId(id);
    setInput('');
  }

  function deleteSession(id: string) {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0]?.id ?? null);
      }
      return remaining;
    });
  }

  async function savePrompt(promptContent: string, cardId: string) {
    if (savingPromptIdsRef.current.has(cardId)) return;

    if (isGuest || !user) {
      setPromptSaveStates((prev) => ({
        ...prev,
        [cardId]: { status: 'error', message: 'Đăng nhập để lưu prompt vào thư viện của bạn.' },
      }));
      return;
    }

    const content = promptContent.trim();
    if (!content) {
      setPromptSaveStates((prev) => ({
        ...prev,
        [cardId]: { status: 'error', message: 'Prompt đang trống nên chưa thể lưu.' },
      }));
      return;
    }

    savingPromptIdsRef.current.add(cardId);
    setPromptSaveStates((prev) => ({ ...prev, [cardId]: { status: 'saving' } }));

    try {
      const purpose = content.split('\n').find((line) => line.trim())?.replace(/^#+\s*/, '').slice(0, 80)
        || 'Prompt từ chatbot';
      const { error } = await supabase.from('saved_prompts').insert({
        user_id: user.id,
        purpose,
        prompt_content: content,
        subject: saveSubject || studyContext?.subject || '',
        book_series: saveBookSeries || studyContext?.textbookSeries || '',
        chapter: saveChapter || studyContext?.lesson || studyContext?.chapter || '',
      });

      if (error) throw error;
      setPromptSaveStates((prev) => ({
        ...prev,
        [cardId]: { status: 'success', message: 'Đã lưu vào Kho Prompt.' },
      }));
    } catch (error) {
      console.error('Error saving prompt:', error);
      setPromptSaveStates((prev) => ({
        ...prev,
        [cardId]: { status: 'error', message: 'Không thể lưu prompt. Vui lòng thử lại.' },
      }));
    } finally {
      savingPromptIdsRef.current.delete(cardId);
    }
  }

  async function handleSend() {
    if (!input.trim() || sendingRef.current) return;
    sendingRef.current = true;
    const text = input.trim();

    let sessionId = activeSessionId;
    if (!sessionId) {
      const id = genId();
      const session: ChatSession = {
        id,
        title: text.slice(0, 40),
        messages: [],
        conversationId: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setSessions((prev) => trimSessions([session, ...prev]));
      sessionId = id;
      setActiveSessionId(id);
    }

    const userMsg: ChatMessage = { id: genId(), role: 'user', text };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const isNewTitle = s.title === 'Cuộc trò chuyện mới' || s.messages.length === 0;
        return {
          ...s,
          messages: [...s.messages, userMsg].slice(-MAX_MESSAGES_PER_SESSION),
          title: isNewTitle ? text.slice(0, 40) : s.title,
          updatedAt: nowIso(),
        };
      })
    );

    setInput('');
    setLoading(true);

    const currentSession = sessionsRef.current.find((s) => s.id === sessionId);
    const currentConversationId = currentSession?.conversationId ?? null;
    try {
      const { content, conversation_id } = await callCoze({
        message: text,
        conversationId: currentConversationId,
        botKey,
        userId: user?.id ?? null,
        userContext,
        studyContext,
        metaData: {
          app: 'eduaihub',
          bot_key: botKey,
          session_id: sessionId,
          source: 'web',
        },
      });

      const aiMsg: ChatMessage = { id: genId(), role: 'ai', text: content };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
              ...s,
              conversationId: conversation_id,
              messages: [...s.messages, aiMsg].slice(-MAX_MESSAGES_PER_SESSION),
              updatedAt: nowIso(),
            }
            : s
        )
      );

    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.';
      const aiMsg: ChatMessage = { id: genId(), role: 'ai', text: errMsg };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, aiMsg].slice(-MAX_MESSAGES_PER_SESSION), updatedAt: nowIso() }
            : s
        )
      );
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      nearBottomRef.current = true;
      handleSend();
    }
  }

  async function handleCopy(text: string, id: string) {
    clearTimeout(copyTimerRef.current);
    setCopyError(false);
    try {
      await copyText(text);
      setCopiedId(id);
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 2200);
    } catch {
      setCopiedId(null);
      setCopyError(true);
    }
  }

  return (
    <div ref={chatViewportRef} className="chat-focus-viewport flex min-h-0 bg-bg p-1 text-text sm:p-2">
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-border bg-bg-card">
        <header className="flex min-w-0 shrink-0 items-center gap-2 flex-wrap border-b border-border px-2 py-1 sm:gap-3 sm:px-3">
          <button ref={sidebarToggleRef} type="button" onClick={() => { setSidebarOpen(value => !value); if (!desktopPanels) setMobileContextOpen(false); }} onKeyDown={event => { if (event.key === 'Escape' && desktopPanels && sidebarOpen) { event.preventDefault(); closeSidebar(); } }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-bg-muted" aria-expanded={sidebarOpen} aria-controls="chat-history" aria-label={sidebarToggleLabel}>
            <PanelLeft size={18} />
          </button>
          <button type="button" onClick={() => navigate('/ai-tools')} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-bg-muted" aria-label="Quay lại Công cụ AI"><ArrowLeft size={18} /></button>
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary-light sm:flex" aria-hidden="true">{icon}</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-sm font-bold leading-snug sm:text-base">{title}</h1>
          </div>
          {isGuest && <button type="button" onClick={signInWithGoogle} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-bg-muted" aria-label="Đăng nhập" title="Đăng nhập để lưu prompt"><LogIn size={18} /></button>}
          {sidebar && <button ref={contextToggleRef} type="button" className="chat-context-trigger btn-outline shrink-0 px-3" onKeyDown={event => { if (event.key === 'Escape' && desktopPanels && contextOpen) { event.preventDefault(); setContextOpen(false); } }} aria-label="Ngữ cảnh học tập" aria-expanded={contextOpen} aria-controls="chat-context" aria-haspopup={desktopPanels ? undefined : 'dialog'} onClick={() => setContextOpen(!contextOpen)}><BookOpen size={18} aria-hidden="true" /><span>Ngữ cảnh học tập</span></button>}
          <span className="hidden shrink-0 text-xs text-text-muted xl:block">{loading ? 'Đang phản hồi…' : 'Trợ lý AI'}</span>
        </header>
        <div className="sr-only" role="status">{loading ? 'AI đang phản hồi.' : messages[messages.length - 1]?.role === 'ai' ? 'Đã nhận phản hồi của AI.' : ''} {copiedId ? 'Đã sao chép.' : ''}</div>
        {copyError && <p role="alert" className="border-b border-border bg-accent-light px-4 py-2 text-sm text-accent">Chưa sao chép được. Hãy thử lại hoặc chọn nội dung để sao chép thủ công.</p>}
        {historySaveError && <p role="alert" className="shrink-0 border-b border-border bg-accent-light px-4 py-2 text-sm text-accent">Chưa lưu được lịch sử trên trình duyệt này. Hội thoại vẫn dùng được trong trang hiện tại; hãy sao chép nội dung quan trọng trước khi tải lại hoặc rời trang.</p>}
        <div className="chat-panels" data-history-open={desktopPanels && sidebarOpen} data-context-open={desktopPanels && contextOpen}>
          <SlidingPanel id="chat-history" title="Lịch sử trò chuyện" side="left" desktop={desktopPanels} open={sidebarOpen} onClose={closeSidebar} trigger={sidebarToggleRef}>
            <aside ref={sidebarRef} className="flex min-h-0 flex-col bg-bg-card">
              <div className="border-b border-border p-3">
                <p className="mb-3 text-xs text-text-muted">{sessions.length} phiên trò chuyện · {historySaveError ? 'chưa lưu được trên trình duyệt này' : 'lưu trên trình duyệt này'}</p>
                <button id="new-chat-session" type="button" onClick={() => { createNewSession(); closeSidebar(); requestAnimationFrame(() => textareaRef.current?.focus()); }} className="btn-primary w-full" title="Cuộc trò chuyện mới"><Plus size={16} />Cuộc trò chuyện mới</button>
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
                {sessions.length === 0 && <p className="px-2 py-4 text-sm leading-6 text-text-muted">Chưa có cuộc trò chuyện. Viết câu hỏi đầu tiên ở ô tin nhắn.</p>}
                {sessions.map(session => <div key={session.id} className={`flex items-center rounded-nav border ${session.id === activeSessionId ? 'border-primary bg-primary-light' : 'border-transparent hover:bg-bg-muted'}`}>
                  <button type="button" aria-pressed={session.id === activeSessionId} onClick={() => selectSession(session.id)} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-nav px-3 py-2 text-left text-sm">
                    <MessageSquare size={15} className="shrink-0 text-text-muted" aria-hidden="true" /><span className="truncate">{session.title}</span>
                  </button>
                  <button type="button" onClick={() => { deleteSession(session.id); requestAnimationFrame(() => sidebarRef.current?.querySelector<HTMLButtonElement>('#new-chat-session')?.focus()); }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-text-muted hover:text-accent" aria-label={`Xóa phiên: ${session.title}`}><Trash2 size={15} /></button>
                </div>)}
              </div>
            </aside>
          </SlidingPanel>
          <div className="chat-conversation flex min-h-0 min-w-0 flex-col">
            <div className="flex min-h-0 min-w-0 flex-1">
              <section className="flex min-h-0 min-w-0 flex-1 flex-col" aria-label="Cuộc trò chuyện">
                <div ref={messageScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain" onScroll={event => { const pane = event.currentTarget; nearBottomRef.current = pane.scrollHeight - pane.scrollTop - pane.clientHeight < 80; if (nearBottomRef.current) setHasUnreadResponse(false); }}>
                  {messages.length === 0 ? <EmptyChatState subtitle={subtitle} starterPrompts={starterPrompts} onPick={prompt => { setInput(prompt); textareaRef.current?.focus(); }} /> : <div className={`${CHAT_RAIL_CLASS} space-y-6 px-3 py-5 sm:px-5 lg:px-6`} role="log" aria-label="Tin nhắn" aria-live="off">
                    {messages.map(message => <div key={message.id} className={`flex min-w-0 gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      {message.role === 'ai' && <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light sm:flex" aria-hidden="true"><div className="scale-75">{icon}</div></div>}
                      <div className={`min-w-0 rounded-[12px] px-4 py-3 text-base leading-7 [overflow-wrap:anywhere] ${message.role === 'user' ? 'max-w-[90%] bg-primary text-on-primary sm:max-w-[80%]' : 'flex-1 text-text'}`}>
                        <span className="sr-only">{message.role === 'user' ? 'Bạn: ' : 'AI: '}</span>
                        {message.role === 'user' ? <p className="whitespace-pre-wrap">{message.text}</p> : <div className="space-y-4">{parseEduAiMessage(message.text).map((part, index) => {
                          if (part.type === 'text') return <div key={`text-${index}`} className="min-w-0">{formatAiText(part.content)}</div>;
                          const cardId = `${message.id}-prompt-${index}`;
                          return <PromptCard key={cardId} content={part.content} copied={copiedId === cardId} saveState={promptSaveStates[cardId]} onCopy={() => handleCopy(part.content, cardId)} onSave={() => savePrompt(part.content, cardId)} />;
                        })}</div>}
                        {message.role === 'ai' && <button type="button" onClick={() => handleCopy(stripEduAiPromptMarkers(message.text), message.id)} className="mt-3 flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-text-muted hover:bg-bg-muted" aria-label="Sao chép phản hồi AI">{copiedId === message.id ? <><Check size={14} />Đã sao chép</> : <><Copy size={14} />Sao chép</>}</button>}
                      </div>
                      {message.role === 'user' && <span className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary sm:flex" aria-hidden="true">{userInitials}</span>}
                    </div>)}
                    {loading && <TypingIndicator icon={icon} primaryColor={primaryColor} />}
                  </div>}
                </div>
                {hasUnreadResponse && <button type="button" className="min-h-11 border-t border-border bg-primary-light px-4 text-sm font-semibold text-primary-text" onClick={() => { const pane = messageScrollRef.current; if (pane) pane.scrollTop = pane.scrollHeight; nearBottomRef.current = true; setHasUnreadResponse(false); }}>Xem phản hồi mới</button>}
                <div className="shrink-0 border-t border-border px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 sm:px-4">
                  <div className={CHAT_RAIL_CLASS}>
                    <div className="flex min-w-0 items-end gap-2 rounded-input border border-border-interactive bg-bg-card p-2 focus-within:border-primary sm:gap-3">
                      <textarea ref={textareaRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Viết câu hỏi của bạn…" rows={1} className="min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-base leading-7 text-text" style={{ maxHeight: '160px' }} aria-label="Nội dung tin nhắn gửi chatbot" aria-describedby="chat-composer-help" />
                      <button type="button" onClick={() => { nearBottomRef.current = true; handleSend(); }} disabled={!input.trim() || loading} className="btn-primary h-11 w-11 shrink-0 p-0" aria-label="Gửi tin nhắn"><Send size={18} /></button>
                    </div>
                    <p id="chat-composer-help" className="mt-1 text-[11px] leading-4 text-text-muted">Enter gửi · Shift+Enter xuống dòng. Hãy kiểm chứng câu trả lời.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          {sidebar && <SlidingPanel id="chat-context" title="Ngữ cảnh học tập" side="right" desktop={desktopPanels} open={contextOpen} onClose={() => setContextOpen(false)} trigger={contextToggleRef}>{sidebar}</SlidingPanel>}
        </div>
      </div>
    </div>
  );
}

function PromptCard({
  content,
  copied,
  saveState,
  onCopy,
  onSave,
}: {
  content: string;
  copied: boolean;
  saveState?: PromptSaveState;
  onCopy: () => void;
  onSave: () => void;
}) {
  const saving = saveState?.status === 'saving';
  const saved = saveState?.status === 'success';

  return (
    <section
      className="my-4 min-w-0 overflow-hidden rounded-card border"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary-light) 52%, var(--color-bg-card))',
        borderColor: 'color-mix(in srgb, var(--color-primary) 34%, var(--color-border))',
      }}
      aria-label="Prompt hoàn chỉnh"
      data-prompt-card
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-2.5 sm:px-4"
        style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 22%, var(--color-border))' }}
      >
        <BookmarkPlus size={15} className="shrink-0 text-primary" />
        <p className="min-w-0 flex-1 text-sm font-semibold text-primary-text">
          Prompt hoàn chỉnh
        </p>
      </div>

      <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words px-3 py-4 font-sans text-base leading-8 text-text sm:px-4">
        {content}
      </pre>

      <div
        className="flex flex-wrap items-center gap-2 border-t px-3 py-3 sm:px-4"
        style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 22%, var(--color-border))' }}
      >
        <button
          type="button"
          onClick={onCopy}
          className="btn-outline"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Sao chép prompt"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || saved}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold text-on-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: saved ? 'var(--color-success)' : 'var(--color-primary)', color: saved ? 'var(--foreground-on-success)' : 'var(--foreground-on-primary)' }}
          aria-label="Lưu prompt"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <BookmarkPlus size={14} />}
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu' : 'Lưu Prompt'}
        </button>
        {saveState?.message && (
          <p
            className={`w-full text-xs leading-5 ${saveState.status === 'error' ? 'text-accent' : 'text-success'}`}
            role={saveState.status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {saveState.message}
          </p>
        )}
      </div>
    </section>
  );
}

function EmptyChatState({ subtitle, starterPrompts, onPick }: { subtitle: string; starterPrompts: string[]; onPick: (prompt: string) => void }) {
  return <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
    <h2 className="font-display text-xl font-bold leading-snug sm:text-2xl">Bạn đang cần gỡ vướng gì?</h2>
    <p className="mt-2 text-sm leading-6 text-text-muted">{subtitle}</p>
    <p className="mt-3 text-sm text-text-muted">Chọn gợi ý, chỉnh lại rồi gửi.</p>
    <div className="mt-3 divide-y divide-border border-y border-border">{starterPrompts.map(prompt => <button key={prompt} type="button" onClick={() => onPick(prompt)} className="min-w-0 min-h-11 w-full rounded-control px-2 py-2 text-left text-sm leading-6 text-text hover:border-primary hover:bg-primary-light">{prompt}</button>)}</div>
  </div>;
}

function TypingIndicator({ icon, primaryColor }: { icon: ReactNode; primaryColor: string }) {
  return (
    <div className="flex gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `color-mix(in srgb, ${primaryColor} 13%, var(--color-bg-card))`,
          border: `1px solid color-mix(in srgb, ${primaryColor} 32%, var(--color-border))`,
        }}
      >
        <div style={{ transform: 'scale(0.68)' }}>{icon}</div>
      </div>
      <div
        className="flex items-center gap-1.5 rounded-card px-4 py-3"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 94%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 72%, transparent)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="typing-dot h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: primaryColor, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
