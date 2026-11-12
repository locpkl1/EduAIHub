import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, NotebookPen } from 'lucide-react';
import { guideLessons } from '../data/guideLessons';
import { fetchPublishedContentPosts, type PublishedContentPost } from '../lib/publicContentApi';
import { CTASection, LoadingState, SectionHeading } from '../components/ui';
import LearningExplorer from '../components/guides/LearningExplorer';

export default function Guides() {
  const [posts, setPosts] = useState<PublishedContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchPublishedContentPosts().then(result => { if (!cancelled) setPosts(result.slice(0, 3)); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);
  return (
    <div>
      <header className="guide-explorer-intro"><div className="page-container">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-text"><NotebookPen size={18} aria-hidden="true" />12 bài · 4 chặng học</p>
        <h1 className="page-title">Cẩm nang AI</h1>
        <p className="page-intro">Hiểu AI, tự thử và kiểm chứng. Chọn chặng bạn cần hoặc bắt đầu từ bài đầu tiên.</p>
        <Link to={`/guides/${guideLessons[0].slug}`} className="btn-primary mt-5">Bắt đầu bài 01 <ArrowRight size={16} /></Link>
      </div></header>
      <div className="page-container">
        <LearningExplorer />
        <CTASection title="Đọc xong, thử với bài học của bạn" description="Chọn một việc đang vướng, tự viết prompt rồi dùng trợ lý để nhận góp ý." primaryAction={<Link to="/ai-tools" className="btn-primary">Chọn công cụ AI <ArrowRight size={16} /></Link>} />
        {(loading || error || posts.length > 0) && <section className="section-space border-t border-border"><SectionHeading title="Đọc thêm từ EduAI-Hub" action={<Link to="/lessons" className="btn-outline">Xem kinh nghiệm học</Link>} />
          {loading ? <LoadingState label="Đang tải bài viết…" /> : error ? <div role="alert" className="mt-4"><p className="text-sm text-text-muted">Chưa tải được bài viết bổ sung. Cẩm nang phía trên vẫn đọc được.</p><button type="button" className="btn-outline mt-3" onClick={() => setAttempt(value => value + 1)}>Thử tải lại</button></div> : <ul className="mt-5 divide-y divide-border">{posts.map(post => <li key={post.id}><Link className="flex items-center justify-between gap-4 py-4 hover:text-primary" to={`/lessons/${post.slug}`}><span>{post.title}</span><ArrowRight size={16} /></Link></li>)}</ul>}
        </section>}
      </div>
    </div>
  );
}
