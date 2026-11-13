import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from './ui/LoadingState';
import StartLearningAction from './StartLearningAction';

const sections = [
  ['/dashboard', 'không gian học tập'], ['/guides', 'Cẩm nang AI'],
  ['/ai-tools', 'công cụ AI'], ['/lessons', 'kinh nghiệm học cùng AI'],
  ['/prompts', 'Kho Prompt'], ['/profile', 'hồ sơ học tập'],
];

/** UX gate only; existing backend authorization still controls data access. */
export default function LearningAccessGuard() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  if (user) return <Outlet />;
  if (loading) return <LoadingState label="Đang xác minh phiên đăng nhập…" />;
  const label = sections.find(([prefix]) => pathname.startsWith(prefix))?.[1] || 'hoạt động học tập';
  return <section className="page-container section-space"><div className="max-w-2xl py-6 sm:py-12"><h1 className="page-title">Đăng nhập để mở {label}</h1><p className="page-intro">Sử dụng tài khoản Google để bắt đầu học. Sau khi đăng nhập, bạn sẽ trở lại trang đang muốn mở.</p><div className="mt-6"><StartLearningAction /></div><Link to="/" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-text">Về trang chủ</Link></div></section>;
}
