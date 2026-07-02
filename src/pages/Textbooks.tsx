import { useState } from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { textbooks, bookSeries, grades } from '../data/educationData';
import Modal from '../components/Modal';

type TextbookItem = (typeof textbooks)[number];

export default function Textbooks() {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState<TextbookItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState('');

  const selectedGradeLabel = grades.find((g) => g.value === selectedGrade)?.label || '';
  const filteredTextbooks = textbooks.filter((book) => book.grade.toString() === selectedGrade);
  const groupedBySeries = bookSeries.map((series) => ({
    ...series,
    books: filteredTextbooks.filter((book) => book.series === series.label),
  }));

  function openModal(book: TextbookItem, seriesLabel: string) {
    setSelectedBook(book);
    setSelectedSeries(seriesLabel);
  }

  function closeModal() {
    setSelectedBook(null);
    setSelectedSeries('');
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Header */}
      <div
        className="border-b py-12"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-4 inline-flex">Tài Nguyên</span>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl mt-1"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}
          >
            Sách <span style={{ color: 'var(--color-primary)' }}>Giáo Khoa</span>
          </h1>
          <p className="text-base mt-3 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
            Danh mục sách giáo khoa chương trình mới — 3 bộ sách, 3 khối lớp.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Grade selector */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-light)', letterSpacing: '0.12em' }}>
            Khối lớp
          </span>
          <div className="flex gap-0" style={{ border: '1px solid var(--color-border)' }}>
            {grades.map((grade, i) => (
              <button
                key={grade.value}
                onClick={() => setSelectedGrade(grade.value)}
                className="px-5 py-2.5 text-sm font-semibold transition-all duration-150"
                style={{
                  backgroundColor: selectedGrade === grade.value ? 'var(--color-primary)' : 'transparent',
                  color: selectedGrade === grade.value ? '#ffffff' : 'var(--color-text-muted)',
                  borderRight: i < grades.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </div>

        {/* Book series groups */}
        <div className="space-y-12">
          {groupedBySeries.map((series) => (
            <section key={series.value}>
              {/* Series header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-6"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
                >
                  {series.label}
                </h2>
                <span
                  className="text-xs px-2 py-0.5 font-medium"
                  style={{
                    backgroundColor: 'var(--color-bg-muted)',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {series.books.length} sách
                </span>
                <ChevronRight size={16} style={{ color: 'var(--color-text-light)' }} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {series.books.map((book, index) => (
                  <button
                    key={`${book.subject}-${series.value}-${index}`}
                    type="button"
                    onClick={() => openModal(book, series.label)}
                    className="group text-left cursor-pointer outline-none focus:ring-2 overflow-hidden transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                      (e.currentTarget as HTMLElement).style.transform = '';
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                    }}
                  >
                    {/* Cover image */}
                    <div
                      className="aspect-[3/4] relative overflow-hidden"
                      style={{ backgroundColor: 'var(--color-bg-muted)' }}
                    >
                      <img
                        src={book.cover}
                        alt={`${book.subject} ${selectedGradeLabel}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#ffffff',
                        }}
                      >
                        {selectedGradeLabel}
                      </div>
                      <div
                        className="absolute bottom-0 left-0 right-0 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                      >
                        <span className="text-white text-xs font-medium">Xem PDF</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Book size={11} style={{ color: 'var(--color-primary)' }} />
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                          {series.label}
                        </span>
                      </div>
                      <h3
                        className="font-display font-bold text-sm line-clamp-1"
                        style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
                      >
                        {book.subject}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                        {selectedGradeLabel}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

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
      <Modal isOpen={!!selectedBook} onClose={closeModal} size="lg">
        {selectedBook && (
          <>
            <div
              className="p-6 sm:p-8 pr-14"
              style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
            >
              <h2
                className="font-display font-bold text-xl sm:text-2xl"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
              >
                {selectedBook.subject}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="tag tag-primary">Bộ sách: {selectedSeries}</span>
                <span className="tag">Khối lớp: {selectedGradeLabel}</span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
                {selectedBook.subject} — {selectedSeries} — Chương trình GDPT 2018
              </p>
            </div>

            <div
              className="p-6 sm:p-8 overflow-y-auto flex-1"
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              <iframe
                src={selectedBook.pdfUrl}
                title={`PDF ${selectedBook.subject}`}
                className="w-full h-[70vh] border-0"
                style={{ backgroundColor: 'var(--color-bg-muted)' }}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
