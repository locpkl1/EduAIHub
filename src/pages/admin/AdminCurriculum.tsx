import { BookMarked } from 'lucide-react';

export default function AdminCurriculum() {
  return (
    <section className="rounded-2xl border bg-bg-card p-6 shadow-card sm:p-8" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex max-w-2xl items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
          <BookMarked size={22} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-text">Bản đồ chương trình học</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Quản lý khối lớp, bộ sách, môn học, chương và bài để học sinh tạo prompt học tập tốt hơn. Đây không phải khu lưu trữ toàn bộ PDF sách giáo khoa.
          </p>
          <div className="mt-6 rounded-xl border border-dashed p-5 text-sm text-text-muted" style={{ borderColor: 'var(--color-border-strong)' }}>
            CRUD bản đồ chương trình học sẽ được triển khai ở Phase 7, gồm sắp xếp thứ tự, trạng thái và prompt gợi ý theo từng bài.
          </div>
        </div>
      </div>
    </section>
  );
}
