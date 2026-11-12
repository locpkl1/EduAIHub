import { useEffect, useMemo, useState } from 'react';
import { Book, ExternalLink, FileText, Sparkles } from 'lucide-react';
import {
  DEFAULT_BOOK_SERIES,
  textbooks,
  bookSeries,
  grades,
  isTargetBookSeries,
} from '../data/educationData';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StartLearningAction from '../components/StartLearningAction';
import {
  getLocalTextbooksForSubject,
  isLocalTextbookFileUrl,
} from '../data/localTextbookResources';
import {
  fetchPublishedLearningResources,
  type PublishedLearningResource,
} from '../lib/publicContentApi';
import { getSafeResourceUrl } from '../lib/resourceFiles';

const seriesDescriptions: Record<string, string> = {
  ket_noi: 'Bộ sách được dùng thống nhất làm ngữ cảnh học tập trong EduAI-Hub.',
};

export default function Textbooks() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGrade = grades.some(grade => grade.value === searchParams.get('grade')) ? searchParams.get('grade')! : '11';
  const [learningResources, setLearningResources] = useState<PublishedLearningResource[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [publicError, setPublicError] = useState(false);
  const availableSubjects = [...new Set(textbooks.filter(book => book.grade.toString() === selectedGrade && isTargetBookSeries(book.series)).map(book => book.subject))];
  const subjectFilter = availableSubjects.includes(searchParams.get('subject') || '') ? searchParams.get('subject')! : 'all';
  function updateFilters(grade: string, subject = 'all') {
    const next = new URLSearchParams(searchParams);
    next.set('grade', grade);
    if (subject === 'all') next.delete('subject'); else next.set('subject', subject);
    setSearchParams(next, { state: { preserveDocumentScroll: { x: scrollX, y: scrollY } } });
  }

  const selectedGradeLabel = grades.find((g) => g.value === selectedGrade)?.label || '';
  const filteredTextbooks = textbooks.filter(
    (book) => book.grade.toString() === selectedGrade && isTargetBookSeries(book.series) && (subjectFilter === 'all' || book.subject === subjectFilter)
  );
  const groupedBySeries = bookSeries.map((series) => ({
    ...series,
    books: filteredTextbooks,
  }));
  const subjectOptions = [...new Set(textbooks.filter(book => book.grade.toString() === selectedGrade && isTargetBookSeries(book.series)).map(book => book.subject))];
  const filteredResources = useMemo(
    () =>
      learningResources.filter((resource) => {
        const matchesGrade = resource.grade === null || resource.grade.toString() === selectedGrade;
        const matchesSeries = !resource.book_series || isTargetBookSeries(resource.book_series);
        const safeUrl = getSafeResourceUrl(resource);
        const duplicatesLocalTextbook = safeUrl ? isLocalTextbookFileUrl(safeUrl) : false;
        const matchesSubject = subjectFilter === 'all' || !resource.subject || resource.subject === subjectFilter;
        return matchesGrade && matchesSeries && matchesSubject && Boolean(safeUrl) && !duplicatesLocalTextbook;
      }),
    [learningResources, selectedGrade, subjectFilter]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPublicContent() {
      setPublicLoading(true);
      setPublicError(false);
      try {
        const resources = await fetchPublishedLearningResources();
        if (!cancelled) {
          setLearningResources(resources);
        }
      } catch {
        if (!cancelled) {
          setLearningResources([]);
          setPublicError(true);
        }
      } finally {
        if (!cancelled) setPublicLoading(false);
      }
    }

    loadPublicContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-w-0" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="page-header"><div className="page-container"><h1 className="page-title">Tài nguyên học tập</h1><p className="page-intro">Chọn lớp, môn để tìm danh mục sách và các nguồn tham khảo đang có.</p></div></header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {!user && <aside className="mb-6 border-y border-border py-5" aria-label="Xem trước tài nguyên"><h2 className="text-lg font-bold">Bạn đang xem trước danh mục</h2><p className="mt-2 mb-4 max-w-2xl text-sm leading-7 text-text-muted">Bạn có thể chọn lớp và môn để xem học liệu đang có. Đăng nhập để mở sách PDF và các nguồn tài liệu; bộ lọc sẽ được giữ khi bạn quay lại.</p><StartLearningAction loginLabel="Đăng nhập để mở học liệu" /></aside>}
        <section
          className="mb-6 rounded-card border p-3 sm:p-4"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border-strong)',
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
            <span className="text-sm font-semibold text-text-muted">Chọn khối lớp</span>
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            {grades.map((grade) => (
              <button
                key={grade.value}
                type="button"
                onClick={() => updateFilters(grade.value)}
                aria-pressed={selectedGrade === grade.value}
                className="relative min-h-11 rounded-control border px-3 py-2.5 text-sm font-bold transition-colors duration-150 sm:px-5"
                style={{
                  backgroundColor: selectedGrade === grade.value ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                  borderColor: selectedGrade === grade.value ? 'var(--color-text)' : 'var(--color-border)',
                  color: selectedGrade === grade.value ? 'var(--foreground-on-primary)' : 'var(--color-text-muted)',
                }}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label htmlFor="resource-subject" className="text-sm font-semibold">Lọc theo môn học</label>
          <select id="resource-subject" value={subjectFilter} onChange={event => updateFilters(selectedGrade, event.target.value)} className="input-field w-full sm:w-64">
            <option value="all">Tất cả môn học</option>{subjectOptions.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </div>
        <nav aria-label="Các phần tài nguyên" className="mb-6 flex flex-wrap gap-3"><Link className="btn-outline" to={{ search: searchParams.toString(), hash: '#danh-muc-hoc-tap' }}>Danh mục học tập</Link><Link className="btn-outline" to={{ search: searchParams.toString(), hash: '#tai-nguyen-hoc-tap' }}>Tài nguyên học tập</Link></nav>

        {/* Book series groups */}
        <div id="danh-muc-hoc-tap" className="space-y-10">
          {groupedBySeries.map((series) => (
            <section
              key={series.value}
              className="border-t border-border py-6"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-8 w-1 shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                    <span className="text-xs font-semibold text-text-light">Danh mục môn học</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold leading-tight text-text">
                    Danh mục học tập
                  </h2>
                  <p className="mt-2 text-base font-semibold">{series.label}</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                    {seriesDescriptions[series.value]}
                  </p>
                </div>
                <div
                  className="flex w-fit items-center gap-2 border px-3 py-2 text-xs font-bold text-primary-text"
                  style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}
                >
                  <Book size={14} />
                  {series.books.length} môn {selectedGradeLabel}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {series.books.map((book, index) => {
                  const localBooks = getLocalTextbooksForSubject(selectedGrade, book.subject);
                  const hasLocalBooks = localBooks.length > 0;

                  return (
                    <article
                      key={`${selectedGrade}-${book.subject}-${series.value}-${index}`}
                      className="group flex min-w-0 flex-col rounded-card border bg-bg-card"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div
                        className="relative overflow-hidden border-b p-4"
                        style={{
                          backgroundColor: 'var(--color-bg-muted)',
                          borderColor: 'var(--color-border)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 ">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-primary-text">
                              {book.subject}
                            </p>
                            <h3 className="mt-2 font-display text-lg font-bold leading-tight text-text">
                              {book.subject === 'Toán học' ? 'Toán' : book.subject} {selectedGrade}
                            </h3>
                          </div>
                          <span
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border"
                            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
                          >
                            {hasLocalBooks ? (
                              <FileText size={18} className="text-primary-text" />
                            ) : (
                              <Book size={18} className="text-text-light" />
                            )}
                          </span>
                        </div>
                        <p className="mt-4 line-clamp-2 pl-2 text-xs font-medium leading-4 text-text-light">
                          {series.label}
                        </p>
                      </div>

                      <div className="flex flex-1 flex-col p-3">
                        {hasLocalBooks ? (
                          <div className="space-y-2" aria-label={`Tài liệu ${book.subject} ${selectedGradeLabel}`}>
                            {localBooks.map((localBook) => (
                              <div
                                key={localBook.fileUrl}
                                className="border-t border-border py-3"
                                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                              >
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span
                                    className="border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-text"
                                    style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}
                                  >
                                    PDF
                                  </span>
                                  {localBook.volume && (
                                    <span className="text-[10px] font-bold text-text-light">
                                      {localBook.volume}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-text">
                                  {localBook.title}
                                </p>
                                {user ? <a
                                  href={localBook.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border px-3 text-xs font-bold transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'var(--foreground-on-primary)' }}
                                  aria-label={`Xem ${localBook.title}${localBook.volume ? ` ${localBook.volume}` : ''}`}
                                >
                                  Xem sách
                                  <ExternalLink size={13} />
                                </a> : <div className="mt-3"><StartLearningAction loginLabel="Đăng nhập để xem sách" className="w-full px-2 text-xs" /></div>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="flex flex-1 items-center px-3 py-4"
                            style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
                          >
                            <p className="text-xs font-semibold leading-5 text-text-muted">
                              Tài liệu đang được cập nhật
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>



        <LearningResourcesSection
          loading={publicLoading}
          selectedGradeLabel={selectedGradeLabel}
          resources={filteredResources}
          hasError={publicError}
        />

        <p className="mt-8 text-sm leading-7 text-text-muted">Phạm vi học liệu: bộ {DEFAULT_BOOK_SERIES}. Dùng tài liệu gốc để đối chiếu các thông tin quan trọng.</p>
      </div>

    </div>
  );
}
const resourceTypeLabels: Record<PublishedLearningResource['resource_type'], string> = {
  link: 'Link',
  pdf: 'PDF',
  image: 'Hình ảnh',
  document: 'Tài liệu',
  other: 'Khác',
};

function LearningResourcesSection({
  loading,
  hasError,
  selectedGradeLabel,
  resources,
}: {
  loading: boolean;
  hasError: boolean;
  selectedGradeLabel: string;
  resources: PublishedLearningResource[];
}) {
  const { user } = useAuth();
  return (
    <section
      id="tai-nguyen-hoc-tap"
      className="mb-12 border p-4 sm:p-5"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-label mb-3 inline-flex">Tài nguyên học tập</span>
          <h2 className="font-display text-2xl font-bold text-text">
            Link nguồn chính thống và tài liệu hỗ trợ
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Tài nguyên được EduAI-Hub chọn lọc cho {selectedGradeLabel}, ưu tiên tự học chủ động và kiểm chứng thông tin.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }}>
          Đang tải tài nguyên học tập...
        </div>
      ) : resources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.slice(0, 6).map((resource) => {
            const href = getSafeResourceUrl(resource);
            return (
              <article
                key={resource.id}
                className="flex h-full flex-col gap-4 border p-5 transition-colors hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}>
                      <FileText size={18} style={{ color: 'var(--color-primary-text)' }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold leading-snug" style={{ color: 'var(--color-text)' }}>
                        {resource.title}
                      </h3>
                      <p className="mt-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                        {[
                          resource.subject,
                          resource.grade ? `Lớp ${resource.grade}` : null,
                          resource.book_series ? DEFAULT_BOOK_SERIES : null,
                        ].filter(Boolean).join(' · ') || 'Tài nguyên chung'}
                      </p>
                    </div>
                  </div>
                  {resource.featured && (
                    <span className="inline-flex shrink-0 items-center gap-1 border px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--color-accent-light)', borderColor: 'var(--color-border)', color: 'var(--color-accent)' }}>
                      <Sparkles size={11} />
                      Nổi bật
                    </span>
                  )}
                </div>

                {resource.description && (
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>
                    {resource.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="border px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    {resourceTypeLabels[resource.resource_type]}
                  </span>
                  {href && !user ? <StartLearningAction loginLabel="Đăng nhập để mở" className="px-3 text-xs" /> : href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 border px-3 text-xs font-bold transition-colors"
                      style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'var(--foreground-on-primary)' }}
                    >
                      {resource.resource_type === 'pdf' ? 'Xem tài liệu' : 'Mở tài nguyên'}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-text-light">Chưa có tài nguyên đính kèm</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          {hasError
            ? 'Chưa tải được tài nguyên học tập. Vui lòng thử lại sau.'
            : 'Chưa có tài nguyên phù hợp với lựa chọn này.'}
        </div>
      )}
    </section>
  );
}
