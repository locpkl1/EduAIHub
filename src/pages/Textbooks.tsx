import { useEffect, useMemo, useState } from 'react';
import { Book, BookOpen, Check, ChevronRight, Copy, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { textbooks, bookSeries, grades } from '../data/educationData';
import Modal from '../components/Modal';
import {
  fetchPublishedCurriculumItems,
  fetchPublishedLearningResources,
  type PublishedCurriculumItem,
  type PublishedLearningResource,
} from '../lib/publicContentApi';

type TextbookItem = (typeof textbooks)[number];

const seriesDescriptions: Record<string, string> = {
  chan_troi: 'Một hàng sách giàu hoạt động thực hành, hợp với việc tự học và ghi chú theo dự án.',
  canh_dieu: 'Bộ sách gần gũi đời sống, dễ dùng để nối kiến thức trên lớp với ví dụ hằng ngày.',
  ket_noi: 'Tập trung kết nối kiến thức, bài học và tình huống thực tiễn để học sâu hơn cùng AI.',
};

export default function Textbooks() {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState<TextbookItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [curriculumItems, setCurriculumItems] = useState<PublishedCurriculumItem[]>([]);
  const [learningResources, setLearningResources] = useState<PublishedLearningResource[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [publicError, setPublicError] = useState(false);
  const [curriculumSeriesFilter, setCurriculumSeriesFilter] = useState('all');
  const [curriculumSubjectFilter, setCurriculumSubjectFilter] = useState('all');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const selectedGradeLabel = grades.find((g) => g.value === selectedGrade)?.label || '';
  const filteredTextbooks = textbooks.filter((book) => book.grade.toString() === selectedGrade);
  const groupedBySeries = bookSeries.map((series) => ({
    ...series,
    books: filteredTextbooks.filter((book) => book.series === series.label),
  }));
  const subjectCount = new Set(filteredTextbooks.map((book) => book.subject)).size;
  const shelfStats = [
    { value: '3', label: 'khối lớp THPT' },
    { value: '3', label: 'bộ sách chính' },
    { value: `${subjectCount}+`, label: `môn học ${selectedGradeLabel}` },
    { value: 'PDF', label: 'mở nhanh tài liệu' },
  ];
  const filteredCurriculumItems = useMemo(
    () =>
      curriculumItems.filter((item) => {
        const matchesGrade = item.grade.toString() === selectedGrade;
        const matchesSeries = curriculumSeriesFilter === 'all' || item.book_series === curriculumSeriesFilter;
        const matchesSubject = curriculumSubjectFilter === 'all' || item.subject === curriculumSubjectFilter;
        return matchesGrade && matchesSeries && matchesSubject;
      }),
    [curriculumItems, curriculumSeriesFilter, curriculumSubjectFilter, selectedGrade]
  );
  const groupedCurriculumItems = useMemo(() => {
    const groups = new Map<string, PublishedCurriculumItem[]>();
    filteredCurriculumItems.forEach((item) => {
      const key = `${item.book_series}||${item.subject}||${item.chapter_title}`;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    });
    return Array.from(groups.entries()).map(([key, items]) => {
      const [book_series, subject, chapter_title] = key.split('||');
      return { book_series, subject, chapter_title, items };
    });
  }, [filteredCurriculumItems]);
  const curriculumSeriesOptions = useMemo(
    () => Array.from(new Set(curriculumItems.filter((item) => item.grade.toString() === selectedGrade).map((item) => item.book_series))),
    [curriculumItems, selectedGrade]
  );
  const curriculumSubjectOptions = useMemo(
    () =>
      Array.from(
        new Set(
          curriculumItems
            .filter((item) => {
              const matchesGrade = item.grade.toString() === selectedGrade;
              const matchesSeries = curriculumSeriesFilter === 'all' || item.book_series === curriculumSeriesFilter;
              return matchesGrade && matchesSeries;
            })
            .map((item) => item.subject)
        )
      ),
    [curriculumItems, curriculumSeriesFilter, selectedGrade]
  );
  const filteredResources = useMemo(
    () =>
      learningResources.filter((resource) => {
        const matchesGrade = resource.grade === null || resource.grade.toString() === selectedGrade;
        return matchesGrade;
      }),
    [learningResources, selectedGrade]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPublicContent() {
      setPublicLoading(true);
      setPublicError(false);
      try {
        const [items, resources] = await Promise.all([
          fetchPublishedCurriculumItems(),
          fetchPublishedLearningResources(),
        ]);
        if (!cancelled) {
          setCurriculumItems(items);
          setLearningResources(resources);
        }
      } catch (error) {
        console.error('Error fetching public curriculum/resources:', error);
        if (!cancelled) {
          setCurriculumItems([]);
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
  }, [curriculumSeriesFilter, selectedGrade]);

  useEffect(() => {
    setCurriculumSeriesFilter('all');
  }, [selectedGrade]);

  function openModal(book: TextbookItem, seriesLabel: string) {
    setSelectedBook(book);
    setSelectedSeries(seriesLabel);
  }

  function closeModal() {
    setSelectedBook(null);
    setSelectedSeries('');
  }

  async function copySuggestedPrompt(item: PublishedCurriculumItem) {
    if (!item.suggested_prompt) return;
    try {
      await navigator.clipboard.writeText(item.suggested_prompt);
      setCopiedPromptId(item.id);
      setTimeout(() => setCopiedPromptId(null), 1800);
    } catch (error) {
      console.error('Error copying suggested prompt:', error);
    }
  }

  function openResource(resource: PublishedLearningResource) {
    const href = resource.external_url?.trim() || resource.file_url?.trim();
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
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
            <span className="section-label mb-4 inline-flex">Tủ sách học cùng AI</span>
            <h1 className="font-display text-4xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl">
              Tủ sách học tập số
              <span className="block text-primary">cho học sinh THPT</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
              Sách giáo khoa, bản đồ chương trình và tài nguyên học tập cho lớp 10, 11, 12.
              Chọn bộ sách, mở PDF, rồi dùng AI với ngữ cảnh học tập rõ ràng hơn.
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">{series.books.length} sách</span>
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
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-text-light">Chọn kệ sách</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">Hàng sách</span>
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
                  {series.books.length} sách {selectedGradeLabel}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {series.books.map((book, index) => (
                  <button
                    key={`${selectedGrade}-${book.subject}-${series.value}-${index}`}
                    type="button"
                    onClick={() => openModal(book, series.label)}
                    className="group flex min-w-0 cursor-pointer flex-col overflow-hidden border bg-bg-card p-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover focus-visible:-translate-y-0.5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <TextbookCover book={book} gradeLabel={selectedGradeLabel} seriesLabel={series.label} />

                    <div className="flex flex-1 flex-col p-3">
                      <div className="mb-1 flex min-w-0 items-center gap-1">
                        <Book size={11} className="shrink-0" style={{ color: 'var(--color-primary)' }} />
                        <span className="truncate text-[10px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                          {series.label}
                        </span>
                      </div>
                      <h3
                        className="font-display font-bold text-sm line-clamp-1"
                        style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
                      >
                        {book.subject}
                      </h3>
                      <div className="mt-4 flex min-h-10 items-center justify-between gap-3 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                        <span className="text-xs font-semibold text-text-light">{selectedGradeLabel}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                          Mở PDF
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <CurriculumMapSection
          loading={publicLoading}
          hasError={publicError}
          selectedGradeLabel={selectedGradeLabel}
          seriesOptions={curriculumSeriesOptions}
          subjectOptions={curriculumSubjectOptions}
          seriesFilter={curriculumSeriesFilter}
          subjectFilter={curriculumSubjectFilter}
          groups={groupedCurriculumItems}
          copiedPromptId={copiedPromptId}
          onSeriesChange={setCurriculumSeriesFilter}
          onSubjectChange={setCurriculumSubjectFilter}
          onCopyPrompt={copySuggestedPrompt}
        />

        <LearningResourcesSection
          loading={publicLoading}
          selectedGradeLabel={selectedGradeLabel}
          resources={filteredResources}
          onOpenResource={openResource}
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
            Chương trình sách giáo khoa mới 2018
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
                  {series.value === 'chan_troi' &&
                    'Tập trung phát triển năng lực người học với nhiều hoạt động thực tiễn và dự án học tập.'}
                  {series.value === 'canh_dieu' &&
                    'Thiết kế hiện đại, gần gũi với đời sống, chú trọng phát triển tư duy sáng tạo.'}
                  {series.value === 'ket_noi' &&
                    'Đa dạng hình thức học tập, kết nối kiến thức với thực tiễn Việt Nam và thế giới.'}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed mt-5" style={{ color: 'var(--color-text-light)' }}>
            Chương trình GDPT 2018 áp dụng từ năm học 2020-2021 với 3 bộ sách được cấp phép bởi Bộ GD&ĐT.
            Tập trung phát triển năng lực và phẩm chất người học, tăng cường hoạt động thực hành.
          </p>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedBook} onClose={closeModal} size="xl">
        {selectedBook && (
          <>
            <div
              className="p-4 pr-14 sm:p-6 sm:pr-16"
              style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border"
                  style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                >
                  <BookOpen size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">Tài liệu PDF</p>
                  <h2 className="mt-1 font-display text-xl font-bold leading-tight text-text sm:text-2xl">
                    {selectedBook.subject}
                  </h2>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="tag tag-primary">Bộ sách: {selectedSeries}</span>
                <span className="tag">Khối lớp: {selectedGradeLabel}</span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
                {selectedBook.subject} — {selectedSeries} — Chương trình GDPT 2018
              </p>
            </div>

            <div
              className="flex-1 overflow-y-auto p-3 sm:p-5"
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              <iframe
                src={selectedBook.pdfUrl}
                title={`PDF ${selectedBook.subject}`}
                className="h-[62dvh] min-h-[18rem] w-full border-0 sm:h-[70dvh]"
                style={{ backgroundColor: 'var(--color-bg-muted)' }}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

type CurriculumGroup = {
  book_series: string;
  subject: string;
  chapter_title: string;
  items: PublishedCurriculumItem[];
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
  seriesOptions,
  subjectOptions,
  seriesFilter,
  subjectFilter,
  groups,
  copiedPromptId,
  onSeriesChange,
  onSubjectChange,
  onCopyPrompt,
}: {
  loading: boolean;
  hasError: boolean;
  selectedGradeLabel: string;
  seriesOptions: string[];
  subjectOptions: string[];
  seriesFilter: string;
  subjectFilter: string;
  groups: CurriculumGroup[];
  copiedPromptId: string | null;
  onSeriesChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onCopyPrompt: (item: PublishedCurriculumItem) => void;
}) {
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
            Chọn lớp, bộ sách, môn học, chương và bài học để có prompt gợi ý học cùng AI đúng ngữ cảnh.
          </p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-[28rem]">
          <select
            value={seriesFilter}
            onChange={(event) => onSeriesChange(event.target.value)}
            className="min-h-11 px-4 pr-10 text-sm font-medium outline-none"
            style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            aria-label="Lọc theo bộ sách"
          >
            <option value="all">Tất cả bộ sách</option>
            {seriesOptions.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={(event) => onSubjectChange(event.target.value)}
            className="min-h-11 px-4 pr-10 text-sm font-medium outline-none"
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

      {loading ? (
        <div className="mt-6 border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }}>
          Đang tải bản đồ chương trình học...
        </div>
      ) : groups.length > 0 ? (
        <div className="mt-6 space-y-4">
          {groups.map((group) => (
            <article
              key={`${group.book_series}-${group.subject}-${group.chapter_title}`}
              className="border p-4"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    {group.book_series} · {group.subject}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {group.chapter_title}
                  </h3>
                </div>
                <span className="border px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
                  {group.items.length} bài học
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {group.items.map((item) => {
                  const isCopied = copiedPromptId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="border p-3"
                      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="font-display text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                            {item.lesson_title || 'Mục học tập'}
                          </h4>
                          {item.description && (
                            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.suggested_prompt && (
                          <button
                            type="button"
                            onClick={() => onCopyPrompt(item)}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border px-3 text-xs font-bold transition-all"
                            style={{
                              backgroundColor: isCopied ? 'var(--color-success)' : 'var(--color-primary)',
                              borderColor: isCopied ? 'var(--color-success)' : 'var(--color-primary)',
                              color: '#ffffff',
                            }}
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                            {isCopied ? 'Đã sao chép' : 'Sao chép prompt gợi ý'}
                          </button>
                        )}
                      </div>
                      {item.suggested_prompt && (
                        <p
                          className="mt-3 border-l-2 px-3 py-2 text-xs leading-relaxed line-clamp-3"
                          style={{
                            backgroundColor: 'var(--color-bg-muted)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {item.suggested_prompt}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          {hasError
            ? 'Chưa tải được bản đồ chương trình học từ EduAI-Hub. Bạn vẫn có thể xem danh mục tĩnh bên dưới.'
            : 'Chưa có mục chương trình đã xuất bản cho lựa chọn này. Danh mục tĩnh bên dưới vẫn sẵn sàng để tham khảo.'}
        </div>
      )}
    </section>
  );
}

function LearningResourcesSection({
  loading,
  selectedGradeLabel,
  resources,
  onOpenResource,
}: {
  loading: boolean;
  selectedGradeLabel: string;
  resources: PublishedLearningResource[];
  onOpenResource: (resource: PublishedLearningResource) => void;
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
            const hasLink = Boolean(resource.external_url?.trim() || resource.file_url?.trim());
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
                        {[resource.subject, resource.grade ? `Lớp ${resource.grade}` : null, resource.book_series].filter(Boolean).join(' · ') || 'Tài nguyên chung'}
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
                  <button
                    type="button"
                    onClick={() => onOpenResource(resource)}
                    disabled={!hasLink}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border px-3 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#ffffff' }}
                  >
                    Mở tài nguyên
                    <ExternalLink size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border px-4 py-5 text-sm" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          Chưa có tài nguyên đã xuất bản cho lựa chọn này. Trang vẫn giữ danh mục chương trình tĩnh bên dưới để bạn tiếp tục tra cứu.
        </div>
      )}
    </section>
  );
}

function TextbookCover({
  book,
  gradeLabel,
  seriesLabel,
}: {
  book: TextbookItem;
  gradeLabel: string;
  seriesLabel: string;
}) {
  const [imageFailed, setImageFailed] = useState(!book.cover);
  const showImage = Boolean(book.cover) && !imageFailed;

  return (
    <div
      className="relative aspect-[3/4] overflow-hidden border"
      style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
    >
      {showImage ? (
        <img
          src={book.cover}
          alt={`${book.subject} ${seriesLabel} ${gradeLabel}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <FallbackBookCover subject={book.subject} seriesLabel={seriesLabel} />
      )}

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-2"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 88%, var(--color-text))' }}
      />
      <div
        className="absolute right-2 top-2 border px-2 py-1 text-[10px] font-bold"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 94%, transparent)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-primary)',
        }}
      >
        {gradeLabel}
      </div>
    </div>
  );
}

function FallbackBookCover({
  subject,
  seriesLabel,
}: {
  subject: string;
  seriesLabel: string;
}) {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-3 sm:p-4"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        backgroundImage:
          'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-light) 68%, transparent) 0 34%, transparent 34% 100%), radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-border) 48%, transparent) 1px, transparent 0)',
        backgroundSize: '100% 100%, 18px 18px',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-2"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
      <span
        aria-hidden="true"
        className="absolute right-3 top-11 h-10 w-10 rotate-6 border"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-accent) 42%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--color-accent-light) 70%, transparent)',
        }}
      />

      <div className="relative pl-3 pr-6">
        <p className="line-clamp-2 text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-text-light">
          {seriesLabel}
        </p>
        <h4 className="mt-4 font-display text-lg font-bold leading-tight text-text sm:text-xl">
          {subject}
        </h4>
      </div>

      <div className="relative flex items-end justify-between gap-3 pl-3">
        <span
          className="border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-primary)' }}
        >
          PDF
        </span>
        <Book size={24} style={{ color: 'var(--color-primary)' }} />
      </div>
    </div>
  );
}
