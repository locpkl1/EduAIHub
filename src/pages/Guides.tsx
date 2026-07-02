import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  BookOpen,
  Zap,
  Shield,
  Target,
  ExternalLink,
} from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Hiểu AI là gì',
    short: 'Nền tảng tư duy',
    color: 'primary',
    content: [
      'AI (trí tuệ nhân tạo) là công cụ dự đoán văn bản dựa trên dữ liệu khổng lồ — nó KHÔNG suy nghĩ như người, không có ý kiến thật sự và không biết "sự thật".',
      'AI có thể tự tin đưa ra thông tin sai (gọi là hallucination). Đây là lý do tại sao bạn phải luôn kiểm chứng.',
      'Hiểu giới hạn này giúp bạn dùng AI như một công cụ mạnh thay vì tin tưởng mù quáng.',
    ],
    tips: ['AI không có ý thức', 'AI có thể bịa thông tin', 'Luôn kiểm chứng với sách giáo khoa'],
  },
  {
    num: '02',
    title: 'Đặt câu hỏi đúng',
    short: 'Kỹ thuật prompt',
    color: 'accent',
    content: [
      'Prompt tốt = Vai trò + Ngữ cảnh + Nhiệm vụ cụ thể + Định dạng mong muốn.',
      'Thay vì "giải thích tích phân", hãy viết: "Bạn là giáo viên Toán lớp 12. Giải thích tích phân bất định với 2 ví dụ đời thực, sau đó cho tôi 3 bài tập mức trung bình."',
      'Câu hỏi càng cụ thể, AI càng trả lời đúng trọng tâm và tiết kiệm thời gian của bạn.',
    ],
    tips: ['Thêm vai trò cho AI', 'Chỉ rõ lớp học và môn', 'Yêu cầu định dạng cụ thể'],
  },
  {
    num: '03',
    title: 'Kiểm chứng thông tin',
    short: 'Tư duy phản biện',
    color: 'warning',
    content: [
      'Sau khi nhận câu trả lời từ AI, đối chiếu với sách giáo khoa, tài liệu chính thống hoặc hỏi giáo viên trực tiếp.',
      'Đặc biệt cẩn thận với số liệu, công thức, ngày tháng lịch sử — đây là những điểm AI hay mắc lỗi nhất.',
      'Hãy xem AI như "bạn học thông minh nhưng hay sai" — hữu ích nhưng cần giám sát.',
    ],
    tips: ['Đối chiếu với SGK', 'Hỏi thêm nhiều câu', 'Tìm nguồn độc lập để xác nhận'],
  },
  {
    num: '04',
    title: 'Biến AI thành gia sư',
    short: 'Học chủ động',
    color: 'success',
    content: [
      'Thay vì xin đáp án, hãy xin AI giải thích phương pháp và cho bạn tự làm — rồi kiểm tra.',
      'Yêu cầu AI hỏi ngược lại bạn để kiểm tra hiểu biết: "Sau khi giải thích, hãy đặt 3 câu hỏi kiểm tra cho tôi."',
      'Dùng AI để tạo flashcard, tóm tắt chương và gợi ý điểm trọng tâm cần ôn.',
    ],
    tips: ['Xin giải thích, không xin đáp án', 'Nhờ AI hỏi ngược lại', 'Tạo bài kiểm tra nhanh'],
  },
  {
    num: '05',
    title: 'Tránh phụ thuộc AI',
    short: 'Tự lực học tập',
    color: 'primary',
    content: [
      'Phụ thuộc AI là khi bạn không thể làm gì nếu thiếu nó. Đây là bẫy nguy hiểm nhất.',
      'Quy tắc: Tự suy nghĩ ít nhất 5 phút trước khi hỏi AI. Nếu bí, hỏi AI giải thích PHƯƠNG PHÁP — không phải đáp án.',
      'Mục tiêu cuối cùng là bạn có thể làm bài kiểm tra MÀ KHÔNG CÓ AI bên cạnh.',
    ],
    tips: ['5 phút tự nghĩ trước', 'Xin phương pháp, không xin đáp án', 'Kiểm tra bản thân không có AI'],
  },
];

const principles = [
  { icon: Brain, title: 'Hiểu trước, hỏi sau', desc: 'Luôn tự suy nghĩ và tìm hiểu trước khi hỏi AI', color: 'primary' },
  { icon: MessageSquare, title: 'Xin giải thích, không xin đáp án', desc: 'Yêu cầu AI giải thích phương pháp thay vì chỉ đưa kết quả', color: 'accent' },
  { icon: CheckCircle, title: 'Kiểm chứng kết quả', desc: 'Luôn đối chiếu thông tin AI đưa ra với nguồn đáng tin cậy', color: 'success' },
  { icon: Target, title: 'Viết prompt rõ ràng, cụ thể', desc: 'Câu hỏi càng cụ thể và có bối cảnh, câu trả lời càng chính xác', color: 'warning' },
  { icon: Shield, title: 'Học để hiểu, không copy', desc: 'Mục đích cuối cùng là tự giải quyết được vấn đề', color: 'primary' },
];

const mistakes = [
  { title: 'Tin AI tuyệt đối', fix: 'Luôn kiểm chứng với SGK và tài liệu chính thống' },
  { title: 'Copy nguyên văn bài AI', fix: 'Đọc hiểu rồi viết lại bằng ngôn ngữ của bạn' },
  { title: 'Hỏi quá mơ hồ', fix: 'Thêm ngữ cảnh: môn học, lớp, mục tiêu cụ thể' },
  { title: 'Không kiểm chứng công thức số liệu', fix: 'Đặc biệt cẩn thận với Toán, Lý, Hóa — AI hay sai ở đây' },
  { title: 'Dùng AI thay thế việc đọc SGK', fix: 'AI bổ sung, không thay thế. Đọc SGK vẫn là nền tảng' },
];

const colorMap: Record<string, string> = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
};

const bgColorMap: Record<string, string> = {
  primary: 'var(--color-primary-light)',
  accent: 'var(--color-accent-light)',
  success: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
  warning: 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
};

export default function Guides() {
  const [openStep, setOpenStep] = useState<string | null>('01');

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Page header */}
      <div
        className="border-b py-12"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-4 inline-flex">Hướng Dẫn</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 text-balance">
            Học cách dùng AI
            <br />
            <span style={{ color: 'var(--color-primary)' }}>từ cơ bản đến thành thạo</span>
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            Không chỉ là "hỏi AI và lấy đáp án". Đây là hướng dẫn toàn diện giúp bạn
            giao tiếp với AI, đặt prompt hiệu quả và học chủ động hơn trong thời đại AI.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left — Steps (accordion) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              5 bước làm chủ AI trong học tập
            </h2>
            {steps.map((step) => {
              const isOpen = openStep === step.num;
              return (
                <div
                  key={step.num}
                  className="rounded-xl border overflow-hidden transition-all duration-200"
                  style={{
                    borderColor: isOpen ? colorMap[step.color] : 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenStep(isOpen ? null : step.num)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
                      style={{ backgroundColor: bgColorMap[step.color], color: colorMap[step.color] }}
                    >
                      {step.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{step.title}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{step.short}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: 'var(--color-text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className="px-5 pb-5 border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="pt-4 space-y-3">
                        {step.content.map((para, i) => (
                          <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            {para}
                          </p>
                        ))}
                        <div className="pt-3 flex flex-wrap gap-2">
                          {step.tips.map((tip) => (
                            <span
                              key={tip}
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                              style={{ backgroundColor: bgColorMap[step.color], color: colorMap[step.color] }}
                            >
                              <CheckCircle size={11} />
                              {tip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Lỗi thường gặp */}
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: 'var(--color-accent)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  Lỗi thường gặp khi dùng AI
                </h3>
              </div>
              <div className="space-y-3">
                {mistakes.map((m) => (
                  <div
                    key={m.title}
                    className="rounded-lg p-3 text-xs"
                    style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border)' }}
                  >
                    <p className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                      ✗ {m.title}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)' }}>{m.fix}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                Thực hành ngay
              </h3>
              <Link
                to="/ai-tools"
                className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-bg-muted"
                style={{ border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <Zap size={15} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Công Cụ AI</span>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
              <Link
                to="/prompts"
                className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-bg-muted"
                style={{ border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={15} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Kho Prompt</span>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
              <div
                className="pt-3 border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-light)' }}>
                  Thực hành với
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-bg-muted"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    ChatGPT <ExternalLink size={10} />
                  </a>
                  <a
                    href="https://gemini.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-bg-muted"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    Gemini <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Nguyên Tắc Vàng */}
        <section className="mt-16">
          <div className="mb-8 text-center">
            <span className="section-label mb-3 inline-flex">Nguyên Tắc Cốt Lõi</span>
            <h2 className="text-2xl font-bold mt-3">5 nguyên tắc vàng khi dùng AI học tập</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="card p-5 flex flex-col gap-3 relative overflow-hidden"
              >
                <div
                  className="absolute top-3 right-3 font-mono font-bold text-4xl opacity-5"
                  style={{ color: colorMap[p.color] }}
                >
                  {i + 1}
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: bgColorMap[p.color] }}
                >
                  <p.icon size={18} style={{ color: colorMap[p.color] }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prompt structure diagram */}
        <section
          className="mt-12 rounded-2xl p-8 border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Cấu trúc prompt hiệu quả
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Mọi prompt tốt đều có 4 thành phần chính. Hãy thực hành cho đến khi thành thói quen.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Vai trò', example: '"Bạn là giáo viên Toán lớp 12..."', desc: 'Cho AI biết nó đang đóng vai gì', color: 'primary' },
              { label: 'Ngữ cảnh', example: '"Tôi đang học Chương 3 — Hàm số..."', desc: 'Cung cấp bối cảnh học tập của bạn', color: 'accent' },
              { label: 'Nhiệm vụ', example: '"Hãy giải thích và cho 3 bài tập..."', desc: 'Yêu cầu cụ thể, rõ ràng và đo được', color: 'warning' },
              { label: 'Định dạng', example: '"Trình bày theo dạng bảng, tiếng Việt..."', desc: 'Chỉ định cách AI trả lời', color: 'success' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="rounded-xl p-4 space-y-2 relative"
                style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: colorMap[item.color], color: 'var(--color-bg)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: colorMap[item.color] }}>
                    {item.label}
                  </span>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--color-text-light)' }}>{item.example}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
