import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AdminStatus {
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
}

const ADMIN_CHECK_ERROR = 'Không thể kiểm tra quyền quản trị lúc này.';

export function useAdminStatus(): AdminStatus {
  const { user, loading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAdminRole() {
      if (authLoading) return;

      if (!user) {
        setIsAdmin(false);
        setError(null);
        setIsChecking(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setIsAdmin(false);
        setError(ADMIN_CHECK_ERROR);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('admin_roles')
          .select('id')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (queryError) throw queryError;
        if (!cancelled) setIsAdmin(Boolean(data));
      } catch (adminError) {
        console.error('Error checking admin role:', adminError);
        if (!cancelled) {
          setIsAdmin(false);
          setError(ADMIN_CHECK_ERROR);
        }
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }

    checkAdminRole();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  return {
    isLoading: authLoading || isChecking,
    isAdmin,
    error,
  };
}
