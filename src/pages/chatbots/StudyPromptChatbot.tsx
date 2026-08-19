import { useEffect, useId, useState, type ReactNode } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';
import { useAuth } from '../../contexts/AuthContext';
import {
  flattenCurriculumLessons,
  resolveCurriculumSubject,
  type CurriculumSubject,
} from '../../data/curriculumData';
import { DEFAULT_BOOK_SERIES, grades, subjects } from '../../data/educationData';
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
  setHasUserChangedGrade,
  selectedSubject,
  setSelectedSubject,
  selectedKnowledgeArea,
  setSelectedKnowledgeArea,
  selectedTopic,
  setSelectedTopic,
  selectedChapter,
  setSelectedChapter,
  selectedLesson,
  setSelectedLesson,
  curriculum,
  learningGoal,
  setLearningGoal,
  currentLevel,
  setCurrentLevel,
  isContextOpen,
  onToggleContext,
}: {
  selectedGrade: string;
  setSelectedGrade: (v: string) => void;
  setHasUserChangedGrade: (v: boolean) => void;
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  selectedKnowledgeArea: string;
  setSelectedKnowledgeArea: (v: string) => void;
  selectedTopic: string;
  setSelectedTopic: (v: string) => void;
  selectedChapter: string;
  setSelectedChapter: (v: string) => void;
  selectedLesson: string;
  setSelectedLesson: (v: string) => void;
  curriculum: CurriculumSubject | null;
  learningGoal: string;
  setLearningGoal: (v: string) => void;
  currentLevel: string;
  setCurrentLevel: (v: string) => void;
  isContextOpen: boolean;
  onToggleContext: () => void;
}) {
  const panelId = useId();
  const usesKnowledgeAreas = Boolean(curriculum?.knowledgeAreas?.length);
  const selectedKnowledgeAreaData = curriculum?.knowledgeAreas?.find(
    (area) => area.id === selectedKnowledgeArea
  );
  const availableTopics = selectedKnowledgeAreaData?.topics ?? [];
  const selectedTopicData = availableTopics.find((topic) => topic.id === selectedTopic);
  const showChapterSelector = !usesKnowledgeAreas && curriculum?.dataStatus === 'verified'
    && curriculum.chapters.some((chapter) => chapter.title.trim());
  const availableLessons = showChapterSelector
    ? curriculum?.chapters.find((chapter) => chapter.id === selectedChapter)?.lessons ?? []
    : flattenCurriculumLessons(curriculum);
  const selectedChapterTitle = curriculum?.chapters.find((chapter) => chapter.id === selectedChapter)?.title ?? '';
  const selectedSubjectLabel = subjects.find((subject) => subject.value === selectedSubject)?.label ?? '';
  const selectedContextLabel = selectedTopicData?.title
    || selectedLesson
    || selectedKnowledgeAreaData?.title
    || selectedChapterTitle;
  const contextSummary = [
    `Lớp ${selectedGrade}`,
    selectedSubjectLabel || 'Chưa chọn môn',
    selectedContextLabel,
  ].filter(Boolean).join(' · ');

  return (
    <div className="min-h-0 overflow-visible p-3 sm:p-4 lg:h-full lg:overflow-y-auto">
      <button
        type="button"
        onClick={onToggleContext}
        aria-expanded={isContextOpen}
        aria-controls={panelId}
        aria-label={isContextOpen ? 'Thu gọn Ngữ cảnh học' : 'Mở Ngữ cảnh học'}
        className={`flex min-h-11 w-full items-start gap-3 p-3 text-left transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-4 ${isContextOpen ? 'mb-4' : ''}`}
        style={{
          backgroundColor: 'var(--color-bg-muted)',
          borderLeft: '4px solid var(--color-primary)',
        }}
      >
        <BookOpen size={16} className="mt-0.5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold uppercase tracking-[0.16em] text-text-light">
            Ngữ cảnh học
          </span>
          {isContextOpen ? (
            <span className="mt-2 block text-xs leading-5 text-text-muted">
              Chọn lớp, môn, ngữ cảnh kiến thức và nhu cầu để chatbot gợi ý prompt sát với việc học của bạn.
            </span>
          ) : (
            <span className="mt-1 block truncate text-xs leading-5 text-text-muted" title={contextSummary}>
              {contextSummary}
            </span>
          )}
        </span>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary"
          aria-hidden="true"
          style={{ backgroundColor: 'var(--color-primary-light)' }}
        >
          {isContextOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isContextOpen && (
        <div id={panelId} className="space-y-3 sm:space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
            Lớp <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => {
                  setHasUserChangedGrade(true);
                  setSelectedGrade(g.value);
                  setSelectedKnowledgeArea('');
                  setSelectedTopic('');
                  setSelectedChapter('');
                  setSelectedLesson('');
                }}
                className="min-h-11 py-2 text-xs font-bold transition-colors"
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

        <FieldLabel label="Môn học">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedKnowledgeArea('');
              setSelectedTopic('');
              setSelectedChapter('');
              setSelectedLesson('');
            }}
            className="input-field min-h-11 py-2 text-xs"
          >
            <option value="">Chọn môn học</option>
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FieldLabel>

        {usesKnowledgeAreas ? (
          <>
            <FieldLabel label="Mảng kiến thức">
              <select
                value={selectedKnowledgeArea}
                onChange={(e) => {
                  setSelectedKnowledgeArea(e.target.value);
                  setSelectedTopic('');
                }}
                className="input-field min-h-11 py-2 text-xs"
              >
                <option value="">Chọn mảng kiến thức</option>
                {curriculum?.knowledgeAreas?.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.title}
                  </option>
                ))}
              </select>
            </FieldLabel>

            <FieldLabel label="Chủ đề cụ thể (không bắt buộc)">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedKnowledgeArea}
                className="input-field min-h-11 py-2 text-xs disabled:opacity-50"
              >
                <option value="">
                  {selectedKnowledgeArea ? 'Không chọn chủ đề cụ thể' : 'Chọn mảng kiến thức trước'}
                </option>
                {availableTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </>
        ) : (
          <>

            {showChapterSelector && (
              <FieldLabel label="Chương">
                <select
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(e.target.value);
                    setSelectedLesson('');
                  }}
                  className="input-field min-h-11 py-2 text-xs"
                >
                  <option value="">Chọn chương</option>
                  {curriculum?.chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </FieldLabel>
            )}

            <FieldLabel label="Bài học">
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                disabled={!selectedSubject || availableLessons.length === 0}
                className="input-field min-h-11 py-2 text-xs disabled:opacity-50"
              >
                <option value="">
                  {curriculum?.dataStatus === 'official-data-required'
                    ? 'Chờ dữ liệu bài học chính thức'
                    : showChapterSelector && !selectedChapter
                      ? 'Chọn chương trước'
                      : 'Chọn bài học'}
                </option>
                {availableLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.title}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </FieldLabel>

            {curriculum?.dataStatus === 'official-data-required' && (
              <p className="border-l-2 border-accent bg-accent-light px-3 py-2 text-xs leading-5 text-text-muted">
                Dữ liệu bài học chính thức đang được cập nhật. Dữ liệu mẫu cũ không được hiển thị trong luồng này.
              </p>
            )}
            {selectedSubject && !curriculum && (
              <p className="border-l-2 border-primary bg-primary-light px-3 py-2 text-xs leading-5 text-text-muted">
                Nội dung chi tiết cho lựa chọn này đang được cập nhật. Bạn vẫn có thể gửi môn học, nhu cầu và trình độ để chatbot gợi ý prompt phù hợp.
              </p>
            )}
            {curriculum?.dataStatus === 'legacy-sample' && (
              <p className="border-l-2 border-border-strong bg-bg-muted px-3 py-2 text-xs leading-5 text-text-light">
                Danh sách này là dữ liệu tham khảo cũ và chưa được xác minh đầy đủ.
              </p>
            )}
          </>
        )}

        <FieldLabel label="Nhu cầu học tập">
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
            className="input-field min-h-11 py-2 text-xs"
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
              <li>
                Môn:{' '}
                <span className="font-bold text-text">
                  {subjects.find((s) => s.value === selectedSubject)?.label}
                </span>
              </li>
              {selectedKnowledgeAreaData && (
                <li>
                  Mảng: <span className="font-bold text-text">{selectedKnowledgeAreaData.title}</span>
                </li>
              )}
              {selectedTopicData && (
                <li>
                  Chủ đề: <span className="font-bold text-text">{selectedTopicData.title}</span>
                </li>
              )}
              {selectedChapterTitle && (
                <li>
                  Chương: <span className="font-bold text-text">{selectedChapterTitle}</span>
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
      )}
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function StudyPromptMentorChatbot() {
  const { profile, displayName } = useAuth();
  const userContext = buildUserLearningContext(profile, displayName);

  const [selectedGrade, setSelectedGrade] = useState(() => userContext.grade || '10');
  const [hasUserChangedGrade, setHasUserChangedGrade] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [isContextOpen, setIsContextOpen] = useState(true);

  useEffect(() => {
    if (!hasUserChangedGrade && userContext.grade) {
      setSelectedGrade(userContext.grade);
    }
  }, [hasUserChangedGrade, userContext.grade]);

  const subjectLabel = subjects.find((s) => s.value === selectedSubject)?.label || selectedSubject;
  const curriculum = selectedSubject
    ? resolveCurriculumSubject({
        grade: selectedGrade,
        subjectKey: selectedSubject,
        allowLegacyFallback: false,
      })
    : null;
  const selectedChapterTitle = curriculum?.chapters.find((chapter) => chapter.id === selectedChapter)?.title ?? '';
  const selectedKnowledgeAreaTitle = curriculum?.knowledgeAreas?.find(
    (area) => area.id === selectedKnowledgeArea
  )?.title ?? '';
  const selectedTopicTitle = curriculum?.knowledgeAreas
    ?.find((area) => area.id === selectedKnowledgeArea)
    ?.topics.find((topic) => topic.id === selectedTopic)?.title ?? '';
  const studyContext: StudyContext = {
    grade: selectedGrade,
    subject: subjectLabel,
    textbookSeries: DEFAULT_BOOK_SERIES,
    knowledgeArea: selectedKnowledgeAreaTitle,
    topic: selectedTopicTitle,
    chapter: selectedKnowledgeAreaTitle || selectedChapterTitle,
    lesson: selectedTopicTitle || selectedLesson,
    learningGoal,
    currentLevel,
  };

  const sidebar = (
    <StudySidebar
      selectedGrade={selectedGrade}
      setSelectedGrade={setSelectedGrade}
      setHasUserChangedGrade={setHasUserChangedGrade}
      selectedSubject={selectedSubject}
      setSelectedSubject={setSelectedSubject}
      selectedKnowledgeArea={selectedKnowledgeArea}
      setSelectedKnowledgeArea={setSelectedKnowledgeArea}
      selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic}
      selectedChapter={selectedChapter}
      setSelectedChapter={setSelectedChapter}
      selectedLesson={selectedLesson}
      setSelectedLesson={setSelectedLesson}
      curriculum={curriculum}
      learningGoal={learningGoal}
      setLearningGoal={setLearningGoal}
      currentLevel={currentLevel}
      setCurrentLevel={setCurrentLevel}
      isContextOpen={isContextOpen}
      onToggleContext={() => setIsContextOpen((current) => !current)}
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
      subtitle="Góp ý và tạo prompt học tập theo lớp, môn, mảng kiến thức, trình độ và mục tiêu"
      icon={<Sparkles size={20} style={{ color: 'var(--color-primary)' }} />}
      botKey="study-prompt"
      userContext={userContext}
      studyContext={studyContext}
      starterPrompts={starters}
      sidebar={sidebar}
      saveSubject={subjectLabel}
      saveBookSeries={DEFAULT_BOOK_SERIES}
      saveChapter={selectedKnowledgeAreaTitle || selectedChapterTitle || selectedTopicTitle || selectedLesson || `Lớp ${selectedGrade}`}
    />
  );
}
