import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { CSSProperties } from 'react';
import { learningTools } from '../data/learningTools';

export default function AiTools() {
  return <div className="page-container">
    <header className="py-8 sm:py-12"><h1 className="page-title">Bạn đang cần AI hỗ trợ điều gì?</h1><p className="page-intro">Chọn theo tình huống hiện tại. Mỗi trợ lý có một vai trò; bạn không cần dùng lần lượt cả ba.</p></header>
    <div className="grid items-stretch gap-6 pb-3 lg:grid-cols-3">
      {learningTools.map((tool, index) => {
        const theme = ['primary', 'accent', 'secondary'][index];
        const style = { '--notebook-accent': `var(--color-${theme})`, '--notebook-soft': `var(--color-${theme}-light)` } as CSSProperties;
        return <article key={tool.href} className="ai-notebook" style={style}>
          <div className="flex items-center justify-between gap-4"><span className="notebook-icon"><tool.icon size={24} aria-hidden="true" /></span><span className="text-sm font-semibold text-text-muted">Trợ lý {index + 1}</span></div>
          <h2 className="mt-5 text-2xl font-bold">{tool.title}</h2>
          <p className="mt-4 text-base font-medium leading-7">{tool.situation}</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">{tool.helps}</p>
          <div className="my-5 border-y border-border py-4"><h3 className="font-sans text-sm font-semibold">Thử hỏi</h3><p className="mt-2 text-sm leading-7 text-text-muted">“{tool.example}”</p></div>
          <Link to={tool.href} className="btn-outline mt-auto">{tool.action} <ArrowRight size={16} /></Link>
        </article>;
      })}
    </div>
    <section className="section-space mt-8 border-t border-border"><h2 className="text-2xl font-bold">Muốn tự viết trước?</h2><p className="mt-3 max-w-2xl text-text-muted">Nói rõ mục tiêu, bối cảnh, nhiệm vụ, ràng buộc và dạng phản hồi bạn cần. Chỉ thêm những phần giúp AI hiểu đúng việc.</p><Link to="/guides/prompt-la-gi-cach-giao-tiep-hieu-qua-voi-ai" className="btn-outline mt-5"><BookOpen size={16} /> Đọc bài về prompt</Link></section>
  </div>;
}
