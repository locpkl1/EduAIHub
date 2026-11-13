import { GraduationCap } from 'lucide-react';
import StartLearningAction from '../StartLearningAction';
import { useAuth } from '../../contexts/AuthContext';

/** V1 paper composition, with text kept in flow so no sheet hides another's copy. */
export default function LearningHero() {
  const { user } = useAuth();
  return <section className="learning-hero">
    <div className="learning-hero-layout page-container">
      <div className="min-w-0">
        <p className="hero-learning-label"><GraduationCap size={16} aria-hidden="true" />Học cùng AI dành cho học sinh THPT</p>
        <h1 className="hero-headline font-display">Học cách hỏi,<br /><span>để biết cách học.</span></h1>
        <p className="page-intro">EduAI-Hub giúp học sinh THPT viết prompt rõ ràng, chọn đúng mức hỗ trợ và kiểm chứng phản hồi AI trong việc tự học.</p>
        <div className="mt-6"><StartLearningAction /></div>
        {!user && <p className="mt-3 max-w-lg text-sm leading-6 text-text-muted">Đăng nhập để sử dụng cẩm nang, trợ lý AI và lưu prompt học tập của bạn.</p>}
        <p className="mt-4 text-sm leading-6 text-text-muted">AI hỗ trợ quá trình học. Bạn giữ quyền suy nghĩ và kết luận.</p>
      </div>
      <figure className="hero-learning-board select-none" aria-label="Ví dụ cải thiện câu hỏi AI">
        <div className="hero-board-backing" aria-hidden="true" />
        <div className="hero-prompt-slip hero-prompt-vague" data-hero-paper="vague">
          <span className="hero-paper-tape" aria-hidden="true" />
          <p className="hero-paper-caption text-accent">Câu hỏi chưa rõ</p>
          <p className="mt-3 text-base font-semibold leading-7">“Giải bài này giúp mình.”</p>
        </div>
        <div className="hero-prompt-slip hero-prompt-improved" data-hero-paper="improved">
          <span className="hero-paper-tape" aria-hidden="true" />
          <p className="hero-paper-caption text-primary-text">Câu hỏi để học</p>
          <p className="mt-3 text-base font-semibold leading-7">“Mình đang vướng ở bước lập luận. Hãy gợi ý một bước, chưa đưa đáp án.”</p>
        </div>
        <div className="hero-checklist" data-hero-paper="checklist">
          <h2 className="text-lg font-bold">Trước khi hỏi AI</h2>
          <ol className="mt-4 space-y-3">{['Mình muốn hiểu điều gì?', 'Mình đã biết và đã thử đến đâu?', 'Mình muốn AI hỗ trợ phần nào?'].map((text, index) => <li key={text} className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-control bg-primary-light text-xs font-semibold text-primary-text" aria-hidden="true">{index + 1}</span><span className="text-sm leading-6 text-text-muted">{text}</span></li>)}</ol>
        </div>
        <blockquote className="hero-statement" data-hero-paper="statement"><p>AI hỗ trợ quá trình học. Bạn vẫn giữ quyền suy nghĩ và kết luận.</p></blockquote>
      </figure>
    </div>
  </section>;
}
