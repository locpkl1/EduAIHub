import { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';
import { bookSeries, grades, lessons, subjects } from '../../data/educationData';

function StudySidebar({
  selectedGrade,
  setSelectedGrade,
  selectedBook,
  setSelectedBook,
  selectedSubject,
  setSelectedSubject,
  selectedLesson,
  setSelectedLesson,
}: {
  selectedGrade: string;
  setSelectedGrade: (v: string) => void;
  selectedBook: string;
  setSelectedBook: (v: string) => void;
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  selectedLesson: string;
  setSelectedLesson: (v: string) => void;
}) {
  const availableLessons = selectedGrade && selectedSubject
    ? lessons[selectedGrade]?.[selectedSubject] || []
    : [];

  return (
    <div className="min-h-0 overflow-visible p-3 sm:p-4 lg:h-full lg:overflow-y-auto">
      <div
        className="mb-4 p-3 sm:p-4"
        style={{
          backgroundColor: 'var(--color-bg-muted)',
          borderLeft: '4px solid var(--color-primary)',
        }}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-text-light">
            Ngữ cảnh học
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-text-muted">
          Chọn lớp, sách, môn và bài để chatbot tạo prompt sát với việc học của bạn.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
            Lớp <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setSelectedGrade(g.value)}
                className="py-2 text-xs font-bold transition-colors"
                style={
                  selectedGrade === g.value
                    ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' }
                    : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)' }
                }
              >
                {g.value}
              </button>
            ))}
          </div>
        </div>

        <FieldLabel label="Bộ sách">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="input-field py-2 text-xs"
          >
            <option value="">Chọn bộ sách</option>
            {bookSeries.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </FieldLabel>

        <FieldLabel label="Môn học">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedLesson('');
            }}
            className="input-field py-2 text-xs"
          >
            <option value="">Chọn môn học</option>
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FieldLabel>

        <FieldLabel label="Bài học">
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            disabled={!selectedSubject || availableLessons.length === 0}
            className="input-field py-2 text-xs disabled:opacity-50"
          >
            <option value="">Chọn bài học</option>
            {availableLessons.map((lesson) => (
              <option key={lesson} value={lesson}>
                {lesson}
              </option>
            ))}
          </select>
        </FieldLabel>

        {selectedSubject && (
          <div
            className="mt-5 p-4"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              borderLeft: '3px solid var(--color-primary)',
            }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Đang dùng
            </p>
            <ul className="space-y-1 text-xs leading-5 text-text-muted">
              <li>
                Lớp: <span className="font-bold text-text">{selectedGrade}</span>
              </li>
              {selectedBook && (
                <li>
                  Sách:{' '}
                  <span className="font-bold text-text">
                    {bookSeries.find((b) => b.value === selectedBook)?.label}
                  </span>
                </li>
              )}
              <li>
                Môn:{' '}
                <span className="font-bold text-text">
                  {subjects.find((s) => s.value === selectedSubject)?.label}
                </span>
              </li>
              {selectedLesson && (
                <li>
                  Bài: <span className="font-bold text-text">{selectedLesson}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function StudyPromptChatbot() {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const subjectLabel = subjects.find((s) => s.value === selectedSubject)?.label || selectedSubject;
  const bookLabel = bookSeries.find((b) => b.value === selectedBook)?.label || '';

  const systemContext = [
    `Bạn là chatbot hướng dẫn tạo prompt học tập cho học sinh THPT Việt Nam.`,
    `Ngữ cảnh: Lớp ${selectedGrade}${bookLabel ? `, Bộ sách ${bookLabel}` : ''}${subjectLabel ? `, Môn ${subjectLabel}` : ''}${selectedLesson ? `, Bài: ${selectedLesson}` : ''}.`,
    `Nhiệm vụ: Tạo prompt học tập tối ưu theo đúng môn, lớp, bài. Giải thích tại sao prompt đó hiệu quả. Nếu người dùng cung cấp prompt yếu, hãy sửa và cải thiện nó.`,
  ].join('\n');

  const sidebar = (
    <StudySidebar
      selectedGrade={selectedGrade}
      setSelectedGrade={setSelectedGrade}
      selectedBook={selectedBook}
      setSelectedBook={setSelectedBook}
      selectedSubject={selectedSubject}
      setSelectedSubject={setSelectedSubject}
      selectedLesson={selectedLesson}
      setSelectedLesson={setSelectedLesson}
    />
  );

  const starters = [
    'Tạo prompt giải thích tích phân lớp 12',
    'Hãy sửa prompt này: "Giải thích quang hợp"',
    'Tạo prompt ôn thi Văn theo chủ đề nghị luận',
    'Tạo prompt học từ vựng tiếng Anh Unit 5',
  ];

  return (
    <ChatbotPage
      title="Tạo Prompt Học Tập"
      subtitle="Tạo và cải thiện prompt theo môn học, lớp và bài học cụ thể"
      icon={<Sparkles size={20} style={{ color: 'var(--color-primary)' }} />}
      botKey="study-prompt"
      autoSavePrompts
      systemContext={systemContext}
      starterPrompts={starters}
      sidebar={sidebar}
      saveSubject={subjectLabel}
      saveBookSeries={bookLabel}
      saveChapter={selectedLesson || `Lớp ${selectedGrade}`}
    />
  );
}
