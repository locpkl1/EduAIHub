import { isSupabaseConfigured, supabase } from './supabase';
import type { ContentPost, CurriculumItem, LearningResource, PromptTemplate } from '../types/database';

export type PublishedContentPost = Pick<
  ContentPost,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'content'
  | 'category'
  | 'tags'
  | 'reading_minutes'
  | 'thumbnail_url'
  | 'featured'
  | 'published_at'
  | 'updated_at'
>;

export type PublishedPromptTemplate = Pick<
  PromptTemplate,
  | 'id'
  | 'title'
  | 'prompt_content'
  | 'purpose'
  | 'subject'
  | 'grade'
  | 'book_series'
  | 'difficulty'
  | 'usage_note'
  | 'why_effective'
  | 'tags'
  | 'featured'
  | 'updated_at'
>;

export type PublishedCurriculumItem = Pick<
  CurriculumItem,
  | 'id'
  | 'grade'
  | 'book_series'
  | 'subject'
  | 'chapter_title'
  | 'lesson_title'
  | 'description'
  | 'suggested_prompt'
  | 'sort_order'
  | 'updated_at'
>;

export type PublishedLearningResource = Pick<
  LearningResource,
  | 'id'
  | 'title'
  | 'description'
  | 'resource_type'
  | 'external_url'
  | 'file_url'
  | 'subject'
  | 'grade'
  | 'book_series'
  | 'featured'
  | 'updated_at'
>;

const publishedPostFields = [
  'id',
  'title',
  'slug',
  'excerpt',
  'content',
  'category',
  'tags',
  'reading_minutes',
  'thumbnail_url',
  'featured',
  'published_at',
  'updated_at',
].join(',');

const publishedPromptTemplateFields = [
  'id',
  'title',
  'prompt_content',
  'purpose',
  'subject',
  'grade',
  'book_series',
  'difficulty',
  'usage_note',
  'why_effective',
  'tags',
  'featured',
  'updated_at',
].join(',');

const publishedCurriculumItemFields = [
  'id',
  'grade',
  'book_series',
  'subject',
  'chapter_title',
  'lesson_title',
  'description',
  'suggested_prompt',
  'sort_order',
  'updated_at',
].join(',');

const publishedLearningResourceFields = [
  'id',
  'title',
  'description',
  'resource_type',
  'external_url',
  'file_url',
  'subject',
  'grade',
  'book_series',
  'featured',
  'updated_at',
].join(',');

export async function fetchPublishedContentPosts(): Promise<PublishedContentPost[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('content_posts')
    .select(publishedPostFields)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PublishedContentPost[];
}

export async function fetchPublishedContentPostBySlug(slug: string): Promise<PublishedContentPost | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('content_posts')
    .select(publishedPostFields)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as PublishedContentPost | null;
}

export async function fetchPublishedPromptTemplates(): Promise<PublishedPromptTemplate[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('prompt_templates')
    .select(publishedPromptTemplateFields)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PublishedPromptTemplate[];
}

export async function fetchPublishedCurriculumItems(): Promise<PublishedCurriculumItem[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('curriculum_items')
    .select(publishedCurriculumItemFields)
    .eq('status', 'published')
    .order('grade', { ascending: true })
    .order('book_series', { ascending: true })
    .order('subject', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PublishedCurriculumItem[];
}

export async function fetchPublishedLearningResources(): Promise<PublishedLearningResource[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('learning_resources')
    .select(publishedLearningResourceFields)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PublishedLearningResource[];
}
