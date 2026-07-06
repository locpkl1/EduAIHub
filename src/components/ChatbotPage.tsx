import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Copy,
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
import { formatAiText, looksLikePrompt, userRequestedSave } from '../lib/formatAiText';

type Message = { id: string; role: 'user' | 'ai'; text: string };
type ChatSession = { id: string; title: string; messages: Message[]; convId: string | null; createdAt: number };

const MAX_SESSIONS = 20;
const MAX_MESSAGES_PER_SESSION = 80;

function genId() {
  return Math.random().toString(36).slice(2, 11);
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
      const source = item as Partial<ChatSession>;
      const messages = Array.isArray(source.messages)
        ? source.messages
            .filter((msg) => msg && (msg.role === 'user' || msg.role === 'ai') && typeof msg.text === 'string')
            .slice(-MAX_MESSAGES_PER_SESSION)
            .map((msg) => ({ id: genId(), role: msg.role, text: msg.text }))
        : [];

      return {
        id: genId(),
        title: typeof source.title === 'string' && source.title.trim() ? source.title : 'Cuộc trò chuyện',
        messages,
        convId: typeof source.convId === 'string' && source.convId.trim() ? source.convId : null,
        createdAt: typeof source.createdAt === 'number' ? source.createdAt : Date.now(),
      };
    })
    .filter((session): session is ChatSession => Boolean(session));
}

function serializeSessions(sessions: ChatSession[]) {
  return trimSessions(sessions).map((session) => ({
    title: session.title,
    messages: session.messages.map((message) => ({
      role: message.role,
      text: message.text,
    })),
    convId: session.convId,
    createdAt: session.createdAt,
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
  autoSavePrompts?: boolean;
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
  autoSavePrompts = false,
  saveSubject = '',
  saveBookSeries = '',
  saveChapter = '',
  userContext,
  studyContext,
}: ChatbotPageProps) {
  const { user, isGuest, displayName } = useAuth();
  const navigate = useNavigate();

  const primaryColor = accentColor || 'var(--color-primary)';
  const userInitials = getInitials(displayName || 'Bạn');

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    } catch {
      /* localStorage can be unavailable or full; chat still works in memory. */
    }
  }, [sessions, sessionsLoaded, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
      convId: null,
      createdAt: Date.now(),
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

  async function maybeSavePrompt(userText: string, aiContent: string) {
    if (!autoSavePrompts || isGuest || !user) return;
    if (!userRequestedSave(userText) && !looksLikePrompt(aiContent)) return;

    const { error } = await supabase.from('saved_prompts').insert({
      user_id: user.id,
      purpose: userText.substring(0, 80),
      prompt_content: aiContent,
      subject: saveSubject || studyContext?.subject || '',
      book_series: saveBookSeries || studyContext?.textbookSeries || '',
      chapter: saveChapter || studyContext?.lesson || studyContext?.chapter || '',
    });

    if (error) console.error('Error saving prompt:', error);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const text = input.trim();

    let sessionId = activeSessionId;
    if (!sessionId) {
      const id = genId();
      const session: ChatSession = {
        id,
        title: text.slice(0, 40),
        messages: [],
        convId: null,
        createdAt: Date.now(),
      };
      setSessions((prev) => trimSessions([session, ...prev]));
      sessionId = id;
      setActiveSessionId(id);
    }

    const userMsg: Message = { id: genId(), role: 'user', text };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const isNewTitle = s.title === 'Cuộc trò chuyện mới' || s.messages.length === 0;
        return {
          ...s,
          messages: [...s.messages, userMsg].slice(-MAX_MESSAGES_PER_SESSION),
          title: isNewTitle ? text.slice(0, 40) : s.title,
        };
      })
    );

    setInput('');
    setLoading(true);

    const currentSession = sessionsRef.current.find((s) => s.id === sessionId);
    const currentConvId = currentSession?.convId ?? null;
    try {
      const { content, conversation_id } = await callCoze({
        message: text,
        conversationId: currentConvId,
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

      const aiMsg: Message = { id: genId(), role: 'ai', text: content };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, convId: conversation_id, messages: [...s.messages, aiMsg].slice(-MAX_MESSAGES_PER_SESSION) }
            : s
        )
      );

      await maybeSavePrompt(text, content);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.';
      const aiMsg: Message = { id: genId(), role: 'ai', text: errMsg };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg].slice(-MAX_MESSAGES_PER_SESSION) } : s
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div
      className="relative flex h-[calc(100svh-92px)] h-[calc(100dvh-92px)] min-h-0 overflow-hidden p-2 text-text sm:p-3"
      style={{
        backgroundColor: 'var(--color-bg)',
        backgroundImage:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-card) 58%, transparent), transparent 34%)',
      }}
    >
      <div
        className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 42%, var(--color-bg))',
          borderColor: 'color-mix(in srgb, var(--color-border) 72%, transparent)',
          boxShadow: '0 22px 70px -54px rgba(0,0,0,0.5)',
        }}
      >
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng lịch sử"
          className="absolute inset-0 z-30 bg-text/25 backdrop-blur-[2px] sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className="shrink-0 border-b px-2.5 py-2 sm:px-4"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-bg) 82%, transparent)',
            borderColor: 'color-mix(in srgb, var(--color-border) 62%, transparent)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div
            className="flex min-w-0 items-center gap-2 rounded-[24px] border px-2 py-2 sm:gap-3 sm:px-3"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 88%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-border) 72%, transparent)',
              boxShadow: '0 14px 34px -32px rgba(0,0,0,0.5)',
            }}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-10 sm:w-10"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 72%, transparent)' }}
              aria-expanded={sidebarOpen}
              aria-label={sidebarToggleLabel}
              title={sidebarToggleLabel}
            >
              <PanelLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/ai-tools')}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-bg-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-10"
              aria-label="Quay lại trang Công Cụ AI"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Công Cụ AI</span>
            </button>

            <div className="hidden h-6 w-px shrink-0 bg-border/70 sm:block" />

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `color-mix(in srgb, ${primaryColor} 13%, var(--color-bg-card))`,
                border: `1px solid color-mix(in srgb, ${primaryColor} 28%, var(--color-border))`,
              }}
            >
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold leading-tight text-text sm:text-base">{title}</p>
              <p className="hidden truncate text-xs leading-5 text-text-muted md:block">{subtitle}</p>
            </div>

            <div
              className="ml-auto inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-2.5 sm:px-3"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 70%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-border) 74%, transparent)',
              }}
            >
              <span className="h-2 w-2 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--color-success)' }} />
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-text-light sm:inline">Sẵn sàng</span>
            </div>
          </div>
        </header>

        <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <aside
            aria-hidden={!sidebarOpen}
            className={`absolute bottom-3 left-3 top-3 z-40 flex min-h-0 w-[min(292px,calc(100vw-24px))] shrink-0 flex-col overflow-hidden rounded-[24px] border transition-[transform,width,opacity] duration-200 sm:static sm:z-auto sm:h-auto sm:rounded-none sm:border-y-0 sm:border-l-0 ${
              sidebarOpen
                ? 'translate-x-0 sm:w-[248px] sm:opacity-100 lg:w-[268px]'
                : 'pointer-events-none -translate-x-[calc(100%+24px)] sm:w-0 sm:translate-x-0 sm:opacity-0'
            }`}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 92%, var(--color-bg))',
              borderColor: 'color-mix(in srgb, var(--color-border) 68%, transparent)',
              boxShadow: sidebarOpen ? '14px 0 34px -30px rgba(0,0,0,0.4)' : 'none',
            }}
          >
            <div className="shrink-0 p-3.5" style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-border) 62%, transparent)' }}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-text">Phiên học</p>
                  <p className="mt-0.5 text-[11px] text-text-light">{sessions.length} phiên trò chuyện</p>
                </div>
                <button
                  type="button"
                  onClick={createNewSession}
                  className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  style={{ backgroundColor: primaryColor, boxShadow: `0 12px 26px -20px ${primaryColor}` }}
                  title="Cuộc trò chuyện mới"
                >
                  <Plus size={13} />
                  Mới
                </button>
              </div>
              <p className="mt-3 rounded-2xl px-3 py-2.5 text-xs leading-5 text-text-muted" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 74%, transparent)' }}>
                Mỗi phiên là một góc học riêng cho câu hỏi, prompt và phản hồi AI.
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5">
              {sessions.length === 0 && (
                <div
                  className="rounded-2xl border px-3 py-4 text-left text-xs leading-5 text-text-muted"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 76%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--color-border) 62%, transparent)',
                  }}
                >
                  Chưa có phiên nào. Bắt đầu bằng một câu hỏi nhỏ để mở trang học đầu tiên.
                </div>
              )}
              {sessions.map((s) => {
                const active = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    className="group flex cursor-pointer items-center gap-2 rounded-[18px] border p-2.5 text-sm transition-all hover:-translate-y-0.5"
                    style={{
                      backgroundColor: active
                        ? `color-mix(in srgb, ${primaryColor} 12%, var(--color-bg-card))`
                        : 'color-mix(in srgb, var(--color-bg-card) 54%, transparent)',
                      borderColor: active
                        ? `color-mix(in srgb, ${primaryColor} 30%, var(--color-border))`
                        : 'color-mix(in srgb, var(--color-border) 48%, transparent)',
                      color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
                      boxShadow: active ? '0 14px 30px -28px rgba(0,0,0,0.45)' : 'none',
                    }}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      if (window.innerWidth < 640) setSidebarOpen(false);
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: active
                          ? `color-mix(in srgb, ${primaryColor} 16%, var(--color-bg-card))`
                          : 'color-mix(in srgb, var(--color-bg-muted) 82%, transparent)',
                      }}
                    >
                      <MessageSquare size={14} className="opacity-75" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-bold">{s.title}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(s.id);
                      }}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-light opacity-100 transition-colors hover:bg-bg-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                      aria-label="Xóa phiên"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

        {sidebar && (
          <div
            className="max-h-[42dvh] min-h-0 shrink-0 overflow-y-auto overflow-x-hidden border-b px-3 py-3 sm:max-h-[34dvh] sm:px-4 lg:hidden"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
          >
            {sidebar}
          </div>
        )}

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {sidebar && (
            <aside
              className="hidden w-72 shrink-0 overflow-y-auto border-r lg:block"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              {sidebar}
            </aside>
          )}

          <section className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div
              className="min-h-0 flex-1 overflow-y-auto"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-card) 82%, transparent), transparent 15%, transparent 86%, color-mix(in srgb, var(--color-bg-card) 72%, transparent)), radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-bg-card) 76%, transparent), transparent 42%), repeating-linear-gradient(180deg, transparent 0, transparent 31px, color-mix(in srgb, var(--color-border) 36%, transparent) 32px)',
                backgroundSize: '100% 100%, 100% 100%, 100% 32px',
                backgroundPosition: 'center top, center top, 0 0',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              {messages.length === 0 ? (
                <EmptyChatState
                  title={title}
                  subtitle={subtitle}
                  icon={icon}
                  starterPrompts={starterPrompts}
                  primaryColor={primaryColor}
                  onPick={setInput}
                />
              ) : (
                <div className="mx-auto w-full max-w-[800px] space-y-7 px-3 py-5 sm:px-5 sm:py-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex min-w-0 gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ai' && (
                        <div
                          className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${primaryColor} 13%, var(--color-bg-card))`,
                            border: `1px solid color-mix(in srgb, ${primaryColor} 32%, var(--color-border))`,
                          }}
                        >
                          <div style={{ transform: 'scale(0.68)' }}>{icon}</div>
                        </div>
                      )}

                      <div
                        className={`group min-w-0 max-w-[calc(100%-2.25rem)] px-4 py-3 text-sm leading-7 [overflow-wrap:anywhere] sm:px-5 sm:py-3.5 sm:max-w-[80%] lg:max-w-[74%] ${
                          msg.role === 'user' ? 'text-white' : 'text-text'
                        }`}
                        style={
                          msg.role === 'user'
                            ? {
                                background: `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 82%, var(--color-text)))`,
                                borderRadius: '22px 22px 8px 22px',
                                boxShadow: '0 16px 30px -25px rgba(0,0,0,0.46)',
                              }
                            : {
                                backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 88%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--color-border) 54%, transparent)',
                                borderRadius: '24px 24px 24px 10px',
                                boxShadow: '0 18px 38px -34px rgba(0,0,0,0.44)',
                              }
                        }
                      >
                        {msg.role === 'user' ? <p className="whitespace-pre-wrap">{msg.text}</p> : formatAiText(msg.text)}
                        {msg.role === 'ai' && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="mt-3 ml-auto flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold opacity-85 transition-colors hover:bg-bg-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:opacity-65 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                            style={{
                              backgroundColor: 'var(--color-bg-card)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                            aria-label="Sao chép phản hồi AI"
                          >
                            {copiedId === msg.id ? <><Check size={10} /> Đã sao chép</> : <><Copy size={10} /> Sao chép</>}
                          </button>
                        )}
                      </div>

                      {msg.role === 'user' && (
                        <div
                          className="mt-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white sm:flex sm:h-8 sm:w-8"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {userInitials}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && <TypingIndicator icon={icon} primaryColor={primaryColor} />}
                  <div ref={endRef} className="h-4" />
                </div>
              )}
            </div>

            <div
              className="shrink-0 border-t px-3 pb-[calc(0.9rem+env(safe-area-inset-bottom))] pt-3 sm:px-4"
              style={{
                borderColor: 'color-mix(in srgb, var(--color-border) 68%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 74%, transparent)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="mx-auto w-full max-w-[800px]">
                <div
                  className="flex min-w-0 items-end gap-2 p-2.5 sm:gap-3 sm:p-3"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 96%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 66%, transparent)',
                    borderRadius: '30px',
                    boxShadow: '0 20px 52px -38px rgba(0,0,0,0.52)',
                  }}
                  onFocusCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = primaryColor;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px color-mix(in srgb, ${primaryColor} 14%, transparent), 0 22px 56px -40px rgba(0,0,0,0.52)`;
                  }}
                  onBlurCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhắn tin... Enter để gửi, Shift+Enter xuống dòng"
                    rows={1}
                    className="min-w-0 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm outline-none sm:px-3"
                    style={{
                      color: 'var(--color-text)',
                      minHeight: '48px',
                      maxHeight: '160px',
                      lineHeight: '1.55',
                    }}
                    aria-label="Nội dung tin nhắn gửi chatbot"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ backgroundColor: input.trim() && !loading ? primaryColor : 'var(--color-border-strong)' }}
                    aria-label="Gửi tin nhắn"
                    title="Gửi"
                  >
                    <Send size={17} />
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] leading-5 text-text-light">
                  AI có thể mắc lỗi. Hãy kiểm chứng thông tin quan trọng và giữ vai trò người học chủ động.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

function EmptyChatState({
  title,
  subtitle,
  icon,
  starterPrompts,
  primaryColor,
  onPick,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  starterPrompts: string[];
  primaryColor: string;
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="flex min-h-full items-center justify-center px-3 py-6 sm:px-5 sm:py-10">
      <div className="w-full max-w-4xl">
        <div
          className="relative overflow-hidden rounded-[28px] border p-5 sm:p-7"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 94%, transparent)',
            borderColor: 'color-mix(in srgb, var(--color-border) 72%, transparent)',
            boxShadow: '0 24px 70px -52px rgba(0,0,0,0.5)',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute right-6 top-6 h-20 w-20 rounded-full blur-2xl"
            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 18%, transparent)` }}
          />
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 13%, var(--color-bg-card))` }}
          >
            {icon}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">{title}</p>
          <h2 className="mt-3 font-display text-2xl font-bold leading-[1.12] text-text sm:text-3xl">
            Hôm nay bạn muốn học gì với AI?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-text-muted">{subtitle}</p>

          <div
            className="mt-5 rounded-2xl px-4 py-3 text-xs leading-6 text-text-muted"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 78%, transparent)',
            }}
          >
            Chọn một gợi ý hoặc viết câu hỏi của riêng bạn. Mục tiêu là hiểu cách học, không chỉ lấy đáp án.
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {starterPrompts.map((prompt, index) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onPick(prompt)}
                className="group relative min-h-[88px] min-w-0 rounded-2xl border p-4 text-left text-sm leading-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-26px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                style={{
                  backgroundColor: index % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-muted)',
                  borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                }}
              >
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">
                  Gợi ý {index + 1}
                </span>
                <span className="text-text-muted group-hover:text-text">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
        className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
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
