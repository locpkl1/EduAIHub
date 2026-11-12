import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { ArrowLeft, Loader2, LogIn, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminStatus } from '../../hooks/useAdminStatus';

interface AdminRouteGuardProps {
  children: ReactNode;
}

interface GuardStateProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  children?: ReactNode;
}

function GuardState({ title, description, icon: Icon, children }: GuardStateProps) {
  return (
    <main id="main-content" className="min-h-screen bg-bg px-4 py-10 text-text">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <section
          className="relative overflow-hidden rounded-card border p-6 sm:p-8"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-strong)' }}
        >
          <div className="relative">
            <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-control"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--foreground-on-primary)' }}
            >
              <Icon size={22} />
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
              {description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, signInWithGoogle } = useAuth();
  const { isLoading, isAdmin, error } = useAdminStatus();

  if (isLoading) {
    return (
      <GuardState
        eyebrow="Admin Center"
        title="Đang kiểm tra quyền quản trị..."
        description="EduAI-Hub đang xác minh phiên đăng nhập và quyền truy cập của bạn."
        icon={ShieldCheck}
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Vui lòng chờ trong giây lát
        </span>
      </GuardState>
    );
  }

  if (!user) {
    return (
      <GuardState
        eyebrow="Admin Center"
        title="Vui lòng đăng nhập để truy cập Trung tâm quản trị."
        description="Đăng nhập bằng tài khoản Google đã được cấp quyền admin để quản lý nội dung EduAI-Hub."
        icon={ShieldCheck}
      >
        <button type="button" onClick={signInWithGoogle} className="btn-primary gap-2">
          <LogIn size={16} />
          Đăng nhập bằng Google
        </button>
        <Link to="/" className="btn-outline gap-2 rounded-control">
          <ArrowLeft size={16} />
          Về trang chủ
        </Link>
      </GuardState>
    );
  }

  if (!isAdmin) {
    return (
      <GuardState
        eyebrow="Không có quyền truy cập"
        title="Bạn không có quyền truy cập Trung tâm quản trị EduAI-Hub."
        description="Khu vực này chỉ dành cho quản trị viên được cấp quyền."
        icon={ShieldAlert}
      >
        <Link to="/" className="btn-primary gap-2">
          <ArrowLeft size={16} />
          Về trang chủ
        </Link>
        {error && <span className="self-center text-xs font-semibold text-text-light">{error}</span>}
      </GuardState>
    );
  }

  return <>{children}</>;
}
