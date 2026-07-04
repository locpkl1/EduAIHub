import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Home,
  NotebookPen,
  SearchCheck,
  Sparkles,
} from 'lucide-react';
import { CTASection, EditorialCard, SectionHeading } from '../components/ui';
import { getAdjacentGuideLessons, getGuideLesson, guideLessons, type GuideAccent, type GuideLesson } from '../data/guideLessons';

const accentText: Record<GuideAccent, string> = {
  blue: 'var(--color-primary)',
  green: 'var(--color-secondary)',
  orange: 'var(--color-accent)',
  ink: 'var(--color-text)',
};

const accentSoft: Record<GuideAccent, string> = {
  blue: 'var(--color-primary-light)',
  green: 'var(--color-secondary-light)',
  orange: 'var(--color-accent-light)',
  ink: 'var(--color-bg-muted)',
};

function NumberStamp({ lesson }: { lesson: GuideLesson }) {
  return (
    <span
      className="inline-flex h-11 min-w-11 items-center justify-center px-2 font-mono text-sm font-bold"
      style={{
        backgroundColor: accentText[lesson.accent],
        color: '#ffffff',
        boxShadow: `5px 5px 0 color-mix(in srgb, ${accentText[lesson.accent]} 18%, transparent)`,
      }}
    >
      {String(lesson.number).padStart(2, '0')}
    </span>
  );
}

function LessonNotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <EditorialCard accent="orange" className="text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center border"
          style={{
            backgroundColor: 'var(--color-accent-light)',
            borderColor: 'var(--color-border-strong)',
            color: 'var(--color-accent)',
          }}
        >
          <BookOpen size={24} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-text">Không tìm thấy bài học này</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-muted">
          Có thể đường dẫn đã bị gõ sai hoặc bài học này chưa nằm trong mini-course. Quay lại cẩm nang để chọn một bài khác nhé.
        </p>
        <Link to="/guides" className="btn-primary mt-7 gap-2">
          <ArrowLeft size={16} />
          Về Cẩm nang AI
        </Link>
      </EditorialCard>
    </div>
  );
}

export default function GuideLessonDetail() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = getGuideLesson(slug);

  if (!lesson) return <LessonNotFound />;

  const { previous, next } = getAdjacentGuideLessons(slug);
  const LessonIcon = lesson.icon;

  return (
    <div className="bg-bg text-text">
      <article>
        <header className="border-b px-4 py-10 sm:px-6 sm:py-14 lg:px-8" style={{ borderColor: 'var(--color-border)' }}>
          <div className="mx-auto max-w-5xl">
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted" aria-label="Breadcrumb">
              <Link to="/guides" className="inline-flex items-center gap-1 font-semibold transition-colors hover:text-primary">
                <Home size={14} />
                Cẩm nang AI
              </Link>
              <ChevronRight size={14} className="text-text-light" />
              <span className="font-semibold text-text">{lesson.title}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <NumberStamp lesson={lesson} />
                  <span
                    className="inline-flex px-3 py-1.5 text-xs font-bold"
                    style={{ backgroundColor: accentSoft[lesson.accent], color: accentText[lesson.accent] }}
                  >
                    {lesson.tag}
                  </span>
                  <span className="text-sm font-semibold text-text-light">{lesson.readTime}</span>
                </div>
                <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-text sm:text-5xl">
                  {lesson.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-text-muted sm:text-lg">{lesson.intro}</p>
              </div>

              <EditorialCard accent={lesson.accent} className="p-5">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center border"
                  style={{
                    backgroundColor: accentSoft[lesson.accent],
                    borderColor: 'var(--color-border-strong)',
                    color: accentText[lesson.accent],
                  }}
                >
                  <LessonIcon size={23} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-light">Mục tiêu bài học</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-text">{lesson.goal}</p>
              </EditorialCard>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
            <div className="space-y-8">
              {lesson.sections.map((section, index) => (
                <section key={section.heading} className="border bg-bg-card p-5 shadow-card sm:p-7" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center font-mono text-xs font-bold"
                      style={{ backgroundColor: accentSoft[lesson.accent], color: accentText[lesson.accent] }}
                    >
                      {index + 1}
                    </span>
                    <h2 className="font-display text-2xl font-bold leading-tight text-text">{section.heading}</h2>
                  </div>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-text-muted sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 border bg-bg-muted p-3 text-sm leading-6 text-text-muted" style={{ borderColor: 'var(--color-border)' }}>
                          <SearchCheck className="mt-0.5 shrink-0 text-primary" size={16} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {lesson.examplePrompt && (
                <section className="paper-surface border p-5 shadow-card sm:p-7" style={{ borderColor: 'var(--color-border-strong)' }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-light">{lesson.examplePrompt.label}</p>
                  <p className="mt-4 text-sm font-semibold leading-8 text-text sm:text-base">"{lesson.examplePrompt.content}"</p>
                </section>
              )}

              {lesson.callout && (
                <section
                  className="border-l-4 px-5 py-5 shadow-card sm:px-7"
                  style={{
                    backgroundColor: 'var(--color-accent-light)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text)',
                  }}
                >
                  <h2 className="font-display text-xl font-bold leading-tight">{lesson.callout.title}</h2>
                  <p className="mt-3 text-sm font-semibold leading-7">{lesson.callout.body}</p>
                </section>
              )}

              <section className="border bg-bg-card p-5 shadow-card sm:p-7" style={{ borderColor: 'var(--color-border)' }}>
                <SectionHeading eyebrow="Ghi nhớ" title="Key takeaways" description="Ba ý ngắn để bạn tự kiểm tra sau khi đọc xong bài này." />
                <ul className="mt-7 grid gap-3">
                  {lesson.takeaways.map((takeaway) => (
                    <li key={takeaway} className="flex items-start gap-3 text-sm leading-7 text-text-muted">
                      <span
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: accentSoft[lesson.accent], color: accentText[lesson.accent] }}
                      >
                        <SearchCheck size={12} />
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <Link to="/guides" className="btn-outline w-full justify-center gap-2">
                <ArrowLeft size={15} />
                Về Cẩm nang
              </Link>
              <div className="border bg-bg-card p-4 shadow-card" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-light">Bài học</p>
                <p className="mt-2 font-display text-2xl font-bold text-text">
                  {String(lesson.number).padStart(2, '0')}/{guideLessons.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-muted">{lesson.cardDescription}</p>
              </div>
            </aside>
          </div>

          <nav className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Điều hướng bài học">
            {previous ? (
              <Link to={`/guides/${previous.slug}`} className="card-soft-hover flex min-h-32 flex-col justify-between p-5">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-text-muted">
                  <ArrowLeft size={15} />
                  Bài trước
                </span>
                <span className="mt-3 font-display text-lg font-bold leading-tight text-text">{previous.title}</span>
              </Link>
            ) : (
              <div className="border bg-bg-muted p-5 text-sm text-text-light" style={{ borderColor: 'var(--color-border)' }}>
                Đây là bài đầu tiên trong mini-course.
              </div>
            )}

            {next ? (
              <Link to={`/guides/${next.slug}`} className="card-soft-hover flex min-h-32 flex-col justify-between p-5 text-right">
                <span className="inline-flex items-center justify-end gap-2 text-sm font-bold text-text-muted">
                  Bài tiếp theo
                  <ArrowRight size={15} />
                </span>
                <span className="mt-3 font-display text-lg font-bold leading-tight text-text">{next.title}</span>
              </Link>
            ) : (
              <div className="border bg-bg-muted p-5 text-right text-sm text-text-light" style={{ borderColor: 'var(--color-border)' }}>
                Bạn đã đọc tới bài cuối. Đẹp rồi, giờ thử thực hành thôi.
              </div>
            )}
          </nav>

          <section className="mt-12">
            <CTASection
              title="Thử biến bài học này thành hành động"
              description="Mở công cụ AI để luyện prompt, hoặc xem Kho Prompt để tham khảo cách hỏi rõ hơn. Nhớ kiểm chứng và tự làm lại trước khi dùng kết quả."
              primaryAction={
                <Link to="/ai-tools" className="btn-primary gap-2">
                  <Sparkles size={16} />
                  Mở Công Cụ AI
                </Link>
              }
              secondaryAction={
                <Link to="/prompts" className="btn-outline gap-2">
                  <NotebookPen size={16} />
                  Xem Kho Prompt
                </Link>
              }
            />
          </section>
        </main>
      </article>
    </div>
  );
}
