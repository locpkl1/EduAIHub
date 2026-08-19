import { DEFAULT_BOOK_SERIES, lessons as legacySampleLessons, subjects } from './educationData';

export type CurriculumDataStatus =
  | 'verified'
  | 'official-data-required'
  | 'legacy-sample'
  | 'published-unverified';

export interface CurriculumLesson {
  id: string;
  title: string;
  description?: string | null;
  suggestedPrompt?: string | null;
}

export interface CurriculumChapter {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
}

export interface KnowledgeSgkMapping {
  chapterIds?: string[];
  lessonIds?: string[];
  notes?: string[];
}

export interface KnowledgeTopic {
  id: string;
  title: string;
  sgkMapping?: KnowledgeSgkMapping;
}

export interface KnowledgeArea {
  id: string;
  title: string;
  topics: KnowledgeTopic[];
}

export interface CurriculumSubject {
  grade: 10 | 11 | 12;
  subjectKey: string;
  subject: string;
  textbookSeries: string;
  dataStatus: CurriculumDataStatus;
  chapters: CurriculumChapter[];
  knowledgeAreas?: KnowledgeArea[];
}

export interface CurriculumRecord {
  id: string;
  grade: 10 | 11 | 12;
  book_series: string;
  subject: string;
  chapter_title: string;
  lesson_title: string | null;
  description?: string | null;
  suggested_prompt?: string | null;
  sort_order: number;
}

// Detailed SGK chapter/lesson records can be added later without changing the
// Study Prompt UX. KnowledgeTopic.sgkMapping is reserved for that linkage.
export const TOAN_11_OFFICIAL_CHAPTERS: CurriculumChapter[] = [];

export const TOAN_11_KNOWLEDGE_AREAS: KnowledgeArea[] = [
  {
    id: 'algebra-functions',
    title: 'Đại số & Hàm số',
    topics: [
      { id: 'trigonometric-functions-equations', title: 'Hàm số lượng giác và phương trình lượng giác' },
      { id: 'sequences-progressions', title: 'Dãy số, cấp số cộng và cấp số nhân' },
      { id: 'exponential-logarithmic-functions', title: 'Hàm số mũ và logarit' },
    ],
  },
  {
    id: 'calculus',
    title: 'Giải tích',
    topics: [
      { id: 'sequence-limits', title: 'Giới hạn dãy số' },
      { id: 'function-limits', title: 'Giới hạn hàm số' },
      { id: 'continuous-functions', title: 'Hàm số liên tục' },
      { id: 'derivatives', title: 'Đạo hàm' },
    ],
  },
  {
    id: 'spatial-geometry',
    title: 'Hình học không gian',
    topics: [
      { id: 'parallel-relations', title: 'Quan hệ song song' },
      { id: 'perpendicular-relations', title: 'Quan hệ vuông góc' },
      { id: 'angles-distances', title: 'Góc và khoảng cách' },
      { id: 'volume', title: 'Thể tích' },
    ],
  },
  {
    id: 'statistics',
    title: 'Thống kê',
    topics: [
      { id: 'grouped-data-samples', title: 'Mẫu số liệu ghép nhóm' },
      { id: 'sample-statistics', title: 'Các số đặc trưng của mẫu số liệu' },
    ],
  },
  {
    id: 'probability',
    title: 'Xác suất',
    topics: [
      { id: 'events', title: 'Biến cố' },
      { id: 'addition-rule', title: 'Quy tắc cộng xác suất' },
      { id: 'multiplication-rule', title: 'Quy tắc nhân xác suất' },
      { id: 'independent-events', title: 'Biến cố độc lập' },
    ],
  },
];

export const TOAN_11_CURRICULUM: CurriculumSubject = {
  grade: 11,
  subjectKey: 'toan',
  subject: 'Toán học',
  textbookSeries: DEFAULT_BOOK_SERIES,
  dataStatus: 'verified',
  chapters: TOAN_11_OFFICIAL_CHAPTERS,
  knowledgeAreas: TOAN_11_KNOWLEDGE_AREAS,
};

const controlledCurriculum = [TOAN_11_CURRICULUM];

function normalizeSubject(value: string) {
  return value.trim().toLocaleLowerCase('vi');
}

function getSubjectLabel(subjectKey: string) {
  return subjects.find((subject) => subject.value === subjectKey)?.label ?? subjectKey;
}

function getControlledCurriculum(grade: number, subjectKey: string) {
  return controlledCurriculum.find(
    (curriculum) => curriculum.grade === grade && curriculum.subjectKey === subjectKey
  ) ?? null;
}

function adaptPublishedRecords(
  grade: 10 | 11 | 12,
  subjectKey: string,
  records: CurriculumRecord[]
): CurriculumSubject | null {
  const subject = getSubjectLabel(subjectKey);
  const matchingRecords = records
    .filter((record) => record.grade === grade && normalizeSubject(record.subject) === normalizeSubject(subject))
    .sort((a, b) => a.sort_order - b.sort_order);

  if (matchingRecords.length === 0) return null;

  const chapters = new Map<string, CurriculumChapter>();
  matchingRecords.forEach((record) => {
    const chapterId = `published-${grade}-${subjectKey}-${normalizeSubject(record.chapter_title).replace(/\s+/g, '-')}`;
    const chapter = chapters.get(chapterId) ?? {
      id: chapterId,
      title: record.chapter_title,
      lessons: [],
    };

    if (record.lesson_title?.trim()) {
      chapter.lessons.push({
        id: record.id,
        title: record.lesson_title.trim(),
        description: record.description,
        suggestedPrompt: record.suggested_prompt,
      });
    }
    chapters.set(chapterId, chapter);
  });

  return {
    grade,
    subjectKey,
    subject,
    textbookSeries: DEFAULT_BOOK_SERIES,
    dataStatus: 'published-unverified',
    chapters: Array.from(chapters.values()),
  };
}

function adaptLegacySample(grade: 10 | 11 | 12, subjectKey: string): CurriculumSubject | null {
  const legacyLessons = legacySampleLessons[String(grade)]?.[subjectKey] ?? [];
  if (legacyLessons.length === 0) return null;

  return {
    grade,
    subjectKey,
    subject: getSubjectLabel(subjectKey),
    textbookSeries: DEFAULT_BOOK_SERIES,
    dataStatus: 'legacy-sample',
    chapters: [
      {
        id: `legacy-${grade}-${subjectKey}`,
        title: '',
        lessons: legacyLessons.map((title, index) => ({
          id: `legacy-${grade}-${subjectKey}-${index + 1}`,
          title,
        })),
      },
    ],
  };
}

export function resolveCurriculumSubject({
  grade,
  subjectKey,
  publishedRecords = [],
  allowLegacyFallback = false,
}: {
  grade: string | number;
  subjectKey: string;
  publishedRecords?: CurriculumRecord[];
  allowLegacyFallback?: boolean;
}): CurriculumSubject | null {
  const parsedGrade = Number(grade);
  if (parsedGrade !== 10 && parsedGrade !== 11 && parsedGrade !== 12) return null;

  const controlled = getControlledCurriculum(parsedGrade, subjectKey);
  if (controlled) return controlled;

  const published = adaptPublishedRecords(parsedGrade, subjectKey, publishedRecords);
  if (published) return published;

  return allowLegacyFallback ? adaptLegacySample(parsedGrade, subjectKey) : null;
}

export function flattenCurriculumLessons(curriculum: CurriculumSubject | null) {
  if (!curriculum) return [];
  return curriculum.chapters.flatMap((chapter) => (
    chapter.lessons.map((lesson) => ({ ...lesson, chapterId: chapter.id, chapterTitle: chapter.title }))
  ));
}
