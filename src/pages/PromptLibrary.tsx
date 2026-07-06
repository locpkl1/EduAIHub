import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SavedPrompt } from '../types/database';
import { referencePrompts, type ReferencePrompt } from '../data/educationData';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Eye,
  Lightbulb,
  Loader2,
  LogIn,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { fetchPublishedPromptTemplates, type PublishedPromptTemplate } from '../lib/publicContentApi';

type Tab = 'mine' | 'reference';
type ReferenceSource = 'template' | 'fallback';

interface LibraryReferencePrompt {
  id: string;
  source: ReferenceSource;
  title: string;
  prompt_content: string;
  purpose: string | null;
  subject: string | null;
  grade: number | null;
  book_series: string | null;
  difficulty: string | null;
  usage_note: string | null;
  why_effective: string | null;
  tags: string[];
  featured: boolean;
  updated_at?: string;
}

const difficultyLabels: Record<string, string> = {
  basic: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
};

const promptStructure = [
  {
    title: 'Vai trò',
    description: 'AI cần biết mình đang đóng vai gì',
  },
  {
    title: 'Bối cảnh',
    description: 'lớp, môn, bài học, trình độ',
  },
  {
    title: 'Nhiệm vụ',
    description: 'AI cần làm gì cho bạn',
  },
  {
    title: 'Định dạng',
    description: 'câu trả lời nên trình bày ra sao',
  },
];

const customizeChecklist = [
  'Thay [Môn học] bằng môn thật',
  'Thay [Chủ đề] bằng bài/chương đang học',
  'Nói rõ lớp và trình độ hiện tại',
  'Yêu cầu AI giải thích từng bước',
  'Thêm yêu cầu tự kiểm tra hoặc bài luyện tập',
];

const defaultWhyEffective =
  'Prompt này hiệu quả vì nó giúp AI hiểu rõ vai trò, bối cảnh, nhiệm vụ và cách trả lời mong muốn. Khi dùng, bạn nên thay các phần trong ngoặc bằng bài học thật của mình.';

function buildUsageFallback(prompt: LibraryReferencePrompt) {
  const purpose = prompt.purpose ? prompt.purpose.toLowerCase() : 'học tập';
  const subject = prompt.subject ? ` môn ${prompt.subject}` : '';
  return `Dùng khi bạn cần hỗ trợ ${purpose}${subject} và muốn AI trả lời có cấu trúc, dễ kiểm tra lại thay vì nhận một đáp án quá chung chung.`;
}

function normalizeTemplate(template: PublishedPromptTemplate): LibraryReferencePrompt {
  return {
    id: template.id,
    source: 'template',
    title: template.title,
    prompt_content: template.prompt_content,
    purpose: template.purpose,
    subject: template.subject,
    grade: template.grade,
    book_series: template.book_series,
    difficulty: template.difficulty,
    usage_note: template.usage_note,
    why_effective: template.why_effective,
    tags: template.tags,
    featured: template.featured,
    updated_at: template.updated_at,
  };
}

function normalizeFallbackPrompt(prompt: ReferencePrompt): LibraryReferencePrompt {
  return {
    id: prompt.id,
    source: 'fallback',
    title: prompt.title,
    prompt_content: prompt.content,
    purpose: prompt.purpose ?? prompt.description,
    subject: prompt.subject ?? prompt.category,
    grade: null,
    book_series: null,
    difficulty: prompt.difficulty ?? 'basic',
    usage_note: prompt.usage_note ?? prompt.description,
    why_effective: prompt.why_effective ?? defaultWhyEffective,
    tags: prompt.tags ?? [prompt.category],
    featured: false,
  };
}

function formatMeta(prompt: LibraryReferencePrompt) {
  return [
    prompt.purpose,
    prompt.subject,
    prompt.grade ? `Lớp ${prompt.grade}` : null,
    prompt.book_series,
    prompt.difficulty ? difficultyLabels[prompt.difficulty] : null,
  ].filter(Boolean);
}

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard may be unavailable in some embedded/browser contexts. */
    }
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex min-h-9 items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${className}`}
      style={{
        backgroundColor: copied ? 'var(--color-success)' : 'var(--color-primary)',
        color: '#ffffff',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      {copied ? (
        <>
          <Check size={12} /> Đã sao chép
        </>
      ) : (
        <>
          <Copy size={12} /> Sao chép prompt
        </>
      )}
    </button>
  );
}

function PromptCard({
  title,
  subtitle,
  content,
  badge,
  onDelete,
  deleting,
}: {
  title: string;
  subtitle?: string;
  content: string;
  badge?: string;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  const preview = content.length > 160 ? `${content.slice(0, 160).trim()}...` : content;
  return (
    <div
      className="card-hover flex h-full flex-col p-5"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="truncate font-display text-sm font-bold"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {badge && <span className="tag tag-primary">{badge}</span>}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="rounded p-1.5 transition-colors"
              style={{ color: 'var(--color-text-light)' }}
              title="Xóa prompt"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          )}
        </div>
      </div>

      <p className="line-clamp-3 flex-1 whitespace-pre-line text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {preview}
      </p>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <CopyButton text={content} />
      </div>
    </div>
  );
}

function PromptTemplateCard({
  prompt,
  selected,
  onSelect,
}: {
  prompt: LibraryReferencePrompt;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = formatMeta(prompt);
  const preview =
    prompt.prompt_content.length > 190
      ? `${prompt.prompt_content.slice(0, 190).trim()}...`
      : prompt.prompt_content;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      className="card-hover group flex h-full cursor-pointer flex-col p-5 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        backgroundColor: selected ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
        borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
        boxShadow: selected ? '0 18px 44px color-mix(in srgb, var(--color-primary) 16%, transparent)' : undefined,
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="font-display text-sm font-bold"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
          >
            {prompt.title}
          </h3>
          {meta.length > 0 && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {meta.join(' · ')}
            </p>
          )}
        </div>
        {prompt.featured && <span className="tag tag-primary flex-shrink-0">Nổi bật</span>}
      </div>

      <p className="line-clamp-4 flex-1 whitespace-pre-line text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {preview}
      </p>

      {prompt.usage_note && (
        <p
          className="mt-4 rounded-lg px-3 py-2 text-xs leading-relaxed"
          style={{
            backgroundColor: 'var(--color-bg-muted)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
          }}
        >
          {prompt.usage_note}
        </p>
      )}

      {prompt.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
          <Eye size={13} /> Xem chi tiết
        </span>
        <CopyButton text={prompt.prompt_content} />
      </div>
    </article>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-display text-lg font-extrabold" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function PromptDetailPanel({ prompt, onClose }: { prompt: LibraryReferencePrompt; onClose: () => void }) {
  const meta = formatMeta(prompt);
  const usageNote = prompt.usage_note || buildUsageFallback(prompt);
  const whyEffective = prompt.why_effective || defaultWhyEffective;

  return (
    <aside
      className="sticky top-4 space-y-5 border p-4 sm:p-5 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-strong)' }}
      aria-label="Chi tiết prompt tham khảo"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="section-label mb-3 inline-flex">Học từ prompt</span>
          <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}>
            {prompt.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          aria-label="Đóng chi tiết"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompt.featured && <span className="tag tag-primary">Nổi bật</span>}
        {meta.map((item) => (
          <span key={item} className="tag">
            {item}
          </span>
        ))}
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}
          >
            #{tag}
          </span>
        ))}
      </div>

      <DetailSection title="Nội dung prompt">
        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--color-bg-muted)',
            borderColor: 'var(--color-border)',
          }}
        >
          <pre className="whitespace-pre-wrap break-words font-mono-code text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {prompt.prompt_content}
          </pre>
        </div>
        <CopyButton text={prompt.prompt_content} className="mt-1" />
      </DetailSection>

      <DetailSection title="Khi nào nên dùng prompt này?">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {usageNote}
        </p>
      </DetailSection>

      <DetailSection title="Vì sao prompt này hiệu quả?">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {whyEffective}
        </p>
      </DetailSection>

      <DetailSection title="Cấu trúc prompt này gồm gì?">
        <div className="grid gap-2 sm:grid-cols-2">
          {promptStructure.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-3"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
            >
              <p className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Cách tùy chỉnh trước khi dùng">
        <ul className="space-y-2">
          {customizeChecklist.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-secondary)' }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DetailSection>

      <div
        className="flex gap-3 rounded-xl border p-4"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-accent) 35%, transparent)',
          backgroundColor: 'var(--color-accent-light)',
          color: 'var(--color-text)',
        }}
      >
        <Lightbulb size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
        <p className="text-sm font-semibold leading-relaxed">
          Đừng nộp nguyên văn câu trả lời của AI. Hãy dùng prompt để hiểu bài, tự làm lại và kiểm chứng trước khi sử dụng.
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row" style={{ borderColor: 'var(--color-border)' }}>
        <CopyButton text={prompt.prompt_content} className="sm:flex-1" />
        <button type="button" onClick={onClose} className="btn-outline justify-center gap-2 rounded-full">
          <ArrowLeft size={15} />
          Quay lại danh sách
        </button>
      </div>
    </aside>
  );
}

export default function PromptLibrary() {
  const { profile, isGuest, loading: authLoading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('mine');
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<PublishedPromptTemplate[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSavedPrompts = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSavedPrompts(data || []);
    } catch (error) {
      console.error('Error fetching saved prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicTemplates() {
      setTemplatesLoading(true);
      setTemplatesError(false);
      try {
        const templates = await fetchPublishedPromptTemplates();
        if (!cancelled) setPublicTemplates(templates);
      } catch (error) {
        console.error('Error fetching public prompt templates:', error);
        if (!cancelled) {
          setPublicTemplates([]);
          setTemplatesError(true);
        }
      } finally {
        if (!cancelled) setTemplatesLoading(false);
      }
    }

    loadPublicTemplates();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authLoading || isGuest || !profile || !isSupabaseConfigured) return;
    fetchSavedPrompts();
  }, [profile, isGuest, authLoading, fetchSavedPrompts]);

  const referenceItems = useMemo(() => (
    publicTemplates.length > 0
      ? publicTemplates.map(normalizeTemplate)
      : referencePrompts.map(normalizeFallbackPrompt)
  ), [publicTemplates]);
  const selectedPrompt = referenceItems.find((prompt) => prompt.id === selectedPromptId) ?? null;

  useEffect(() => {
    if (activeTab !== 'reference') return;
    if (selectedPromptId && !referenceItems.some((prompt) => prompt.id === selectedPromptId)) {
      setSelectedPromptId(null);
    }
  }, [activeTab, referenceItems, selectedPromptId]);

  async function handleDeletePrompt(id: string) {
    if (!profile || !confirm('Xóa prompt này?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('saved_prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', profile.id);
      if (error) throw error;
      setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    } finally {
      setDeletingId(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'mine', label: 'Kho prompt của tôi' },
    { id: 'reference', label: 'Kho prompt tham khảo' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div
        className="border-b py-12"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-4 inline-flex">Tài nguyên</span>
          <h1
            className="mt-1 font-display text-4xl font-bold sm:text-5xl"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}
          >
            Kho <span style={{ color: 'var(--color-primary)' }}>Prompt</span>
          </h1>
          <p className="mt-3 max-w-xl text-base" style={{ color: 'var(--color-text-muted)' }}>
            Quản lý prompt cá nhân và khám phá mẫu prompt chất lượng cho việc học.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex gap-0 overflow-x-auto" style={{ borderBottom: '2px solid var(--color-border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className="relative whitespace-nowrap px-5 py-3 text-sm font-semibold transition-all duration-150"
              style={{
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'mine' && (
          <div>
            {authLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : isGuest ? (
              <div
                className="border p-8 text-center sm:p-12"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                >
                  <Sparkles size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h2 className="mb-2 font-display text-xl font-bold" style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
                  Lưu prompt cá nhân
                </h2>
                <p className="mx-auto mb-6 max-w-md text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Đăng nhập Google để lưu các prompt cá nhân. Prompt tạo từ chatbot sẽ xuất hiện tại đây.
                </p>
                <button onClick={signInWithGoogle} type="button" className="btn-primary inline-flex items-center gap-2">
                  <LogIn size={15} />
                  Đăng nhập bằng Google
                </button>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : savedPrompts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    title={prompt.purpose || 'Prompt học tập'}
                    subtitle={[prompt.subject, prompt.chapter].filter(Boolean).join(' · ')}
                    content={prompt.prompt_content}
                    badge={prompt.book_series || undefined}
                    onDelete={() => handleDeletePrompt(prompt.id)}
                    deleting={deletingId === prompt.id}
                  />
                ))}
              </div>
            ) : (
              <div
                className="border p-8 text-center sm:p-12"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-bg-muted)',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  }}
                >
                  <BookOpen size={24} style={{ color: 'var(--color-text-light)' }} />
                </div>
                <h2 className="mb-2 font-display text-lg font-bold" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                  Chưa có prompt nào
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Hãy thử chatbot Tạo Prompt Học Tập. Prompt đã lưu sẽ hiển thị tại đây.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reference' && (
          <div className="space-y-6">
            <div
              className="border p-5"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  }}
                >
                  <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                    Kho prompt mẫu từ EduAI-Hub
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Mỗi prompt là một mẫu để học cách hỏi AI rõ hơn: xem cấu trúc, hiểu lý do hiệu quả, rồi chỉnh lại cho bài học của bạn.
                  </p>
                  {!templatesLoading && (templatesError || publicTemplates.length === 0) && (
                    <p className="mt-3 text-xs" style={{ color: 'var(--color-text-light)' }}>
                      Đang hiển thị bộ prompt tham khảo sẵn có trong khi chờ nội dung xuất bản từ EduAI-Hub.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {templatesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : (
              <div className={selectedPrompt ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.86fr)] lg:items-start' : 'space-y-6'}>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {referenceItems.map((prompt) => (
                    <PromptTemplateCard
                      key={`${prompt.source}-${prompt.id}`}
                      prompt={prompt}
                      selected={selectedPrompt?.id === prompt.id}
                      onSelect={() => setSelectedPromptId(prompt.id)}
                    />
                  ))}
                </div>
                {selectedPrompt && <PromptDetailPanel prompt={selectedPrompt} onClose={() => setSelectedPromptId(null)} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
