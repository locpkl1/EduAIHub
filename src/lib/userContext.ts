import type { UserLearningContext } from './cozeClient';
import type { Profile } from '../types/database';

export function buildUserLearningContext(
  profile: Profile | null | undefined,
  displayName?: string
): UserLearningContext {
  return {
    displayName: displayName || profile?.full_name || '',
    grade: profile?.grade ? String(profile.grade) : '',
    school: profile?.school || '',
    personalBackground: profile?.personal_background || '',
    strengths: profile?.strengths || [],
    weaknesses: profile?.weaknesses || [],
    commonProblems: profile?.common_problems || [],
    goals: profile?.learning_goals || [],
    preferredLearningStyle: profile?.preferred_learning_style || '',
    aiExperienceLevel: profile?.ai_experience_level || '',
  };
}
