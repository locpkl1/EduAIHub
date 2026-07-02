import { Library } from 'lucide-react';

export default function AdminResources() {
  return (
    <section className="rounded-2xl border bg-bg-card p-6 shadow-card sm:p-8" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex max-w-2xl items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Library size={22} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-text">Tài nguyên</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Quản lý link, PDF tự soạn, worksheet, mindmap, hình ảnh hoặc tài liệu hỗ trợ học tập.
          </p>
          <div className="mt-6 rounded-xl border border-dashed p-5 text-sm text-text-muted" style={{ borderColor: 'var(--color-border-strong)' }}>
            CRUD tài nguyên sẽ được triển khai ở Phase 8, bao gồm loại tài nguyên, liên kết ngoài, file URL và liên kết tới mục chương trình học.
          </div>
        </div>
      </div>
    </section>
  );
}
