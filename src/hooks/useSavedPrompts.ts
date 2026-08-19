import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { SavedPrompt } from '../types/database';

const SAVED_PROMPT_COLUMNS =
  'id,user_id,subject,book_series,chapter,purpose,prompt_content,created_at';

interface UseSavedPromptsOptions {
  userId?: string;
  enabled?: boolean;
  limit?: number;
}

export function useSavedPrompts({
  userId,
  enabled = true,
  limit,
}: UseSavedPromptsOptions) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchPrompts = useCallback(async () => {
    if (!enabled || !userId || !isSupabaseConfigured) {
      setPrompts([]);
      setLoading(false);
      setFetchError(false);
      return;
    }

    setLoading(true);
    setFetchError(false);

    try {
      let query = supabase
        .from('saved_prompts')
        .select(SAVED_PROMPT_COLUMNS)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (typeof limit === 'number') {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPrompts((data ?? []) as SavedPrompt[]);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [enabled, limit, userId]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const updatePrompt = useCallback(async (id: string, promptContent: string) => {
    if (!userId || !isSupabaseConfigured) {
      throw new Error('Bạn cần đăng nhập để chỉnh sửa prompt.');
    }

    const content = promptContent.trim();
    if (!content) {
      throw new Error('Nội dung prompt không được để trống.');
    }

    const { data, error } = await supabase
      .from('saved_prompts')
      .update({ prompt_content: content })
      .eq('id', id)
      .eq('user_id', userId)
      .select(SAVED_PROMPT_COLUMNS)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Không tìm thấy prompt hoặc bạn không có quyền chỉnh sửa.');

    const updated = data as SavedPrompt;
    setPrompts((current) => current.map((prompt) => (prompt.id === id ? updated : prompt)));
    return updated;
  }, [userId]);

  const deletePrompt = useCallback(async (id: string) => {
    if (!userId || !isSupabaseConfigured) {
      throw new Error('Bạn cần đăng nhập để xóa prompt.');
    }

    const { data, error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Không tìm thấy prompt hoặc bạn không có quyền xóa.');

    setPrompts((current) => current.filter((prompt) => prompt.id !== id));
  }, [userId]);

  return {
    prompts,
    loading,
    fetchError,
    retry: fetchPrompts,
    updatePrompt,
    deletePrompt,
  };
}
