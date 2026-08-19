import { useState } from 'react';
import { BookOpen, Library, Loader2, Sparkles, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SavedPromptCollection from '../components/saved-prompts/SavedPromptWorkspace';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { useSavedPrompts } from '../hooks/useSavedPrompts';

const quickActions = [
  {
    to: '/ai-tools/goi-y-prompt-hoc-tap',
    title: 'Tạo Prompt mới',
    description: 'Tạo prompt học tập có ngữ cảnh rõ ràng.',
    icon: Sparkles,
    primary: true,
  },
  {
    to: '/prompts',
    title: 'Kho Prompt',
    description: 'Xem prompt cá nhân và prompt tham khảo.',
    icon: Library,
    primary: false,
  },
  {
    to: '/guides',
    title: 'Hướng dẫn dùng AI',
    description: 'Ôn lại cách hỏi, kiểm chứng và tự học.',
    icon: BookOpen,
    primary: false,
  },
];

export default function Dashboard() {
  const { user, profile, loading: authLoading, isGuest, displayName } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const {
    prompts: recentPrompts,
    loading,
    fetchError,
    retry,
    updatePrompt,
    deletePrompt,
  } = useSavedPrompts({
    userId: user?.id,
    enabled: !authLoading && !isGuest,
    limit: 5,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" aria-label="Đang tải Dashboard">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const welcomeName = isGuest ? 'Bạn' : displayName || profile?.full_name || 'Học sinh';

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {isGuest && (
        <div
          className="flex items-start gap-3 rounded-xl border p-4"
          style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
        >
          <UserCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="font-bold text-text">Bạn đang xem ở chế độ khách</p>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Bạn vẫn có thể khám phá EduAI-Hub. Đăng nhập để xem, chỉnh sửa và quản lý prompt cá nhân trên mọi thiết bị.
            </p>
          </div>
        </div>
      )}

      <section
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-text-muted">{getGreeting()}</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
              {welcomeName}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted sm:text-base">
              Đây là không gian để bạn quay lại những prompt đáng dùng nhất, chỉnh chúng tốt hơn và tiếp tục học.
            </p>
          </div>
          {profile?.avatar_url && !avatarFailed ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Ảnh đại diện'}
              referrerPolicy="no-referrer"
              onError={() => setAvatarFailed(true)}
              className="h-16 w-16 rounded-full border-2 object-cover sm:h-20 sm:w-20"
              style={{ borderColor: 'var(--color-border)' }}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary sm:h-20 sm:w-20" aria-hidden="true">
              <Sparkles size={28} />
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="recent-prompts-title">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="section-label mb-3 inline-flex">Prompt Workspace</span>
            <h2 id="recent-prompts-title" className="font-display text-2xl font-extrabold text-text sm:text-3xl">
              Prompt gần đây
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Mở, sao chép, chỉnh sửa hoặc xóa prompt cá nhân ngay tại đây.
            </p>
          </div>
          <Link to="/prompts" className="btn-outline min-h-11 justify-center">
            Xem toàn bộ Kho Prompt
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : fetchError ? (
          <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-display text-xl font-bold text-text">Chưa tải được prompt gần đây</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
              Dữ liệu đã lưu không bị thay đổi. Vui lòng kiểm tra kết nối rồi thử lại.
            </p>
            <button type="button" onClick={retry} className="btn-outline mt-5 min-h-11">
              Thử tải lại
            </button>
          </div>
        ) : recentPrompts.length > 0 ? (
          <SavedPromptCollection
            prompts={recentPrompts}
            onUpdate={updatePrompt}
            onDelete={deletePrompt}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          />
        ) : (
          <EmptyState
            icon={<Sparkles size={28} />}
            title={isGuest ? 'Đăng nhập để mở Prompt Workspace' : 'Bạn chưa lưu prompt nào'}
            description={
              isGuest
                ? 'Prompt bạn lưu từ chatbot sẽ xuất hiện tại đây sau khi đăng nhập.'
                : 'Hãy tạo prompt đầu tiên với EduAI-Hub. Prompt đã lưu sẽ đồng bộ vào Dashboard và Kho Prompt.'
            }
            action={(
              <Link to="/ai-tools/goi-y-prompt-hoc-tap" className="btn-primary min-h-11 justify-center">
                Tạo prompt đầu tiên
              </Link>
            )}
          />
        )}
      </section>

      <section aria-labelledby="quick-actions-title">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <h2 id="quick-actions-title" className="font-display text-lg font-bold text-text">Lối tắt</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map(({ to, title, description, icon: Icon, primary }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-h-32 items-start gap-4 rounded-xl border p-5 transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: primary ? 'var(--color-primary)' : 'var(--color-bg-card)',
                borderColor: primary ? 'var(--color-primary)' : 'var(--color-border)',
                color: primary ? '#ffffff' : 'var(--color-text)',
              }}
            >
              <Icon className="mt-0.5 h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-display font-bold">{title}</p>
                <p className={`mt-1 text-sm leading-5 ${primary ? 'text-white/80' : 'text-text-muted'}`}>
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
