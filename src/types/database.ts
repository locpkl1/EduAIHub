export type Grade = 10 | 11 | 12;

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  grade: Grade | null;
  school: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name: string;
  grade: Grade;
  school: string;
}

export interface SavedPrompt {
  id: string;
  user_id: string;
  subject: string;
  book_series: string;
  chapter: string;
  purpose: string;
  prompt_content: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  subject: string;
  duration_minutes: number;
  session_type: string;
  created_at: string;
}
