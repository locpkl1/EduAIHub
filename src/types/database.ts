export type Grade = 10 | 11 | 12;
export type AdminRoleName = 'admin';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type PromptDifficulty = 'basic' | 'intermediate' | 'advanced';
export type ResourceType = 'link' | 'pdf' | 'image' | 'document' | 'other';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  grade: Grade | null;
  school: string | null;
  personal_background: string;
  strengths: string[];
  weaknesses: string[];
  common_problems: string[];
  learning_goals: string[];
  preferred_learning_style: string;
  ai_experience_level: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name: string;
  grade: Grade;
  school: string;
  personal_background?: string;
  strengths?: string[];
  weaknesses?: string[];
  common_problems?: string[];
  learning_goals?: string[];
  preferred_learning_style?: string;
  ai_experience_level?: string;
  onboarding_completed?: boolean;
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

export interface AdminRole {
  id: string;
  user_id: string;
  role: AdminRoleName;
  created_at: string;
}

export interface ContentPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  tags: string[];
  reading_minutes: number;
  thumbnail_url: string | null;
  status: ContentStatus;
  featured: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PromptTemplate {
  id: string;
  title: string;
  prompt_content: string;
  purpose: string | null;
  subject: string | null;
  grade: Grade | null;
  book_series: string | null;
  difficulty: PromptDifficulty | null;
  usage_note: string | null;
  why_effective: string | null;
  tags: string[];
  status: ContentStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CurriculumItem {
  id: string;
  grade: Grade;
  book_series: string;
  subject: string;
  chapter_title: string;
  lesson_title: string | null;
  description: string | null;
  suggested_prompt: string | null;
  status: ContentStatus;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  file_url: string | null;
  external_url: string | null;
  subject: string | null;
  grade: Grade | null;
  book_series: string | null;
  curriculum_item_id: string | null;
  status: ContentStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type AdminRoleInsert = {
  id?: string;
  user_id: string;
  role?: AdminRoleName;
  created_at?: string;
};

export type AdminRoleUpdate = Partial<AdminRoleInsert>;

export type ContentPostInsert = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[];
  reading_minutes?: number;
  thumbnail_url?: string | null;
  status?: ContentStatus;
  featured?: boolean;
  author_id?: string | null;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
};

export type ContentPostUpdate = Partial<ContentPostInsert>;

export type PromptTemplateInsert = {
  id?: string;
  title: string;
  prompt_content: string;
  purpose?: string | null;
  subject?: string | null;
  grade?: Grade | null;
  book_series?: string | null;
  difficulty?: PromptDifficulty | null;
  usage_note?: string | null;
  why_effective?: string | null;
  tags?: string[];
  status?: ContentStatus;
  featured?: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PromptTemplateUpdate = Partial<PromptTemplateInsert>;

export type CurriculumItemInsert = {
  id?: string;
  grade: Grade;
  book_series: string;
  subject: string;
  chapter_title: string;
  lesson_title?: string | null;
  description?: string | null;
  suggested_prompt?: string | null;
  status?: ContentStatus;
  sort_order?: number;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CurriculumItemUpdate = Partial<CurriculumItemInsert>;

export type LearningResourceInsert = {
  id?: string;
  title: string;
  description?: string | null;
  resource_type?: ResourceType;
  file_url?: string | null;
  external_url?: string | null;
  subject?: string | null;
  grade?: Grade | null;
  book_series?: string | null;
  curriculum_item_id?: string | null;
  status?: ContentStatus;
  featured?: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type LearningResourceUpdate = Partial<LearningResourceInsert>;
