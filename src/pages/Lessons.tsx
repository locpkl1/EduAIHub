import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Brain, AlertTriangle, TrendingUp, Star, Search, ChevronDown, FileText } from 'lucide-react';
import { fetchPublishedContentPosts, type PublishedContentPost } from '../lib/publicContentApi';

export interface Lesson {
  id: number;
  title: string;
  tag: string;
  tagColor: 'primary' | 'accent' | 'warning' | 'success';
  desc: string;
  readTime: string;
  featured?: boolean;
  icon: React.ElementType;
  content: {
    intro: string;
    sections: { heading: string; body: string; tips?: string[] }[];
  };
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Biến AI thành người hướng dẫn học tập',
    tag: 'Chiến lược',
    tagColor: 'primary',
    desc: 'Thiết lập vai trò, yêu cầu câu hỏi gợi mở và giữ phần suy luận chính cho chính bạn.',
    readTime: '7 phút',
    featured: true,
    icon: Brain,
    content: {
      intro: 'AI hỗ trợ học tốt hơn khi nó hướng dẫn quá trình suy nghĩ thay vì đưa ngay một câu trả lời hoàn chỉnh.',
      sections: [
        {
          heading: 'Bước 1: Thiết lập vai trò cho AI',
          body: 'Bắt đầu bằng prompt: "Bạn là người hướng dẫn học tập kiên nhẫn. Nhiệm vụ của bạn là giúp em hiểu, không làm thay. Khi em sai, hãy đặt một câu hỏi gợi ý thay vì đưa đáp án ngay." Sau đó thêm lớp, môn và nội dung bạn đang học.',
          tips: ['Nói rõ vai trò hỗ trợ', 'Đặt quy tắc không đưa đáp án ngay', 'Thêm lớp, môn và mục tiêu'],
        },
        {
          heading: 'Bước 2: Học theo phương pháp Socratic',
          body: 'Thay vì hỏi "giải bài này", hãy hỏi "Bài này tôi cần áp dụng kiến thức gì? Gợi ý cho tôi điểm bắt đầu." Sau đó tự làm, nếu sai, hỏi "Tôi sai ở bước nào? Cho tôi một câu hỏi gợi ý thay vì đáp án."',
        },
        {
          heading: 'Bước 3: Kiểm tra sau khi học',
          body: 'Cuối mỗi phiên, yêu cầu: "Hãy hỏi tôi 5 câu kiểm tra về những gì tôi vừa học. Chờ tôi trả lời từng câu trước khi phản hồi." Sau đó tự giải thích lại phần quan trọng bằng lời của mình.',
          tips: ['Tự trả lời trước khi xem đáp án', 'Yêu cầu câu hỏi từ dễ đến khó', 'Nhờ AI phân tích lỗi sai'],
        },
      ],
    },
  },
  {
    id: 3,
    title: 'Những lỗi phổ biến khi dùng AI học tập',
    tag: 'Kinh nghiệm',
    tagColor: 'warning',
    desc: 'Nhận diện prompt mơ hồ, thói quen sao chép và việc tin câu trả lời mà chưa kiểm chứng.',
    readTime: '6 phút',
    featured: false,
    icon: AlertTriangle,
    content: {
      intro: 'AI chỉ hỗ trợ việc học khi bạn vẫn đọc, suy nghĩ, kiểm tra và tự trình bày lại kết quả.',
      sections: [
        {
          heading: 'Lỗi 1: Hỏi quá mơ hồ',
          body: 'Prompt "Giải thích bài này" thiếu mục tiêu và bối cảnh. Hãy nói rõ lớp, môn, nội dung đang học, phần chưa hiểu và kiểu hỗ trợ bạn muốn nhận.',
          tips: ['Thêm lớp, môn và chủ đề', 'Nêu phần đang vướng', 'Nói rõ muốn gợi ý hay phản hồi'],
        },
        {
          heading: 'Lỗi 2: Copy nguyên văn câu trả lời AI',
          body: 'Sao chép một câu trả lời hoàn chỉnh không cho thấy bạn đã hiểu. Hãy đọc, kiểm chứng, tự giải thích và viết lại bằng lời của mình theo yêu cầu của giáo viên.',
        },
        {
          heading: 'Lỗi 3: Tin tuyệt đối vào AI',
          body: 'AI có thể sai, đặc biệt với số liệu, công thức Toán/Lý/Hóa và sự kiện lịch sử. Quy tắc vàng: bất kỳ thông tin quan trọng nào cũng cần đối chiếu với sách giáo khoa.',
          tips: ['Đối chiếu phần quan trọng với SGK', 'Cẩn thận với công thức, số liệu và trích dẫn', 'Yêu cầu AI nêu căn cứ và phần chưa chắc chắn'],
        },
      ],
    },
  },
  {
    id: 6,
    title: 'Cách kiểm chứng phản hồi của AI',
    tag: 'Tư duy phản biện',
    tagColor: 'warning',
    desc: 'Nhận diện phần đáng nghi và đối chiếu thông tin quan trọng trước khi sử dụng.',
    readTime: '6 phút',
    featured: false,
    icon: TrendingUp,
    content: {
      intro: 'AI có thể trình bày trôi chảy dù thông tin còn thiếu hoặc sai. Cách viết tự tin không phải là bằng chứng về độ chính xác.',
      sections: [
        {
          heading: 'Những phần cần kiểm tra kỹ',
          body: 'Số liệu, công thức, ngày tháng, tên riêng, trích dẫn và điều kiện áp dụng đều có thể bị thiếu hoặc nhầm. Hãy đánh dấu từng ý quan trọng thay vì chỉ đọc toàn bộ câu trả lời một lần.',
          tips: ['Cẩn thận với con số cụ thể', 'Kiểm tra công thức và điều kiện áp dụng', 'Yêu cầu nêu nguồn hoặc căn cứ có thể đối chiếu'],
        },
        {
          heading: 'Quy trình kiểm chứng 3 bước',
          body: '1) Đối chiếu với SGK ngay khi nhận thông tin quan trọng. 2) Dùng prompt "Bạn có chắc chắn về thông tin này không? Liệt kê những điểm bạn không chắc." 3) Tìm nguồn độc lập (thầy cô, tài liệu tham khảo chính thống).',
        },
      ],
    },
  },
];

export const allTags = ['Tất cả', 'Chiến lược', 'Kinh nghiệm', 'Tư duy phản biện'];

export const tagColorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'var(--color-primary-light)', text: 'var(--color-primary)' },
  accent: { bg: 'var(--color-accent-light)', text: 'var(--color-accent)' },
  warning: { bg: 'color-mix(in srgb, var(--color-warning) 12%, transparent)', text: 'var(--color-warning)' },
  success: { bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)', text: 'var(--color-success)' },
};

export default function Lessons() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [publishedPosts, setPublishedPosts] = useState<PublishedContentPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const TAG_VISIBLE_COUNT = 4;

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedPosts() {
      setPostsLoading(true);
      try {
        const posts = await fetchPublishedContentPosts();
        if (!cancelled) setPublishedPosts(posts);
      } catch {
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

  const publishedCategories = useMemo(
    () => publishedPosts.map((post) => post.category).filter((category): category is string => Boolean(category)),
    [publishedPosts]
  );

  const availableTags = useMemo(
    () => Array.from(new Set([...allTags, ...publishedCategories])),
    [publishedCategories]
  );

  const visibleTags = tagsExpanded ? availableTags : availableTags.slice(0, TAG_VISIBLE_COUNT + 1);

  const filtered = lessons.filter((l) => {
    const matchTag = activeTag === allTags[0] || l.tag === activeTag;
    const matchSearch = search.trim() === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.desc.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const featured = filtered.filter((l) => l.featured);
  const regular = filtered.filter((l) => !l.featured);
  const filteredPosts = publishedPosts.filter((post) => {
    const category = post.category || 'Bài viết';
    const normalizedSearch = search.trim().toLowerCase();
    const matchTag = activeTag === allTags[0] || category === activeTag;
    const matchSearch =
      normalizedSearch === '' ||
      post.title.toLowerCase().includes(normalizedSearch) ||
      (post.excerpt || '').toLowerCase().includes(normalizedSearch) ||
      category.toLowerCase().includes(normalizedSearch) ||
      post.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
    return matchTag && matchSearch;
  });
  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);
  const postsForGrid = activeTag === allTags[0] && search === '' ? regularPosts : filteredPosts;
  const hasResults = filtered.length > 0 || filteredPosts.length > 0;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Header */}
      <div
        className="border-b py-10"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-3 inline-flex rounded-full">Bài Học</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-3 text-balance">
            Kho kinh nghiệm
            <br />
            <span style={{ color: 'var(--color-primary)' }}>học cùng AI</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
            Không phải lý thuyết khô khan. Những bài học thực tế, chiến lược cụ thể từ việc dùng AI học tập mỗi ngày.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-light)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bài học..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-muted)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {visibleTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  activeTag === tag
                    ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                    : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
                }
              >
                {tag}
              </button>
            ))}
            {availableTags.length > TAG_VISIBLE_COUNT + 1 && (
              <button
                type="button"
                onClick={() => setTagsExpanded((v) => !v)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-light)', border: '1px solid var(--color-border)' }}
              >
                {tagsExpanded ? 'Thu gọn' : `+${availableTags.length - TAG_VISIBLE_COUNT - 1} tag`}
                <ChevronDown size={12} style={{ transform: tagsExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            )}
          </div>
        </div>

        {/* Featured */}
        {activeTag === allTags[0] && search === '' && (featured.length > 0 || featuredPosts.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} style={{ color: 'var(--color-accent)' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Nổi bật</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map((lesson) => (
                <FeaturedCard key={lesson.id} lesson={lesson} onClick={() => navigate(`/lessons/${lesson.id}`)} />
              ))}
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} onClick={() => navigate(`/lessons/${post.slug}`)} />
              ))}
            </div>
          </div>
        )}

        {postsLoading && (
          <div className="mb-5 text-xs" style={{ color: 'var(--color-text-light)' }}>
            Đang tải bài viết mới từ EduAI-Hub...
          </div>
        )}

        {/* Regular grid */}
        {!hasResults ? (
          <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
            <p className="text-sm">Không tìm thấy bài học phù hợp.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTag === allTags[0] && search === '' ? regular : filtered).map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onClick={() => navigate(`/lessons/${lesson.id}`)} />
            ))}
            {postsForGrid.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => navigate(`/lessons/${post.slug}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPostMeta(post: PublishedContentPost) {
  return {
    category: post.category || 'Bài viết',
    readTime: `${post.reading_minutes || 5} phút`,
    excerpt: post.excerpt || 'Bài viết từ EduAI-Hub giúp bạn học chủ động hơn với AI.',
  };
}

function FeaturedPostCard({ post, onClick }: { post: PublishedContentPost; onClick: () => void }) {
  const { category, readTime, excerpt } = getPostMeta(post);
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left card-soft-hover p-6 flex flex-col gap-4 w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-light)' }}>
          <FileText size={20} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            {category}
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
            style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
          >
            Nổi bật
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-display font-bold text-base mb-2 leading-snug text-balance" style={{ color: 'var(--color-text)' }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{excerpt}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-light)' }}>
          <Clock size={11} />
          {readTime}
        </span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Đọc tiếp →</span>
      </div>
    </button>
  );
}

function PostCard({ post, onClick }: { post: PublishedContentPost; onClick: () => void }) {
  const { category, readTime, excerpt } = getPostMeta(post);
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left card-soft-hover p-5 flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
        >
          <FileText size={11} />
          {category}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
          <Clock size={10} />
          {readTime}
        </span>
      </div>
      <h3 className="font-display font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>{excerpt}</p>
      <span className="text-xs font-semibold mt-auto" style={{ color: 'var(--color-primary)' }}>Đọc tiếp →</span>
    </button>
  );
}

function FeaturedCard({ lesson, onClick }: { lesson: Lesson; onClick: () => void }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left card-soft-hover p-6 flex flex-col gap-4 w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
          <Icon size={20} style={{ color: text }} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
            style={{ backgroundColor: bg, color: text }}
          >
            {lesson.tag}
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
            style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
          >
            Nổi bật
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-display font-bold text-base mb-2 leading-snug text-balance" style={{ color: 'var(--color-text)' }}>
          {lesson.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{lesson.desc}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-light)' }}>
          <Clock size={11} />
          {lesson.readTime}
        </span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Đọc tiếp →</span>
      </div>
    </button>
  );
}

function LessonCard({ lesson, onClick }: { lesson: Lesson; onClick: () => void }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left card-soft-hover p-5 flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
          style={{ backgroundColor: bg, color: text }}
        >
          <Icon size={11} />
          {lesson.tag}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
          <Clock size={10} />
          {lesson.readTime}
        </span>
      </div>
      <h3 className="font-display font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
        {lesson.title}
      </h3>
      <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>{lesson.desc}</p>
      <span className="text-xs font-semibold mt-auto" style={{ color: 'var(--color-primary)' }}>Đọc tiếp →</span>
    </button>
  );
}
