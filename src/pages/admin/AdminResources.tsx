import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Archive,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Library,
  Loader2,
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
  LearningResource,
  LearningResourceInsert,
  LearningResourceUpdate,
  ResourceType,
} from '../../types/database';
import StatusBadge from '../../components/admin/StatusBadge';

type StatusFilter = 'all' | ContentStatus;
type GradeFilter = 'all' | '10' | '11' | '12';
type ResourceTypeFilter = 'all' | ResourceType;
type FeaturedFilter = 'all' | 'featured';

interface ResourceFormState {
  title: string;
  description: string;
  resource_type: ResourceType;
  external_url: string;
  file_url: string;
  subject: string;
  grade: '' | '10' | '11' | '12';
  book_series: string;
  curriculum_item_id: string;
  status: ContentStatus;
  featured: boolean;
}

const bookSeriesOptions = ['Chân Trời Sáng Tạo', 'Cánh Diều', 'Kết Nối Tri Thức'];

const resourceTypeLabels: Record<ResourceType, string> = {
  link: 'Link',
  pdf: 'PDF',
  image: 'Hình ảnh',
  document: 'Tài liệu',
  other: 'Khác',
};

const emptyForm: ResourceFormState = {
  title: '',
  description: '',
  resource_type: 'link',
  external_url: '',
  file_url: '',
  subject: '',
  grade: '',
  book_series: '',
  curriculum_item_id: '',
  status: 'draft',
  featured: false,
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

function parseGrade(value: ResourceFormState['grade']): Grade | null {
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

function buildFormFromResource(resource: LearningResource): ResourceFormState {
  return {
    title: resource.title,
    description: resource.description ?? '',
    resource_type: resource.resource_type,
    external_url: resource.external_url ?? '',
    file_url: resource.file_url ?? '',
    subject: resource.subject ?? '',
    grade: resource.grade ? String(resource.grade) as ResourceFormState['grade'] : '',
    book_series: resource.book_series ?? '',
    curriculum_item_id: resource.curriculum_item_id ?? '',
    status: resource.status,
    featured: resource.featured,
  };
}

function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const accent =
    type === 'link'
      ? { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' }
      : type === 'pdf'
        ? { bg: 'var(--color-accent-light)', color: 'var(--color-accent)' }
        : type === 'image'
          ? { bg: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }
          : { bg: 'var(--color-bg-muted)', color: 'var(--color-text-muted)' };

  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ backgroundColor: accent.bg, color: accent.color }}
    >
      {resourceTypeLabels[type]}
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

export default function AdminResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResourceTypeFilter>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [form, setForm] = useState<ResourceFormState>(emptyForm);

  const fetchResources = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase chưa được cấu hình.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('learning_resources')
        .select('*')
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;
      setResources((data ?? []) as LearningResource[]);
    } catch (queryError) {
      console.error('Error fetching learning resources:', queryError);
      setError('Không thể tải danh sách tài nguyên học tập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const subjectOptions = useMemo(() => {
    return Array.from(
      new Set(resources.map((resource) => resource.subject?.trim()).filter(Boolean) as string[])
    ).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [resources]);

  const filteredResources = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !keyword ||
        resource.title.toLowerCase().includes(keyword) ||
        (resource.description ?? '').toLowerCase().includes(keyword) ||
        (resource.subject ?? '').toLowerCase().includes(keyword) ||
        (resource.book_series ?? '').toLowerCase().includes(keyword);
      const matchesType = typeFilter === 'all' || resource.resource_type === typeFilter;
      const matchesGrade = gradeFilter === 'all' || resource.grade === Number.parseInt(gradeFilter, 10);
      const matchesSubject = subjectFilter === 'all' || resource.subject === subjectFilter;
      const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
      const matchesFeatured = featuredFilter === 'all' || resource.featured;
      return matchesSearch && matchesType && matchesGrade && matchesSubject && matchesStatus && matchesFeatured;
    });
  }, [resources, search, typeFilter, gradeFilter, subjectFilter, statusFilter, featuredFilter]);

  function openCreateForm() {
    setEditingResource(null);
    setForm(emptyForm);
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function openEditForm(resource: LearningResource) {
    setEditingResource(resource);
    setForm(buildFormFromResource(resource));
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function closeForm(force = false) {
    if (saving && !force) return;
    setFormOpen(false);
    setEditingResource(null);
    setForm(emptyForm);
  }

  function buildPayload(): LearningResourceInsert | LearningResourceUpdate {
    return {
      title: form.title.trim(),
      description: normalizeOptional(form.description),
      resource_type: form.resource_type,
      external_url: normalizeOptional(form.external_url),
      file_url: normalizeOptional(form.file_url),
      subject: normalizeOptional(form.subject),
      grade: parseGrade(form.grade),
      book_series: normalizeOptional(form.book_series),
      curriculum_item_id: normalizeOptional(form.curriculum_item_id),
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

      if (editingResource) {
        const { error: updateError } = await supabase
          .from('learning_resources')
          .update(payload)
          .eq('id', editingResource.id);
        if (updateError) throw updateError;
        setFeedback('Đã lưu thay đổi tài nguyên.');
      } else {
        const insertPayload: LearningResourceInsert = {
          ...(payload as LearningResourceInsert),
          created_by: user?.id ?? null,
        };
        const { error: insertError } = await supabase.from('learning_resources').insert(insertPayload);
        if (insertError) throw insertError;
        setFeedback('Đã thêm tài nguyên.');
      }

      closeForm(true);
      await fetchResources();
    } catch (saveError) {
      console.error('Error saving learning resource:', saveError);
      setError('Không thể lưu tài nguyên. Vui lòng kiểm tra thông tin và thử lại.');
    } finally {
      setSaving(false);
    }
  }

  async function updateResourceStatus(resource: LearningResource, status: ContentStatus) {
    setActionId(resource.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: updateError } = await supabase
        .from('learning_resources')
        .update({ status } satisfies LearningResourceUpdate)
        .eq('id', resource.id);
      if (updateError) throw updateError;

      const message =
        status === 'published'
          ? 'Đã xuất bản tài nguyên.'
          : status === 'draft'
            ? 'Đã gỡ xuất bản tài nguyên.'
            : 'Đã lưu trữ tài nguyên.';
      setFeedback(message);
      await fetchResources();
    } catch (statusError) {
      console.error('Error updating learning resource status:', statusError);
      setError('Không thể cập nhật trạng thái tài nguyên.');
    } finally {
      setActionId(null);
    }
  }

  async function deleteResource(resource: LearningResource) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa tài nguyên này không?');
    if (!confirmed) return;

    setActionId(resource.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: deleteError } = await supabase.from('learning_resources').delete().eq('id', resource.id);
      if (deleteError) throw deleteError;
      setFeedback('Đã xóa tài nguyên.');
      await fetchResources();
    } catch (deleteError) {
      console.error('Error deleting learning resource:', deleteError);
      setError('Không thể xóa tài nguyên.');
    } finally {
      setActionId(null);
    }
  }

  function openResourceLink(resource: LearningResource) {
    const href = resource.external_url?.trim() || resource.file_url?.trim();
    if (!href) {
      setError('Tài nguyên này chưa có liên kết để mở.');
      return;
    }

    window.open(href, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-2xl border bg-bg-card p-6 shadow-card sm:p-8"
        style={{ borderColor: 'var(--color-border-strong)' }}
      >
        <div
          className="absolute -right-12 -top-12 h-32 w-32 rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">Tài nguyên học tập</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
              Quản lý tài nguyên
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Quản lý tài liệu tự biên soạn, link nguồn chính thống và tài nguyên hỗ trợ học tập.
            </p>
            <p className="mt-2 text-sm font-semibold text-text-muted">
              Tài nguyên học tập nên ưu tiên tài liệu tự biên soạn hoặc link nguồn chính thống.
            </p>
          </div>
          <button type="button" onClick={openCreateForm} className="btn-primary gap-2 self-start lg:self-auto">
            <Plus size={16} />
            Thêm tài nguyên
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
              placeholder="Tìm theo tiêu đề, mô tả, môn, bộ sách..."
              className="input-field pl-10"
            />
          </label>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as ResourceTypeFilter)}
            className="input-field min-w-[10rem] pr-10"
            aria-label="Lọc loại tài nguyên"
          >
            <option value="all">Tất cả</option>
            <option value="link">Link</option>
            <option value="pdf">PDF</option>
            <option value="image">Hình ảnh</option>
            <option value="document">Tài liệu</option>
            <option value="other">Khác</option>
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
                {editingResource ? 'Sửa tài nguyên' : 'Thêm tài nguyên'}
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Trang này quản lý metadata và URL tài nguyên học tập. Không dùng upload file trực tiếp trong Admin Center.
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
              <span className="text-sm font-bold text-text">Mô tả</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="input-field min-h-24 resize-y"
                placeholder="Mô tả ngắn về cách dùng tài nguyên này..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Loại tài nguyên</span>
              <select
                value={form.resource_type}
                onChange={(event) => setForm((current) => ({ ...current, resource_type: event.target.value as ResourceType }))}
                className="input-field pr-10"
                required
              >
                <option value="link">Link</option>
                <option value="pdf">PDF</option>
                <option value="image">Hình ảnh</option>
                <option value="document">Tài liệu</option>
                <option value="other">Khác</option>
              </select>
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
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Link nguồn chính thống</span>
              <input
                type="url"
                value={form.external_url}
                onChange={(event) => setForm((current) => ({ ...current, external_url: event.target.value }))}
                className="input-field"
                placeholder="https://..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">File URL</span>
              <input
                type="url"
                value={form.file_url}
                onChange={(event) => setForm((current) => ({ ...current, file_url: event.target.value }))}
                className="input-field"
                placeholder="https://..."
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
                onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value as ResourceFormState['grade'] }))}
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
              <select
                value={form.book_series}
                onChange={(event) => setForm((current) => ({ ...current, book_series: event.target.value }))}
                className="input-field pr-10"
              >
                <option value="">Không gắn bộ sách</option>
                {bookSeriesOptions.map((series) => (
                  <option key={series} value={series}>
                    {series}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Curriculum item ID</span>
              <input
                value={form.curriculum_item_id}
                onChange={(event) => setForm((current) => ({ ...current, curriculum_item_id: event.target.value }))}
                className="input-field font-mono-code"
                placeholder="UUID tùy chọn"
              />
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
                <span className="block text-xs text-text-muted">Ưu tiên tài nguyên này trong các luồng hiển thị sau.</span>
              </span>
            </label>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row lg:col-span-2" style={{ borderColor: 'var(--color-border)' }}>
              <button type="submit" disabled={saving} className="btn-primary gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {editingResource ? 'Lưu thay đổi' : 'Thêm tài nguyên'}
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
            <h3 className="font-display text-lg font-extrabold text-text">Danh sách tài nguyên</h3>
            <p className="text-sm text-text-muted">{filteredResources.length} tài nguyên đang hiển thị</p>
          </div>
          <Library size={18} className="text-text-light" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm font-bold text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Đang tải tài nguyên học tập...
          </div>
        ) : resources.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Library size={24} />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-text">Chưa có tài nguyên nào</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Thêm tài nguyên đầu tiên bằng metadata và URL nguồn chính thống hoặc tài liệu tự biên soạn.
            </p>
            <button type="button" onClick={openCreateForm} className="btn-primary mt-5 gap-2">
              <Plus size={16} />
              Thêm tài nguyên
            </button>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="px-5 py-14 text-center text-sm text-text-muted">
            Không tìm thấy tài nguyên phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[82rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-text-light">
                <tr>
                  <th className="px-5 py-3 font-bold">Tiêu đề</th>
                  <th className="px-5 py-3 font-bold">Loại</th>
                  <th className="px-5 py-3 font-bold">Môn</th>
                  <th className="px-5 py-3 font-bold">Khối</th>
                  <th className="px-5 py-3 font-bold">Bộ sách</th>
                  <th className="px-5 py-3 font-bold">Trạng thái</th>
                  <th className="px-5 py-3 font-bold">Nổi bật</th>
                  <th className="px-5 py-3 font-bold">Cập nhật</th>
                  <th className="px-5 py-3 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((resource) => {
                  const busy = actionId === resource.id;
                  const hasLink = Boolean(resource.external_url?.trim() || resource.file_url?.trim());
                  return (
                    <tr key={resource.id} className="border-t align-top" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="max-w-sm px-5 py-4">
                        <p className="font-bold text-text">{resource.title}</p>
                        {resource.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">{resource.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <ResourceTypeBadge type={resource.resource_type} />
                      </td>
                      <td className="px-5 py-4 text-text-muted">{resource.subject || 'Chung'}</td>
                      <td className="px-5 py-4 text-text-muted">{resource.grade ? `Lớp ${resource.grade}` : 'Tất cả'}</td>
                      <td className="px-5 py-4 text-text-muted">{resource.book_series || 'Không gắn'}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={resource.status} />
                      </td>
                      <td className="px-5 py-4">
                        <FeaturedBadge featured={resource.featured} />
                      </td>
                      <td className="px-5 py-4 text-text-muted">{formatDate(resource.updated_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(resource)}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Edit3 size={13} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => openResourceLink(resource)}
                            disabled={!hasLink}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <ExternalLink size={13} />
                            Mở liên kết
                          </button>
                          {resource.status === 'published' ? (
                            <button
                              type="button"
                              onClick={() => updateResourceStatus(resource, 'draft')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                              Gỡ xuất bản
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateResourceStatus(resource, 'published')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Xuất bản
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => updateResourceStatus(resource, 'archived')}
                            disabled={busy || resource.status === 'archived'}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Archive size={13} />
                            Lưu trữ
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteResource(resource)}
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
