import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Archive,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Loader2,
  MessageSquareText,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type {
  ContentStatus,
  Grade,
  PromptDifficulty,
  PromptTemplate,
  PromptTemplateInsert,
  PromptTemplateUpdate,
} from '../../types/database';
import StatusBadge from '../../components/admin/StatusBadge';

type StatusFilter = 'all' | ContentStatus;
type GradeFilter = 'all' | '10' | '11' | '12';
type DifficultyFilter = 'all' | PromptDifficulty;
type FeaturedFilter = 'all' | 'featured';

interface PromptFormState {
  title: string;
  prompt_content: string;
  purpose: string;
  subject: string;
  grade: '' | '10' | '11' | '12';
  book_series: string;
  difficulty: '' | PromptDifficulty;
  usage_note: string;
  why_effective: string;
  tags: string;
  status: ContentStatus;
  featured: boolean;
}

const emptyForm: PromptFormState = {
  title: '',
  prompt_content: '',
  purpose: '',
  subject: '',
  grade: '',
  book_series: '',
  difficulty: '',
  usage_note: '',
  why_effective: '',
  tags: '',
  status: 'draft',
  featured: false,
};

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'archived', label: 'Đã lưu trữ' },
];

const difficultyLabels: Record<PromptDifficulty, string> = {
  basic: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
};

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseGrade(value: PromptFormState['grade']): Grade | null {
  if (!value) return null;
  return Number.parseInt(value, 10) as Grade;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function buildFormFromTemplate(template: PromptTemplate): PromptFormState {
  return {
    title: template.title,
    prompt_content: template.prompt_content,
    purpose: template.purpose ?? '',
    subject: template.subject ?? '',
    grade: template.grade ? String(template.grade) as PromptFormState['grade'] : '',
    book_series: template.book_series ?? '',
    difficulty: template.difficulty ?? '',
    usage_note: template.usage_note ?? '',
    why_effective: template.why_effective ?? '',
    tags: template.tags.join(', '),
    status: template.status,
    featured: template.featured,
  };
}

function DifficultyBadge({ difficulty }: { difficulty: PromptDifficulty | null }) {
  if (!difficulty) return <span className="text-xs font-semibold text-text-light">Chưa đặt</span>;

  const accent =
    difficulty === 'basic'
      ? { bg: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }
      : difficulty === 'intermediate'
        ? { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' }
        : { bg: 'var(--color-accent-light)', color: 'var(--color-accent)' };

  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ backgroundColor: accent.bg, color: accent.color }}
    >
      {difficultyLabels[difficulty]}
    </span>
  );
}

function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) return <span className="text-xs font-semibold text-text-light">Không</span>;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold"
      style={{
        backgroundColor: 'var(--color-accent-light)',
        borderColor: 'color-mix(in srgb, var(--color-accent) 28%, transparent)',
        color: 'var(--color-accent)',
      }}
    >
      <Star size={12} />
      Nổi bật
    </span>
  );
}

export default function AdminPrompts() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [form, setForm] = useState<PromptFormState>(emptyForm);

  const fetchTemplates = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase chưa được cấu hình.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;
      setTemplates((data ?? []) as PromptTemplate[]);
    } catch (queryError) {
      console.error('Error fetching prompt templates:', queryError);
      setError('Không thể tải danh sách prompt mẫu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const subjectOptions = useMemo(() => {
    return Array.from(
      new Set(templates.map((template) => template.subject?.trim()).filter(Boolean) as string[])
    ).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesSearch =
        !keyword ||
        template.title.toLowerCase().includes(keyword) ||
        template.prompt_content.toLowerCase().includes(keyword) ||
        (template.purpose ?? '').toLowerCase().includes(keyword) ||
        (template.subject ?? '').toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
      const matchesGrade = gradeFilter === 'all' || template.grade === Number.parseInt(gradeFilter, 10);
      const matchesSubject = subjectFilter === 'all' || template.subject === subjectFilter;
      const matchesDifficulty = difficultyFilter === 'all' || template.difficulty === difficultyFilter;
      const matchesFeatured = featuredFilter === 'all' || template.featured;
      return matchesSearch && matchesStatus && matchesGrade && matchesSubject && matchesDifficulty && matchesFeatured;
    });
  }, [templates, search, statusFilter, gradeFilter, subjectFilter, difficultyFilter, featuredFilter]);

  function openCreateForm() {
    setEditingTemplate(null);
    setForm(emptyForm);
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function openEditForm(template: PromptTemplate) {
    setEditingTemplate(template);
    setForm(buildFormFromTemplate(template));
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function closeForm(force = false) {
    if (saving && !force) return;
    setFormOpen(false);
    setEditingTemplate(null);
    setForm(emptyForm);
  }

  function buildPayload(): PromptTemplateInsert | PromptTemplateUpdate {
    return {
      title: form.title.trim(),
      prompt_content: form.prompt_content.trim(),
      purpose: normalizeOptional(form.purpose),
      subject: normalizeOptional(form.subject),
      grade: parseGrade(form.grade),
      book_series: normalizeOptional(form.book_series),
      difficulty: form.difficulty || null,
      usage_note: normalizeOptional(form.usage_note),
      why_effective: normalizeOptional(form.why_effective),
      tags: parseTags(form.tags),
      status: form.status,
      featured: form.featured,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const payload = buildPayload();

      if (editingTemplate) {
        const { error: updateError } = await supabase
          .from('prompt_templates')
          .update(payload)
          .eq('id', editingTemplate.id);
        if (updateError) throw updateError;
        setFeedback('Đã lưu thay đổi prompt mẫu.');
      } else {
        const insertPayload: PromptTemplateInsert = {
          ...(payload as PromptTemplateInsert),
          created_by: user?.id ?? null,
        };
        const { error: insertError } = await supabase.from('prompt_templates').insert(insertPayload);
        if (insertError) throw insertError;
        setFeedback('Đã tạo prompt mẫu mới.');
      }

      closeForm(true);
      await fetchTemplates();
    } catch (saveError) {
      console.error('Error saving prompt template:', saveError);
      setError('Không thể lưu prompt mẫu. Vui lòng kiểm tra nội dung và thử lại.');
    } finally {
      setSaving(false);
    }
  }

  async function updateTemplateStatus(template: PromptTemplate, status: ContentStatus) {
    setActionId(template.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: updateError } = await supabase
        .from('prompt_templates')
        .update({ status } satisfies PromptTemplateUpdate)
        .eq('id', template.id);
      if (updateError) throw updateError;

      const message =
        status === 'published'
          ? 'Đã xuất bản prompt mẫu.'
          : status === 'draft'
            ? 'Đã gỡ xuất bản prompt mẫu.'
            : 'Đã lưu trữ prompt mẫu.';
      setFeedback(message);
      await fetchTemplates();
    } catch (statusError) {
      console.error('Error updating prompt template status:', statusError);
      setError('Không thể cập nhật trạng thái prompt mẫu.');
    } finally {
      setActionId(null);
    }
  }

  async function deleteTemplate(template: PromptTemplate) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa prompt này không?');
    if (!confirmed) return;

    setActionId(template.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: deleteError } = await supabase.from('prompt_templates').delete().eq('id', template.id);
      if (deleteError) throw deleteError;
      setFeedback('Đã xóa prompt mẫu.');
      await fetchTemplates();
    } catch (deleteError) {
      console.error('Error deleting prompt template:', deleteError);
      setError('Không thể xóa prompt mẫu.');
    } finally {
      setActionId(null);
    }
  }

  async function copyPrompt(template: PromptTemplate) {
    try {
      await navigator.clipboard.writeText(template.prompt_content);
      setCopiedId(template.id);
      setFeedback('Đã sao chép prompt.');
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch (copyError) {
      console.error('Error copying prompt template:', copyError);
      setError('Không thể sao chép prompt. Vui lòng thử lại.');
    }
  }

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-2xl border bg-bg-card p-6 shadow-card sm:p-8"
        style={{ borderColor: 'var(--color-border-strong)' }}
      >
        <div
          className="absolute -right-12 -top-12 h-32 w-32 rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 14%, transparent)' }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">Prompt mẫu</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
              Quản lý prompt mẫu
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Tạo và quản lý các prompt học tập mẫu để học sinh dùng AI hiệu quả hơn.
            </p>
            <p className="mt-2 text-sm font-semibold text-text-muted">
              Prompt mẫu giúp học sinh hỏi AI đúng cách, không chỉ lấy đáp án nhanh.
            </p>
          </div>
          <button type="button" onClick={openCreateForm} className="btn-primary gap-2 self-start lg:self-auto">
            <Plus size={16} />
            Tạo prompt mẫu
          </button>
        </div>
      </section>

      {(feedback || error) && (
        <div
          className="rounded-xl border px-4 py-3 text-sm font-semibold"
          style={{
            backgroundColor: feedback ? 'var(--color-secondary-light)' : 'var(--color-accent-light)',
            borderColor: feedback
              ? 'color-mix(in srgb, var(--color-secondary) 35%, transparent)'
              : 'color-mix(in srgb, var(--color-accent) 35%, transparent)',
            color: feedback ? 'var(--color-secondary)' : 'var(--color-accent)',
          }}
        >
          {feedback || error}
        </div>
      )}

      <section className="rounded-2xl border bg-bg-card p-4 shadow-card" style={{ borderColor: 'var(--color-border)' }}>
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto_auto_auto] xl:items-center">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề, nội dung, mục đích, môn học..."
              className="input-field pl-10"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="input-field min-w-[11rem] pr-10"
            aria-label="Lọc trạng thái"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={gradeFilter}
            onChange={(event) => setGradeFilter(event.target.value as GradeFilter)}
            className="input-field min-w-[9rem] pr-10"
            aria-label="Lọc khối lớp"
          >
            <option value="all">Tất cả</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
            className="input-field min-w-[10rem] pr-10"
            aria-label="Lọc môn học"
          >
            <option value="all">Tất cả môn</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value as DifficultyFilter)}
            className="input-field min-w-[10rem] pr-10"
            aria-label="Lọc độ khó"
          >
            <option value="all">Tất cả</option>
            <option value="basic">Cơ bản</option>
            <option value="intermediate">Trung bình</option>
            <option value="advanced">Nâng cao</option>
          </select>
          <select
            value={featuredFilter}
            onChange={(event) => setFeaturedFilter(event.target.value as FeaturedFilter)}
            className="input-field min-w-[9rem] pr-10"
            aria-label="Lọc nổi bật"
          >
            <option value="all">Tất cả</option>
            <option value="featured">Nổi bật</option>
          </select>
        </div>
      </section>

      {formOpen && (
        <section className="rounded-2xl border bg-bg-card p-5 shadow-card" style={{ borderColor: 'var(--color-border-strong)' }}>
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold text-text">
                {editingTemplate ? 'Sửa prompt mẫu' : 'Tạo prompt mẫu'}
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Đây là prompt mẫu công khai do admin quản lý, không phải prompt cá nhân của học sinh.
              </p>
            </div>
            <button
              type="button"
              onClick={() => closeForm()}
              className="flex h-9 w-9 items-center justify-center rounded-full border text-text-muted hover:bg-bg-muted"
              style={{ borderColor: 'var(--color-border)' }}
              aria-label="Hủy"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Tiêu đề</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="input-field"
                required
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Nội dung prompt</span>
              <textarea
                value={form.prompt_content}
                onChange={(event) => setForm((current) => ({ ...current, prompt_content: event.target.value }))}
                className="input-field min-h-64 resize-y font-mono-code"
                placeholder="Viết prompt mẫu tại đây..."
                required
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Mục đích</span>
              <input
                value={form.purpose}
                onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))}
                className="input-field"
                placeholder="Ôn tập, tóm tắt, luyện viết..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Môn học</span>
              <input
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                className="input-field"
                placeholder="Toán học, Ngữ văn, Tiếng Anh..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Khối lớp</span>
              <select
                value={form.grade}
                onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value as PromptFormState['grade'] }))}
                className="input-field pr-10"
              >
                <option value="">Không gắn khối</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Bộ sách</span>
              <input
                value={form.book_series}
                onChange={(event) => setForm((current) => ({ ...current, book_series: event.target.value }))}
                className="input-field"
                placeholder="Cánh Diều, Kết Nối Tri Thức..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Độ khó</span>
              <select
                value={form.difficulty}
                onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value as PromptFormState['difficulty'] }))}
                className="input-field pr-10"
              >
                <option value="">Chưa đặt</option>
                <option value="basic">Cơ bản</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Tags</span>
              <input
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                className="input-field"
                placeholder="AI, ôn tập, phản biện"
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Khi nào nên dùng prompt này?</span>
              <textarea
                value={form.usage_note}
                onChange={(event) => setForm((current) => ({ ...current, usage_note: event.target.value }))}
                className="input-field min-h-24 resize-y"
                placeholder="Gợi ý tình huống nên dùng prompt này: ôn tập, giải thích khái niệm, luyện viết, tự kiểm tra..."
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Vì sao prompt này hiệu quả?</span>
              <textarea
                value={form.why_effective}
                onChange={(event) => setForm((current) => ({ ...current, why_effective: event.target.value }))}
                className="input-field min-h-24 resize-y"
                placeholder="Giải thích ngắn gọn vì sao prompt này giúp học sinh hỏi AI tốt hơn. Ví dụ: prompt có bối cảnh rõ, yêu cầu từng bước, có phần tự luyện và kiểm chứng."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ContentStatus }))}
                className="input-field pr-10"
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              <span>
                <span className="block text-sm font-bold text-text">Nổi bật</span>
                <span className="block text-xs text-text-muted">Ưu tiên hiển thị prompt mẫu này.</span>
              </span>
            </label>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row lg:col-span-2" style={{ borderColor: 'var(--color-border)' }}>
              <button type="submit" disabled={saving} className="btn-primary gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {editingTemplate ? 'Lưu thay đổi' : 'Tạo prompt mẫu'}
              </button>
              <button type="button" onClick={() => closeForm()} disabled={saving} className="btn-outline rounded-full">
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border bg-bg-card shadow-card" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h3 className="font-display text-lg font-extrabold text-text">Danh sách prompt mẫu</h3>
            <p className="text-sm text-text-muted">{filteredTemplates.length} prompt mẫu đang hiển thị</p>
          </div>
          <MessageSquareText size={18} className="text-text-light" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm font-bold text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Đang tải prompt mẫu...
          </div>
        ) : templates.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent">
              <MessageSquareText size={24} />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-text">Chưa có prompt mẫu nào</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Tạo prompt mẫu đầu tiên để giúp học sinh hỏi AI rõ ràng, có bối cảnh và có trách nhiệm.
            </p>
            <button type="button" onClick={openCreateForm} className="btn-primary mt-5 gap-2">
              <Plus size={16} />
              Tạo prompt mẫu
            </button>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="px-5 py-14 text-center text-sm text-text-muted">
            Không tìm thấy prompt mẫu phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[82rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-text-light">
                <tr>
                  <th className="px-5 py-3 font-bold">Tiêu đề</th>
                  <th className="px-5 py-3 font-bold">Mục đích</th>
                  <th className="px-5 py-3 font-bold">Môn</th>
                  <th className="px-5 py-3 font-bold">Khối</th>
                  <th className="px-5 py-3 font-bold">Độ khó</th>
                  <th className="px-5 py-3 font-bold">Trạng thái</th>
                  <th className="px-5 py-3 font-bold">Nổi bật</th>
                  <th className="px-5 py-3 font-bold">Cập nhật</th>
                  <th className="px-5 py-3 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => {
                  const busy = actionId === template.id;
                  return (
                    <tr key={template.id} className="border-t align-top" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="max-w-sm px-5 py-4">
                        <p className="font-bold text-text">{template.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                          {template.prompt_content}
                        </p>
                        {template.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {template.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="tag px-2 py-0.5 text-[11px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-text-muted">{template.purpose || 'Chưa đặt'}</td>
                      <td className="px-5 py-4 text-text-muted">{template.subject || 'Chung'}</td>
                      <td className="px-5 py-4 text-text-muted">{template.grade ? `Lớp ${template.grade}` : 'Tất cả'}</td>
                      <td className="px-5 py-4">
                        <DifficultyBadge difficulty={template.difficulty} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={template.status} />
                      </td>
                      <td className="px-5 py-4">
                        <FeaturedBadge featured={template.featured} />
                      </td>
                      <td className="px-5 py-4 text-text-muted">{formatDate(template.updated_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(template)}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Edit3 size={13} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => copyPrompt(template)}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            {copiedId === template.id ? <Check size={13} /> : <Copy size={13} />}
                            Sao chép prompt
                          </button>
                          {template.status === 'published' ? (
                            <button
                              type="button"
                              onClick={() => updateTemplateStatus(template, 'draft')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                              Gỡ xuất bản
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateTemplateStatus(template, 'published')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Xuất bản
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => updateTemplateStatus(template, 'archived')}
                            disabled={busy || template.status === 'archived'}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Archive size={13} />
                            Lưu trữ
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTemplate(template)}
                            disabled={busy}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5 text-accent hover:text-accent"
                          >
                            {busy ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
