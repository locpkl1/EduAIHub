import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  DEFAULT_BOOK_SERIES,
  isTargetBookSeries,
  referencePrompts,
  type ReferencePrompt,
} from '../data/educationData';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Eye,
  Lightbulb,
  Loader2,
  LogIn,
  Sparkles,
  X,
} from 'lucide-react';
import { fetchPublishedPromptTemplates, type PublishedPromptTemplate } from '../lib/publicContentApi';
import CopyButton from '../components/ui/CopyButton';
import SavedPromptCollection from '../components/saved-prompts/SavedPromptWorkspace';
import { useSavedPrompts } from '../hooks/useSavedPrompts';

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
    title: 'Mục tiêu',
    description: 'điều bạn muốn hiểu hoặc làm được',
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
    title: 'Ràng buộc',
    description: 'điều AI cần giới hạn hoặc tránh làm thay',
  },
  {
    title: 'Định dạng',
    description: 'câu trả lời nên trình bày ra sao',
  },
];

const customizeChecklist = [
  'Thay [Môn học] bằng môn thật',
  'Thay [Chủ đề] bằng nội dung đang học',
  'Nói rõ lớp và trình độ hiện tại',
  'Yêu cầu AI giải thích từng bước',
  'Thêm yêu cầu tự kiểm tra hoặc bài luyện tập',
];

const defaultWhyEffective =
  'Prompt này hiệu quả vì nó giúp AI hiểu mục tiêu, bối cảnh, nhiệm vụ, ràng buộc và định dạng bạn cần. Vai trò là gợi ý bổ sung khi phù hợp, không phải thành phần bắt buộc. Khi dùng, bạn nên thay các phần trong ngoặc bằng nội dung học thật của mình.';

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
    book_series: template.book_series ? DEFAULT_BOOK_SERIES : null,
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

function PromptTemplateCard({
  prompt,
  selected,
  onSelect,
}: {
  prompt: LibraryReferencePrompt;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = [prompt.subject, prompt.grade ? `Lớp ${prompt.grade}` : null, prompt.difficulty ? difficultyLabels[prompt.difficulty] : null].filter(Boolean);
  const preview =
    prompt.prompt_content.length > 190
      ? `${prompt.prompt_content.slice(0, 190).trim()}...`
      : prompt.prompt_content;

  return (
    <article
      className="card-hover group flex h-full flex-col p-5"
      style={{
        backgroundColor: selected ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
        borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="font-display text-xl font-bold"
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


      {prompt.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-control px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-text)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          type="button"
          data-prompt-select={prompt.id}
          onClick={onSelect}
          aria-expanded={selected}
          aria-controls={selected ? 'reference-prompt-detail' : undefined}
          aria-label={`Xem chi tiết: ${prompt.title}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--color-primary-text)' }}
        >
          <Eye size={13} /> Xem chi tiết
        </button>
        <span className="text-xs text-text-muted">Đọc rồi tùy chỉnh</span>
      </div>
    </article>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-display text-lg font-bold" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function PromptDetailPanel({ prompt, onClose, headingRef }: { prompt: LibraryReferencePrompt; onClose: () => void; headingRef: RefObject<HTMLHeadingElement> }) {
  const meta = formatMeta(prompt);
  const usageNote = prompt.usage_note || buildUsageFallback(prompt);
  const whyEffective = prompt.why_effective || defaultWhyEffective;

  return (
    <aside
      id="reference-prompt-detail"
      className="space-y-5 rounded-card border p-4 sm:p-5 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-strong)' }}
      aria-label="Chi tiết prompt tham khảo"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="scroll-mt-28 font-display text-2xl font-bold leading-tight sm:text-3xl" style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}>
            {prompt.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-control border"
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
            className="rounded-control px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}
          >
            #{tag}
          </span>
        ))}
      </div>

      <DetailSection title="Nội dung prompt">
        <div
          className="rounded-card border p-4"
          style={{
            backgroundColor: 'var(--color-bg-muted)',
            borderColor: 'var(--color-border)',
          }}
        >
          <pre className="whitespace-pre-wrap break-words font-sans text-base leading-8" style={{ color: 'var(--color-text)' }}>
            {prompt.prompt_content}
          </pre>
        </div>

        <CopyButton text={prompt.prompt_content} className="mt-4" />
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

      <DetailSection title="Các thành phần để bạn kiểm tra">
        <p className="text-sm leading-7 text-text-muted">Không phải mẫu nào cũng cần đủ năm phần. Vai trò của AI có thể bổ sung khi giúp làm rõ nhiệm vụ.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {promptStructure.map((item) => (
            <div
              key={item.title}
              className="rounded-card border p-3"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
            >
              <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
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
        className="flex gap-3 rounded-card border p-4"
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

        <button type="button" onClick={onClose} className="btn-outline justify-center gap-2 rounded-control">
          <ArrowLeft size={15} />
          Quay lại danh sách
        </button>
      </div>
    </aside>
  );
}

export default function PromptLibrary() {
  const { user, isGuest, loading: authLoading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('reference');
  const [publicTemplates, setPublicTemplates] = useState<PublishedPromptTemplate[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);
  const lastSelectedId = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (activeTab !== 'reference') return;
    if (selectedPromptId) {
      lastSelectedId.current = selectedPromptId;
      detailHeadingRef.current?.focus({ preventScroll: true });
      detailHeadingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else if (lastSelectedId.current) {
      const trigger = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-prompt-select]'))
        .find((button) => button.dataset.promptSelect === lastSelectedId.current);
      trigger?.focus({ preventScroll: true });
      trigger?.scrollIntoView({ block: 'center', behavior: 'instant' });
      lastSelectedId.current = null;
    }
  }, [selectedPromptId, activeTab]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState(false);
  const {
    prompts: savedPrompts,
    loading,
    fetchError: savedPromptsError,
    retry: fetchSavedPrompts,
    updatePrompt,
    deletePrompt,
  } = useSavedPrompts({
    userId: user?.id,
    enabled: !authLoading && !isGuest,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadPublicTemplates() {
      setTemplatesLoading(true);
      setTemplatesError(false);
      try {
        const templates = await fetchPublishedPromptTemplates();
        if (!cancelled) {
          setPublicTemplates(templates.filter((template) => (
            !template.book_series || isTargetBookSeries(template.book_series)
          )));
        }
      } catch {
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'reference', label: 'Prompt tham khảo' },
    { id: 'mine', label: 'Prompt của tôi' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div
        className="page-header"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1
            className="page-title"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}
          >
            Kho <span style={{ color: 'var(--color-primary-text)' }}>Prompt</span>
          </h1>
          <p className="mt-3 max-w-xl text-base" style={{ color: 'var(--color-text-muted)' }}>
            Đọc mẫu để hiểu cách hỏi, chỉnh cho bài học của bạn và quản lý những prompt đã lưu.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-0" style={{ borderBottom: '2px solid var(--color-border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              type="button"
              className="relative min-h-11 px-3 py-3 text-sm font-semibold transition-colors duration-150"
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
              <div role="status" aria-label="Đang tải prompt" className="flex justify-center py-8">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: 'var(--color-primary-text)' }} />
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
                  }}
                >
                  <Sparkles size={28} style={{ color: 'var(--color-primary-text)' }} />
                </div>
                <h2 className="mb-2 font-display text-xl font-bold" style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
                  Lưu prompt cá nhân
                </h2>
                <p className="mx-auto mb-6 max-w-md text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Đăng nhập Google để lưu prompt cá nhân. Những prompt bạn chọn Lưu trong chatbot sẽ xuất hiện tại đây.
                </p>
                <button onClick={signInWithGoogle} type="button" className="btn-primary inline-flex items-center gap-2">
                  <LogIn size={15} />
                  Đăng nhập bằng Google
                </button>
              </div>
            ) : loading ? (
              <div role="status" aria-label="Đang tải prompt" className="flex justify-center py-8">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: 'var(--color-primary-text)' }} />
              </div>
            ) : savedPromptsError ? (
              <div
                className="border p-8 text-center sm:p-12"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <h2 className="font-display text-lg font-bold text-text">Chưa tải được Kho Prompt</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                  Dữ liệu đã lưu của bạn không bị thay đổi. Vui lòng kiểm tra kết nối rồi thử lại.
                </p>
                <button type="button" onClick={fetchSavedPrompts} className="btn-outline mt-5">
                  Thử tải lại
                </button>
              </div>
            ) : savedPrompts.length > 0 ? (
              <SavedPromptCollection
                prompts={savedPrompts}
                onUpdate={updatePrompt}
                onDelete={deletePrompt}
              />
            ) : (
              <div
                className="border p-8 text-center sm:p-12"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-bg-muted)',
                  }}
                >
                  <BookOpen size={24} style={{ color: 'var(--color-text-light)' }} />
                </div>
                <h2 className="mb-2 font-display text-lg font-bold" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                  Chưa có prompt nào
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Hãy thử chatbot Gợi Ý Prompt Học Tập. Prompt đã lưu sẽ hiển thị tại đây.
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
                  }}
                >
                  <BookOpen size={18} style={{ color: 'var(--color-primary-text)' }} />
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
                      Đang dùng bộ mẫu tham khảo sẵn có. Nội dung xuất bản hiện chưa có hoặc chưa tải được.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {templatesLoading ? (
              <div role="status" aria-label="Đang tải prompt tham khảo" className="flex justify-center py-8">
                <Loader2 className="h-7 w-7 animate-spin" style={{ color: 'var(--color-primary-text)' }} />
              </div>
            ) : (
              <div className={selectedPrompt ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.86fr)] lg:items-start' : 'space-y-6'}>
                <div className={selectedPrompt ? 'hidden gap-4 lg:grid' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'}>
                  {referenceItems.map((prompt) => (
                    <PromptTemplateCard
                      key={`${prompt.source}-${prompt.id}`}
                      prompt={prompt}
                      selected={selectedPrompt?.id === prompt.id}
                      onSelect={() => setSelectedPromptId(prompt.id)}
                    />
                  ))}
                </div>
                {selectedPrompt && <PromptDetailPanel prompt={selectedPrompt} headingRef={detailHeadingRef} onClose={() => setSelectedPromptId(null)} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
