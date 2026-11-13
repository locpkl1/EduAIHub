import type { Grade } from '../../types/database';

export type ProfileSection = 'basic' | 'learning' | 'goals';
export const profileSections: { id: ProfileSection; title: string; description: string }[] = [
  { id: 'basic', title: 'Thông tin cơ bản', description: 'Tên hiển thị, khối lớp và trường học.' },
  { id: 'learning', title: 'Cách học với AI', description: 'Bối cảnh, điểm mạnh và những điều muốn cải thiện.' },
  { id: 'goals', title: 'Mục tiêu học tập', description: 'Những việc bạn muốn được hỗ trợ.' },
];
export interface ProfileDraft {
  fullName: string; grade: Grade | ''; school: string; personalBackground: string;
  strengths: string[]; weaknesses: string[]; commonProblems: string[]; learningGoals: string[];
  preferredLearningStyle: string; aiExperienceLevel: string;
}
export type ProfileSetters = { [K in keyof ProfileDraft]: (value: ProfileDraft[K]) => void };
