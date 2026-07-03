import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Brain, MessageSquare, AlertTriangle, Target, BookOpen, TrendingUp, Star, Search, ChevronDown, FileText } from 'lucide-react';
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
    title: 'Cách biến AI thành gia sư cá nhân miễn phí',
    tag: 'Chiến lược',
    tagColor: 'primary',
    desc: 'Thiết lập đúng vai trò cho AI, đặt câu hỏi liên tục và xây dựng phiên học 1:1 hiệu quả không cần trả tiền',
    readTime: '7 phút',
    featured: true,
    icon: Brain,
    content: {
      intro: 'Gia sư AI không phải là AI trả lời câu hỏi của bạn — mà là AI được bạn lập trình để DẠY bạn. Sự khác biệt này rất quan trọng.',
      sections: [
        {
          heading: 'Bước 1: Thiết lập vai trò cho AI',
          body: 'Bắt đầu mỗi phiên học bằng prompt thiết lập vai trò: "Bạn là gia sư Toán lớp 12 kiên nhẫn, giỏi giải thích bằng ví dụ đời sống. Nhiệm vụ của bạn là giúp tôi HIỂU, không phải làm thay tôi. Khi tôi sai, hãy hỏi tôi câu hỏi gợi ý thay vì đưa đáp án ngay."',
          tips: ['Thêm tính cách cho AI (kiên nhẫn, gần gũi)', 'Đặt quy tắc rõ: không đưa đáp án ngay', 'Chỉ rõ môn và lớp'],
        },
        {
          heading: 'Bước 2: Học theo phương pháp Socratic',
          body: 'Thay vì hỏi "giải bài này", hãy hỏi "Bài này tôi cần áp dụng kiến thức gì? Gợi ý cho tôi điểm bắt đầu." Sau đó tự làm, nếu sai, hỏi "Tôi sai ở bước nào? Cho tôi một câu hỏi gợi ý thay vì đáp án."',
        },
        {
          heading: 'Bước 3: Kiểm tra sau khi học',
          body: 'Cuối mỗi phiên, yêu cầu: "Hãy hỏi tôi 5 câu kiểm tra về những gì tôi vừa học. Chờ tôi trả lời từng câu trước khi cho biết đúng sai." Đây là cách hiệu quả nhất để kiểm tra bạn có thực sự hiểu không.',
          tips: ['Tự trả lời trước khi xem đáp án', 'Yêu cầu câu hỏi từ dễ đến khó', 'Nhờ AI phân tích lỗi sai'],
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Học tiếng Anh với AI — từ giao tiếp đến ôn thi',
    tag: 'Tiếng Anh',
    tagColor: 'accent',
    desc: 'Luyện nói, mở rộng từ vựng, sửa lỗi ngữ pháp và viết luận với AI — hoàn toàn miễn phí và linh hoạt 24/7',
    readTime: '8 phút',
    featured: true,
    icon: MessageSquare,
    content: {
      intro: 'AI là người bạn học tiếng Anh lý tưởng: không phán xét, sẵn sàng 24/7, kiên nhẫn vô hạn và phản hồi ngay lập tức.',
      sections: [
        {
          heading: 'Luyện từ vựng theo chủ đề',
          body: 'Prompt hiệu quả: "Bạn là giáo viên tiếng Anh. Dạy tôi 10 từ vựng chủ đề [Environment/Technology/Health] — mỗi từ cần: phát âm IPA, nghĩa tiếng Việt, 2 câu ví dụ tự nhiên và 1 mẹo ghi nhớ vui."',
          tips: ['Học theo chủ đề, không học lẻ tẻ', 'Yêu cầu câu ví dụ thực tế', 'Tạo flashcard từ phản hồi'],
        },
        {
          heading: 'Sửa lỗi ngữ pháp và viết luận',
          body: 'Viết đoạn văn → paste vào AI với prompt: "Hãy sửa lỗi ngữ pháp trong đoạn văn này, giải thích tại sao sai và cách viết đúng. Sau đó đánh giá mức độ tự nhiên của tiếng Anh theo thang 1-10."',
        },
        {
          heading: 'Luyện nói với AI',
          body: 'Dùng ChatGPT voice hoặc Gemini: "Hãy giả vờ là người phỏng vấn tôi về chủ đề Climate Change. Hỏi tôi 3 câu, chờ tôi trả lời và sau đó nhận xét ngữ pháp và từ vựng của tôi."',
        },
      ],
    },
  },
  {
    id: 3,
    title: 'Những lỗi sai cực kỳ phổ biến khi dùng AI học tập',
    tag: 'Kinh nghiệm',
    tagColor: 'warning',
    desc: 'Copy paste, tin tuyệt đối, hỏi quá mơ hồ — 5 lỗi này đang khiến bạn lãng phí tiềm năng của AI và tự hại bản thân',
    readTime: '6 phút',
    featured: false,
    icon: AlertTriangle,
    content: {
      intro: 'Dùng AI sai cách không chỉ không giúp ích — đôi khi còn có hại hơn không dùng. Đây là 5 lỗi bạn cần tránh ngay.',
      sections: [
        {
          heading: 'Lỗi 1: Hỏi quá mơ hồ',
          body: 'Tệ: "Giải thích Vật lý cho tôi". Tốt: "Tôi là HS lớp 12, đang học Chương Khúc xạ ánh sáng. Giải thích định luật Snell với 2 ví dụ thực tế và 1 bài tập áp dụng mức trung bình."',
          tips: ['Luôn thêm lớp, môn, chương cụ thể', 'Chỉ rõ muốn bao nhiêu ví dụ', 'Nêu mức độ khó'],
        },
        {
          heading: 'Lỗi 2: Copy nguyên văn câu trả lời AI',
          body: 'AI viết bài cho bạn = bạn không học được gì. Đọc, hiểu, rồi TỰ VIẾT LẠI bằng lời của bạn. Nộp bài do AI viết trong kỳ thi có thể bị xử lý gian lận.',
        },
        {
          heading: 'Lỗi 3: Tin tuyệt đối vào AI',
          body: 'AI có thể sai, đặc biệt với số liệu, công thức Toán/Lý/Hóa và sự kiện lịch sử. Quy tắc vàng: bất kỳ thông tin quan trọng nào cũng cần đối chiếu với sách giáo khoa.',
          tips: ['Luôn đối chiếu SGK', 'Đặc biệt cẩn thận với số liệu', 'Hỏi "Bạn chắc chắn không?" để AI tự kiểm tra'],
        },
      ],
    },
  },
  {
    id: 4,
    title: 'Dùng AI để lập kế hoạch ôn thi cực kỳ hiệu quả',
    tag: 'Ôn thi',
    tagColor: 'success',
    desc: 'Từ lịch học Pomodoro đến bộ đề trắc nghiệm tự động — AI có thể làm được tất cả nếu bạn biết cách prompt đúng',
    readTime: '9 phút',
    featured: false,
    icon: Target,
    content: {
      intro: 'Ôn thi là thời điểm AI hữu ích nhất. Nhưng phải dùng đúng cách — nghĩa là AI hỗ trợ, không làm thay.',
      sections: [
        {
          heading: 'Tạo lịch ôn tập cá nhân hóa',
          body: 'Prompt: "Tôi còn 3 tuần trước kỳ thi THPT. Tôi học khối A (Toán, Lý, Hóa). Điểm yếu là Hóa hữu cơ và Vật lý điện. Hãy lập lịch ôn tập 3 tuần, mỗi ngày học 3 tiếng, theo phương pháp spaced repetition."',
          tips: ['Cung cấp đủ thông tin (thời gian, điểm yếu, thời lượng)', 'Yêu cầu phương pháp cụ thể (Pomodoro, spaced repetition)', 'Xem lại và điều chỉnh lịch sau 1 tuần'],
        },
        {
          heading: 'Tạo bộ câu hỏi trắc nghiệm tự động',
          body: 'Prompt: "Tôi là giáo viên Hóa học lớp 12. Tạo 15 câu trắc nghiệm về Este-Lipit, mỗi câu 4 đáp án A-D, ghi đáp án đúng và giải thích ngắn 2 dòng. Phân bổ: 5 câu nhận biết, 5 câu thông hiểu, 5 câu vận dụng."',
        },
      ],
    },
  },
  {
    id: 5,
    title: 'Tóm tắt sách giáo khoa siêu nhanh với AI',
    tag: 'Mẹo học',
    tagColor: 'primary',
    desc: 'Biến một chương sách giáo khoa dài thành mindmap, flashcard và điểm trọng tâm chỉ trong vài phút',
    readTime: '5 phút',
    featured: false,
    icon: BookOpen,
    content: {
      intro: 'AI có thể giúp bạn đọc và xử lý tài liệu nhanh hơn — nhưng nhớ rằng tóm tắt không thay thế việc đọc và hiểu.',
      sections: [
        {
          heading: 'Prompt tóm tắt chương học',
          body: 'Paste nội dung chương vào AI và dùng prompt: "Hãy tóm tắt chương này theo cấu trúc: 1) Ý chính 3 gạch đầu dòng 2) 5 khái niệm quan trọng cần nhớ 3) 2 lỗi sai học sinh hay gặp 4) Câu hỏi ôn tập khả năng cao."',
          tips: ['Không chỉ copy tóm tắt — đọc và hiểu trước', 'Tự thêm ví dụ từ kinh nghiệm của bạn', 'So sánh với ghi chú trên lớp'],
        },
        {
          heading: 'Tạo flashcard nhanh',
          body: 'Prompt: "Từ nội dung tóm tắt trên, tạo 10 cặp flashcard định nghĩa theo format: [Mặt trước: câu hỏi/thuật ngữ] | [Mặt sau: giải thích ngắn gọn dưới 20 chữ]."',
        },
      ],
    },
  },
  {
    id: 6,
    title: 'Cách kiểm chứng thông tin AI cung cấp',
    tag: 'Tư duy phản biện',
    tagColor: 'warning',
    desc: 'AI hay nói sai nhất ở đâu? Làm thế nào để phát hiện và kiểm chứng mà không mất nhiều thời gian?',
    readTime: '6 phút',
    featured: false,
    icon: TrendingUp,
    content: {
      intro: 'AI rất tự tin ngay cả khi sai. Khả năng phát hiện và kiểm chứng thông tin là kỹ năng quan trọng nhất khi dùng AI.',
      sections: [
        {
          heading: 'AI sai nhiều nhất ở đâu?',
          body: '1) Số liệu và thống kê (hay bịa năm tháng, con số). 2) Công thức Toán/Lý/Hóa phức tạp (hay nhầm dấu, đơn vị). 3) Sự kiện lịch sử (nhầm nhân vật, địa danh). 4) Tên tác giả và tác phẩm văn học.',
          tips: ['Cẩn thận với mọi con số cụ thể', 'Kiểm tra công thức trước khi dùng bài thi', 'Đặt câu hỏi "Nguồn của thông tin này là gì?"'],
        },
        {
          heading: 'Quy trình kiểm chứng 3 bước',
          body: '1) Đối chiếu với SGK ngay khi nhận thông tin quan trọng. 2) Dùng prompt "Bạn có chắc chắn về thông tin này không? Liệt kê những điểm bạn không chắc." 3) Tìm nguồn độc lập (thầy cô, tài liệu tham khảo chính thống).',
        },
      ],
    },
  },
];

export const allTags = ['Tất cả', 'Chiến lược', 'Tiếng Anh', 'Kinh nghiệm', 'Ôn thi', 'Mẹo học', 'Tư duy phản biện'];

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
      } catch (error) {
        console.error('Error fetching published posts:', error);
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
            Ná»•i báº­t
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
