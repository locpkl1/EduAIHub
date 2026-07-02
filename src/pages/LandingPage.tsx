import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Copy,
  FileText,
  GraduationCap,
  Library,
  Lightbulb,
  MessageSquare,
  NotebookPen,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { CTASection, EditorialCard, SectionHeading, ShapeAccent } from '../components/ui';

type ChartPoint = { name: string; prompts: number; hoc: number };

const FALLBACK_CHART_DATA: ChartPoint[] = [
  { name: 'T2', prompts: 3, hoc: 45 },
  { name: 'T3', prompts: 7, hoc: 60 },
  { name: 'T4', prompts: 5, hoc: 52 },
  { name: 'T5', prompts: 12, hoc: 78 },
  { name: 'T6', prompts: 9, hoc: 85 },
  { name: 'T7', prompts: 15, hoc: 90 },
  { name: 'CN', prompts: 11, hoc: 72 },
];

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

const stats = [
  { value: '3', label: 'chatbot học tập', note: 'hướng dẫn, tạo prompt, hỏi đáp' },
  { value: '50+', label: 'prompt mẫu', note: 'cho học tập và viết lách' },
  { value: '10-12', label: 'khối THPT', note: 'bám sát nhu cầu học sinh Việt Nam' },
  { value: '24/7', label: 'bạn học AI', note: 'hỏi lại, luyện tập, tự kiểm tra' },
];

const valueCards = [
  {
    title: 'Hỏi AI như một người học chủ động',
    text: 'Không xin đáp án rồi chép. EduAI-Hub giúp bạn đặt câu hỏi rõ, yêu cầu giải thích và tự kiểm tra lại.',
    accent: 'blue' as const,
    icon: Lightbulb,
  },
  {
    title: 'Biến prompt thành kỹ năng học tập',
    text: 'Từ Toán, Văn, Anh đến ôn thi: bạn học cách viết prompt có ngữ cảnh, mục tiêu và định dạng cụ thể.',
    accent: 'orange' as const,
    icon: NotebookPen,
  },
  {
    title: 'Dùng AI có trách nhiệm',
    text: 'AI có thể sai. Nền tảng luôn nhắc bạn kiểm chứng, đối chiếu SGK và giữ tư duy độc lập.',
    accent: 'green' as const,
    icon: ShieldCheck,
  },
];

const chatbotCards = [
  {
    to: '/ai-tools/huong-dan-ai',
    title: 'Hướng Dẫn Sử Dụng AI',
    label: '01',
    description: 'Hiểu AI, tránh phụ thuộc, biết cách kiểm chứng thông tin.',
    color: 'var(--color-primary)',
  },
  {
    to: '/ai-tools/prompt-hoc-tap',
    title: 'Tạo Prompt Học Tập',
    label: '02',
    description: 'Chọn lớp, môn, bài học rồi tạo prompt học tập rõ ràng.',
    color: 'var(--color-accent)',
  },
  {
    to: '/ai-tools/prompt-da-dung',
    title: 'Tạo Prompt Đa Dụng',
    label: '03',
    description: 'Luyện cách viết prompt cho nhiều mục đích học và sáng tạo.',
    color: 'var(--color-secondary)',
  },
];

const lessonPreviews = [
  {
    title: 'Biến AI thành gia sư cá nhân',
    tag: 'Chiến lược',
    text: 'Thiết lập vai trò, học theo câu hỏi gợi mở và tự kiểm tra sau mỗi phiên.',
    time: '7 phút',
  },
  {
    title: 'Học tiếng Anh với AI',
    tag: 'Tiếng Anh',
    text: 'Luyện từ vựng, sửa đoạn văn, luyện nói và mở rộng ý tưởng bài luận.',
    time: '8 phút',
  },
  {
    title: 'Những lỗi hay gặp khi dùng AI',
    tag: 'Tư duy phản biện',
    text: 'Copy nguyên văn, hỏi quá mơ hồ, tin AI tuyệt đối và cách sửa từng lỗi.',
    time: '6 phút',
  },
];

const motionSteps = [
  ['Prompt thô', 'Giải thích bài này giúp em'],
  ['Prompt tốt hơn', 'Em học lớp 12, cần hiểu tích phân bằng ví dụ đời sống'],
  ['Kế hoạch học', '3 công thức, 2 ví dụ, 5 câu tự kiểm tra'],
  ['Ôn lại', 'Tóm tắt thành flashcard và câu hỏi nhanh'],
];

function weekdayLabel(date: Date) {
  return WEEKDAY_LABELS[date.getDay()];
}

function buildWeeklyChartData(
  prompts: { created_at: string }[],
  progress: { created_at: string; duration_minutes: number }[]
): ChartPoint[] {
  const map = Object.fromEntries(
    WEEKDAY_LABELS.map((label) => [label, { name: label, prompts: 0, hoc: 0 }])
  ) as Record<string, ChartPoint>;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  for (const item of prompts) {
    const d = new Date(item.created_at);
    if (d >= weekAgo) map[weekdayLabel(d)].prompts += 1;
  }

  for (const item of progress) {
    const d = new Date(item.created_at);
    if (d >= weekAgo) map[weekdayLabel(d)].hoc += item.duration_minutes;
  }

  return WEEKDAY_LABELS.map((label) => map[label]);
}

export default function LandingPage() {
  const { user, profile, signInWithGoogle } = useAuth();
  const [chartData, setChartData] = useState<ChartPoint[]>(FALLBACK_CHART_DATA);

  useEffect(() => {
    if (!profile || !isSupabaseConfigured) {
      setChartData(FALLBACK_CHART_DATA);
      return;
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    Promise.all([
      supabase
        .from('saved_prompts')
        .select('created_at')
        .eq('user_id', profile.id)
        .gte('created_at', weekAgo.toISOString()),
      supabase
        .from('learning_progress')
        .select('created_at, duration_minutes')
        .eq('user_id', profile.id)
        .gte('created_at', weekAgo.toISOString()),
    ])
      .then(([promptsRes, progressRes]) => {
        if (promptsRes.error || progressRes.error) return;
        const built = buildWeeklyChartData(promptsRes.data ?? [], progressRes.data ?? []);
        const hasData = built.some((d) => d.prompts > 0 || d.hoc > 0);
        setChartData(hasData ? built : FALLBACK_CHART_DATA);
      })
      .catch(() => setChartData(FALLBACK_CHART_DATA));
  }, [profile]);

  return (
    <div className="overflow-hidden text-text">
      <HeroSection user={user} onGoogleSignIn={signInWithGoogle} />
      <SocialProofStrip />
      <CoreValueSection />
      <CompanionSection />
      <PromptFeatureSection />
      <ProgressSection chartData={chartData} />
      <ResourcesSection />
      <MotionPlaceholderSection />
      <FinalCTA user={user} onGoogleSignIn={signInWithGoogle} />
    </div>
  );
}

function HeroSection({
  user,
  onGoogleSignIn,
}: {
  user: unknown;
  onGoogleSignIn: () => void;
}) {
  return (
    <section className="relative px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="absolute left-8 top-16 hidden lg:block">
        <ShapeAccent variant="line" color="orange" />
      </div>
      <div className="absolute right-10 top-24 hidden opacity-50 lg:block">
        <ShapeAccent variant="blob" color="green" className="h-28 w-28" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative z-10">
          <div
            className="mb-6 inline-flex rotate-[-1deg] items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border-strong)',
              boxShadow: '4px 4px 0 color-mix(in srgb, var(--color-accent) 18%, transparent)',
            }}
          >
            <GraduationCap size={14} className="text-primary" />
            Dành cho học sinh THPT Việt Nam
          </div>

          <h1 className="font-sans text-[clamp(2.55rem,7vw,5.9rem)] font-semibold leading-[1.08] tracking-normal text-text">
            Học cùng{' '}
            <span className="font-display font-extrabold text-primary">AI</span>,
            <span className="relative mt-2 block text-text sm:mt-3">
              vẫn là{' '}
              <span className="text-primary">chính mình</span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-1 h-3 w-[72%] -rotate-1 sm:-bottom-2"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 42%, transparent)' }}
              />
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
            EduAI-Hub là sổ tay học tập giúp bạn biết cách hỏi AI, viết prompt tốt hơn,
            kiểm chứng câu trả lời và biến AI thành bạn học đồng hành thay vì máy làm bài hộ.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/ai-tools" className="btn-primary group gap-2">
              Khám phá công cụ AI
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            {!user ? (
              <button type="button" onClick={onGoogleSignIn} className="btn-outline gap-2">
                <GoogleIcon />
                Đăng nhập Google
              </button>
            ) : (
              <Link to="/dashboard" className="btn-outline gap-2">
                Vào bảng học tập
                <ChevronRight size={16} />
              </Link>
            )}
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {['Lớp 10', 'Lớp 11', 'Lớp 12'].map((grade, index) => (
              <div
                key={grade}
                className="border px-3 py-3 text-center"
                style={{
                  backgroundColor: index === 1 ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <p className="font-sans text-lg font-semibold text-text">{grade}</p>
                <p className="mt-1 text-[11px] font-semibold text-text-muted">học chủ động</p>
              </div>
            ))}
          </div>
        </div>

        <HeroArtifactBoard />
      </div>
    </section>
  );
}

function HeroArtifactBoard() {
  return (
    <div className="relative mx-auto min-h-[560px] w-full max-w-2xl lg:min-h-[640px]">
      <div
        className="absolute left-4 top-8 h-[470px] w-[76%] rotate-[-3deg] border"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: 'var(--color-border-strong)',
          boxShadow: '14px 14px 0 color-mix(in srgb, var(--color-primary) 14%, transparent)',
        }}
      />

      <PromptSlip
        className="absolute left-0 top-16 w-[72%] rotate-[-5deg]"
        label="prompt yếu"
        text="Giải bài này giúp em."
        color="var(--color-accent)"
      />
      <PromptSlip
        className="absolute right-0 top-3 w-[66%] rotate-[4deg]"
        label="prompt tốt hơn"
        text="Em học lớp 12. Hãy gợi ý từng bước, đừng cho đáp án ngay."
        color="var(--color-primary)"
      />

      <div
        className="absolute left-8 top-44 w-[74%] border p-5"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: 'var(--color-border)',
          boxShadow: '8px 8px 0 color-mix(in srgb, var(--color-secondary) 18%, transparent)',
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-light">Phiên học 25 phút</span>
          <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white">AI đồng hành</span>
        </div>
        <div className="space-y-3">
          {[
            ['1', 'Tóm tắt khái niệm bằng ví dụ đời sống'],
            ['2', 'Cho 3 câu hỏi gợi mở để tự làm'],
            ['3', 'Kiểm tra lại với SGK trước khi ghi nhớ'],
          ].map(([num, text]) => (
            <div key={num} className="flex items-start gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                {num}
              </span>
              <p className="text-sm leading-6 text-text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-20 right-4 w-[52%] rotate-[5deg] border p-4"
        style={{
          backgroundColor: 'var(--color-bg-muted)',
          borderColor: 'var(--color-border)',
        }}
      >
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">flashcard nhanh</p>
        <p className="font-sans text-xl font-semibold leading-snug text-text">Tích phân là gì?</p>
        <p className="mt-2 text-xs leading-5 text-text-muted">
          Diện tích tích lũy dưới đường cong, dùng để tính tổng liên tục.
        </p>
      </div>

      <div
        className="absolute bottom-0 left-8 w-[50%] -rotate-2 border p-4"
        style={{
          backgroundColor: 'var(--color-primary)',
          borderColor: 'var(--color-text)',
          color: '#ffffff',
          boxShadow: '8px 8px 0 color-mix(in srgb, var(--color-accent) 45%, transparent)',
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">ghi nhớ</p>
        <p className="mt-2 font-sans text-2xl font-semibold leading-snug">
          AI gợi ý. Bạn vẫn là người hiểu bài.
        </p>
      </div>
    </div>
  );
}

function SocialProofStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4"
        style={{ backgroundColor: 'transparent' }}
      >
        {stats.map((item, index) => (
          <div
            key={item.label}
            className="relative bg-bg-card px-5 py-6"
            style={{
              border: index === 0 ? '1px solid var(--color-border-strong)' : '1px solid transparent',
              boxShadow: index === 1 ? 'inset 0 -4px 0 color-mix(in srgb, var(--color-accent) 28%, transparent)' : 'none',
              clipPath:
                index === 3
                  ? 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)'
                  : undefined,
            }}
          >
            {index === 3 && (
              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-[18px] w-[18px]"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 22%, var(--color-bg))' }}
              />
            )}
            <p className="font-display text-4xl font-extrabold text-primary">{item.value}</p>
            <p className="mt-1 text-sm font-bold text-text">{item.label}</p>
            <p className="mt-2 text-xs leading-5 text-text-muted">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CoreValueSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Không phải thêm một app AI"
          title={
            <>
              Đây là cách học mới:
              <br />
              hỏi tốt hơn, hiểu sâu hơn.
            </>
          }
          description="EduAI-Hub không biến AI thành phép màu. Nền tảng giúp học sinh tập tư duy, đặt câu hỏi, nhận phản hồi và biết khi nào cần kiểm chứng."
          action={
            <Link to="/guides" className="btn-outline gap-2">
              Đọc hướng dẫn
              <ArrowRight size={15} />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {valueCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <EditorialCard
                key={card.title}
                accent={card.accent}
                className={index === 1 ? 'md:translate-y-8' : ''}
                interactive
              >
                <Icon size={24} className="mb-8 text-primary" />
                <h3 className="font-sans text-2xl font-semibold leading-[1.22] text-text">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-text-muted">{card.text}</p>
              </EditorialCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CompanionSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">AI như bạn học</p>
          <h2 className="font-sans text-4xl font-semibold leading-[1.16] tracking-normal text-text sm:text-5xl">
            Không lạnh lùng.
            <br />
            Không làm thay.
            <br />
            Luôn hỏi ngược lại.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-text-muted">
            Một phiên học tốt với AI nên giống như ngồi cạnh một bạn học kiên nhẫn:
            cùng chia nhỏ bài, cùng thử cách giải, cùng kiểm tra điểm chưa chắc.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-7 lg:gap-x-7 lg:gap-y-8">
          <NotebookNote title="Bạn hỏi" color="var(--color-accent)" tilt="-0.8deg">
            “Mình đang kẹt ở bước đổi biến. Hãy gợi ý 1 câu, đừng giải hết.”
          </NotebookNote>
          <NotebookNote title="AI đáp" color="var(--color-primary)" tilt="1deg" className="sm:mt-6">
            “Thử nhìn biểu thức nào có đạo hàm xuất hiện cạnh nó. Bạn thấy phần nào giống vậy?”
          </NotebookNote>
          <NotebookNote title="Bạn tự làm" color="var(--color-secondary)" tilt="0.6deg">
            “Mình chọn u = x² + 1, vậy du = 2x dx. Bước tiếp theo là gì?”
          </NotebookNote>
          <NotebookNote title="Kết quả" color="var(--color-primary)" tilt="-0.7deg" className="sm:mt-6">
            “Bạn hiểu cách làm, không chỉ nhận đáp án. Ghi lại thành flashcard nhé.”
          </NotebookNote>
        </div>
      </div>
    </section>
  );
}

function PromptFeatureSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Prompt là kỹ năng"
              title="Ba chatbot, ba cách học AI thực tế."
              description="Mỗi chatbot có một vai trò rõ ràng: hiểu AI, tạo prompt học tập theo môn lớp, hoặc luyện prompt tự do cho nhiều mục đích."
            />
            <div className="mt-8 space-y-4">
              {chatbotCards.map((bot) => (
                <Link
                  key={bot.to}
                  to={bot.to}
                  className="group relative flex items-start gap-4 bg-bg-card p-5 transition-all hover:-translate-y-1"
                  style={{
                    borderLeft: `4px solid ${bot.color}`,
                    borderTop: '1px solid color-mix(in srgb, var(--color-border) 58%, transparent)',
                    boxShadow: `0 14px 30px -24px ${bot.color}`,
                    clipPath:
                      bot.label === '02'
                        ? 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)'
                        : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-0 h-2 w-12 -translate-y-1/2"
                    style={{ backgroundColor: `color-mix(in srgb, ${bot.color} 22%, transparent)` }}
                  />
                  <span
                    className="font-display text-4xl font-extrabold leading-none"
                    style={{ color: bot.color }}
                  >
                    {bot.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-xl font-semibold leading-snug text-text">{bot.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-text-muted">{bot.description}</span>
                  </span>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-text-light transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <PromptBuilderCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressSection({ chartData }: { chartData: ChartPoint[] }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[0.9fr_minmax(0,1.1fr)] lg:items-center">
          <div className="min-w-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">Theo dõi việc học</p>
            <h2 className="font-sans text-4xl font-semibold leading-[1.16] tracking-normal text-text sm:text-5xl">
              Học với AI cũng cần nhịp, không chỉ cảm hứng.
            </h2>
            <p className="mt-5 text-base leading-8 text-text-muted">
              Dashboard giúp bạn nhìn lại prompt đã tạo, phiên học đã ghi nhận và những việc cần làm.
              Không phải để áp lực, mà để thấy mình đang tiến bộ.
            </p>
          </div>

          <div className="min-w-0 max-w-full overflow-hidden">
            <DashboardPreview chartData={chartData} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Bài học và tài nguyên"
          title="Một góc học tập có hướng dẫn, không chỉ danh sách link."
          description="Đọc kinh nghiệm dùng AI, lưu prompt hay, mở sách giáo khoa và quay lại luyện tập ngay trong cùng một không gian."
          action={
            <Link to="/lessons" className="btn-outline gap-2">
              Xem bài học
              <ArrowRight size={15} />
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-3">
            {lessonPreviews.map((lesson, index) => (
              <Link
                key={lesson.title}
                to="/lessons"
                className={`relative bg-bg-card p-5 transition-all hover:-translate-y-1 ${index === 1 ? 'sm:translate-y-8' : ''}`}
                style={{
                  border: index === 0 ? '1px solid var(--color-border)' : '1px solid transparent',
                  boxShadow:
                    index === 2
                      ? 'inset 0 0 0 1px var(--color-border), 0 10px 24px -18px color-mix(in srgb, var(--color-accent) 55%, transparent)'
                      : '0 10px 24px -18px color-mix(in srgb, var(--color-primary) 55%, transparent)',
                  clipPath:
                    index === 1
                      ? 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)'
                      : undefined,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-0 h-2 w-14 -translate-y-1/2"
                  style={{
                    backgroundColor:
                      index === 0
                        ? 'color-mix(in srgb, var(--color-primary) 22%, transparent)'
                        : index === 1
                          ? 'color-mix(in srgb, var(--color-secondary) 26%, transparent)'
                          : 'color-mix(in srgb, var(--color-accent) 24%, transparent)',
                  }}
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{lesson.tag}</span>
                <h3 className="mt-4 font-sans text-xl font-semibold leading-[1.22] text-text">{lesson.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{lesson.text}</p>
                <p className="mt-5 text-xs font-bold text-text-light">{lesson.time} đọc</p>
              </Link>
            ))}
          </div>

          <div
            className="relative overflow-hidden p-6"
            style={{
              backgroundColor: 'var(--color-bg-muted)',
              borderLeft: '4px solid var(--color-primary)',
              borderTop: '1px solid color-mix(in srgb, var(--color-border) 55%, transparent)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
            }}
          >
            <span
              aria-hidden="true"
              className="absolute right-6 top-0 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              kiểm chứng
            </span>
            <Library size={28} className="text-primary" />
            <h3 className="mt-5 font-sans text-3xl font-semibold leading-[1.2] text-text">
              Prompt và SGK nằm gần nhau.
            </h3>
            <p className="mt-4 text-sm leading-7 text-text-muted">
              Khi AI đưa ra ý tưởng, bạn vẫn có thể quay lại tài liệu chính thống để kiểm chứng.
              Đây là nhịp học an toàn hơn cho bài kiểm tra thật.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/prompts" className="btn-primary gap-2">
                Kho Prompt <ArrowRight size={15} />
              </Link>
              <Link to="/textbooks" className="btn-outline gap-2">
                Sách Giáo Khoa <BookOpen size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MotionPlaceholderSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="mx-auto max-w-7xl overflow-hidden p-5 sm:p-8 lg:p-10"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderTop: '1px solid var(--color-border-strong)',
          borderLeft: '1px solid var(--color-border)',
          borderRadius: '18px',
          boxShadow: '0 18px 48px -34px color-mix(in srgb, var(--color-secondary) 70%, transparent)',
        }}
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">Video ngắn sắp tới</p>
            <h2 className="font-sans text-4xl font-semibold leading-[1.16] tracking-normal text-text">
              Nhìn một prompt biến thành kế hoạch học.
            </h2>
            <p className="mt-5 text-base leading-8 text-text-muted">
              Khu vực này dành cho các video ngắn: sửa prompt, biến đoạn văn thành flashcard,
              tóm tắt SGK hoặc để chatbot dẫn bạn từng bước.
            </p>
          </div>

          <div
            className="relative min-h-[360px] overflow-hidden"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid color-mix(in srgb, var(--color-border) 72%, transparent)',
              borderRadius: '14px',
            }}
          >
            <button
              type="button"
              className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-primary transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border-strong)',
                boxShadow: '6px 6px 0 color-mix(in srgb, var(--color-primary) 18%, transparent)',
              }}
              aria-label="Video placeholder"
            >
              <Play size={24} fill="currentColor" />
            </button>
            <div className="grid h-full min-h-[360px] grid-cols-1 gap-3 p-4 sm:grid-cols-2">
              {motionSteps.map(([label, text], index) => (
                <div
                  key={label}
                  className="p-4"
                  style={{
                    backgroundColor: index % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-muted)',
                    border:
                      index === 0
                        ? '1px solid var(--color-border)'
                        : '1px solid color-mix(in srgb, var(--color-border) 45%, transparent)',
                    borderRadius: index === 3 ? '12px' : '0',
                    transform: `rotate(${index % 2 === 0 ? '-1.5deg' : '1.5deg'})`,
                    clipPath:
                      index === 2
                        ? 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)'
                        : undefined,
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">{label}</p>
                  <p className="mt-4 font-sans text-xl font-semibold leading-[1.22] text-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({
  user,
  onGoogleSignIn,
}: {
  user: unknown;
  onGoogleSignIn: () => void;
}) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CTASection
          className="rounded-[18px]"
          title="Bắt đầu bằng một câu hỏi tốt hơn hôm nay."
          description="Mở chatbot, chọn mục tiêu học và thử viết prompt đầu tiên. EduAI-Hub sẽ giúp bạn biến AI thành công cụ tự học có trách nhiệm."
          primaryAction={
            <Link to="/ai-tools" className="btn-primary gap-2">
              Bắt đầu học với AI
              <ArrowRight size={16} />
            </Link>
          }
          secondaryAction={
            user ? (
              <Link to="/dashboard" className="btn-outline gap-2">
                Xem tiến độ
                <TrendingUp size={16} />
              </Link>
            ) : (
              <button type="button" onClick={onGoogleSignIn} className="btn-outline gap-2">
                <GoogleIcon />
                Đăng nhập Google
              </button>
            )
          }
        />
      </div>
    </section>
  );
}

function PromptSlip({
  label,
  text,
  color,
  className = '',
}: {
  label: string;
  text: string;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`relative p-4 ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid color-mix(in srgb, var(--color-border) 78%, transparent)',
        boxShadow: `0 12px 26px -20px ${color}`,
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-3 top-0 h-2 w-12 -translate-y-1/2"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 24%, transparent)` }}
      />
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {label}
      </p>
      <p className="font-sans text-lg font-semibold leading-[1.22] text-text">{text}</p>
    </div>
  );
}

function NotebookNote({
  title,
  color,
  children,
  tilt = '0deg',
  className = '',
}: {
  title: string;
  color: string;
  children: ReactNode;
  tilt?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative min-w-0 p-5 transition-transform duration-200 hover:-translate-y-1 ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid color-mix(in srgb, var(--color-border) 78%, transparent)',
        borderLeft: `3px solid ${color}`,
        boxShadow: `0 14px 28px -22px ${color}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        transform: `rotate(${tilt})`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-4 top-3 h-2 w-10"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 26%, transparent)` }}
      />
      <p className="mb-4 pr-12 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {title}
      </p>
      <p className="text-sm leading-7 text-text-muted">{children}</p>
    </div>
  );
}

function PromptBuilderCard() {
  return (
    <div
      className="relative overflow-hidden p-5"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: '16px',
        boxShadow: '0 18px 40px -30px color-mix(in srgb, var(--color-accent) 70%, transparent)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-5 top-0 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
      >
        prompt lab
      </span>
      <div className="mb-5 flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">Công thức prompt</p>
          <h3 className="mt-1 font-sans text-2xl font-semibold leading-snug text-text">4 mảnh ghép</h3>
        </div>
        <ClipboardList className="text-primary" size={28} />
      </div>

      <div className="space-y-3">
        {[
          ['Vai trò', 'Bạn là giáo viên Toán lớp 12...'],
          ['Ngữ cảnh', 'Em đang ôn chương tích phân...'],
          ['Nhiệm vụ', 'Giải thích bằng 2 ví dụ và 3 câu hỏi...'],
          ['Định dạng', 'Trình bày ngắn gọn theo bảng...'],
        ].map(([label, text], index) => (
          <div key={label} className="flex gap-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor:
                  index === 1 ? 'var(--color-accent-light)' : index === 2 ? 'var(--color-secondary-light)' : 'var(--color-primary-light)',
                color: index === 1 ? 'var(--color-accent)' : index === 2 ? 'var(--color-secondary)' : 'var(--color-primary)',
              }}
            >
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-bold text-text">{label}</p>
              <p className="text-sm leading-6 text-text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-6 border p-4"
        style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">kết quả</p>
        <p className="mt-2 text-sm leading-7 text-text-muted">
          AI hiểu bạn cần gì, trả lời đúng trọng tâm hơn và dễ biến thành phiên học thật.
        </p>
      </div>
    </div>
  );
}

function DashboardPreview({ chartData }: { chartData: ChartPoint[] }) {
  return (
    <div
      className="w-full min-w-0 max-w-full overflow-hidden border bg-bg-card p-4 sm:p-5"
      style={{
        borderColor: 'color-mix(in srgb, var(--color-border-strong) 78%, transparent)',
        borderRadius: '16px',
        boxShadow: '0 20px 46px -34px color-mix(in srgb, var(--color-primary) 70%, transparent)',
      }}
    >
      <div className="mb-5 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <BarChart2 size={18} className="text-primary" />
          <p className="min-w-0 truncate font-sans text-lg font-semibold text-text sm:text-xl">Bảng học tập</p>
        </div>
        <span className="border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-text-light" style={{ borderColor: 'var(--color-border)' }}>
          tuần này
        </span>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        {[
          ['47', 'prompt đã tạo', Sparkles],
          ['23', 'phiên chat', MessageSquare],
          ['12', 'bài đã đọc', BookOpen],
          ['7', 'ngày liên tiếp', TrendingUp],
        ].map(([value, label, Icon]) => (
          <div
            key={label as string}
            className="min-w-0 p-3"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderTop: '1px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
              boxShadow: 'inset 0 -3px 0 color-mix(in srgb, var(--color-primary) 10%, transparent)',
            }}
          >
            <Icon size={14} className="mb-2 text-primary" />
            <p className="font-display text-2xl font-extrabold text-text">{value as string}</p>
            <p className="mt-1 break-words text-[11px] leading-4 text-text-muted">{label as string}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
        <ChartPanel title="Phút học" dataKey="hoc" color="var(--color-primary)" chartData={chartData} />
        <ChartPanel title="Prompt" dataKey="prompts" color="var(--color-accent)" chartData={chartData} />
      </div>

      <div
        className="mt-5 flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-start"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderLeft: '3px solid var(--color-accent)',
          borderTop: '1px solid color-mix(in srgb, var(--color-border) 58%, transparent)',
        }}
      >
        <FileText size={18} className="mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-light">Prompt gần nhất</p>
          <p className="mt-2 min-w-0 break-words text-sm leading-6 text-text-muted sm:line-clamp-1">
            “Bạn là giáo viên tiếng Anh. Giải thích 5 từ vựng Unit 3 bằng ví dụ dễ nhớ...”
          </p>
        </div>
        <button
          type="button"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-xs font-bold text-primary"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Copy size={12} />
          Copy
        </button>
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  dataKey,
  color,
  chartData,
}: {
  title: string;
  dataKey: 'hoc' | 'prompts';
  color: string;
  chartData: ChartPoint[];
}) {
  const gradientId = `landing-${dataKey}`;

  return (
    <div
      className="min-w-0 overflow-hidden p-3 sm:p-4"
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid color-mix(in srgb, var(--color-border) 58%, transparent)',
        borderRadius: '12px',
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-text">{title}</p>
        <span className="text-xs font-bold" style={{ color }}>
          +18%
        </span>
      </div>
      <div className="h-[112px] min-w-0 sm:h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.38} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-light)' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 0,
              color: 'var(--color-text)',
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
