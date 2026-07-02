import { Users } from 'lucide-react';

export default function AdminUsers() {
  return (
    <section className="rounded-2xl border bg-bg-card p-6 shadow-card sm:p-8" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex max-w-2xl items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
          <Users size={22} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-text">Người dùng</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Xem tổng quan tài khoản học sinh và admin. MVP chỉ dùng hai vai trò: student và admin.
          </p>
          <div className="mt-6 rounded-xl border border-dashed p-5 text-sm text-text-muted" style={{ borderColor: 'var(--color-border-strong)' }}>
            Phase 4 sẽ nối kiểm tra admin_roles. Trang người dùng sẽ được mở rộng sau khi các luồng nội dung chính ổn định.
          </div>
        </div>
      </div>
    </section>
  );
}
