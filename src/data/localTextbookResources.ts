import { DEFAULT_BOOK_SERIES } from './educationData';

export interface LocalTextbookResource {
  grade: string;
  subject: string;
  title: string;
  volume: string | null;
  bookSeries: string;
  fileUrl: `/resources/${string}.pdf`;
  resourceType: 'pdf';
}

export const localTextbookResources = [
  {
    grade: '11',
    subject: 'Hóa học',
    title: 'Hóa học 11',
    volume: null,
    bookSeries: DEFAULT_BOOK_SERIES,
    fileUrl: '/resources/Hóa học 11 kết nối tri thức.pdf',
    resourceType: 'pdf',
  },
  {
    grade: '11',
    subject: 'Ngữ văn',
    title: 'Ngữ văn 11',
    volume: 'Tập 1',
    bookSeries: DEFAULT_BOOK_SERIES,
    fileUrl: '/resources/Ngữ vănKết nối 11 tập 1.pdf',
    resourceType: 'pdf',
  },
  {
    grade: '11',
    subject: 'Toán học',
    title: 'Sách giáo khoa Toán 11',
    volume: 'Tập 1',
    bookSeries: DEFAULT_BOOK_SERIES,
    fileUrl: '/resources/Sách giáo khoa Toán 11 (tập 1) (Kết Nối Tri Thức Với Cuộc Sống) - TOANMATH.com.pdf',
    resourceType: 'pdf',
  },
] satisfies readonly LocalTextbookResource[];

function canonicalizeResourceUrl(value: string) {
  try {
    return decodeURIComponent(new URL(value, 'https://eduai-hub.local').pathname)
      .normalize('NFC')
      .toLocaleLowerCase('vi-VN');
  } catch {
    return value.normalize('NFC').toLocaleLowerCase('vi-VN');
  }
}

const localTextbookFileKeys = new Set(
  localTextbookResources.map((resource) => canonicalizeResourceUrl(resource.fileUrl))
);

export function getLocalTextbooksForSubject(grade: string, subject: string) {
  return localTextbookResources.filter(
    (resource) => resource.grade === grade && resource.subject === subject
  );
}

export function isLocalTextbookFileUrl(value: string) {
  return localTextbookFileKeys.has(canonicalizeResourceUrl(value));
}
