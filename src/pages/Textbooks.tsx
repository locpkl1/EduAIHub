import { useEffect, useMemo, useState } from 'react';
import { Book, BookOpen, Check, ChevronRight, Copy, ExternalLink, FileText, Sparkles } from 'lucide-react';
import {
  DEFAULT_BOOK_SERIES,
  textbooks,
  bookSeries,
  grades,
  isTargetBookSeries,
} from '../data/educationData';
import { resolveCurriculumSubject } from '../data/curriculumData';
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
  const [selectedGrade, setSelectedGrade] = useState('11');
  const [learningResources, setLearningResources] = useState<PublishedLearningResource[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [publicError, setPublicError] = useState(false);
  const [curriculumSubjectFilter, setCurriculumSubjectFilter] = useState('all');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const selectedGradeLabel = grades.find((g) => g.value === selectedGrade)?.label || '';
  const filteredTextbooks = textbooks.filter(
    (book) => book.grade.toString() === selectedGrade && isTargetBookSeries(book.series)
  );
  const groupedBySeries = bookSeries.map((series) => ({
    ...series,
    books: filteredTextbooks,
  }));
  const subjectCount = new Set(filteredTextbooks.map((book) => book.subject)).size;
  const shelfStats = [
    { value: '3', label: 'khối lớp THPT' },
    { value: '1', label: 'bộ sách thống nhất' },
    { value: `${subjectCount}`, label: `môn học ${selectedGradeLabel}` },
    { value: 'AI', label: 'ngữ cảnh học tập' },
  ];
  const mathGrade11Curriculum = resolveCurriculumSubject({ grade: 11, subjectKey: 'toan' });
  const showsMathGrade11 = selectedGrade === '11'
    && (curriculumSubjectFilter === 'all' || curriculumSubjectFilter === 'Toán học');
  const controlledCurriculumGroups = useMemo<CurriculumGroup[]>(() => {
    if (!showsMathGrade11 || mathGrade11Curriculum?.dataStatus !== 'verified') return [];
    return (mathGrade11Curriculum.knowledgeAreas ?? []).map((area) => ({
      book_series: mathGrade11Curriculum.textbookSeries,
      subject: mathGrade11Curriculum.subject,
      chapter_title: area.title,
      isKnowledgeArea: true,
      items: area.topics.map((topic) => ({
        id: topic.id,
        lesson_title: topic.title,
        description: null,
        suggested_prompt: null,
      })),
    }));
  }, [mathGrade11Curriculum, showsMathGrade11]);
  const curriculumGroups = controlledCurriculumGroups;
  const curriculumSubjectOptions = useMemo(
    () => selectedGrade === '11' ? ['Toán học'] : [],
    [selectedGrade]
  );
  const filteredResources = useMemo(
    () =>
      learningResources.filter((resource) => {
        const matchesGrade = resource.grade === null || resource.grade.toString() === selectedGrade;
        const matchesSeries = !resource.book_series || isTargetBookSeries(resource.book_series);
        const safeUrl = getSafeResourceUrl(resource);
        const duplicatesLocalTextbook = safeUrl ? isLocalTextbookFileUrl(safeUrl) : false;
        return matchesGrade && matchesSeries && Boolean(safeUrl) && !duplicatesLocalTextbook;
      }),
    [learningResources, selectedGrade]
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

  useEffect(() => {
    setCurriculumSubjectFilter('all');
  }, [selectedGrade]);

  async function copySuggestedPrompt(item: CurriculumDisplayItem) {
    if (!item.suggested_prompt) return;
    try {
      await navigator.clipboard.writeText(item.suggested_prompt);
      setCopiedPromptId(item.id);
      setTimeout(() => setCopiedPromptId(null), 1800);
    } catch (error) {
      console.error('Error copying suggested prompt:', error);
    }
  }

  return (
    <div className="overflow-hidden" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <section
        className="relative border-b px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
          backgroundImage:
            'linear-gradient(to bottom, transparent 31px, color-mix(in srgb, var(--color-border) 28%, transparent) 32px)',
          backgroundSize: '100% 32px',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute left-6 top-6 hidden h-3 w-24 rotate-[-2deg] lg:block"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 28%, var(--color-bg-card))' }}
        />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="section-label mb-4 inline-flex">Bản đồ chương trình học</span>
            <h1 className="font-display text-4xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl">
              Ngữ cảnh học tập số
              <span className="block text-primary">cho học sinh THPT</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
              Bản đồ chương trình, tài nguyên học tập và ngữ cảnh theo lớp, môn học cho lớp 10, 11, 12.
              Chọn chủ đề học tập rồi dùng AI với bối cảnh rõ ràng hơn.
            </p>

            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {shelfStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="border px-3 py-3"
                  style={{
                    backgroundColor: index === 1 ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    boxShadow: index === 3 ? 'inset 0 -3px 0 color-mix(in srgb, var(--color-accent) 32%, transparent)' : 'none',
                  }}
                >
                  <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative hidden overflow-hidden border p-5 lg:block"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border-strong)',
              boxShadow: '10px 10px 0 color-mix(in srgb, var(--color-primary) 12%, transparent)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">Kệ sách đang xem</p>
                <p className="mt-1 font-display text-2xl font-bold text-text">{selectedGradeLabel}</p>
              </div>
              <BookOpen size={30} className="text-primary" />
            </div>
            <div className="mt-8 flex min-h-[210px] items-end gap-3 border-b-4 px-3" style={{ borderColor: 'var(--color-border-strong)' }}>
              {groupedBySeries.map((series, index) => (
                <div
                  key={series.value}
                  className="flex flex-1 flex-col justify-between border px-3 py-4"
                  style={{
                    height: `${156 + index * 22}px`,
                    backgroundColor:
                      index === 0 ? 'var(--color-primary)' : index === 1 ? 'var(--color-accent)' : 'var(--color-secondary)',
                    borderColor: 'var(--color-text)',
                    color: '#ffffff',
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">{series.books.length} môn học</span>
                  <span className="writing-mode-vertical font-display text-lg font-bold leading-tight [writing-mode:vertical-rl]">
                    {series.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section
          className="mb-10 border p-3 sm:p-4"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border-strong)',
            boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-accent) 10%, transparent)',
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-text-light">Chọn khối lớp</span>
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            {grades.map((grade) => (
              <button
                key={grade.value}
                type="button"
                onClick={() => setSelectedGrade(grade.value)}
                aria-pressed={selectedGrade === grade.value}
                className="relative min-h-11 border px-3 py-2.5 text-sm font-bold transition-all duration-150 sm:px-5"
                style={{
                  backgroundColor: selectedGrade === grade.value ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                  borderColor: selectedGrade === grade.value ? 'var(--color-text)' : 'var(--color-border)',
                  color: selectedGrade === grade.value ? '#ffffff' : 'var(--color-text-muted)',
                  boxShadow: selectedGrade === grade.value ? '3px 3px 0 color-mix(in srgb, var(--color-accent) 42%, transparent)' : 'none',
                }}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </section>

        {/* Book series groups */}
        <div className="space-y-10">
          {groupedBySeries.map((series) => (
            <section
              key={series.value}
              className="relative overflow-hidden border px-4 py-5 sm:px-5 lg:px-6"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 16px 38px -32px color-mix(in srgb, var(--color-text) 48%, transparent)',
              }}
            >
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-border-strong) 58%, transparent)' }}
              />
              <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-8 w-1 shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">Danh mục môn học</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold leading-tight text-text">
                    {series.label}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                    {seriesDescriptions[series.value]}
                  </p>
                </div>
                <div
                  className="flex w-fit items-center gap-2 border px-3 py-2 text-xs font-bold text-primary"
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
                      className="group flex min-w-0 flex-col overflow-hidden border bg-bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div
                        className="relative overflow-hidden border-b p-4"
                        style={{
                          backgroundColor: 'var(--color-bg-muted)',
                          borderColor: 'var(--color-border)',
                          backgroundImage:
                            'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-light) 72%, transparent) 0 38%, transparent 38% 100%), radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-border) 48%, transparent) 1px, transparent 0)',
                          backgroundSize: '100% 100%, 18px 18px',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 top-0 w-1.5"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        />
                        <div className="flex items-start justify-between gap-3 pl-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                              {book.subject}
                            </p>
                            <h3 className="mt-2 font-display text-lg font-extrabold leading-tight text-text">
                              {book.subject === 'Toán học' ? 'Toán' : book.subject} {selectedGrade}
                            </h3>
                          </div>
                          <span
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border"
                            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
                          >
                            {hasLocalBooks ? (
                              <FileText size={18} className="text-primary" />
                            ) : (
                              <Book size={18} className="text-text-light" />
                            )}
                          </span>
                        </div>
                        <p className="mt-4 line-clamp-2 pl-2 text-[10px] font-semibold leading-4 text-text-light">
                          {series.label}
                        </p>
                      </div>

                      <div className="flex flex-1 flex-col p-3">
                        {hasLocalBooks ? (
                          <div className="space-y-2" aria-label={`Tài liệu ${book.subject} ${selectedGradeLabel}`}>
                            {localBooks.map((localBook) => (
                              <div
                                key={localBook.fileUrl}
                                className="border p-3"
                                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                              >
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span
                                    className="border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary"
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
                                <a
                                  href={localBook.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border px-3 text-xs font-extrabold transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#ffffff' }}
                                  aria-label={`Xem ${localBook.title}${localBook.volume ? ` ${localBook.volume}` : ''}`}
                                >
                                  Xem sách
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="flex min-h-24 flex-1 items-center border border-dashed px-3 py-4"
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

        <CurriculumMapSection
          loading={publicLoading}
          hasError={publicError}
          selectedGradeLabel={selectedGradeLabel}
          subjectOptions={curriculumSubjectOptions}
          subjectFilter={curriculumSubjectFilter}
          groups={curriculumGroups}
          pendingOfficialData={showsMathGrade11 && mathGrade11Curriculum?.dataStatus === 'official-data-required'}
          copiedPromptId={copiedPromptId}
          onSubjectChange={setCurriculumSubjectFilter}
          onCopyPrompt={copySuggestedPrompt}
        />

        <LearningResourcesSection
          loading={publicLoading}
          selectedGradeLabel={selectedGradeLabel}
          resources={filteredResources}
          hasError={publicError}
        />

        {/* About section */}
        <div
          className="mt-14 p-7 border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <h2
            className="font-display font-bold text-lg mb-5"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
          >
            Phạm vi dữ liệu hiện tại
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {bookSeries.map((series) => (
              <div
                key={series.value}
                className="p-4 border"
                style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-1 h-4 mb-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <h3
                  className="font-display font-bold text-sm mb-2"
                  style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
                >
                  {series.label}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {series.value === 'ket_noi' &&
                    'Đa dạng hình thức học tập, kết nối kiến thức với thực tiễn Việt Nam và thế giới.'}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed mt-5" style={{ color: 'var(--color-text-light)' }}>
            EduAI-Hub hiện sử dụng thống nhất bộ {DEFAULT_BOOK_SERIES}. Chỉ nội dung đã được kiểm soát mới xuất hiện trong bản đồ; các phần còn thiếu được hiển thị bằng trạng thái đang cập nhật.
          </p>
        </div>
      </div>

    </div>
  );
}
type CurriculumDisplayItem = {
  id: string;
  lesson_title: string | null;
  description: string | null;
  suggested_prompt: string | null;
};

type CurriculumGroup = {
  book_series: string;
  subject: string;
  chapter_title: string;
  isKnowledgeArea?: boolean;
  items: CurriculumDisplayItem[];
};

const resourceTypeLabels: Record<PublishedLearningResource['resource_type'], string> = {
  link: 'Link',
  pdf: 'PDF',
  image: 'Hình ảnh',
  document: 'Tài liệu',
  other: 'Khác',
};

function CurriculumMapSection({
  loading,
  hasError,
  selectedGradeLabel,
  subjectOptions,
  subjectFilter,
  groups,
  pendingOfficialData,
  copiedPromptId,
  onSubjectChange,
  onCopyPrompt,
}: {
  loading: boolean;
  hasError: boolean;
  selectedGradeLabel: string;
  subjectOptions: string[];
  subjectFilter: string;
  groups: CurriculumGroup[];
  pendingOfficialData: boolean;
  copiedPromptId: string | null;
  onSubjectChange: (value: string) => void;
  onCopyPrompt: (item: CurriculumDisplayItem) => void;
}) {
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);

  useEffect(() => {
    setExpandedGroupKey(null);
  }, [selectedGradeLabel, subjectFilter]);

  return (
    <section
      className="mb-10 mt-12 border p-4 sm:p-5"
      style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="section-label mb-3 inline-flex">Ghi chú học tập</span>
          <h2 className="font-display text-2xl font-bold text-text">
            Ngữ cảnh học tập cho {selectedGradeLabel}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Xem mảng kiến thức và chủ đề đã được kiểm soát để dùng AI với ngữ cảnh rõ ràng hơn.
          </p>
          {groups.some((group) => group.isKnowledgeArea) && (
            <p className="mt-3 border-l-2 border-primary pl-3 text-xs leading-5 text-text-light">
              Các mảng kiến thức là cách EduAI-Hub đơn giản hóa lựa chọn cho học sinh, không phải tên chương chính thức của SGK.
            </p>
          )}
        </div>

        <div className="w-full lg:w-64">
          <select
            value={subjectFilter}
            onChange={(event) => onSubjectChange(event.target.value)}
            className="min-h-11 w-full px-4 pr-10 text-sm font-medium outline-none"
            style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            aria-label="Lọc theo môn học"
          >
            <option value="all">Tất cả môn học</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pendingOfficialData && (
        <div
          className="mt-6 border-l-4 px-4 py-4 text-sm leading-6"
          style={{ backgroundColor: 'var(--color-accent-light)', borderColor: 'var(--color-accent)', color: 'var(--color-text-muted)' }}
        >
          <p className="font-bold text-text">Nội dung Toán 11 đang được cập nhật.</p>
          <p className="mt-1">Danh sách chưa được xác minh sẽ không xuất hiện tại đây.</p>
        </div>
      )}

      {loading ? (
        <div className="mt-6 border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }}>
          Đang tải bản đồ chương trình học...
        </div>
      ) : groups.length > 0 ? (
        <div className="mt-6 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const groupKey = `${group.book_series}-${group.subject}-${group.chapter_title}`;
            const isExpanded = expandedGroupKey === groupKey;

            return (
              <article
                key={groupKey}
                className="min-w-0 border p-4 sm:p-5"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: isExpanded ? 'var(--color-primary)' : 'var(--color-border)',
                  boxShadow: isExpanded ? '5px 5px 0 color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'none',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  {group.subject} · {selectedGradeLabel}
                </p>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3 className="min-w-0 font-display text-xl font-extrabold leading-snug text-text">
                    {group.chapter_title}
                  </h3>
                  <span className="shrink-0 border px-2.5 py-1 text-xs font-bold text-primary" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}>
                    {group.items.length} {group.isKnowledgeArea ? 'chủ đề' : 'bài học'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedGroupKey(isExpanded ? null : groupKey)}
                  aria-expanded={isExpanded}
                  className="mt-5 flex min-h-11 w-full items-center justify-between border px-4 text-sm font-bold transition-colors"
                  style={{
                    backgroundColor: isExpanded ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                    borderColor: isExpanded ? 'var(--color-primary)' : 'var(--color-border)',
                    color: isExpanded ? '#ffffff' : 'var(--color-primary)',
                  }}
                >
                  {isExpanded ? 'Đóng danh sách' : 'Xem chủ đề'}
                  <ChevronRight size={17} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                    <ol className="space-y-2">
                      {group.items.map((item, index) => {
                        const isCopied = copiedPromptId === item.id;
                        return (
                          <li key={item.id} className="border p-3" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                            <div className="flex items-start gap-3">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-extrabold text-primary">
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-display text-sm font-bold leading-6 text-text">
                                  {item.lesson_title || (group.isKnowledgeArea ? 'Chủ đề' : 'Mục học tập')}
                                </h4>
                                {item.description && <p className="mt-1 text-sm leading-6 text-text-muted">{item.description}</p>}
                              </div>
                            </div>
                            {item.suggested_prompt && (
                              <button
                                type="button"
                                onClick={() => onCopyPrompt(item)}
                                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border px-3 text-xs font-bold"
                                style={{ backgroundColor: isCopied ? 'var(--color-success)' : 'var(--color-primary)', borderColor: 'transparent', color: '#ffffff' }}
                              >
                                {isCopied ? <Check size={13} /> : <Copy size={13} />}
                                {isCopied ? 'Đã sao chép' : 'Sao chép prompt gợi ý'}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : !pendingOfficialData ? (
        <div className="mt-6 border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          {hasError
            ? 'Chưa tải được nội dung chương trình. Vui lòng thử lại sau.'
            : 'Nội dung chương trình cho lựa chọn này đang được cập nhật.'}
        </div>
      ) : null}
    </section>
  );
}

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
  return (
    <section
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
                className="flex h-full flex-col gap-4 border p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)' }}>
                      <FileText size={18} style={{ color: 'var(--color-primary)' }} />
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
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 border px-3 text-xs font-bold transition-all"
                      style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#ffffff' }}
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
            : 'Tài nguyên đã xác minh cho lựa chọn này đang được cập nhật.'}
        </div>
      )}
    </section>
  );
}
