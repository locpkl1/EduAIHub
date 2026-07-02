/*
  # Add grade and school to profiles

  Required by ProfileCompletionModal, Profile page, and AuthContext.updateProfile().
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school text;

COMMENT ON COLUMN profiles.grade IS 'Student grade level: 10, 11, or 12';
COMMENT ON COLUMN profiles.school IS 'High school name';
