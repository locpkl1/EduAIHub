import { useState, type ReactNode } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';
import { useAuth } from '../../contexts/AuthContext';
import { bookSeries, grades, lessons, subjects } from '../../data/educationData';
import { buildUserLearningContext } from '../../lib/userContext';
import type { StudyContext } from '../../lib/cozeClient';

const CURRENT_LEVEL_OPTIONS = [
  'Mới bắt đầu',
  'Đang hiểu một phần',
  'Cần củng cố nền tảng',
  'Đã khá vững',
  'Muốn luyện nâng cao',
];

function StudySidebar({
  selectedGrade,
  setSelectedGrade,
  selectedBook,
  setSelectedBook,
  selectedSubject,
  setSelectedSubject,
  selectedChapter,
  setSelectedChapter,
  selectedLesson,
  setSelectedLesson,
  learningGoal,
  setLearningGoal,
  currentLevel,
  setCurrentLevel,
}: {
  selectedGrade: string;
  setSelectedGrade: (v: string) => void;
  selectedBook: string;
  setSelectedBook: (v: string) => void;
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  selectedChapter: string;
  setSelectedChapter: (v: string) => void;
  selectedLesson: string;
  setSelectedLesson: (v: string) => void;
  learningGoal: string;
  setLearningGoal: (v: string) => void;
  currentLevel: string;
  setCurrentLevel: (v: string) => void;
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
          Chọn lớp, sách, môn, chương, bài và mục tiêu để chatbot gợi ý prompt sát với việc học của bạn.
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

        <FieldLabel label="Chương / chủ đề">
          <input
            type="text"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            placeholder="VD: Hàm số lượng giác"
            className="input-field py-2 text-xs"
          />
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

        <FieldLabel label="Mục tiêu học tập">
          <textarea
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="VD: Hiểu bản chất, ôn kiểm tra, tự luyện bài tập..."
            rows={3}
            className="input-field resize-none py-2 text-xs"
          />
        </FieldLabel>

        <FieldLabel label="Trình độ hiện tại">
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            className="input-field py-2 text-xs"
          >
            <option value="">Chọn trình độ</option>
            {CURRENT_LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
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
              {selectedChapter && (
                <li>
                  Chương: <span className="font-bold text-text">{selectedChapter}</span>
                </li>
              )}
              {selectedLesson && (
                <li>
                  Bài: <span className="font-bold text-text">{selectedLesson}</span>
                </li>
              )}
              {currentLevel && (
                <li>
                  Trình độ: <span className="font-bold text-text">{currentLevel}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function StudyPromptMentorChatbot() {
  const { profile, displayName } = useAuth();
  const userContext = buildUserLearningContext(profile, displayName);

  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');

  const subjectLabel = subjects.find((s) => s.value === selectedSubject)?.label || selectedSubject;
  const bookLabel = bookSeries.find((b) => b.value === selectedBook)?.label || '';

  const studyContext: StudyContext = {
    grade: selectedGrade,
    subject: subjectLabel,
    textbookSeries: bookLabel,
    chapter: selectedChapter,
    lesson: selectedLesson,
    learningGoal,
    currentLevel,
  };

  const sidebar = (
    <StudySidebar
      selectedGrade={selectedGrade}
      setSelectedGrade={setSelectedGrade}
      selectedBook={selectedBook}
      setSelectedBook={setSelectedBook}
      selectedSubject={selectedSubject}
      setSelectedSubject={setSelectedSubject}
      selectedChapter={selectedChapter}
      setSelectedChapter={setSelectedChapter}
      selectedLesson={selectedLesson}
      setSelectedLesson={setSelectedLesson}
      learningGoal={learningGoal}
      setLearningGoal={setLearningGoal}
      currentLevel={currentLevel}
      setCurrentLevel={setCurrentLevel}
    />
  );

  const starters = [
    'Gợi ý prompt giúp em hiểu bài này theo từng bước',
    'Em có prompt này, hãy góp ý và sửa cho tốt hơn',
    'Tạo prompt ôn kiểm tra nhưng không cho đáp án ngay',
    'Tạo prompt giúp em tự kiểm tra xem mình đã hiểu bài chưa',
  ];

  return (
    <ChatbotPage
      title="Gợi Ý Prompt Học Tập"
      subtitle="Góp ý và tạo prompt học tập theo lớp, môn, bộ sách, trình độ và mục tiêu"
      icon={<Sparkles size={20} style={{ color: 'var(--color-primary)' }} />}
      botKey="study-prompt"
      autoSavePrompts
      userContext={userContext}
      studyContext={studyContext}
      starterPrompts={starters}
      sidebar={sidebar}
      saveSubject={subjectLabel}
      saveBookSeries={bookLabel}
      saveChapter={selectedLesson || selectedChapter || `Lớp ${selectedGrade}`}
    />
  );
}
