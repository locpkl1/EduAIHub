import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/** Reuse the existing OAuth flow and its per-tab return destination. */
export default function StartLearningAction({ compact = false, className = '', loginLabel = 'Đăng nhập để bắt đầu học' }: {
  compact?: boolean;
  className?: string;
  loginLabel?: string;
}) {
  const { user, loading, signInWithGoogle } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const classes = `btn-primary ${className}`;
  if (user) return <Link to="/dashboard" className={classes} aria-label="Vào không gian học tập">{compact ? <><span className="lg:hidden">Vào học</span><span className="hidden lg:inline">Vào không gian học tập</span></> : 'Vào không gian học tập'}</Link>;
  async function login() {
    setError(''); setPending(true);
    try { await signInWithGoogle(); }
    catch { setError('Chưa đăng nhập được. Bạn hãy thử lại.'); }
    finally { setPending(false); }
  }
  return <div className="relative min-w-0"><button type="button" className={classes} disabled={loading || pending} aria-busy={pending || undefined} aria-label={pending && compact ? 'Đang mở đăng nhập…' : undefined} onClick={login}>{pending ? (compact ? 'Đang mở…' : 'Đang mở đăng nhập…') : compact ? 'Đăng nhập' : loginLabel}</button>{error && <p role="alert" className={compact ? 'absolute right-0 top-full z-50 mt-2 w-60 rounded-control border border-border bg-bg-card p-3 text-sm text-text' : 'mt-2 text-sm text-text'}>{error}</p>}</div>;
}
