import { Settings } from 'lucide-react';

export default function AdminSettings() {
  return (
    <section className="rounded-2xl border bg-bg-card p-6 shadow-card sm:p-8" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex max-w-2xl items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-light text-accent">
          <Settings size={22} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-text">Cài đặt</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Khu vực dành cho các thiết lập hiển thị và vận hành Admin Center trong tương lai.
          </p>
          <div className="mt-6 rounded-xl border border-dashed p-5 text-sm text-text-muted" style={{ borderColor: 'var(--color-border-strong)' }}>
            Chưa có cài đặt nào trong Phase 3. Các tuỳ chọn quản trị sẽ được bổ sung khi cần, tránh overbuild sớm.
          </div>
        </div>
      </div>
    </section>
  );
}
