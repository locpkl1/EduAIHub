import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const placeholderPatterns = [
  'your-supabase-url',
  'your-supabase-anon-key',
  'your-actual-anon-key',
  'placeholder.supabase.co',
  'placeholder-anon-key',
];

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !placeholderPatterns.some((p) => supabaseUrl.includes(p) || supabaseAnonKey.includes(p))
);

export const supabaseConfigError =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the current EduAI-Hub Supabase project.';

if (!isSupabaseConfigured) {
  console.warn(supabaseConfigError);
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    });
