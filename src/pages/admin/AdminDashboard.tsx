import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Archive,
  BookMarked,
  FileText,
  Library,
  MessageSquareText,
  PencilLine,
  Plus,
  Rows3,
  Sparkles,
} from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { ContentStatus } from '../../types/database';

type CmsTable = 'content_posts' | 'prompt_templates' | 'curriculum_items' | 'learning_resources';

type CountKey =
  | 'posts'
  | 'prompts'
  | 'curriculum'
  | 'resources'
  | 'draft'
  | 'published'
  | 'archived';

interface RecentContentItem {
  id: string;
  title: string;
  type: string;
  status: ContentStatus;
  updated_at: string;
  route: string;
}

const initialCounts: Record<CountKey, number> = {
  posts: 0,
  prompts: 0,
  curriculum: 0,
  resources: 0,
  draft: 0,
  published: 0,
  archived: 0,
};

const cmsTables: CmsTable[] = ['content_posts', 'prompt_templates', 'curriculum_items', 'learning_resources'];

const tableConfig: Record<CmsTable, { countKey: CountKey; route: string; type: string }> = {
  content_posts: { countKey: 'posts', route: '/admin/posts', type: 'Bài viết' },
  prompt_templates: { countKey: 'prompts', route: '/admin/prompts', type: 'Prompt mẫu' },
  curriculum_items: { countKey: 'curriculum', route: '/admin/curriculum', type: 'Chương trình học' },
  learning_resources: { countKey: 'resources', route: '/admin/resources', type: 'Tài nguyên' },
};

const statusLabels: Record<ContentStatus, CountKey> = {
  draft: 'draft',
  published: 'published',
  archived: 'archived',
};

const quickActions = [
  { title: 'Tạo bài viết', desc: 'Soạn guide, lesson hoặc bài học AI.', to: '/admin/posts', icon: FileText },
  { title: 'Tạo prompt mẫu', desc: 'Chuẩn bị mẫu prompt công khai.', to: '/admin/prompts', icon: MessageSquareText },
  { title: 'Thêm mục chương trình học', desc: 'Gắn khối, môn, chương và bài học.', to: '/admin/curriculum', icon: BookMarked },
  { title: 'Thêm tài nguyên', desc: 'Liên kết tài liệu tự biên soạn hoặc nguồn chính thống.', to: '/admin/resources', icon: Library },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

async function countRows(table: CmsTable, status?: ContentStatus) {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (status) query = query.eq('status', status);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

function getRecentTitle(table: CmsTable, row: Record<string, unknown>) {
  if (table === 'curriculum_items') {
    return [row.subject, row.chapter_title, row.lesson_title].filter(Boolean).join(' - ') || 'Mục chương trình học';
  }

  return typeof row.title === 'string' && row.title.trim() ? row.title : tableConfig[table].type;
}

async function fetchRecentContent(): Promise<RecentContentItem[]> {
  const requests = cmsTables.map(async (table) => {
    const fields =
      table === 'curriculum_items'
        ? 'id,subject,chapter_title,lesson_title,status,updated_at'
        : 'id,title,status,updated_at';

    const { data, error } = await supabase
      .from(table)
      .select(fields)
      .order('updated_at', { ascending: false })
      .limit(4);

    if (error) throw error;

    return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      title: getRecentTitle(table, row),
      type: tableConfig[table].type,
      status: row.status as ContentStatus,
      updated_at: String(row.updated_at),
      route: tableConfig[table].route,
    }));
  });

  const groups = await Promise.all(requests);
  return groups
    .flat()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<CountKey, number>>(initialCounts);
  const [recentItems, setRecentItems] = useState<RecentContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      setIsLoading(true);
      setNotice(null);

      if (!isSupabaseConfigured) {
        setCounts(initialCounts);
        setRecentItems([]);
        setNotice('Supabase chưa được cấu hình nên bảng điều khiển đang hiển thị số liệu 0.');
        setIsLoading(false);
        return;
      }

      try {
        const countEntries = await Promise.all(
          cmsTables.map(async (table) => [tableConfig[table].countKey, await countRows(table)] as const)
        );

        const statusEntries = await Promise.all(
          (Object.keys(statusLabels) as ContentStatus[]).map(async (status) => {
            const values = await Promise.all(cmsTables.map((table) => countRows(table, status)));
            return [statusLabels[status], values.reduce((sum, value) => sum + value, 0)] as const;
          })
        );

        const recent = await fetchRecentContent();

        if (!cancelled) {
          setCounts({ ...initialCounts, ...Object.fromEntries([...countEntries, ...statusEntries]) });
          setRecentItems(recent);
        }
      } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        if (!cancelled) {
          setCounts(initialCounts);
          setRecentItems([]);
          setNotice('Chưa thể tải số liệu mới nhất. Bảng điều khiển tạm hiển thị giá trị 0.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Tổng bài viết', value: counts.posts, helper: 'Tất cả bài viết trong CMS', icon: FileText, accent: 'blue' as const },
      { label: 'Prompt mẫu', value: counts.prompts, helper: 'Prompt công khai do admin quản lý', icon: MessageSquareText, accent: 'orange' as const },
      { label: 'Mục chương trình học', value: counts.curriculum, helper: 'Bản đồ ngữ cảnh học tập', icon: BookMarked, accent: 'green' as const },
      { label: 'Tài nguyên', value: counts.resources, helper: 'Tài liệu tự biên soạn và link nguồn', icon: Library, accent: 'blue' as const },
      { label: 'Đang nháp', value: counts.draft, helper: 'Tổng nháp trên 4 bảng CMS', icon: PencilLine, accent: 'orange' as const },
      { label: 'Đã xuất bản', value: counts.published, helper: 'Nội dung đang hiển thị công khai', icon: Sparkles, accent: 'green' as const },
      { label: 'Đã lưu trữ', value: counts.archived, helper: 'Nội dung đã ẩn khỏi trang công khai', icon: Archive, accent: 'blue' as const },
    ],
    [counts]
  );

  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-2xl border p-6 shadow-card sm:p-8"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-strong)' }}
      >
        <div
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
        />
        <div className="relative max-w-3xl">
          <span className="section-label">Không gian biên tập</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
            Quản trị nội dung học AI cho học sinh THPT
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
            Theo dõi nhanh bài viết, prompt mẫu, bản đồ chương trình học và tài nguyên đã được quản lý trong EduAI-Hub.
          </p>
        </div>
      </section>

      {notice && (
        <div
          className="flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <AlertCircle className="mt-0.5 shrink-0 text-accent" size={17} />
          <span>{notice}</span>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={isLoading ? '...' : String(stat.value)}
            helper={stat.helper}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div
          className="rounded-2xl border bg-bg-card shadow-card"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="font-display text-lg font-extrabold text-text">Nội dung gần đây</h3>
              <p className="text-sm text-text-muted">Các mục mới cập nhật từ 4 bảng CMS chính.</p>
            </div>
            <Rows3 size={18} className="text-text-light" />
          </div>

          {isLoading ? (
            <div className="px-5 py-10 text-sm font-semibold text-text-muted">Đang tải nội dung gần đây...</div>
          ) : recentItems.length === 0 ? (
            <div className="px-5 py-10 text-sm leading-relaxed text-text-muted">
              Chưa có nội dung nào. Hãy bắt đầu bằng cách tạo bài viết hoặc prompt mẫu đầu tiên.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-text-light">
                  <tr>
                    <th className="px-5 py-3 font-bold">Tiêu đề</th>
                    <th className="px-5 py-3 font-bold">Loại</th>
                    <th className="px-5 py-3 font-bold">Trạng thái</th>
                    <th className="px-5 py-3 font-bold">Cập nhật</th>
                    <th className="px-5 py-3 font-bold">Mở</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-5 py-4 font-bold text-text">{item.title}</td>
                      <td className="px-5 py-4 text-text-muted">{item.type}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-text-muted">{formatDate(item.updated_at)}</td>
                      <td className="px-5 py-4">
                        <Link to={item.route} className="text-xs font-bold text-primary hover:underline">
                          Quản lý
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-bg-card p-5 shadow-card" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-display text-lg font-extrabold text-text">Thao tác nhanh</h3>
          <p className="mt-1 text-sm text-text-muted">Đi tới đúng khu vực CRUD để tạo hoặc cập nhật nội dung.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-muted text-primary group-hover:bg-bg-card">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="flex items-center gap-2 font-bold text-text">
                        {action.title}
                        <Plus size={14} className="text-primary" />
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-text-muted">{action.desc}</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
