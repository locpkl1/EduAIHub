import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Archive,
  BookMarked,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type {
  ContentStatus,
  CurriculumItem,
  CurriculumItemInsert,
  CurriculumItemUpdate,
  Grade,
} from '../../types/database';
import StatusBadge from '../../components/admin/StatusBadge';

type StatusFilter = 'all' | ContentStatus;
type GradeFilter = 'all' | '10' | '11' | '12';

interface CurriculumFormState {
  grade: '10' | '11' | '12';
  book_series: string;
  subject: string;
  chapter_title: string;
  lesson_title: string;
  description: string;
  suggested_prompt: string;
  status: ContentStatus;
  sort_order: string;
}

const bookSeriesOptions = ['Chân Trời Sáng Tạo', 'Cánh Diều', 'Kết Nối Tri Thức'];

const emptyForm: CurriculumFormState = {
  grade: '10',
  book_series: bookSeriesOptions[0],
  subject: '',
  chapter_title: '',
  lesson_title: '',
  description: '',
  suggested_prompt: '',
  status: 'draft',
  sort_order: '0',
};

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'archived', label: 'Đã lưu trữ' },
];

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseGrade(value: CurriculumFormState['grade']): Grade {
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

function buildFormFromItem(item: CurriculumItem): CurriculumFormState {
  return {
    grade: String(item.grade) as CurriculumFormState['grade'],
    book_series: item.book_series,
    subject: item.subject,
    chapter_title: item.chapter_title,
    lesson_title: item.lesson_title ?? '',
    description: item.description ?? '',
    suggested_prompt: item.suggested_prompt ?? '',
    status: item.status,
    sort_order: String(item.sort_order),
  };
}

export default function AdminCurriculum() {
  const { user } = useAuth();
  const [items, setItems] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [bookSeriesFilter, setBookSeriesFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CurriculumItem | null>(null);
  const [form, setForm] = useState<CurriculumFormState>(emptyForm);

  const fetchItems = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase chưa được cấu hình.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('curriculum_items')
        .select('*')
        .order('grade', { ascending: true })
        .order('subject', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;
      setItems((data ?? []) as CurriculumItem[]);
    } catch (queryError) {
      console.error('Error fetching curriculum items:', queryError);
      setError('Không thể tải bản đồ chương trình học. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const subjectOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.subject.trim()).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, 'vi')
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.book_series.toLowerCase().includes(keyword) ||
        item.subject.toLowerCase().includes(keyword) ||
        item.chapter_title.toLowerCase().includes(keyword) ||
        (item.lesson_title ?? '').toLowerCase().includes(keyword) ||
        (item.description ?? '').toLowerCase().includes(keyword);
      const matchesGrade = gradeFilter === 'all' || item.grade === Number.parseInt(gradeFilter, 10);
      const matchesBookSeries = bookSeriesFilter === 'all' || item.book_series === bookSeriesFilter;
      const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesGrade && matchesBookSeries && matchesSubject && matchesStatus;
    });
  }, [items, search, gradeFilter, bookSeriesFilter, subjectFilter, statusFilter]);

  function openCreateForm() {
    setEditingItem(null);
    setForm(emptyForm);
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function openEditForm(item: CurriculumItem) {
    setEditingItem(item);
    setForm(buildFormFromItem(item));
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function closeForm(force = false) {
    if (saving && !force) return;
    setFormOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  }

  function buildPayload(): CurriculumItemInsert | CurriculumItemUpdate {
    const sortOrder = Number.parseInt(form.sort_order, 10);

    return {
      grade: parseGrade(form.grade),
      book_series: form.book_series.trim(),
      subject: form.subject.trim(),
      chapter_title: form.chapter_title.trim(),
      lesson_title: normalizeOptional(form.lesson_title),
      description: normalizeOptional(form.description),
      suggested_prompt: normalizeOptional(form.suggested_prompt),
      status: form.status,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const payload = buildPayload();

      if (editingItem) {
        const { error: updateError } = await supabase
          .from('curriculum_items')
          .update(payload)
          .eq('id', editingItem.id);
        if (updateError) throw updateError;
        setFeedback('Đã lưu thay đổi mục chương trình.');
      } else {
        const insertPayload: CurriculumItemInsert = {
          ...(payload as CurriculumItemInsert),
          created_by: user?.id ?? null,
        };
        const { error: insertError } = await supabase.from('curriculum_items').insert(insertPayload);
        if (insertError) throw insertError;
        setFeedback('Đã thêm mục chương trình.');
      }

      closeForm(true);
      await fetchItems();
    } catch (saveError) {
      console.error('Error saving curriculum item:', saveError);
      setError('Không thể lưu mục chương trình. Vui lòng kiểm tra thông tin và thử lại.');
    } finally {
      setSaving(false);
    }
  }

  async function updateItemStatus(item: CurriculumItem, status: ContentStatus) {
    setActionId(item.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: updateError } = await supabase
        .from('curriculum_items')
        .update({ status } satisfies CurriculumItemUpdate)
        .eq('id', item.id);
      if (updateError) throw updateError;

      const message =
        status === 'published'
          ? 'Đã xuất bản mục chương trình.'
          : status === 'draft'
            ? 'Đã gỡ xuất bản mục chương trình.'
            : 'Đã lưu trữ mục chương trình.';
      setFeedback(message);
      await fetchItems();
    } catch (statusError) {
      console.error('Error updating curriculum item status:', statusError);
      setError('Không thể cập nhật trạng thái mục chương trình.');
    } finally {
      setActionId(null);
    }
  }

  async function deleteItem(item: CurriculumItem) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa mục chương trình này không?');
    if (!confirmed) return;

    setActionId(item.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: deleteError } = await supabase.from('curriculum_items').delete().eq('id', item.id);
      if (deleteError) throw deleteError;
      setFeedback('Đã xóa mục chương trình.');
      await fetchItems();
    } catch (deleteError) {
      console.error('Error deleting curriculum item:', deleteError);
      setError('Không thể xóa mục chương trình.');
    } finally {
      setActionId(null);
    }
  }

  async function copySuggestedPrompt(item: CurriculumItem) {
    if (!item.suggested_prompt?.trim()) {
      setError('Mục này chưa có prompt gợi ý để sao chép.');
      return;
    }

    try {
      await navigator.clipboard.writeText(item.suggested_prompt);
      setCopiedId(item.id);
      setFeedback('Đã sao chép prompt gợi ý.');
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch (copyError) {
      console.error('Error copying suggested prompt:', copyError);
      setError('Không thể sao chép prompt gợi ý. Vui lòng thử lại.');
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
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 16%, transparent)' }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">Bản đồ chương trình học</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
              Quản lý chương trình học
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Quản lý lớp, bộ sách, môn học, chương và bài học để tạo ngữ cảnh học tập cho AI.
            </p>
            <p className="mt-2 text-sm font-semibold text-text-muted">
              Bản đồ chương trình học giúp AI hiểu học sinh đang học lớp nào, môn nào, bộ sách nào và bài nào.
            </p>
          </div>
          <button type="button" onClick={openCreateForm} className="btn-primary gap-2 self-start lg:self-auto">
            <Plus size={16} />
            Thêm mục chương trình
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
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto_auto] xl:items-center">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo bộ sách, môn, chủ đề/chương/bài học..."
              className="input-field pl-10"
            />
          </label>
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
            value={bookSeriesFilter}
            onChange={(event) => setBookSeriesFilter(event.target.value)}
            className="input-field min-w-[13rem] pr-10"
            aria-label="Lọc bộ sách"
          >
            <option value="all">Tất cả</option>
            {bookSeriesOptions.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
            className="input-field min-w-[11rem] pr-10"
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
        </div>
      </section>

      {formOpen && (
        <section className="rounded-2xl border bg-bg-card p-5 shadow-card" style={{ borderColor: 'var(--color-border-strong)' }}>
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold text-text">
                {editingItem ? 'Sửa mục chương trình' : 'Thêm mục chương trình'}
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Quản lý ngữ cảnh học tập để AI có thể hỗ trợ học sinh đúng lớp, đúng môn và đúng bài.
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
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Khối lớp</span>
              <select
                value={form.grade}
                onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value as CurriculumFormState['grade'] }))}
                className="input-field pr-10"
                required
              >
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Bộ sách</span>
              <select
                value={form.book_series}
                onChange={(event) => setForm((current) => ({ ...current, book_series: event.target.value }))}
                className="input-field pr-10"
                required
              >
                {bookSeriesOptions.map((series) => (
                  <option key={series} value={series}>
                    {series}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Môn học</span>
              <input
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                className="input-field"
                placeholder="Toán học, Ngữ văn, Tiếng Anh..."
                required
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Thứ tự sắp xếp</span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))}
                className="input-field"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Chủ đề / chương</span>
              <input
                value={form.chapter_title}
                onChange={(event) => setForm((current) => ({ ...current, chapter_title: event.target.value }))}
                className="input-field"
                placeholder="Ví dụ: Hàm số bậc hai"
                required
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Bài học</span>
              <input
                value={form.lesson_title}
                onChange={(event) => setForm((current) => ({ ...current, lesson_title: event.target.value }))}
                className="input-field"
                placeholder="Ví dụ: Tìm hiểu đồ thị hàm số"
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Mô tả ngữ cảnh học tập</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="input-field min-h-24 resize-y"
                placeholder="Ghi chú mục tiêu học tập, kiến thức trọng tâm hoặc lưu ý cho AI..."
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Prompt gợi ý</span>
              <textarea
                value={form.suggested_prompt}
                onChange={(event) => setForm((current) => ({ ...current, suggested_prompt: event.target.value }))}
                className="input-field min-h-44 resize-y font-mono-code"
                placeholder="Viết prompt gợi ý để học sinh hỏi AI theo đúng ngữ cảnh bài học..."
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

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row lg:col-span-2" style={{ borderColor: 'var(--color-border)' }}>
              <button type="submit" disabled={saving} className="btn-primary gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {editingItem ? 'Lưu thay đổi' : 'Thêm mục chương trình'}
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
            <h3 className="font-display text-lg font-extrabold text-text">Danh sách mục chương trình</h3>
            <p className="text-sm text-text-muted">{filteredItems.length} mục đang hiển thị</p>
          </div>
          <BookMarked size={18} className="text-text-light" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm font-bold text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Đang tải bản đồ chương trình học...
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
              <BookMarked size={24} />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-text">Chưa có mục chương trình nào</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Thêm mục đầu tiên để xây dựng ngữ cảnh học tập theo lớp, môn, bộ sách và bài học.
            </p>
            <button type="button" onClick={openCreateForm} className="btn-primary mt-5 gap-2">
              <Plus size={16} />
              Thêm mục chương trình
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-5 py-14 text-center text-sm text-text-muted">
            Không tìm thấy mục chương trình phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[82rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-text-light">
                <tr>
                  <th className="px-5 py-3 font-bold">Khối</th>
                  <th className="px-5 py-3 font-bold">Bộ sách</th>
                  <th className="px-5 py-3 font-bold">Môn</th>
                  <th className="px-5 py-3 font-bold">Chủ đề / chương</th>
                  <th className="px-5 py-3 font-bold">Bài học</th>
                  <th className="px-5 py-3 font-bold">Trạng thái</th>
                  <th className="px-5 py-3 font-bold">Thứ tự</th>
                  <th className="px-5 py-3 font-bold">Cập nhật</th>
                  <th className="px-5 py-3 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const busy = actionId === item.id;
                  return (
                    <tr key={item.id} className="border-t align-top" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-5 py-4 font-bold text-text">Lớp {item.grade}</td>
                      <td className="px-5 py-4 text-text-muted">{item.book_series}</td>
                      <td className="px-5 py-4 text-text-muted">{item.subject}</td>
                      <td className="max-w-xs px-5 py-4">
                        <p className="font-bold text-text">{item.chapter_title}</p>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">{item.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-text-muted">{item.lesson_title || 'Chưa đặt'}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-text-muted">{item.sort_order}</td>
                      <td className="px-5 py-4 text-text-muted">{formatDate(item.updated_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Edit3 size={13} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => copySuggestedPrompt(item)}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                            Sao chép prompt gợi ý
                          </button>
                          {item.status === 'published' ? (
                            <button
                              type="button"
                              onClick={() => updateItemStatus(item, 'draft')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                              Gỡ xuất bản
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateItemStatus(item, 'published')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Xuất bản
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => updateItemStatus(item, 'archived')}
                            disabled={busy || item.status === 'archived'}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Archive size={13} />
                            Lưu trữ
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItem(item)}
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
