import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  FileText,
  GraduationCap,
  MessageSquareText,
  NotebookPen,
  SearchCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { CTASection, EditorialCard, LoadingState, SectionHeading, ShapeAccent } from '../components/ui';
import { guideLessons, type GuideAccent } from '../data/guideLessons';
import { fetchPublishedContentPosts, type PublishedContentPost } from '../lib/publicContentApi';

interface Outcome {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: GuideAccent;
}

const accentText: Record<GuideAccent, string> = {
  blue: 'var(--color-primary)',
  green: 'var(--color-secondary)',
  orange: 'var(--color-accent)',
  ink: 'var(--color-text)',
};

const accentSoft: Record<GuideAccent, string> = {
  blue: 'var(--color-primary-light)',
  green: 'var(--color-secondary-light)',
  orange: 'var(--color-accent-light)',
  ink: 'var(--color-bg-muted)',
};

const outcomes: Outcome[] = [
  {
    title: 'Hiểu AI là gì',
    desc: 'Biết AI có thể giúp gì, dễ sai ở đâu và vì sao câu trả lời nghe rất chắc vẫn cần kiểm chứng.',
    icon: Brain,
    accent: 'blue',
  },
  {
    title: 'Biết viết prompt tốt',
    desc: 'Dùng vai trò, bối cảnh, nhiệm vụ và định dạng để hỏi rõ hơn, học nhẹ hơn.',
    icon: MessageSquareText,
    accent: 'orange',
  },
  {
    title: 'Biết kiểm chứng thông tin',
    desc: 'Đối chiếu câu trả lời AI với SGK, tài liệu chính thống và chính suy luận của bạn.',
    icon: SearchCheck,
    accent: 'green',
  },
  {
    title: 'Biết học chủ động với AI',
    desc: 'Dùng AI để gợi ý, luyện tập và tự kiểm tra, không dùng AI để chép cho nhanh.',
    icon: Target,
    accent: 'ink',
  },
];

function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`section-label inline-flex ${className}`}>{children}</span>;
}

function IconMark({ icon: Icon, accent = 'blue' }: { icon: LucideIcon; accent?: GuideAccent }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center border"
      style={{
        backgroundColor: accentSoft[accent],
        borderColor: 'color-mix(in srgb, var(--color-border-strong) 50%, transparent)',
        color: accentText[accent],
        boxShadow: `4px 4px 0 color-mix(in srgb, ${accentText[accent]} 14%, transparent)`,
      }}
    >
      <Icon size={20} />
    </span>
  );
}

function NumberStamp({ children, accent = 'blue' }: { children: ReactNode; accent?: GuideAccent }) {
  return (
    <span
      className="inline-flex h-9 min-w-9 items-center justify-center px-2 font-mono text-xs font-bold"
      style={{
        backgroundColor: accentText[accent],
        color: '#ffffff',
        boxShadow: `4px 4px 0 color-mix(in srgb, ${accentText[accent]} 18%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

function PublishedPostsSection({ posts, loading }: { posts: PublishedContentPost[]; loading: boolean }) {
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <SectionHeading
        eyebrow="Bài viết mới"
        title="Bài viết mới từ EduAI-Hub"
        description="Phần này lấy từ nội dung admin đã xuất bản. Các bài học mini-course ở trên vẫn là nội dung tĩnh, nên trang không bị trống nếu Supabase chưa có bài mới."
        action={
          <Link to="/lessons" className="btn-outline gap-2">
            Xem tất cả
            <ArrowRight size={15} />
          </Link>
        }
      />

      <div className="mt-7">
        {loading ? (
          <LoadingState label="Đang tải bài viết mới..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} to={`/lessons/${post.slug}`} className="card-soft-hover flex min-h-56 flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
                    style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  >
                    <FileText size={11} />
                    {post.category || 'Bài viết'}
                  </span>
                  <span className="text-xs text-text-light">{post.reading_minutes || 5} phút</span>
                </div>
                <h3 className="font-display text-lg font-bold leading-snug text-text">{post.title}</h3>
                <p className="line-clamp-3 text-sm leading-7 text-text-muted">
                  {post.excerpt || 'Bài viết từ EduAI-Hub giúp bạn học chủ động hơn với AI.'}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Đọc tiếp
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Guides() {
  const [publishedPosts, setPublishedPosts] = useState<PublishedContentPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const lessonCount = guideLessons.length;

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedPosts() {
      setPostsLoading(true);
      try {
        const posts = await fetchPublishedContentPosts();
        if (!cancelled) setPublishedPosts(posts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching guide posts:', error);
        if (!cancelled) setPublishedPosts([]);
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    }

    loadPublishedPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-bg text-text">
      <section className="relative overflow-hidden border-b px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8" style={{ borderColor: 'var(--color-border)' }}>
        <ShapeAccent variant="blob" color="green" className="absolute -left-10 top-28 opacity-40" />
        <ShapeAccent variant="stamp" color="orange" className="absolute right-5 top-24 hidden opacity-75 sm:block" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <Eyebrow>Cẩm nang học AI</Eyebrow>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.04] text-text sm:text-5xl lg:text-6xl">
              Cẩm nang học AI cho học sinh THPT
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-text-muted sm:text-lg">
              Một mini-course gồm {lessonCount} bài học ngắn giúp bạn hiểu AI, viết prompt tốt hơn, kiểm chứng thông tin và dùng AI để học thật, không chép bài.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
              EduAI-Hub giúp bạn tận dụng các công cụ AI miễn phí như ChatGPT, Gemini, Claude và các trợ lý AI học tập trong nền tảng.
              Mục tiêu không phải để AI học thay bạn, mà để bạn biết hỏi, biết nghĩ cùng AI và biết tự kiểm tra kết quả.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/ai-tools" className="btn-primary gap-2">
                Khám phá Công Cụ AI
                <Sparkles size={16} />
              </Link>
              <Link to="/prompts" className="btn-outline gap-2">
                Xem Kho Prompt
                <NotebookPen size={16} />
              </Link>
              <Link to="/textbooks" className="btn-outline gap-2">
                Mở bản đồ chương trình
                <BookOpen size={16} />
              </Link>
            </div>
          </div>

          <EditorialCard accent="blue" className="overflow-hidden p-0">
            <div className="grid gap-0 sm:grid-cols-[0.82fr_1fr] lg:grid-cols-1 xl:grid-cols-[0.82fr_1fr]">
              <div className="relative min-h-56 bg-primary p-6 text-white">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="relative flex h-full flex-col justify-between gap-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Mini-course</p>
                    <p className="mt-4 font-display text-5xl font-black leading-none">{lessonCount}</p>
                    <p className="mt-2 text-sm font-semibold text-white/85">bài học có thể đọc riêng từng phần</p>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 bg-white px-3 py-2 text-xs font-bold text-primary">
                    <GraduationCap size={14} />
                    Học chủ động hơn
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <IconMark icon={GraduationCap} accent="orange" />
                  <div>
                    <Eyebrow>Sứ mệnh của EduAI-Hub</Eyebrow>
                  </div>
                </div>
                <h2 className="font-display text-2xl font-bold leading-tight text-text">Dùng AI như bạn học, không như phao cứu sinh</h2>
                <p className="mt-3 text-sm leading-7 text-text-muted">
                  EduAI-Hub không khuyến khích học sinh chép đáp án hay để AI làm hộ bài. Cẩm nang này giúp bạn hỏi tốt hơn,
                  hiểu sâu hơn, kiểm chứng kỹ hơn và dần học độc lập hơn.
                </p>
              </div>
            </div>
          </EditorialCard>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-14 sm:py-16">
          <SectionHeading
            eyebrow="Bạn sẽ học được gì?"
            title="Một bộ kỹ năng nhỏ, dùng được trong mọi môn học"
            description="Các bài học được thiết kế để đọc nhanh, nhưng mỗi bài đều có mục tiêu rõ và có thể áp dụng ngay."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((item, index) => (
              <EditorialCard key={item.title} accent={item.accent} className={`min-h-64 ${index === 1 ? 'lg:mt-8' : ''} ${index === 2 ? 'lg:-mt-4' : ''}`}>
                <IconMark icon={item.icon} accent={item.accent} />
                <h3 className="mt-5 font-display text-xl font-bold leading-tight text-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{item.desc}</p>
              </EditorialCard>
            ))}
          </div>
        </section>

        <section className="border-y py-14 sm:py-16" style={{ borderColor: 'var(--color-border)' }}>
          <SectionHeading
            eyebrow={`Lộ trình ${lessonCount} bài học`}
            title="Đi từng bài, hoặc chọn đúng phần bạn đang cần"
            description="Mỗi thẻ là một bài riêng với URL riêng. Bạn có thể đọc theo thứ tự hoặc mở ngay bài phù hợp với vấn đề hôm nay."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {guideLessons.map((lesson) => (
              <EditorialCard key={lesson.slug} accent={lesson.accent} interactive className="flex min-h-[25rem] flex-col">
                <div className="flex items-start justify-between gap-4">
                  <NumberStamp accent={lesson.accent}>{String(lesson.number).padStart(2, '0')}</NumberStamp>
                  <span
                    className="inline-flex px-2.5 py-1 text-xs font-bold"
                    style={{ backgroundColor: accentSoft[lesson.accent], color: accentText[lesson.accent] }}
                  >
                    {lesson.tag}
                  </span>
                </div>
                <IconMark icon={lesson.icon} accent={lesson.accent} />
                <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-text">{lesson.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{lesson.cardDescription}</p>
                <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-light">Mục tiêu</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-text">{lesson.goal}</p>
                </div>
                <Link to={`/guides/${lesson.slug}`} className="btn-primary mt-auto gap-2 self-start">
                  Đọc bài
                  <ArrowRight size={15} />
                </Link>
              </EditorialCard>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <CTASection
            title="Muốn thực hành ngay sau khi đọc?"
            description="Đọc một bài trong cẩm nang, sau đó mở Công Cụ AI để thử viết prompt cho môn học của bạn. Học tốt với AI là đọc, thử, kiểm chứng và tự làm lại."
            primaryAction={
              <Link to="/ai-tools" className="btn-primary gap-2">
                Mở Công Cụ AI
                <Sparkles size={16} />
              </Link>
            }
            secondaryAction={
              <Link to="/prompts" className="btn-outline gap-2">
                Xem Kho Prompt
                <NotebookPen size={16} />
              </Link>
            }
          />
        </section>

        <PublishedPostsSection posts={publishedPosts} loading={postsLoading} />

        <section className="pb-16 pt-4 sm:pb-20">
          <div className="grid gap-4 border bg-bg-card p-5 shadow-card sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center" style={{ borderColor: 'var(--color-border-strong)' }}>
            <div>
              <Eyebrow>Quy tắc nhỏ</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-text">AI giúp bạn học tốt hơn khi bạn vẫn là người học chính</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                Hãy dùng AI để hỏi, luyện tập, kiểm chứng và tự giải thích lại. Đừng dùng AI để thay phần suy nghĩ của bạn.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-success">
              <CheckCircle size={18} />
              Học chủ động, không chép máy
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
