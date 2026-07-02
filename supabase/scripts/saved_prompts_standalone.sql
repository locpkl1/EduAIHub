-- =============================================================================
-- EduAI-Hub: Bảng lưu lịch sử prompt / chat (standalone)
-- =============================================================================
--
-- LƯU Ý: Migration gốc `20260527094221_001_initial_schema.sql` ĐÃ tạo bảng
-- `saved_prompts` với các cột: subject, book_series, chapter, purpose.
-- Chỉ chạy script này nếu project Supabase của bạn CHƯA có bảng đó.
--
-- Chạy trên Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.saved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text DEFAULT '',
  book_series text DEFAULT '',
  chapter text DEFAULT '',
  purpose text DEFAULT '',
  prompt_content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_prompts_user_id ON public.saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_created_at ON public.saved_prompts(created_at DESC);

ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own prompts" ON public.saved_prompts;
DROP POLICY IF EXISTS "Users can insert own prompts" ON public.saved_prompts;
DROP POLICY IF EXISTS "Users can delete own prompts" ON public.saved_prompts;

CREATE POLICY "Users can view own prompts"
  ON public.saved_prompts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own prompts"
  ON public.saved_prompts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own prompts"
  ON public.saved_prompts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
