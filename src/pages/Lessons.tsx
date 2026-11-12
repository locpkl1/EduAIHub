import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Search, ChevronDown, FileText } from 'lucide-react';
import { fetchPublishedContentPosts, type PublishedContentPost } from '../lib/publicContentApi';

import { lessons, allTags, tagColorMap, type Lesson } from '../data/lessons';
export type { Lesson } from '../data/lessons';

export default function Lessons() {
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [publishedPosts, setPublishedPosts] = useState<PublishedContentPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const TAG_VISIBLE_COUNT = 4;

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedPosts() {
      setPostsLoading(true);
      setPostsError(false);
      try {
        const posts = await fetchPublishedContentPosts();
        if (!cancelled) setPublishedPosts(posts);
      } catch {
        if (!cancelled) setPostsError(true);
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    }

    loadPublishedPosts();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

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
    const matchSearch = search.trim() === '' || l.title.toLowerCase().includes(search.trim().toLowerCase()) || l.desc.toLowerCase().includes(search.trim().toLowerCase());
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
          <h1 className="page-title">Kinh nghiệm học cùng AI</h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
            Những hướng dẫn nhanh cho tình huống cụ thể. Muốn học theo lộ trình, hãy bắt đầu từ Cẩm nang AI.
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
              aria-label="Tìm bài kinh nghiệm"
              name="lesson-search"
              placeholder="Tìm bài học…"
              className="w-full pl-9 pr-4 py-2.5 text-base rounded-input transition-colors"
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
                aria-pressed={activeTag === tag}
                className="px-3.5 py-1.5 rounded-control text-xs font-semibold transition-colors"
                style={
                  activeTag === tag
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--foreground-on-primary)' }
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
                aria-expanded={tagsExpanded}
                className="flex items-center gap-1 px-3 py-1.5 rounded-control text-xs font-medium transition-colors"
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
                <FeaturedCard key={lesson.id} lesson={lesson} to={`/lessons/${lesson.id}`} />
              ))}
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} to={`/lessons/${post.slug}`} />
              ))}
            </div>
          </div>
        )}

        {postsLoading && (
          <div role="status" className="mb-5 text-sm" style={{ color: 'var(--color-text-light)' }}>
            Đang tải bài viết mới từ EduAI-Hub...
          </div>
        )}

        {postsError && <div role="alert" className="mb-5 border-l border-accent pl-4 text-sm text-text-muted"><p>Chưa tải được bài viết xuất bản. Các bài kinh nghiệm có sẵn vẫn đọc được.</p><button type="button" className="btn-outline mt-3" onClick={() => setAttempt(value => value + 1)}>Thử tải lại</button></div>}
        {/* Regular grid */}
        {!hasResults && !postsLoading ? (
          <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
            <p className="text-sm">Không tìm thấy bài học phù hợp.</p><button type="button" className="btn-outline mt-4" onClick={() => { setSearch(''); setActiveTag('Tất cả'); }}>Xóa tìm kiếm và bộ lọc</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTag === allTags[0] && search === '' ? regular : filtered).map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} to={`/lessons/${lesson.id}`} />
            ))}
            {postsForGrid.map((post) => (
              <PostCard key={post.id} post={post} to={`/lessons/${post.slug}`} />
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

function FeaturedPostCard({ post, to }: { post: PublishedContentPost; to: string }) {
  const { category, readTime, excerpt } = getPostMeta(post);
  return (
    <Link
      to={to}
      className="text-left card-soft-hover p-6 flex flex-col gap-4 w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-card flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-light)' }}>
          <FileText size={20} style={{ color: 'var(--color-primary-text)' }} />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-control"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-text)' }}
          >
            {category}
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-control"
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
        <span className="text-xs font-semibold" style={{ color: 'var(--color-primary-text)' }}>Đọc tiếp →</span>
      </div>
    </Link>
  );
}

function PostCard({ post, to }: { post: PublishedContentPost; to: string }) {
  const { category, readTime, excerpt } = getPostMeta(post);
  return (
    <Link
      to={to}
      className="text-left card-soft-hover p-5 flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-control"
          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-text)' }}
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
      <span className="text-xs font-semibold mt-auto" style={{ color: 'var(--color-primary-text)' }}>Đọc tiếp →</span>
    </Link>
  );
}

function FeaturedCard({ lesson, to }: { lesson: Lesson; to: string }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;
  return (
    <Link
      to={to}
      className="text-left card-soft-hover p-6 flex flex-col gap-4 w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-card flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
          <Icon size={20} style={{ color: text }} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-control"
            style={{ backgroundColor: bg, color: text }}
          >
            {lesson.tag}
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-control"
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
        <span className="text-xs font-semibold" style={{ color: 'var(--color-primary-text)' }}>Đọc tiếp →</span>
      </div>
    </Link>
  );
}

function LessonCard({ lesson, to }: { lesson: Lesson; to: string }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;
  return (
    <Link
      to={to}
      className="text-left card-soft-hover p-5 flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-control"
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
      <span className="text-xs font-semibold mt-auto" style={{ color: 'var(--color-primary-text)' }}>Đọc tiếp →</span>
    </Link>
  );
}
