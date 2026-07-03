/*
  # Add learning context fields to profiles

  These optional fields personalize chatbot context without changing existing
  user records or saved prompts.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS personal_background text DEFAULT '',
  ADD COLUMN IF NOT EXISTS strengths text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS weaknesses text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS common_problems text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS learning_goals text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preferred_learning_style text DEFAULT '',
  ADD COLUMN IF NOT EXISTS ai_experience_level text DEFAULT '',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

COMMENT ON COLUMN profiles.personal_background IS 'Optional student learning background for chatbot personalization';
COMMENT ON COLUMN profiles.strengths IS 'Student self-reported learning strengths';
COMMENT ON COLUMN profiles.weaknesses IS 'Student self-reported learning weaknesses';
COMMENT ON COLUMN profiles.common_problems IS 'Common learning or AI-use problems selected by the student';
COMMENT ON COLUMN profiles.learning_goals IS 'Student learning goals for EduAI-Hub';
COMMENT ON COLUMN profiles.preferred_learning_style IS 'Preferred explanation or tutoring style';
COMMENT ON COLUMN profiles.ai_experience_level IS 'Self-reported AI experience level';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the expanded profile onboarding has been completed';
