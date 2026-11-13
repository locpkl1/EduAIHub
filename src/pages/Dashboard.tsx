import { ArrowRight, BookOpen, Library, Loader2, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SavedPromptCollection from '../components/saved-prompts/SavedPromptWorkspace';
import { useAuth } from '../contexts/AuthContext';
import { useSavedPrompts } from '../hooks/useSavedPrompts';
import { guideLessons } from '../data/guideLessons';
import { learningTools } from '../data/learningTools';
import { recommendLearning } from '../lib/learningRecommendations';

export default function Dashboard() {
  const { user, profile, loading: authLoading, isGuest, displayName, signInWithGoogle } = useAuth();
  const { prompts, loading, fetchError, retry, updatePrompt, deletePrompt } = useSavedPrompts({ userId: user?.id, enabled: !authLoading && !isGuest, limit: 3 });
  if (authLoading && !user) return <div role="status" className="page-container py-10">Đang mở không gian học tập…</div>;
  const suggestions = recommendLearning(profile);
  const needsProfile = !profile?.grade || !profile.school?.trim() || !profile.onboarding_completed;
  return <div className="page-container max-w-6xl space-y-8 py-6 sm:py-8">
    <header><h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{isGuest ? 'Không gian học tập của bạn' : `Chào ${displayName || 'bạn'}, hôm nay mình học gì?`}</h1><p className="mt-3 text-base leading-7 text-text-muted">{profile?.grade && [10, 11, 12].includes(profile.grade) ? `Lớp ${profile.grade} · ` : ''}Chọn một việc cần hiểu, rồi thử với bài học của bạn.</p></header>
    {isGuest ? <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-4"><p className="text-sm text-text-muted">Đăng nhập để mở workspace và dùng prompt cá nhân đã lưu.</p><button type="button" className="btn-outline" onClick={signInWithGoogle}>Đăng nhập</button></div> : needsProfile && <aside className="flex items-start gap-3 border-y border-border py-4"><UserCircle size={20} className="mt-1 shrink-0 text-primary" /><p className="text-sm leading-6 text-text-muted">Bạn có thể bổ sung lớp, mục tiêu và cách học để nhận gợi ý sát hơn. <Link className="font-semibold text-primary-text underline underline-offset-4" to="/profile">Hoàn thiện hồ sơ</Link></p></aside>}
    <section aria-labelledby="start-learning-title" className="dashboard-start">
      <div><h2 id="start-learning-title" className="text-2xl font-bold">Bắt đầu học cùng AI</h2><p className="mt-3 max-w-2xl text-base leading-7">Đọc bài đầu, chọn một hoạt động thử và tự kiểm tra bằng lời của mình.</p></div>
      <Link to={`/guides/${guideLessons[0].slug}`} className="btn-primary shrink-0">Bắt đầu bài 01 <ArrowRight size={16} /></Link>
    </section>
    <section aria-labelledby="my-tools-title"><h2 id="my-tools-title" className="text-2xl font-bold">Chọn trợ lý theo việc cần làm</h2><div className="mt-4 grid gap-3 lg:grid-cols-3">{learningTools.map(tool => <Link key={tool.href} to={tool.href} className="flex min-w-0 items-start gap-3 rounded-card border border-border-interactive bg-bg-card p-4 hover:border-primary"><tool.icon size={21} className="mt-1 shrink-0 text-primary" aria-hidden="true" /><span className="min-w-0"><strong className="block text-base">{tool.title}</strong><span className="mt-2 block text-sm leading-6 text-text-muted">{tool.situation}</span></span></Link>)}</div></section>
    <section aria-labelledby="recent-prompts-title"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 id="recent-prompts-title" className="text-2xl font-bold">Prompt gần đây</h2><Link to="/prompts" className="btn-ghost">Mở Kho Prompt <ArrowRight size={15} /></Link></div>
      {loading ? <p role="status" className="py-5 text-sm text-text-muted"><Loader2 className="mr-2 inline animate-spin" size={16} />Đang tải prompt…</p> : fetchError ? <div role="alert" className="border-y border-border py-4"><p className="text-sm text-text-muted">Chưa tải được prompt. Dữ liệu đã lưu không bị thay đổi.</p><button type="button" onClick={retry} className="btn-outline mt-3">Thử tải lại</button></div> : prompts.length ? <SavedPromptCollection prompts={prompts} onUpdate={updatePrompt} onDelete={deletePrompt} className="grid gap-4 lg:grid-cols-3" /> : <div className="border-y border-border py-5"><p className="text-base font-medium">{isGuest ? 'Đăng nhập để xem prompt cá nhân' : 'Bạn chưa lưu prompt nào'}</p><p className="mt-2 text-sm leading-6 text-text-muted">Sau khi tạo prompt phù hợp trong chatbot, chọn Lưu để quay lại dùng ở đây.</p><Link to="/ai-tools/goi-y-prompt-hoc-tap" className="btn-outline mt-4">Tạo prompt đầu tiên</Link></div>}
    </section>
    <section aria-labelledby="recommendations-title"><div className="flex flex-wrap items-baseline justify-between gap-3"><h2 id="recommendations-title" className="text-2xl font-bold">Gợi ý cho việc học của bạn</h2><Link to="/profile" className="text-sm font-semibold text-primary-text underline underline-offset-4">Cập nhật mục tiêu</Link></div><ul className="mt-4 divide-y divide-border border-y border-border">{suggestions.map(item => <li key={item.to} className="py-4"><Link to={item.to} className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-primary-text">{item.title}<ArrowRight size={16} /></Link><p className="mt-1 text-sm leading-6 text-text-muted">{item.reason}</p></li>)}</ul><p className="mt-3 text-sm text-text-muted">Gợi ý theo lựa chọn trong hồ sơ; bạn luôn có thể chọn nội dung khác.</p></section>
    <section aria-label="Tài nguyên học tập" className="flex flex-wrap gap-4 border-t border-border py-5"><Link to="/prompts" className="btn-ghost"><Library size={17} />Kho Prompt</Link><Link to="/textbooks" className="btn-ghost"><BookOpen size={17} />Tài nguyên học tập</Link></section>
  </div>;
}
