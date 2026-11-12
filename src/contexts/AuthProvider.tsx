import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { AuthContext, isProfileIncomplete, getAuthUserMeta } from './authContextCore';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';
import { clearLoginDestination, rememberLoginDestination } from '../lib/loginDestination';
import type { Profile, ProfileUpdateData } from '../types/database';

function profileDismissKey(userId: string) {
  return `eduaihub_profile_onboarding_dismissed_v2_${userId}`;
}

const PROFILE_DISMISS_TTL_MS = 12 * 60 * 60 * 1000;

function isProfileDismissedForNow(userId: string) {
  const raw = localStorage.getItem(profileDismissKey(userId));
  if (!raw) return false;

  const dismissedAt = Number.parseInt(raw, 10);
  if (!Number.isFinite(dismissedAt)) {
    localStorage.removeItem(profileDismissKey(userId));
    return false;
  }

  if (Date.now() - dismissedAt > PROFILE_DISMISS_TTL_MS) {
    localStorage.removeItem(profileDismissKey(userId));
    return false;
  }

  return true;
}

const AUTH_LOADING_TIMEOUT_MS = 3000;

function buildProfileFromAuth(authUser: User): Profile {
  const { displayName, avatarUrl } = getAuthUserMeta(authUser);
  const now = new Date().toISOString();
  return {
    id: authUser.id,
    full_name: displayName,
    avatar_url: avatarUrl,
    grade: null,
    school: null,
    personal_background: '',
    strengths: [],
    weaknesses: [],
    common_problems: [],
    learning_goals: [],
    preferred_learning_style: '',
    ai_experience_level: '',
    onboarding_completed: false,
    created_at: now,
    updated_at: now,
  };
}

function normalizeProfile(data: Partial<Profile>, authUser?: User): Profile {
  const fallback = authUser ? buildProfileFromAuth(authUser) : {
    id: data.id ?? '',
    full_name: '',
    avatar_url: '',
    grade: null,
    school: null,
    personal_background: '',
    strengths: [],
    weaknesses: [],
    common_problems: [],
    learning_goals: [],
    preferred_learning_style: '',
    ai_experience_level: '',
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    ...fallback,
    ...data,
    grade: data.grade ?? fallback.grade,
    school: data.school ?? fallback.school,
    personal_background: data.personal_background ?? '',
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    common_problems: Array.isArray(data.common_problems) ? data.common_problems : [],
    learning_goals: Array.isArray(data.learning_goals) ? data.learning_goals : [],
    preferred_learning_style: data.preferred_learning_style ?? '',
    ai_experience_level: data.ai_experience_level ?? '',
    onboarding_completed: Boolean(data.onboarding_completed),
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
      setProfileDismissed(isProfileDismissedForNow(user.id));
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
            setProfile(normalizeProfile(updated, authUser));
          } else {
            setProfile(normalizeProfile({
              ...data,
              full_name: data.full_name?.trim() || metaName,
              avatar_url: data.avatar_url?.trim() || metaAvatar,
            }, authUser));
          }
        } else {
          setProfile(normalizeProfile(data, authUser));
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
        setProfile(normalizeProfile(newProfile, authUser));
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
      console.warn(supabaseConfigError);
      window.alert(
        'Google login is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the current Supabase project, then configure Google OAuth in Supabase.'
      );
      return;
    }
    rememberLoginDestination();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) { clearLoginDestination(); throw error; }
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
    localStorage.setItem(profileDismissKey(user.id), String(Date.now()));
    setProfileDismissed(true);
  }

  async function updateProfile(data: ProfileUpdateData) {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Không thể cập nhật hồ sơ');
    }

    const updatePayload: Partial<ProfileUpdateData> & { updated_at: string } = {
      full_name: data.full_name,
      grade: data.grade,
      school: data.school,
      updated_at: new Date().toISOString(),
    };

    if (data.personal_background !== undefined) updatePayload.personal_background = data.personal_background;
    if (data.strengths !== undefined) updatePayload.strengths = data.strengths;
    if (data.weaknesses !== undefined) updatePayload.weaknesses = data.weaknesses;
    if (data.common_problems !== undefined) updatePayload.common_problems = data.common_problems;
    if (data.learning_goals !== undefined) updatePayload.learning_goals = data.learning_goals;
    if (data.preferred_learning_style !== undefined) {
      updatePayload.preferred_learning_style = data.preferred_learning_style;
    }
    if (data.ai_experience_level !== undefined) updatePayload.ai_experience_level = data.ai_experience_level;
    if (data.onboarding_completed !== undefined) updatePayload.onboarding_completed = data.onboarding_completed;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(normalizeProfile(updated, user));
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
    </AuthContext.Provider>
  );
}
