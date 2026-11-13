import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Library } from 'lucide-react';
import { guideLessons, guideStages } from '../data/guideLessons';
import { lessons } from '../data/lessons';
import { learningTools } from '../data/learningTools';
import { CTASection, SectionHeading } from '../components/ui';
import LearningHero from '../components/home/LearningHero';
import StartLearningAction from '../components/StartLearningAction';

export default function LandingPage() {
  return (
    <div>
      <LearningHero />

      <section className="border-y border-border bg-bg-card">
        <div className="page-container section-space">
          <SectionHeading title="Giữ quyền chủ động trong mỗi bước học" description="Bắt đầu từ việc bạn muốn hiểu và kiểm tra điều mình tự làm được sau khi dùng AI." />
          <ol aria-label="Nhịp học cùng AI" className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">{[
            ['Hiểu', 'Xác định điều mình cần học.'], ['Thử', 'Tự làm trước, hỏi AI đúng chỗ.'], ['Sửa', 'Đối chiếu và cải thiện cách nghĩ.'], ['Áp dụng', 'Đóng AI, tự làm một nhiệm vụ mới.'],
          ].map(([title, text]) => <li key={title} className="border-t border-border py-4"><h3 className="text-xl font-bold text-primary">{title}</h3><p className="mt-2 text-sm leading-7 text-text-muted">{text}</p></li>)}</ol>
        </div>
      </section>

      <section className="page-container section-space">
        <SectionHeading title="Một lộ trình, bốn chặng học" description={`${guideLessons.length} bài có ví dụ, hoạt động thử và câu hỏi tự kiểm tra. Đọc theo thứ tự hoặc chọn phần bạn đang cần.`} action={<Link className="btn-outline" to="/guides">Xem cẩm nang <ArrowRight size={16} /></Link>} />
        <ol className="mt-6 grid gap-x-10 md:grid-cols-2">
          {guideStages.map(stage => <li key={stage.number} className="flex gap-4 border-t border-border py-5"><span className="font-display text-2xl text-primary">{String(stage.number).padStart(2, '0')}</span><div><h3 className="text-xl font-bold"><Link className="hover:text-primary" to={`/guides#guide-stage-${stage.number}`}>{stage.title}</Link></h3><p className="mt-2 text-sm leading-7 text-text-muted">{stage.description}</p></div></li>)}
        </ol>
      </section>

      <section className="border-y border-border bg-bg-card">
        <div className="page-container section-space">
          <SectionHeading title="Chọn hỗ trợ theo nhu cầu của bạn" description="Bạn có thể đi thẳng vào công cụ phù hợp; không cần dùng tuần tự cả ba." />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {learningTools.map(tool => <div key={tool.href} className="flex flex-col border-t border-border pt-5"><tool.icon size={22} className="text-primary" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold">{tool.title}</h3><p className="mt-3 text-sm leading-7 text-text-muted">{tool.situation} {tool.helps}</p><Link className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-semibold text-primary" to={tool.href}>{tool.action} <ArrowRight size={15} /></Link></div>)}
          </div>
        </div>
      </section>

      <section className="page-container section-space grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div><h2 className="text-2xl font-bold sm:text-[2rem]">Kinh nghiệm để tra cứu khi cần</h2><ul className="mt-5 divide-y divide-border border-y border-border">{lessons.map(lesson => <li key={lesson.id}><Link to={`/lessons/${lesson.id}`} className="flex min-h-16 items-center justify-between gap-4 py-4 hover:text-primary"><span className="font-medium">{lesson.title}</span><ArrowRight size={17} className="shrink-0" /></Link></li>)}</ul></div>
        <div><h2 className="text-2xl font-bold sm:text-[2rem]">Tài nguyên học tập</h2><div className="mt-5 space-y-5"><Link to="/prompts" className="flex gap-3 hover:text-primary"><Library size={20} className="mt-1 shrink-0 text-primary" /><span><strong className="block">Kho Prompt</strong><span className="mt-1 block text-sm leading-6 text-text-muted">Đọc mẫu, hiểu cấu trúc và chỉnh cho việc học của bạn.</span></span></Link><Link to="/textbooks" className="flex gap-3 hover:text-primary"><BookOpen size={20} className="mt-1 shrink-0 text-primary" /><span><strong className="block">Danh mục và tài nguyên học tập</strong><span className="mt-1 block text-sm leading-6 text-text-muted">Tìm học liệu theo lớp, môn và quay về nguồn tài liệu.</span></span></Link></div></div>
      </section>
      <div className="page-container"><CTASection title="Bắt đầu bằng một việc bạn muốn hiểu" description="Vào không gian học tập, đọc bài đầu và chọn một hoạt động để thử." primaryAction={<StartLearningAction />} /></div>
    </div>
  );
}
