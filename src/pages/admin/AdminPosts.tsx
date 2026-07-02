import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Archive,
  CheckCircle2,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { ContentPost, ContentPostInsert, ContentPostUpdate, ContentStatus } from '../../types/database';
import StatusBadge from '../../components/admin/StatusBadge';

type StatusFilter = 'all' | ContentStatus;
type FeaturedFilter = 'all' | 'featured';

interface PostFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  reading_minutes: string;
  thumbnail_url: string;
  status: ContentStatus;
  featured: boolean;
}

const emptyForm: PostFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: '',
  reading_minutes: '5',
  thumbnail_url: '',
  status: 'draft',
  featured: false,
};

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'archived', label: 'Đã lưu trữ' },
];

function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
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

function buildFormFromPost(post: ContentPost): PostFormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    content: post.content ?? '',
    category: post.category ?? '',
    tags: post.tags.join(', '),
    reading_minutes: String(post.reading_minutes),
    thumbnail_url: post.thumbnail_url ?? '',
    status: post.status,
    featured: post.featured,
  };
}

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) {
    return <span className="text-xs font-semibold text-text-light">Không</span>;
  }

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

export default function AdminPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null);
  const [form, setForm] = useState<PostFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase chưa được cấu hình.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('content_posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;
      setPosts((data ?? []) as ContentPost[]);
    } catch (queryError) {
      console.error('Error fetching content posts:', queryError);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !keyword ||
        post.title.toLowerCase().includes(keyword) ||
        (post.excerpt ?? '').toLowerCase().includes(keyword) ||
        (post.category ?? '').toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesFeatured = featuredFilter === 'all' || post.featured;
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [posts, search, statusFilter, featuredFilter]);

  function openCreateForm() {
    setEditingPost(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function openEditForm(post: ContentPost) {
    setEditingPost(post);
    setForm(buildFormFromPost(post));
    setSlugTouched(true);
    setFormOpen(true);
    setFeedback(null);
    setError(null);
  }

  function closeForm(force = false) {
    if (saving && !force) return;
    setFormOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
    setSlugTouched(false);
  }

  function updateTitle(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: !editingPost && !slugTouched ? createSlug(value) : current.slug,
    }));
  }

  function buildPayload(): ContentPostInsert | ContentPostUpdate {
    const readingMinutes = Number.parseInt(form.reading_minutes, 10);
    const status = form.status;
    const publishedAt =
      status === 'published'
        ? editingPost?.published_at ?? new Date().toISOString()
        : editingPost?.published_at ?? null;

    return {
      title: form.title.trim(),
      slug: form.slug.trim() || createSlug(form.title),
      excerpt: normalizeOptional(form.excerpt),
      content: normalizeOptional(form.content),
      category: normalizeOptional(form.category),
      tags: parseTags(form.tags),
      reading_minutes: Number.isFinite(readingMinutes) && readingMinutes >= 1 ? readingMinutes : 1,
      thumbnail_url: normalizeOptional(form.thumbnail_url),
      status,
      featured: form.featured,
      published_at: publishedAt,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const payload = buildPayload();

      if (editingPost) {
        const { error: updateError } = await supabase
          .from('content_posts')
          .update(payload)
          .eq('id', editingPost.id);
        if (updateError) throw updateError;
        setFeedback('Đã lưu thay đổi bài viết.');
      } else {
        const insertPayload: ContentPostInsert = {
          ...(payload as ContentPostInsert),
          author_id: user?.id ?? null,
        };
        const { error: insertError } = await supabase.from('content_posts').insert(insertPayload);
        if (insertError) throw insertError;
        setFeedback('Đã tạo bài viết mới.');
      }

      closeForm(true);
      await fetchPosts();
    } catch (saveError) {
      console.error('Error saving content post:', saveError);
      setError('Không thể lưu bài viết. Kiểm tra lại slug hoặc thử lại sau.');
    } finally {
      setSaving(false);
    }
  }

  async function updatePostStatus(post: ContentPost, status: ContentStatus) {
    setActionId(post.id);
    setError(null);
    setFeedback(null);

    try {
      const payload: ContentPostUpdate = {
        status,
        published_at: status === 'published' ? post.published_at ?? new Date().toISOString() : post.published_at,
      };

      const { error: updateError } = await supabase
        .from('content_posts')
        .update(payload)
        .eq('id', post.id);
      if (updateError) throw updateError;

      const message =
        status === 'published'
          ? 'Đã xuất bản bài viết.'
          : status === 'draft'
            ? 'Đã gỡ xuất bản bài viết.'
            : 'Đã lưu trữ bài viết.';
      setFeedback(message);
      await fetchPosts();
    } catch (statusError) {
      console.error('Error updating content post status:', statusError);
      setError('Không thể cập nhật trạng thái bài viết.');
    } finally {
      setActionId(null);
    }
  }

  async function deletePost(post: ContentPost) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa bài viết này không?');
    if (!confirmed) return;

    setActionId(post.id);
    setError(null);
    setFeedback(null);

    try {
      const { error: deleteError } = await supabase.from('content_posts').delete().eq('id', post.id);
      if (deleteError) throw deleteError;
      setFeedback('Đã xóa bài viết.');
      await fetchPosts();
    } catch (deleteError) {
      console.error('Error deleting content post:', deleteError);
      setError('Không thể xóa bài viết.');
    } finally {
      setActionId(null);
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
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">Bài viết</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
              Quản lý bài viết
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Quản lý bài hướng dẫn, kinh nghiệm học cùng AI và nội dung học tập.
            </p>
          </div>
          <button type="button" onClick={openCreateForm} className="btn-primary gap-2 self-start lg:self-auto">
            <Plus size={16} />
            Tạo bài viết
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
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề, mô tả, chuyên mục..."
              className="input-field pl-10"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="input-field min-w-[12rem] pr-10"
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
            className="input-field min-w-[10rem] pr-10"
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
                {editingPost ? 'Sửa bài viết' : 'Tạo bài viết'}
              </h3>
              <p className="mt-1 text-sm text-text-muted">Dùng Markdown hoặc văn bản thuần trong phần nội dung.</p>
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
              <span className="text-sm font-bold text-text">Tiêu đề</span>
              <input
                value={form.title}
                onChange={(event) => updateTitle(event.target.value)}
                className="input-field"
                required
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setForm((current) => ({ ...current, slug: createSlug(event.target.value) }));
                }}
                className="input-field"
                required
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Mô tả ngắn</span>
              <textarea
                value={form.excerpt}
                onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                className="input-field min-h-24 resize-y"
              />
            </label>
            <label className="space-y-1.5 lg:col-span-2">
              <span className="text-sm font-bold text-text">Nội dung</span>
              <textarea
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                className="input-field min-h-64 resize-y font-mono-code"
                placeholder="Viết nội dung hoặc Markdown tại đây..."
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Chuyên mục</span>
              <input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="input-field"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Tags</span>
              <input
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                className="input-field"
                placeholder="AI, ôn tập, prompt"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Số phút đọc</span>
              <input
                type="number"
                min={1}
                value={form.reading_minutes}
                onChange={(event) => setForm((current) => ({ ...current, reading_minutes: event.target.value }))}
                className="input-field"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-text">Thumbnail URL</span>
              <input
                type="url"
                value={form.thumbnail_url}
                onChange={(event) => setForm((current) => ({ ...current, thumbnail_url: event.target.value }))}
                className="input-field"
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
                <span className="block text-xs text-text-muted">Đánh dấu bài viết quan trọng.</span>
              </span>
            </label>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row lg:col-span-2" style={{ borderColor: 'var(--color-border)' }}>
              <button type="submit" disabled={saving} className="btn-primary gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {editingPost ? 'Lưu thay đổi' : 'Tạo bài viết'}
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
            <h3 className="font-display text-lg font-extrabold text-text">Danh sách bài viết</h3>
            <p className="text-sm text-text-muted">{filteredPosts.length} bài viết đang hiển thị</p>
          </div>
          <FileText size={18} className="text-text-light" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm font-bold text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Đang tải bài viết...
          </div>
        ) : posts.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <FileText size={24} />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-text">Chưa có bài viết nào</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Tạo bài viết đầu tiên để chuẩn bị nội dung hướng dẫn và kinh nghiệm học cùng AI.
            </p>
            <button type="button" onClick={openCreateForm} className="btn-primary mt-5 gap-2">
              <Plus size={16} />
              Tạo bài viết
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="px-5 py-14 text-center text-sm text-text-muted">
            Không tìm thấy bài viết phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[72rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-text-light">
                <tr>
                  <th className="px-5 py-3 font-bold">Tiêu đề</th>
                  <th className="px-5 py-3 font-bold">Chuyên mục</th>
                  <th className="px-5 py-3 font-bold">Trạng thái</th>
                  <th className="px-5 py-3 font-bold">Nổi bật</th>
                  <th className="px-5 py-3 font-bold">Phút đọc</th>
                  <th className="px-5 py-3 font-bold">Cập nhật</th>
                  <th className="px-5 py-3 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  const busy = actionId === post.id;
                  return (
                    <tr key={post.id} className="border-t align-top" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="max-w-sm px-5 py-4">
                        <p className="font-bold text-text">{post.title}</p>
                        <p className="mt-1 text-xs text-text-light">/{post.slug}</p>
                        {post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="tag px-2 py-0.5 text-[11px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-text-muted">{post.category || 'Chưa phân loại'}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-5 py-4">
                        <FeaturedBadge featured={post.featured} />
                      </td>
                      <td className="px-5 py-4 text-text-muted">{post.reading_minutes} phút</td>
                      <td className="px-5 py-4 text-text-muted">{formatDate(post.updated_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(post)}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Edit3 size={13} />
                            Sửa
                          </button>
                          {post.status === 'published' ? (
                            <button
                              type="button"
                              onClick={() => updatePostStatus(post, 'draft')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                              Gỡ xuất bản
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updatePostStatus(post, 'published')}
                              disabled={busy}
                              className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                            >
                              {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Xuất bản
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => updatePostStatus(post, 'archived')}
                            disabled={busy || post.status === 'archived'}
                            className="btn-ghost gap-1 rounded-full px-3 py-1.5"
                          >
                            <Archive size={13} />
                            Lưu trữ
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePost(post)}
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
