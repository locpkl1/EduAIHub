import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  Library,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  NotebookPen,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { CTASection, EditorialCard, SectionHeading, ShapeAccent } from '../components/ui';

const problemCards = [
  {
    label: 'Câu hỏi quá ngắn',
    title: '“Giải bài này giúp mình.”',
    text: 'AI không biết bạn đang học lớp nào, vướng ở đâu hay muốn được hỗ trợ đến mức nào.',
    icon: MessageCircleQuestion,
    accent: 'orange' as const,
  },
  {
    label: 'Tin vì nghe hợp lý',
    title: 'Câu trả lời tự tin chưa chắc đã đúng.',
    text: 'Một lời giải trôi chảy vẫn có thể sai dữ kiện, thiếu bước hoặc không phù hợp với chương trình học.',
    icon: ShieldCheck,
    accent: 'green' as const,
  },
  {
    label: 'Không biết hỏi tiếp',
    title: 'Biết mình chưa hiểu, nhưng chưa biết nói thế nào.',
    text: 'Khi thiếu mục tiêu và bối cảnh, cuộc trò chuyện dễ đi xa khỏi điều bạn thực sự cần học.',
    icon: Compass,
    accent: 'blue' as const,
  },
  {
    label: 'Dùng quá tay',
    title: 'AI làm càng nhiều, mình nghĩ càng ít.',
    text: 'Xin đáp án hoàn chỉnh quá sớm khiến bạn bỏ lỡ phần quan trọng nhất: tự suy luận và tự kiểm tra.',
    icon: Lightbulb,
    accent: 'orange' as const,
  },
];

const learningSkills = [
  {
    number: '01',
    title: 'Biết mình đang cần gì',
    text: 'Xác định mục tiêu trước khi mở AI: hiểu khái niệm, tìm gợi ý, luyện tập hay kiểm tra bài làm.',
    icon: Target,
  },
  {
    number: '02',
    title: 'Cung cấp đủ bối cảnh',
    text: 'Nói rõ lớp, môn, phần kiến thức, điều đã thử và điểm đang vướng để AI không phải đoán.',
    icon: NotebookPen,
  },
  {
    number: '03',
    title: 'Chọn đúng mức hỗ trợ',
    text: 'Yêu cầu một gợi ý, câu hỏi dẫn dắt hoặc phản hồi theo từng bước thay vì lấy đáp án ngay.',
    icon: ListChecks,
  },
  {
    number: '04',
    title: 'Kiểm chứng trước khi dùng',
    text: 'Đối chiếu thông tin quan trọng với SGK, giáo viên và nguồn đáng tin; luôn giữ quyền kết luận.',
    icon: SearchCheck,
  },
];

const guideStages = [
  {
    stage: 'Chặng 1',
    title: 'Làm quen với AI',
    text: 'Hiểu AI có thể giúp gì, giới hạn ở đâu và cách bắt đầu an toàn trong việc học.',
    color: 'var(--color-primary)',
  },
  {
    stage: 'Chặng 2',
    title: 'Viết prompt rõ ràng',
    text: 'Luyện 5 phần của một prompt học tập: mục tiêu, bối cảnh, nhiệm vụ, ràng buộc và định dạng.',
    color: 'var(--color-accent)',
  },
  {
    stage: 'Chặng 3',
    title: 'Học chủ động cùng AI',
    text: 'Dùng gợi ý, câu hỏi dẫn dắt và phản hồi để tự làm nhiều hơn, không trao việc học cho AI.',
    color: 'var(--color-secondary)',
  },
  {
    stage: 'Chặng 4',
    title: 'Kiểm chứng và dùng có trách nhiệm',
    text: 'Nhận diện sai sót, bảo vệ thông tin cá nhân và biết lúc nào cần quay về nguồn chính thống.',
    color: 'var(--color-primary)',
  },
];

const assistants = [
  {
    to: '/ai-tools/hoc-tu-duy-prompt',
    number: '01',
    title: 'Học Tư Duy Prompt',
    text: 'Học cách suy nghĩ trước khi viết: mình cần gì, AI cần biết gì và câu trả lời tốt phải đáp ứng điều nào.',
    action: 'Học cách nghĩ',
    color: 'var(--color-primary)',
  },
  {
    to: '/ai-tools/goi-y-prompt-hoc-tap',
    number: '02',
    title: 'Gợi Ý Prompt Học Tập',
    text: 'Tạo một prompt có cấu trúc theo lớp, môn, chủ đề và mục tiêu học tập cụ thể của bạn.',
    action: 'Tạo prompt có hướng dẫn',
    color: 'var(--color-accent)',
  },
  {
    to: '/ai-tools/danh-gia-prompt',
    number: '03',
    title: 'Đánh Giá Prompt',
    text: 'Nhận góp ý về prompt đã viết, thấy phần còn mơ hồ và học cách tự cải thiện cho lần sau.',
    action: 'Kiểm tra prompt',
    color: 'var(--color-secondary)',
  },
];

const lessonPreviews = [
  {
    tag: 'Chiến lược học',
    title: 'Biến AI thành người hướng dẫn học tập',
    text: 'Thiết lập cuộc trò chuyện để AI gợi mở, phản hồi và giúp bạn tự kiểm tra thay vì làm hộ.',
  },
  {
    tag: 'Học chủ động',
    title: 'Những lỗi phổ biến khi dùng AI',
    text: 'Nhận diện prompt mơ hồ, thói quen chép đáp án và cách lấy lại phần suy nghĩ của mình.',
  },
  {
    tag: 'Tư duy phản biện',
    title: 'Cách kiểm chứng phản hồi AI',
    text: 'Biết phần nào cần đối chiếu, chọn nguồn nào và xử lý ra sao khi các câu trả lời khác nhau.',
  },
];

const resourceCards = [
  {
    to: '/prompts',
    title: 'Kho Prompt',
    text: 'Tham khảo các prompt học tập có cấu trúc và lưu lại mẫu phù hợp với cách học của bạn.',
    icon: Sparkles,
  },
  {
    to: '/textbooks',
    title: 'Bản đồ chương trình',
    text: 'Tìm đúng lớp, môn và mạch kiến thức trước khi đặt câu hỏi cho AI.',
    icon: BookOpen,
  },
  {
    to: '/textbooks',
    title: 'Tài nguyên học tập',
    text: 'Quay về sách giáo khoa và nguồn học liệu phù hợp để đối chiếu những điều quan trọng.',
    icon: Library,
  },
];

export default function LandingPage() {
  return (
    <div className="text-text">
      <HeroSection />
      <ProblemSection />
      <SkillsSection />
      <GuidePathSection />
      <PromptComparisonSection />
      <AssistantSection />
      <GuidedDialogueSection />
      <LessonsSection />
      <ResourcesSection />
      <FinalCTA />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-16">
      <div className="absolute left-8 top-16 hidden lg:block">
        <ShapeAccent variant="line" color="orange" />
      </div>
      <div className="absolute right-10 top-24 hidden opacity-50 lg:block">
        <ShapeAccent variant="blob" color="green" className="h-28 w-28" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 xl:gap-16">
        <div className="relative z-10 min-w-0">
          <div
            className="mb-5 inline-flex rotate-[-1deg] items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border-strong)',
              boxShadow: '4px 4px 0 color-mix(in srgb, var(--color-accent) 18%, transparent)',
            }}
          >
            <GraduationCap size={14} className="text-primary" />
            Học cùng AI dành cho học sinh THPT
          </div>

          <h1 className="max-w-2xl font-display text-[clamp(2.35rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-normal text-text">
            AI có thể trả lời rất nhanh.
            <span className="relative mt-2 block text-primary sm:mt-3">
              Nhưng bạn vẫn phải là người hiểu.
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-3 w-[74%] -rotate-1 sm:-bottom-2"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 38%, transparent)' }}
              />
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
            ChatGPT hay Gemini chỉ thật sự hữu ích khi bạn biết mình cần gì. EduAI-Hub giúp bạn đưa đủ bối cảnh,
            viết prompt rõ ràng, chọn đúng mức hướng dẫn và kiểm chứng câu trả lời trước khi sử dụng.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/guides" className="btn-primary group min-h-11 justify-center gap-2 sm:justify-start">
              Bắt đầu với Hướng dẫn
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/ai-tools" className="btn-outline min-h-11 justify-center gap-2 sm:justify-start">
              Khám phá 3 trợ lý AI
              <Sparkles size={16} />
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-text-light">
            Nếu bạn mới bắt đầu, hãy đọc Hướng dẫn trước rồi quay lại thử các trợ lý AI.
          </p>
        </div>

        <HeroLearningBoard />
      </div>
    </section>
  );
}

function HeroLearningBoard() {
  return (
    <div className="relative mx-auto min-h-[430px] w-full max-w-xl overflow-hidden sm:min-h-[450px] lg:min-h-[480px]">
      <div
        className="absolute left-[5%] top-8 h-[350px] w-[82%] rotate-[-3deg] border sm:h-[370px] lg:h-[395px]"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: 'var(--color-border-strong)',
          boxShadow: '14px 14px 0 color-mix(in srgb, var(--color-primary) 14%, transparent)',
        }}
      />
      <PromptSlip
        className="absolute left-0 top-10 w-[72%] rotate-[-5deg]"
        label="câu hỏi chưa rõ"
        text="Giải bài này giúp mình."
        color="var(--color-accent)"
      />
      <PromptSlip
        className="absolute right-0 top-0 w-[70%] rotate-[4deg]"
        label="câu hỏi để học"
        text="Mình đang vướng ở bước lập luận. Hãy gợi ý một bước, chưa đưa đáp án."
        color="var(--color-primary)"
      />

      <div
        className="absolute left-[9%] top-36 w-[78%] border p-4 sm:top-40 sm:p-5"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: 'var(--color-border)',
          boxShadow: '8px 8px 0 color-mix(in srgb, var(--color-secondary) 18%, transparent)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-text-light">Trước khi hỏi AI</p>
        <div className="mt-4 space-y-3">
          {[
            'Mình muốn hiểu điều gì?',
            'Mình đã biết và đã thử đến đâu?',
            'Mình muốn AI hỗ trợ phần nào?',
          ].map((text, index) => (
            <div key={text} className="flex items-start gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-2 left-[7%] w-[78%] -rotate-2 border p-4 sm:w-[72%] sm:p-5"
        style={{
          backgroundColor: 'var(--color-primary)',
          borderColor: 'var(--color-text)',
          color: '#ffffff',
          boxShadow: '8px 8px 0 color-mix(in srgb, var(--color-accent) 45%, transparent)',
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">nguyên tắc</p>
        <p className="mt-2 font-sans text-xl font-semibold leading-snug sm:text-2xl">
          AI hỗ trợ quá trình học. Bạn vẫn giữ quyền suy nghĩ và kết luận.
        </p>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Vấn đề không nằm ở tốc độ"
          title="AI trả lời được, nhưng bạn có thật sự học được không?"
          description="Nhiều cuộc trò chuyện với AI bắt đầu rất nhanh nhưng kết thúc bằng một đáp án khó kiểm chứng và khó nhớ. Đây là những tình huống quen thuộc."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {problemCards.map((card) => {
            const Icon = card.icon;
            return (
              <EditorialCard
                key={card.title}
                accent={card.accent}
                className="min-w-0"
              >
                <Icon size={23} className="mb-5 text-primary" />
                <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-text-light">{card.label}</p>
                <h3 className="mt-3 font-display text-xl font-semibold leading-[1.25] text-text">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-text-muted">{card.text}</p>
              </EditorialCard>
            );
          })}
        </div>

        <div
          className="mt-8 max-w-4xl border-l-4 px-5 py-4 sm:w-4/5 sm:px-6"
          style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-primary)' }}
        >
          <p className="font-display text-2xl font-semibold leading-snug text-text sm:text-3xl">
            EduAI-Hub không giúp AI làm nhiều hơn. Nền tảng giúp học sinh dùng AI tốt hơn.
          </p>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section
      className="border-y px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 58%, transparent)',
        borderColor: 'color-mix(in srgb, var(--color-border) 55%, transparent)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Kỹ năng dùng được với mọi công cụ"
          title="EduAI-Hub dạy cách học cùng AI, không dạy phụ thuộc vào một ứng dụng."
          description="Dù bạn dùng ChatGPT, Gemini hay một công cụ khác, bốn kỹ năng nền tảng này vẫn giúp cuộc trò chuyện rõ hơn, an toàn hơn và có ích cho việc học."
          action={
            <Link to="/guides" className="btn-outline gap-2">
              Xem 12 bài hướng dẫn <ArrowRight size={15} />
            </Link>
          }
        />

        <div className="mt-8 grid gap-x-7 md:grid-cols-2">
          {learningSkills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.number}
                className="group relative min-w-0 border-t px-1 py-5 sm:p-6"
                style={{
                  borderColor: 'var(--color-border-strong)',
                }}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="font-display text-4xl font-extrabold leading-none text-primary">{skill.number}</span>
                  <div className="min-w-0">
                    <Icon size={21} className="mb-4 text-primary" />
                    <h3 className="font-display text-2xl font-semibold leading-tight text-text">{skill.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-text-muted">{skill.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GuidePathSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Hướng dẫn trước, công cụ sau"
          title="12 bài học ngắn, đi qua 4 chặng rõ ràng."
          description="Lộ trình giúp bạn hiểu cách dùng AI trước khi thử công cụ. Mỗi chặng xây trên kỹ năng của chặng trước, để bạn không chỉ có prompt tốt hơn mà còn học chủ động hơn."
          action={
            <Link to="/guides" className="btn-primary gap-2">
              Bắt đầu lộ trình 12 bài <ArrowRight size={16} />
            </Link>
          }
        />

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-5">
            {guideStages.map((item, index) => (
              <div
                key={item.stage}
                className="relative grid min-w-0 gap-4 bg-bg-card p-5 sm:grid-cols-[auto_1fr] sm:gap-5 sm:p-6"
                style={{
                  borderLeft: `4px solid ${item.color}`,
                  borderTop: '1px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
                  boxShadow: `0 14px 30px -26px ${item.color}`,
                }}
              >
                <span className="font-display text-4xl font-extrabold leading-none" style={{ color: item.color }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-text-light">{item.stage}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-text">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}

function PromptComparisonSection() {
  return (
    <section
      className="border-y px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary-light) 24%, transparent)',
        borderColor: 'color-mix(in srgb, var(--color-border) 55%, transparent)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Một thay đổi nhỏ trong cách hỏi"
          title="Từ xin lời giải đến yêu cầu một cách học."
          description="Một prompt tốt không cần dài. Nó cần cho AI biết mục tiêu, bối cảnh, nhiệm vụ, giới hạn hỗ trợ và dạng phản hồi bạn mong muốn."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <PromptExample
            label="Trước"
            title="AI phải đoán gần như mọi thứ"
            color="var(--color-accent)"
          >
            “Giải bài giới hạn này giúp mình.”
          </PromptExample>
          <PromptExample
            label="Sau"
            title="AI biết cách hỗ trợ mà không làm thay"
            color="var(--color-primary)"
          >
            “Mình đang học giới hạn ở lớp 11 và chưa hiểu cách chọn phép biến đổi. Hãy hỏi mình 2 câu để xác định
            chỗ vướng, sau đó chỉ gợi ý bước đầu tiên. Chưa đưa lời giải hoàn chỉnh.”
          </PromptExample>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {['Mục tiêu', 'Bối cảnh', 'Nhiệm vụ', 'Ràng buộc', 'Định dạng'].map((part, index) => (
            <div
              key={part}
              className="flex items-center gap-3 border px-3 py-2.5"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-xs font-extrabold text-primary">{index + 1}</span>
              <span className="text-sm font-bold text-text">{part}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AssistantSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Thực hành sau khi đã hiểu"
          title="Ba trợ lý AI, ba bước luyện prompt."
          description="Dùng từng trợ lý cho đúng mục đích: học cách nghĩ, tạo một prompt có hướng dẫn, rồi tự kiểm tra prompt đã viết."
          action={
            <Link to="/ai-tools" className="btn-outline gap-2">
              Xem tất cả trợ lý <ArrowRight size={15} />
            </Link>
          }
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {assistants.map((assistant) => (
            <Link
              key={assistant.to}
              to={assistant.to}
              className="group relative flex min-w-0 flex-col bg-bg-card p-5 transition-transform hover:-translate-y-1 sm:p-6"
              style={{
                borderLeft: `4px solid ${assistant.color}`,
                borderTop: '1px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
                boxShadow: `0 16px 34px -26px ${assistant.color}`,
              }}
            >
              <span className="font-display text-4xl font-extrabold leading-none" style={{ color: assistant.color }}>
                {assistant.number}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold leading-tight text-text">{assistant.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">{assistant.text}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary">
                {assistant.action}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidedDialogueSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">AI hướng dẫn, không làm thay</p>
          <h2 className="font-display text-4xl font-semibold leading-[1.16] text-text sm:text-5xl">
            Một cuộc hội thoại tốt đưa suy nghĩ trở lại cho bạn.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-text-muted">
            Thay vì xuất ra đáp án cuối, AI có thể giúp bạn gọi tên chỗ vướng, chia nhỏ nhiệm vụ và phản hồi trên phần
            bạn đã tự làm.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <NotebookNote title="Bạn hỏi" color="var(--color-accent)" tilt="-0.8deg">
            “Mình chưa biết bắt đầu câu này. Hãy giúp mình nhận ra dữ kiện quan trọng trước.”
          </NotebookNote>
          <NotebookNote title="AI hỏi lại" color="var(--color-primary)" tilt="1deg">
            “Đề đang yêu cầu tìm điều gì? Trong các dữ kiện, phần nào liên quan trực tiếp đến yêu cầu đó?”
          </NotebookNote>
          <NotebookNote title="Bạn tự làm" color="var(--color-secondary)" tilt="0.6deg">
            “Mình đã xác định yêu cầu và thử bước đầu. Bạn chỉ ra điểm chưa hợp lý, chưa sửa thay nhé.”
          </NotebookNote>
          <NotebookNote title="AI phản hồi" color="var(--color-primary)" tilt="-0.7deg">
            “Hướng đi của bạn phù hợp. Hãy kiểm tra lại điều kiện ở bước hai trước khi tiếp tục.”
          </NotebookNote>
        </div>
      </div>
    </section>
  );
}

function LessonsSection() {
  return (
    <section
      className="border-y px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 58%, transparent)',
        borderColor: 'color-mix(in srgb, var(--color-border) 55%, transparent)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Bài học để quay lại khi cần"
          title="Kinh nghiệm dùng AI gắn với việc học thật."
          description="Các bài viết ngắn giúp bạn xử lý những tình huống thường gặp: bắt đầu một phiên học, tránh lệ thuộc và kiểm chứng thông tin."
          action={
            <Link to="/lessons" className="btn-outline gap-2">
              Xem tất cả bài học <ArrowRight size={15} />
            </Link>
          }
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {lessonPreviews.map((lesson) => (
            <Link
              key={lesson.title}
              to="/lessons"
              className="group relative flex min-w-0 flex-col bg-bg-card p-5 transition-transform hover:-translate-y-1 sm:p-6"
              style={{
                border: '1px solid color-mix(in srgb, var(--color-border) 72%, transparent)',
                boxShadow: '0 14px 30px -26px color-mix(in srgb, var(--color-primary) 65%, transparent)',
              }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-primary">{lesson.tag}</span>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-[1.23] text-text">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">{lesson.text}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary">
                Đọc bài <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Tài nguyên học tập"
          title="Tìm prompt để tham khảo, rồi quay về đúng ngữ cảnh môn học."
          description="Ba điểm đến ngắn gọn để bạn tiếp tục: xem mẫu prompt, định vị kiến thức trong chương trình và đối chiếu với học liệu phù hợp."
        />

        <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {resourceCards.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.title}
                to={resource.to}
                className="group flex min-w-0 items-start gap-3 border-t bg-bg-card p-4 transition-transform hover:-translate-y-1"
                style={{ borderColor: 'var(--color-border-strong)' }}
              >
                <Icon size={22} className="mt-1 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-semibold text-text">{resource.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-text-muted">{resource.text}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-primary">
                    Khám phá <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <CTASection
          className="rounded-[18px] lg:px-12 lg:py-11"
          title="Bắt đầu bằng cách hiểu mình cần học gì."
          description="Đi qua lộ trình hướng dẫn trước, rồi dùng các trợ lý AI để luyện tập. AI có thể hỗ trợ rất nhanh — nhưng việc hiểu, kiểm chứng và quyết định vẫn thuộc về bạn."
          primaryAction={
            <Link to="/guides" className="btn-primary gap-2">
              Bắt đầu với Hướng dẫn <ArrowRight size={16} />
            </Link>
          }
          secondaryAction={
            <Link to="/ai-tools" className="btn-outline gap-2">
              Khám phá 3 trợ lý AI <Sparkles size={16} />
            </Link>
          }
        />
        <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-text-muted">
          EduAI-Hub không thay bạn học. Nền tảng giúp bạn đặt câu hỏi tốt hơn, suy nghĩ rõ hơn và dùng AI có trách nhiệm hơn.
        </p>
      </div>
    </section>
  );
}

function PromptExample({
  label,
  title,
  color,
  children,
}: {
  label: string;
  title: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative min-w-0 p-5 sm:p-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderLeft: `4px solid ${color}`,
        borderTop: '1px solid color-mix(in srgb, var(--color-border) 65%, transparent)',
        boxShadow: `0 16px 34px -28px ${color}`,
      }}
    >
      <span
        className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.17em]"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
      >
        {label}
      </span>
      <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-text">{title}</h3>
      <p className="mt-4 whitespace-pre-wrap break-words text-base leading-7 text-text-muted">{children}</p>
    </div>
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
      <p className="break-words font-sans text-base font-semibold leading-[1.3] text-text sm:text-lg">{text}</p>
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
      className={`relative min-w-0 p-4 transition-transform duration-200 hover:-translate-y-1 sm:p-5 ${className}`}
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
      <p className="mb-3 pr-12 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {title}
      </p>
      <p className="text-sm leading-7 text-text-muted">{children}</p>
    </div>
  );
}
