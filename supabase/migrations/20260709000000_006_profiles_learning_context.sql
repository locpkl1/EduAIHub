/*
  # Ensure profile learning context columns exist

  This repair migration is intentionally idempotent. It covers Supabase
  projects where an earlier learning-context migration was not applied or
  was marked as applied while the public.profiles columns were still missing.
*/

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS personal_background text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS strengths text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS weaknesses text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS common_problems text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS learning_goals text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS preferred_learning_style text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ai_experience_level text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.personal_background IS 'Optional student learning background for chatbot personalization';
COMMENT ON COLUMN public.profiles.strengths IS 'Student self-reported learning strengths';
COMMENT ON COLUMN public.profiles.weaknesses IS 'Student self-reported learning weaknesses';
COMMENT ON COLUMN public.profiles.common_problems IS 'Common learning or AI-use problems selected by the student';
COMMENT ON COLUMN public.profiles.learning_goals IS 'Student learning goals for EduAI-Hub';
COMMENT ON COLUMN public.profiles.preferred_learning_style IS 'Preferred explanation or tutoring style';
COMMENT ON COLUMN public.profiles.ai_experience_level IS 'Self-reported AI experience level';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether the expanded profile onboarding has been completed';
