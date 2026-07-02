import { Link } from 'react-router-dom';
import {
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

const stats = [
  { label: 'Tổng bài viết', value: '0', helper: 'Sẵn sàng cho Phase 5', icon: FileText, accent: 'blue' as const },
  { label: 'Prompt mẫu', value: '0', helper: 'Sẽ quản lý ở Phase 6', icon: MessageSquareText, accent: 'orange' as const },
  { label: 'Mục chương trình học', value: '0', helper: 'Bản đồ prompt học tập', icon: BookMarked, accent: 'green' as const },
  { label: 'Tài nguyên', value: '0', helper: 'Link, PDF, worksheet', icon: Library, accent: 'blue' as const },
  { label: 'Đang nháp', value: '0', helper: 'Nội dung chưa xuất bản', icon: PencilLine, accent: 'orange' as const },
  { label: 'Đã xuất bản', value: '0', helper: 'Hiển thị cho học sinh', icon: Sparkles, accent: 'green' as const },
];

const quickActions = [
  { title: 'Tạo bài viết', desc: 'Soạn guide, lesson hoặc bài học AI.', to: '/admin/posts', icon: FileText },
  { title: 'Tạo prompt mẫu', desc: 'Chuẩn bị mẫu prompt công khai.', to: '/admin/prompts', icon: MessageSquareText },
  { title: 'Thêm mục chương trình học', desc: 'Gắn khối, môn, chương và bài.', to: '/admin/curriculum', icon: BookMarked },
  { title: 'Thêm tài nguyên', desc: 'Liên kết worksheet, ảnh, PDF hoặc link.', to: '/admin/resources', icon: Library },
];

const placeholderRows = [
  { title: 'Hướng dẫn dùng AI có trách nhiệm', type: 'Bài viết', status: 'draft' as const },
  { title: 'Prompt ôn tập theo chương', type: 'Prompt mẫu', status: 'published' as const },
  { title: 'Lớp 12 - Toán - Tích phân', type: 'Bản đồ chương trình', status: 'archived' as const },
];

export default function AdminDashboard() {
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
            Phase này dựng khung làm việc cho admin. Dữ liệu thật và thao tác tạo/sửa/xóa sẽ được nối từng phần ở các phase tiếp theo.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
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
              <p className="text-sm text-text-muted">Dữ liệu mẫu để giữ bố cục trước khi nối CRUD.</p>
            </div>
            <Rows3 size={18} className="text-text-light" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-text-light">
                <tr>
                  <th className="px-5 py-3 font-bold">Tiêu đề</th>
                  <th className="px-5 py-3 font-bold">Loại</th>
                  <th className="px-5 py-3 font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {placeholderRows.map((row) => (
                  <tr key={row.title} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-5 py-4 font-bold text-text">{row.title}</td>
                    <td className="px-5 py-4 text-text-muted">{row.type}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border bg-bg-card p-5 shadow-card" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-display text-lg font-extrabold text-text">Thao tác nhanh</h3>
          <p className="mt-1 text-sm text-text-muted">Các nút này tạm dẫn tới từng khu vực quản trị.</p>
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
