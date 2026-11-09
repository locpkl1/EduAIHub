import { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile, ProfileUpdateData } from '../types/database';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  displayName: string;
  avatarUrl: string;
  loading: boolean;
  isGuest: boolean;
  isProfileIncomplete: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  dismissProfileModal: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function isProfileIncomplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return !profile.onboarding_completed || profile.grade == null || !profile.school?.trim();
}

/** Lấy tên và ảnh từ Google OAuth (user_metadata) */
export function getAuthUserMeta(authUser: User) {
  const meta = authUser.user_metadata ?? {};
  const displayName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    authUser.email?.split('@')[0] ||
    'Người dùng';
  const avatarUrl =
    (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta.picture === 'string' && meta.picture) ||
    '';
  return { displayName, avatarUrl };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
