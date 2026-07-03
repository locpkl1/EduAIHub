import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  Lightbulb,
  NotebookPen,
  Route,
} from 'lucide-react';
import { SectionHeading, ShapeAccent } from '../components/ui';

const learningPaths = [
  {
    id: 'prompt-thinking',
    href: '/ai-tools/hoc-tu-duy-prompt',
    icon: Lightbulb,
    number: '01',
    title: 'Học tư duy prompt',
    situation: 'Khi bạn chưa biết cách hỏi AI sao cho rõ, đúng mục tiêu và không bị phụ thuộc.',
    helps: 'Dạy cấu trúc prompt tốt, cách đặt bối cảnh, mục tiêu, ràng buộc và cách kiểm chứng.',
    example: 'Prompt tốt cần có những phần nào?',
    tags: ['Tư duy prompt', 'Học chủ động', 'Kiểm chứng'],
    color: 'var(--color-primary)',
    bg: 'var(--color-primary-light)',
  },
  {
    id: 'study-prompt',
    href: '/ai-tools/goi-y-prompt-hoc-tap',
    icon: NotebookPen,
    number: '02',
    title: 'Gợi ý prompt học tập',
    situation: 'Khi bạn có lớp, môn, bộ sách, bài học hoặc vấn đề học tập cụ thể.',
    helps: 'Góp ý và tạo prompt học tập sát chương trình, có hướng dẫn từng bước và tự kiểm tra.',
    example: 'Gợi ý prompt học Toán 11 bài phương trình lượng giác.',
    tags: ['Theo lớp', 'Theo bài', 'Tự kiểm tra'],
    color: 'var(--color-accent)',
    bg: 'var(--color-accent-light)',
  },
  {
    id: 'prompt-evaluator',
    href: '/ai-tools/danh-gia-prompt',
    icon: ClipboardCheck,
    number: '03',
    title: 'Đánh giá prompt của bạn',
    situation: 'Khi bạn đã tự viết prompt nhưng chưa biết nó đủ rõ hay chưa.',
    helps: 'Chấm điểm, chỉ lỗi, viết lại bản tốt hơn và giải thích vì sao.',
    example: 'Đánh giá prompt: "Dạy em bài này".',
    tags: ['Chấm điểm', 'Sửa prompt', 'Nâng cấp'],
    color: 'var(--color-secondary)',
    bg: 'var(--color-secondary-light)',
  },
];

const practiceLinks = [
  ['ChatGPT', 'https://chatgpt.com'],
  ['Gemini', 'https://gemini.google.com'],
  ['Claude', 'https://claude.ai'],
] as const;

export default function AiTools() {
  return (
    <div className="text-text">
      <section className="px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <div
                className="mb-5 inline-flex rotate-[-1deg] items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border-strong)',
                  boxShadow: '4px 4px 0 color-mix(in srgb, var(--color-accent) 18%, transparent)',
                }}
              >
                <Route size={14} className="text-primary" />
                Xưởng prompt
              </div>
              <h1 className="max-w-4xl font-display text-[clamp(2.35rem,5.8vw,4.8rem)] font-semibold leading-[1.1] tracking-normal text-text">
                Học cách hỏi AI trước khi nhờ AI trả lời.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
                Ba lối vào mới giúp bạn hiểu tư duy prompt, tạo prompt học tập theo ngữ cảnh và tự kiểm tra prompt mình viết.
              </p>
            </div>

            <div
              className="relative overflow-hidden p-5"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderLeft: '4px solid var(--color-primary)',
                borderTop: '1px solid var(--color-border)',
                clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
              }}
            >
              <ShapeAccent variant="line" color="orange" className="mb-5" />
              <p className="text-sm font-bold text-text">Nếu chưa biết bắt đầu từ đâu</p>
              <p className="mt-2 text-sm leading-7 text-text-muted">
                Bắt đầu với <strong className="text-text">Học tư duy prompt</strong>, sau đó chuyển sang gợi ý prompt học tập hoặc đánh giá prompt của bạn.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {practiceLinks.map(([name, href]) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-bold text-text-muted transition-colors hover:border-primary hover:text-primary"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {name}
                    <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Ba lối luyện prompt"
            title="Chọn đúng kiểu hỗ trợ cho câu hỏi bạn đang có."
            description="Bạn muốn hiểu cách hỏi, tạo prompt theo bài học, hay kiểm tra prompt đã viết? Mỗi bot giữ một vai trò riêng để phản hồi sắc hơn."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {learningPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <Link
                  key={path.id}
                  to={path.href}
                  className={`group relative min-w-0 bg-bg-card p-5 transition-all hover:-translate-y-1 ${
                    index === 1 ? 'lg:translate-y-8' : ''
                  }`}
                  style={{
                    borderTop: '1px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
                    borderLeft: `4px solid ${path.color}`,
                    boxShadow: `0 18px 38px -32px ${path.color}`,
                    clipPath:
                      index === 2
                        ? 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)'
                        : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-5 top-0 h-2 w-14 -translate-y-1/2"
                    style={{ backgroundColor: `color-mix(in srgb, ${path.color} 24%, transparent)` }}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center"
                      style={{ backgroundColor: path.bg, color: path.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="font-display text-5xl font-extrabold leading-none" style={{ color: path.color }}>
                      {path.number}
                    </span>
                  </div>

                  <h2 className="mt-8 font-display text-2xl font-semibold leading-[1.2] text-text">
                    {path.title}
                  </h2>

                  <div className="mt-5 space-y-4 text-sm leading-7">
                    <ToolLine label="Khi nào chọn" text={path.situation} />
                    <ToolLine label="Giúp bạn" text={path.helps} />
                    <div
                      className="relative p-3"
                      style={{
                        backgroundColor: 'var(--color-bg-muted)',
                        borderLeft: `3px solid ${path.color}`,
                      }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">Câu hỏi mẫu</p>
                      <p className="mt-1 text-text-muted">"{path.example}"</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {path.tags.map((tag) => (
                      <span key={tag} className="tag text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold" style={{ color: path.color }}>
                    Bắt đầu
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div
          className="mx-auto flex max-w-7xl flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          style={{
            backgroundColor: 'var(--color-bg-muted)',
            borderLeft: '4px solid var(--color-accent)',
          }}
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 shrink-0 text-primary" size={20} />
            <p className="text-sm leading-7 text-text-muted">
              <strong className="text-text">Mẹo nhỏ:</strong> Một prompt tốt nên nói rõ mục tiêu, bối cảnh, tiêu chí câu trả lời và cách bạn muốn AI giúp mình tự học.
            </p>
          </div>
          <Link to="/guides" className="btn-outline shrink-0 gap-2">
            Đọc hướng dẫn
            <BookOpen size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ToolLine({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">{label}</p>
      <p className="mt-1 text-text-muted">{text}</p>
    </div>
  );
}
