import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { lessons, tagColorMap, type Lesson } from './Lessons';

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lesson = lessons.find((l) => l.id === Number(id));

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4" style={{ color: 'var(--color-text-muted)' }}>
        <p className="text-lg font-semibold">Bài học không tồn tại.</p>
        <button
          type="button"
          onClick={() => navigate('/lessons')}
          className="btn-outline flex items-center gap-2 text-sm rounded-full"
        >
          <ArrowLeft size={14} />
          Về Bài Học
        </button>
      </div>
    );
  }

  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;

  // Related lessons: same tag first, then others, exclude current
  const related: Lesson[] = [
    ...lessons.filter((l) => l.id !== lesson.id && l.tag === lesson.tag),
    ...lessons.filter((l) => l.id !== lesson.id && l.tag !== lesson.tag),
  ].slice(0, 3);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Header */}
      <div
        className="border-b py-8"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/lessons')}
            className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors rounded-full px-3 py-1.5"
            style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={13} />
            Tất cả bài học
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon size={22} style={{ color: text }} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
                style={{ backgroundColor: bg, color: text }}
              >
                {lesson.tag}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-light)' }}>
                <Clock size={11} />
                {lesson.readTime} đọc
              </span>
            </div>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold leading-snug text-balance"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
          >
            {lesson.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{lesson.desc}</p>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Intro blockquote */}
        <blockquote
          className="text-base leading-relaxed italic mb-10 pl-5"
          style={{
            borderLeft: '3px solid var(--color-primary)',
            color: 'var(--color-text-muted)',
          }}
        >
          {lesson.content.intro}
        </blockquote>

        {/* Sections */}
        <div className="space-y-10">
          {lesson.content.sections.map((section, i) => (
            <article key={i} className="space-y-4">
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em', color: 'var(--color-text)' }}
              >
                {section.heading}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {section.body}
              </p>
              {section.tips && section.tips.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {section.tips.map((tip, ti) => (
                    <li
                      key={ti}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                        style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                      >
                        {ti + 1}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 h-px" style={{ backgroundColor: 'var(--color-border)' }} />

        {/* Related lessons */}
        {related.length > 0 && (
          <section>
            <h3
              className="text-base font-bold mb-5"
              style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em', color: 'var(--color-text)' }}
            >
              Bài học gợi ý tiếp theo
            </h3>
            <div className="space-y-3">
              {related.map((rel) => {
                const { bg: rBg, text: rText } = tagColorMap[rel.tagColor];
                const RelIcon = rel.icon;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => navigate(`/lessons/${rel.id}`)}
                    className="w-full text-left card-soft-hover flex items-center gap-4 p-4"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: rBg }}
                    >
                      <RelIcon size={16} style={{ color: rText }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full"
                          style={{ backgroundColor: rBg, color: rText }}
                        >
                          {rel.tag}
                        </span>
                        <span className="text-[11px]" style={{ color: 'var(--color-text-light)' }}>{rel.readTime}</span>
                      </div>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)', fontFamily: 'Syne, sans-serif' }}>
                        {rel.title}
                      </p>
                    </div>
                    <ChevronRight size={16} className="flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
