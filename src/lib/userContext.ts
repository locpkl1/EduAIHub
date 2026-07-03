import type { UserLearningContext } from './cozeClient';
import type { Profile } from '../types/database';

type ProfileLike = Partial<Profile> & {
  display_name?: unknown;
  name?: unknown;
  grade_level?: unknown;
  class?: unknown;
  school_name?: unknown;
};

function readString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
    : [];
}

export function buildUserLearningContext(
  profile: ProfileLike | null | undefined,
  displayName?: string
): UserLearningContext {
  return {
    displayName: readString(displayName, profile?.display_name, profile?.full_name, profile?.name),
    grade: readString(profile?.grade, profile?.grade_level, profile?.class),
    school: readString(profile?.school, profile?.school_name),
    personalBackground: readString(profile?.personal_background),
    strengths: readStringArray(profile?.strengths),
    weaknesses: readStringArray(profile?.weaknesses),
    commonProblems: readStringArray(profile?.common_problems),
    goals: readStringArray(profile?.learning_goals),
    preferredLearningStyle: readString(profile?.preferred_learning_style),
    aiExperienceLevel: readString(profile?.ai_experience_level),
  };
}
