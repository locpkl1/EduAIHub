import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import type { Profile, ProfileUpdateData } from '../types/database';

interface AuthContextType {
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

function profileDismissKey(userId: string) {
  return `profile_dismissed_${userId}`;
}

export function isProfileIncomplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.grade == null || !profile.school?.trim();
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_LOADING_TIMEOUT_MS = 3000;

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

function buildProfileFromAuth(authUser: User): Profile {
  const { displayName, avatarUrl } = getAuthUserMeta(authUser);
  const now = new Date().toISOString();
  return {
    id: authUser.id,
    full_name: displayName,
    avatar_url: avatarUrl,
    grade: null,
    school: null,
    created_at: now,
    updated_at: now,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDismissed, setProfileDismissed] = useState(false);

  const { displayName, avatarUrl } = useMemo(() => {
    if (!user) {
      return { displayName: '', avatarUrl: '' };
    }
    const meta = getAuthUserMeta(user);
    return {
      displayName: profile?.full_name?.trim() || meta.displayName,
      avatarUrl: profile?.avatar_url?.trim() || meta.avatarUrl,
    };
  }, [user, profile]);

  useEffect(() => {
    if (user) {
      setProfileDismissed(localStorage.getItem(profileDismissKey(user.id)) === '1');
    } else {
      setProfileDismissed(false);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const finishLoading = () => {
      if (!cancelled) setLoading(false);
    };

    const timeout = setTimeout(finishLoading, AUTH_LOADING_TIMEOUT_MS);

    if (!isSupabaseConfigured) {
      finishLoading();
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (cancelled) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          fetchOrCreateProfile(currentSession.user);
        } else {
          setProfile(null);
          finishLoading();
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        finishLoading();
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (cancelled) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setLoading(true);
        fetchOrCreateProfile(currentSession.user);
      } else {
        setProfile(null);
        finishLoading();
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function fetchOrCreateProfile(authUser: User) {
    const { displayName: metaName, avatarUrl: metaAvatar } = getAuthUserMeta(authUser);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const needsSync =
          (!data.full_name?.trim() && metaName) || (!data.avatar_url?.trim() && metaAvatar);

        if (needsSync) {
          const { data: updated, error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: data.full_name?.trim() || metaName,
              avatar_url: data.avatar_url?.trim() || metaAvatar,
              updated_at: new Date().toISOString(),
            })
            .eq('id', authUser.id)
            .select()
            .single();

          if (!updateError && updated) {
            setProfile(updated);
          } else {
            setProfile({
              ...data,
              full_name: data.full_name?.trim() || metaName,
              avatar_url: data.avatar_url?.trim() || metaAvatar,
            });
          }
        } else {
          setProfile(data);
        }
      } else {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            full_name: metaName,
            avatar_url: metaAvatar,
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      setProfile(buildProfileFromAuth(authUser));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase chưa được cấu hình. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  }

  const isGuest = !user;
  const profileIncomplete = Boolean(
    user && !profileDismissed && (!profile || isProfileIncomplete(profile))
  );

  function dismissProfileModal() {
    if (!user) return;
    localStorage.setItem(profileDismissKey(user.id), '1');
    setProfileDismissed(true);
  }

  async function updateProfile(data: ProfileUpdateData) {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Không thể cập nhật hồ sơ');
    }

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        grade: data.grade,
        school: data.school,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(updated);
    localStorage.removeItem(profileDismissKey(user.id));
    setProfileDismissed(false);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        displayName,
        avatarUrl,
        loading,
        isGuest,
        isProfileIncomplete: profileIncomplete,
        signInWithGoogle,
        signOut,
        updateProfile,
        dismissProfileModal,
      }}
    >
      {children}
      <ProfileCompletionModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
