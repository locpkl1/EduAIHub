import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  Compass,
  FileText,
  GraduationCap,
  LockKeyhole,
  MessageSquareText,
  NotebookPen,
  PenLine,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { CTASection, EditorialCard, LoadingState, SectionHeading, ShapeAccent } from '../components/ui';
import { fetchPublishedContentPosts, type PublishedContentPost } from '../lib/publicContentApi';

type Accent = 'blue' | 'green' | 'orange' | 'ink';

interface Outcome {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: Accent;
}

interface CourseLesson {
  id: string;
  title: string;
  short: string;
  time: string;
  icon: LucideIcon;
  accent: Accent;
  explanation: string;
  example: string;
  warning?: string;
  takeaways: string[];
}

interface WarningCard {
  title: string;
  desc: string;
  action: string;
  icon: LucideIcon;
}

interface FlowStep {
  title: string;
  desc: string;
  to: string;
  icon: LucideIcon;
}

const accentText: Record<Accent, string> = {
  blue: 'var(--color-primary)',
  green: 'var(--color-secondary)',
  orange: 'var(--color-accent)',
  ink: 'var(--color-text)',
};

const accentSoft: Record<Accent, string> = {
  blue: 'var(--color-primary-light)',
  green: 'var(--color-secondary-light)',
  orange: 'var(--color-accent-light)',
  ink: 'var(--color-bg-muted)',
};

const outcomes: Outcome[] = [
  {
    title: 'Hiểu AI là gì',
    desc: 'Biết AI giỏi ở đâu, dễ sai ở đâu, và vì sao một câu trả lời nghe rất tự tin vẫn cần được kiểm tra.',
    icon: Brain,
    accent: 'blue',
  },
  {
    title: 'Biết viết prompt tốt',
    desc: 'Dùng vai trò, bối cảnh, nhiệm vụ và định dạng để biến câu hỏi mơ hồ thành một yêu cầu học tập rõ ràng.',
    icon: PenLine,
    accent: 'orange',
  },
  {
    title: 'Biết kiểm chứng câu trả lời',
    desc: 'So sánh với sách giáo khoa, nguồn đáng tin, thầy cô và chính suy luận của bạn trước khi dùng kết quả.',
    icon: SearchCheck,
    accent: 'green',
  },
  {
    title: 'Biết học chủ động với AI',
    desc: 'Dùng AI để được gợi ý, luyện tập, tự kiểm tra và làm lại, không dùng AI để chép cho nhanh.',
    icon: Target,
    accent: 'ink',
  },
];

const courseLessons: CourseLesson[] = [
  {
    id: '01',
    title: 'Chào mừng đến với EduAI-Hub',
    short: 'AI là bạn học, không phải người làm bài thuê.',
    time: '4 phút',
    icon: GraduationCap,
    accent: 'blue',
    explanation:
      'EduAI-Hub giúp bạn học cách dùng các công cụ AI miễn phí như ChatGPT, Gemini, Claude và các trợ lý AI trong nền tảng theo cách có trách nhiệm. Mục tiêu là học sâu hơn, hỏi rõ hơn và tự làm tốt hơn.',
    example:
      'Thay vì hỏi: "Làm bài này giúp em", hãy hỏi: "Hãy gợi ý bước đầu tiên để em tự giải bài này, sau đó kiểm tra cách làm của em."',
    warning: 'Nếu AI làm hết bài, điểm có thể cao hơn trong một ngày, nhưng năng lực của bạn sẽ không đi cùng.',
    takeaways: ['AI hỗ trợ quá trình học', 'Bạn vẫn là người suy nghĩ chính', 'Mỗi câu trả lời cần được hiểu lại bằng lời của mình'],
  },
  {
    id: '02',
    title: 'AI là gì? Hiểu đơn giản trước đã',
    short: 'Một hệ thống dự đoán rất giỏi, không phải bộ não thứ hai.',
    time: '6 phút',
    icon: Brain,
    accent: 'green',
    explanation:
      'AI học từ rất nhiều dữ liệu để tạo ra phản hồi có vẻ hợp lý. Nó có thể giải thích, tóm tắt, đặt câu hỏi và gợi ý hướng học, nhưng không thật sự hiểu lớp học, giáo viên hay bài kiểm tra của bạn như con người.',
    example:
      'Bạn có thể yêu cầu AI giải thích định luật bảo toàn năng lượng bằng ví dụ đời sống, rồi tự đối chiếu lại với định nghĩa trong sách giáo khoa.',
    warning: 'AI có thể "nói sai rất mượt". Tự tin không đồng nghĩa với chính xác.',
    takeaways: ['AI dự đoán câu trả lời', 'AI có thể sai', 'Hiểu bản chất giúp bạn bớt phụ thuộc'],
  },
  {
    id: '03',
    title: 'ChatGPT, Gemini, Claude khác nhau thế nào?',
    short: 'Nhiều công cụ, cùng một nguyên tắc: hỏi rõ và kiểm chứng.',
    time: '5 phút',
    icon: Sparkles,
    accent: 'orange',
    explanation:
      'ChatGPT, Gemini và Claude đều có thể hỗ trợ học tập, viết nháp, giải thích bài và luyện tập. Mỗi công cụ có điểm mạnh riêng, nhưng không công cụ nào thay thế được tư duy của bạn.',
    example:
      'Dùng ChatGPT để luyện hỏi đáp, Gemini để tham khảo thêm cách giải thích, Claude để rà lại dàn ý. Sau đó chọn phần đúng, sửa theo giọng của bạn.',
    warning: 'Đừng xem công cụ nào là "máy đáp án". Hãy xem chúng như nhiều góc nhìn để bạn học tốt hơn.',
    takeaways: ['Công cụ khác nhau, kỹ năng hỏi vẫn là lõi', 'So sánh nhiều phản hồi khi cần', 'Không gửi thông tin cá nhân nhạy cảm'],
  },
  {
    id: '04',
    title: 'Prompt là gì?',
    short: 'Prompt là cách bạn giao nhiệm vụ cho AI.',
    time: '5 phút',
    icon: MessageSquareText,
    accent: 'blue',
    explanation:
      'Prompt là câu hỏi hoặc yêu cầu bạn đưa cho AI. Prompt càng rõ mục tiêu, bối cảnh và định dạng, câu trả lời càng dễ dùng. Prompt mơ hồ thường tạo ra câu trả lời dài mà vẫn không trúng ý.',
    example:
      '"Em là học sinh lớp 11, đang học Este. Hãy giải thích khái niệm bằng 3 ý chính, 1 ví dụ, rồi hỏi em 3 câu kiểm tra."',
    takeaways: ['Prompt là đề bài dành cho AI', 'Rõ bối cảnh giúp AI trả lời sát hơn', 'Prompt tốt vẫn cần kiểm tra kết quả'],
  },
  {
    id: '05',
    title: 'Công thức prompt 4 phần',
    short: 'Vai trò, bối cảnh, nhiệm vụ, định dạng.',
    time: '8 phút',
    icon: ClipboardCheck,
    accent: 'green',
    explanation:
      'Một prompt học tập tốt thường có 4 phần: AI đóng vai gì, bạn đang học gì, AI cần làm nhiệm vụ nào, và kết quả nên trình bày ra sao. Công thức này giúp bạn hỏi ngắn mà vẫn đủ ý.',
    example:
      '"Bạn là gia sư Toán lớp 10. Em đang học hàm số bậc hai và chưa hiểu đỉnh parabol. Hãy giải thích từng bước bằng ngôn ngữ đơn giản, sau đó cho 3 bài tự luyện có đáp án."',
    takeaways: ['Vai trò định hướng giọng trả lời', 'Bối cảnh giúp bám chương trình', 'Định dạng giúp bạn dễ học lại'],
  },
  {
    id: '06',
    title: 'Dùng AI để học bài, không phải chép bài',
    short: 'Xin gợi ý, ví dụ và phản hồi, không xin bài làm hoàn chỉnh.',
    time: '7 phút',
    icon: NotebookPen,
    accent: 'orange',
    explanation:
      'AI hữu ích nhất khi giúp bạn hiểu cách làm. Hãy yêu cầu AI chia nhỏ bài, đặt câu hỏi gợi mở, kiểm tra lời giải của bạn hoặc tạo bài tương tự để luyện thêm.',
    example:
      '"Đừng giải hết. Hãy cho em gợi ý bước 1, chờ em làm, rồi nhận xét xem em sai ở đâu."',
    warning: 'Copy nguyên văn làm bạn mất cơ hội luyện suy nghĩ. Đó là cái giá khá đắt cho một lần tiết kiệm vài phút.',
    takeaways: ['Xin hướng dẫn thay vì đáp án', 'Tự viết lại bằng lời của mình', 'Luyện thêm bài tương tự sau khi hiểu'],
  },
  {
    id: '07',
    title: 'Kiểm chứng thông tin AI',
    short: 'Nhanh là tốt, đúng mới dùng được.',
    time: '7 phút',
    icon: SearchCheck,
    accent: 'blue',
    explanation:
      'Với công thức, số liệu, sự kiện lịch sử, trích dẫn và kiến thức quan trọng, hãy kiểm tra lại bằng sách giáo khoa, tài liệu chính thống hoặc thầy cô. AI có thể bịa nguồn hoặc nhầm chi tiết.',
    example:
      'Sau khi AI giải một bài Vật lý, hãy thay số lại, kiểm tra đơn vị, rồi hỏi: "Bước nào trong lời giải này dễ sai nhất?"',
    warning: 'Nhất là trước khi nộp bài, đừng để AI là người duy nhất đã đọc câu trả lời.',
    takeaways: ['Đối chiếu với SGK', 'Kiểm tra số liệu và đơn vị', 'Hỏi AI tự chỉ ra điểm chưa chắc'],
  },
  {
    id: '08',
    title: 'Không phụ thuộc AI',
    short: 'Dùng AI như bánh phụ, không phải tay lái.',
    time: '6 phút',
    icon: ShieldCheck,
    accent: 'green',
    explanation:
      'Nếu câu hỏi nào bạn cũng đưa ngay cho AI, não sẽ quen bỏ qua bước tự nghĩ. Hãy thử tự làm trước vài phút, ghi rõ chỗ kẹt, rồi mới nhờ AI giúp đúng phần đó.',
    example:
      'Trước khi hỏi AI, viết ra: "Em nghĩ bài này dùng công thức nào, nhưng chưa biết bước biến đổi tiếp theo."',
    warning: 'Một dấu hiệu phụ thuộc là bạn thấy bất an khi phải làm bài mà không mở AI.',
    takeaways: ['Tự nghĩ trước khi hỏi', 'Dùng AI cho điểm kẹt cụ thể', 'Tự làm lại khi đã hiểu'],
  },
  {
    id: '09',
    title: 'Ba trợ lý AI trong EduAI-Hub',
    short: 'Chọn đúng trợ lý để học đúng việc.',
    time: '5 phút',
    icon: Zap,
    accent: 'orange',
    explanation:
      'EduAI-Hub có các trợ lý giúp bạn hiểu tư duy prompt, gợi ý prompt học tập và đánh giá prompt đã dùng. Khi chọn đúng trợ lý, bạn sẽ tiết kiệm thời gian và học có hệ thống hơn.',
    example:
      'Nếu bạn chưa biết hỏi thế nào, dùng trợ lý gợi ý prompt học tập. Nếu đã có prompt, dùng trợ lý đánh giá để làm câu hỏi rõ hơn.',
    takeaways: ['Trợ lý hướng dẫn AI giúp hiểu cách hỏi', 'Trợ lý prompt học tập giúp tạo câu hỏi tốt', 'Trợ lý đánh giá giúp sửa prompt yếu'],
  },
  {
    id: '10',
    title: 'Quy trình học 30 phút với AI',
    short: 'Một buổi học ngắn, có mục tiêu và có kiểm tra.',
    time: '8 phút',
    icon: Route,
    accent: 'blue',
    explanation:
      'Chia 30 phút thành 5 phần: tự đọc đề, hỏi AI đúng phần kẹt, luyện một ví dụ, kiểm chứng lại, rồi tự làm bài tương tự. Kết thúc bằng một câu tự giải thích: "Hôm nay mình hiểu được gì?"',
    example:
      '5 phút đọc SGK, 8 phút hỏi AI phần chưa hiểu, 7 phút làm ví dụ, 5 phút kiểm chứng, 5 phút tự tóm tắt và lưu prompt hay.',
    takeaways: ['Có mục tiêu trước khi hỏi', 'Luôn có bước tự làm lại', 'Lưu prompt tốt để lần sau học nhanh hơn'],
  },
];

const promptFormula = [
  ['Vai trò', 'Bạn là gia sư Toán lớp 10.'],
  ['Bối cảnh', 'Em đang học hàm số bậc hai và chưa hiểu đỉnh parabol.'],
  ['Nhiệm vụ', 'Hãy giải thích từng bước, dùng ví dụ dễ hiểu.'],
  ['Định dạng', 'Cuối cùng cho 3 bài tự luyện và đáp án kiểm tra.'],
];

const warningCards: WarningCard[] = [
  {
    title: 'Đừng tin AI tuyệt đối',
    desc: 'AI có thể sai về công thức, số liệu, sự kiện hoặc trích dẫn dù câu trả lời nghe rất chắc.',
    action: 'Luôn đối chiếu với SGK, nguồn chính thống hoặc thầy cô.',
    icon: AlertTriangle,
  },
  {
    title: 'Đừng copy nguyên văn',
    desc: 'Một bài làm trơn tru nhưng không phải giọng của bạn sẽ không giúp bạn tiến bộ.',
    action: 'Dùng AI để góp ý, sau đó tự viết lại bằng cách hiểu của mình.',
    icon: PenLine,
  },
  {
    title: 'Đừng đưa thông tin nhạy cảm',
    desc: 'Không nhập số điện thoại, địa chỉ, mật khẩu, mã học sinh hoặc chuyện riêng tư không cần thiết.',
    action: 'Chỉ cung cấp bối cảnh học tập: lớp, môn, bài, mục tiêu.',
    icon: LockKeyhole,
  },
  {
    title: 'Đừng bỏ qua sách giáo khoa',
    desc: 'AI có thể rút gọn quá tay và bỏ mất điều kiện quan trọng trong chương trình học.',
    action: 'Đọc SGK trước, dùng AI để giải thích lại đoạn khó.',
    icon: BookOpen,
  },
  {
    title: 'Hãy kiểm chứng trước khi nộp bài',
    desc: 'Bài nộp là trách nhiệm của bạn, không phải của chatbot.',
    action: 'Kiểm tra lại công thức, lập luận, nguồn và cách diễn đạt.',
    icon: ClipboardCheck,
  },
];

const eduFlow: FlowStep[] = [
  {
    title: 'Đọc cẩm nang',
    desc: 'Nắm nguyên tắc hỏi, học và kiểm chứng trước khi bắt đầu.',
    to: '/guides',
    icon: Compass,
  },
  {
    title: 'Vào Công Cụ AI',
    desc: 'Chọn đúng trợ lý cho việc hiểu AI, tạo prompt hoặc đánh giá prompt.',
    to: '/ai-tools',
    icon: Zap,
  },
  {
    title: 'Tạo hoặc cải thiện prompt',
    desc: 'Thêm lớp, môn, mục tiêu, phần đang kẹt và định dạng mong muốn.',
    to: '/ai-tools',
    icon: MessageSquareText,
  },
  {
    title: 'Kiểm chứng và tự làm lại',
    desc: 'So sánh với SGK, tự giải lại và sửa phần chưa chắc.',
    to: '/textbooks',
    icon: SearchCheck,
  },
  {
    title: 'Lưu prompt tốt',
    desc: 'Giữ lại câu hỏi hiệu quả để dùng cho lần ôn tập tiếp theo.',
    to: '/prompts',
    icon: NotebookPen,
  },
];

function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`section-label inline-flex ${className}`}>{children}</span>;
}

function IconMark({ icon: Icon, accent = 'blue' }: { icon: LucideIcon; accent?: Accent }) {
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

function NumberStamp({ children, accent = 'blue' }: { children: ReactNode; accent?: Accent }) {
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

function PromptExample() {
  return (
    <div
      className="paper-surface border p-5 shadow-card sm:p-6"
      style={{ borderColor: 'var(--color-border-strong)' }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Eyebrow>Prompt mẫu</Eyebrow>
        <span className="text-xs font-semibold text-text-light">Công thức 4 phần</span>
      </div>
      <p className="text-sm font-semibold leading-7 text-text sm:text-base">
        "Bạn là gia sư Toán lớp 10. Em đang học chương Hàm số bậc hai và chưa hiểu cách xác định đỉnh parabol.
        Hãy giải thích bằng ngôn ngữ đơn giản, có ví dụ từng bước, sau đó cho em 3 bài tự luyện và đáp án kiểm tra."
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {promptFormula.map(([label, text], index) => (
          <div key={label} className="border bg-bg-card p-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <NumberStamp accent={index % 2 === 0 ? 'blue' : 'orange'}>{index + 1}</NumberStamp>
              <p className="text-sm font-bold text-text">{label}</p>
            </div>
            <p className="mt-3 text-xs leading-6 text-text-muted">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonAccordion({
  lesson,
  isOpen,
  onToggle,
}: {
  lesson: CourseLesson;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="overflow-hidden border bg-bg-card shadow-card transition-all duration-200"
      style={{
        borderColor: isOpen ? accentText[lesson.accent] : 'var(--color-border)',
        boxShadow: isOpen
          ? `8px 8px 0 color-mix(in srgb, ${accentText[lesson.accent]} 14%, transparent)`
          : undefined,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5"
        aria-expanded={isOpen}
        aria-controls={`lesson-panel-${lesson.id}`}
      >
        <NumberStamp accent={lesson.accent}>{lesson.id}</NumberStamp>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-base font-bold leading-snug text-text sm:text-lg">{lesson.title}</span>
            <span
              className="inline-flex px-2 py-1 text-[11px] font-bold"
              style={{ backgroundColor: accentSoft[lesson.accent], color: accentText[lesson.accent] }}
            >
              {lesson.time}
            </span>
          </span>
          <span className="mt-1 block text-sm leading-6 text-text-muted">{lesson.short}</span>
        </span>
        <ChevronDown
          className="mt-1 shrink-0 text-text-light transition-transform duration-200"
          size={18}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {isOpen && (
        <div id={`lesson-panel-${lesson.id}`} className="border-t px-4 pb-5 pt-4 sm:px-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm leading-7 text-text-muted">{lesson.explanation}</p>
              {lesson.warning && (
                <div
                  className="mt-4 border-l-4 px-4 py-3 text-sm font-semibold leading-6"
                  style={{
                    backgroundColor: 'var(--color-accent-light)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text)',
                  }}
                >
                  {lesson.warning}
                </div>
              )}
            </div>
            <div className="border bg-bg-muted p-4" style={{ borderColor: 'var(--color-border)' }}>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-text-light">Ví dụ thực hành</p>
              <p className="text-sm leading-7 text-text">{lesson.example}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.takeaways.map((takeaway) => (
              <span
                key={takeaway}
                className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <CheckCircle size={12} style={{ color: accentText[lesson.accent] }} />
                {takeaway}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function PublishedPostsSection({ posts, loading }: { posts: PublishedContentPost[]; loading: boolean }) {
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <SectionHeading
        eyebrow="Bài viết mới"
        title="Hướng dẫn mới từ EduAI-Hub"
        description="Phần này lấy từ nội dung admin đã xuất bản. Nếu chưa có bài mới, cẩm nang tĩnh phía trên vẫn hoạt động bình thường."
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
  const [openLesson, setOpenLesson] = useState('01');
  const [publishedPosts, setPublishedPosts] = useState<PublishedContentPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

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
              Chào bạn, chào mừng bạn đến với EduAI-Hub. Nếu bạn từng dùng AI để hỏi bài, viết bài,
              học tiếng Anh hoặc ôn thi nhưng vẫn chưa biết hỏi sao cho đúng, trang này là điểm bắt đầu dành cho bạn.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
              EduAI-Hub giúp bạn tận dụng tốt các công cụ AI miễn phí như ChatGPT, Gemini, Claude và các trợ lý AI học tập
              trong nền tảng. Mục tiêu không phải là để AI học thay bạn, mà là giúp bạn biết đặt prompt, tư duy cùng AI,
              kiểm chứng thông tin và học tập hiệu quả hơn.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#lo-trinh" className="btn-primary gap-2">
                Bắt đầu học
                <ArrowRight size={16} />
              </a>
              <Link to="/ai-tools" className="btn-outline gap-2">
                Khám phá công cụ AI
                <Sparkles size={16} />
              </Link>
              <Link to="/prompts" className="btn-outline gap-2">
                Xem kho prompt
                <NotebookPen size={16} />
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
                    <p className="mt-4 font-display text-5xl font-black leading-none">10</p>
                    <p className="mt-2 text-sm font-semibold text-white/85">bài học ngắn, thực tế, dễ bắt đầu</p>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 bg-white px-3 py-2 text-xs font-bold text-primary">
                    <BookOpen size={14} />
                    Học để tự tin hơn
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
                  Nền tảng này không khuyến khích học sinh chép đáp án hay để AI làm hộ bài. EduAI-Hub giúp bạn hỏi tốt hơn,
                  hiểu sâu hơn, kiểm tra lại thông tin và dần học độc lập hơn.
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
            title="Một bộ kỹ năng nhỏ, nhưng dùng được mỗi ngày"
            description="Sau cẩm nang này, bạn không chỉ biết dùng AI. Bạn biết dùng AI theo cách giúp mình hiểu bài hơn."
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

        <section id="lo-trinh" className="border-y py-14 sm:py-16" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Lộ trình 10 bài học"
                title="Đi từ tò mò đến biết tự học cùng AI"
                description="Mỗi bài học là một mảnh ghép: hiểu AI, viết prompt, kiểm chứng, tránh phụ thuộc và dùng đúng công cụ trong EduAI-Hub."
              />
              <div className="mt-6 hidden border bg-bg-card p-5 shadow-card lg:block" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-sm font-bold text-text">Cách học gợi ý</p>
                <p className="mt-2 text-sm leading-7 text-text-muted">
                  Đọc lộ trình một lượt, mở bài bạn cần nhất, rồi thử viết lại một prompt cho môn học hôm nay.
                  Học AI tốt nhất là học bằng tay mình, không chỉ bằng mắt.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {courseLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setOpenLesson(lesson.id)}
                  className="group border bg-bg-card p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-1"
                  style={{
                    borderColor: openLesson === lesson.id ? accentText[lesson.accent] : 'var(--color-border)',
                    boxShadow:
                      openLesson === lesson.id
                        ? `6px 6px 0 color-mix(in srgb, ${accentText[lesson.accent]} 16%, transparent)`
                        : undefined,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <NumberStamp accent={lesson.accent}>{lesson.id}</NumberStamp>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold leading-snug text-text">{lesson.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-text-muted">{lesson.short}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <SectionHeading
            eyebrow="Nội dung chi tiết"
            title="Mở từng bài để học sâu hơn"
            description="Mỗi bài có giải thích ngắn, ví dụ thực hành và những điều cần nhớ. Không dài dòng, nhưng đủ để bạn bắt tay vào học."
          />
          <div className="mt-7 space-y-4">
            {courseLessons.map((lesson) => (
              <LessonAccordion
                key={lesson.id}
                lesson={lesson}
                isOpen={openLesson === lesson.id}
                onToggle={() => setOpenLesson((current) => (current === lesson.id ? '' : lesson.id))}
              />
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Công thức prompt"
                title="Hỏi rõ hơn, học nhẹ hơn"
                description="Prompt tốt không cần hoa mỹ. Nó chỉ cần cho AI biết bạn là ai, đang học gì, muốn được giúp phần nào và muốn nhận câu trả lời theo dạng nào."
              />
              <div className="mt-6 border-l-4 px-5 py-4 text-sm font-semibold leading-7" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}>
                Mẹo nhỏ: nếu chưa hiểu câu trả lời, đừng hỏi lại "giải thích lại" chung chung. Hãy nói rõ phần nào làm bạn kẹt.
              </div>
            </div>
            <PromptExample />
          </div>
        </section>

        <section className="border-y py-14 sm:py-16" style={{ borderColor: 'var(--color-border)' }}>
          <SectionHeading
            eyebrow="Những điều cần nhớ"
            title="Dùng AI có trách nhiệm là một kỹ năng học tập"
            description="AI càng tiện, bạn càng cần vài nguyên tắc chắc tay để không biến việc học thành việc chép."
          />
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {warningCards.map((item, index) => (
              <EditorialCard key={item.title} accent={index % 2 === 0 ? 'orange' : 'ink'} className="lg:min-h-80">
                <IconMark icon={item.icon} accent={index % 2 === 0 ? 'orange' : 'ink'} />
                <h3 className="mt-5 font-display text-lg font-bold leading-tight text-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{item.desc}</p>
                <p className="mt-4 border-t pt-4 text-sm font-semibold leading-6 text-text" style={{ borderColor: 'var(--color-border)' }}>
                  {item.action}
                </p>
              </EditorialCard>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <SectionHeading
            eyebrow="Học với EduAI-Hub như thế nào?"
            title="Một vòng học 5 bước, gọn và có kiểm chứng"
            description="Bạn có thể dùng luồng này cho một bài Toán, một đoạn Văn, một chủ đề tiếng Anh hoặc một buổi ôn thi ngắn."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {eduFlow.map((step, index) => (
              <Link
                key={step.title}
                to={step.to}
                className="group relative border bg-bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-1"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <NumberStamp accent={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'orange' : 'green'}>
                    {index + 1}
                  </NumberStamp>
                  <step.icon className="text-text-light transition-colors group-hover:text-primary" size={19} />
                </div>
                <h3 className="font-display text-lg font-bold leading-tight text-text">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{step.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Mở
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={14} />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/ai-tools" className="btn-outline gap-2">/ai-tools <ArrowRight size={14} /></Link>
            <Link to="/prompts" className="btn-outline gap-2">/prompts <ArrowRight size={14} /></Link>
            <Link to="/textbooks" className="btn-outline gap-2">/textbooks <ArrowRight size={14} /></Link>
            <Link to="/dashboard" className="btn-outline gap-2">/dashboard <ArrowRight size={14} /></Link>
          </div>
        </section>

        <PublishedPostsSection posts={publishedPosts} loading={postsLoading} />

        <section className="pb-16 pt-4 sm:pb-20">
          <CTASection
            title="Bắt đầu bằng một câu hỏi tốt hơn hôm qua"
            description="Chọn một bài bạn đang học, viết prompt theo công thức 4 phần, hỏi AI để được gợi ý, rồi tự làm lại. Đó là cách AI thật sự giúp bạn tiến bộ."
            primaryAction={
              <Link to="/ai-tools" className="btn-primary gap-2">
                Vào Công Cụ AI
                <ArrowRight size={16} />
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
      </main>
    </div>
  );
}
