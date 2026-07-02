import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SavedPrompt } from '../types/database';
import { referencePrompts } from '../data/educationData';
import { Copy, Check, LogIn, BookOpen, Sparkles, Loader2, Trash2 } from 'lucide-react';

type Tab = 'mine' | 'reference';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all duration-150"
      style={{
        backgroundColor: copied ? 'var(--color-success)' : 'var(--color-primary)',
        color: '#ffffff',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      {copied ? <><Check size={12} /> Đã sao chép</> : <><Copy size={12} /> Copy Prompt</>}
    </button>
  );
}

function PromptCard({
  title,
  subtitle,
  content,
  badge,
  onDelete,
  deleting,
}: {
  title: string;
  subtitle?: string;
  content: string;
  badge?: string;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  const preview = content.length > 160 ? `${content.slice(0, 160).trim()}…` : content;
  return (
    <div
      className="card-hover flex flex-col h-full p-5"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3
            className="font-display font-bold text-sm truncate"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge && <span className="tag-primary tag">{badge}</span>}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--color-text-light)' }}
              title="Xóa prompt"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          )}
        </div>
      </div>

      <p
        className="text-sm flex-1 whitespace-pre-line leading-relaxed line-clamp-3"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {preview}
      </p>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <CopyButton text={content} />
      </div>
    </div>
  );
}

export default function PromptLibrary() {
  const { profile, isGuest, loading: authLoading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('mine');
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || isGuest || !profile || !isSupabaseConfigured) return;
    fetchSavedPrompts();
  }, [profile, isGuest, authLoading]);

  async function fetchSavedPrompts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSavedPrompts(data || []);
    } catch (error) {
      console.error('Error fetching saved prompts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePrompt(id: string) {
    if (!profile || !confirm('Xóa prompt này?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('saved_prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', profile.id);
      if (error) throw error;
      setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    } finally {
      setDeletingId(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'mine', label: 'Kho prompt của tôi' },
    { id: 'reference', label: 'Kho prompt tham khảo' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div
        className="border-b py-12"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-4 inline-flex">Tài Nguyên</span>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl mt-1"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}
          >
            Kho <span style={{ color: 'var(--color-primary)' }}>Prompt</span>
          </h1>
          <p className="text-base mt-3 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
            Quản lý prompt cá nhân và khám phá mẫu prompt chất lượng cho việc học.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-0 mb-8" style={{ borderBottom: '2px solid var(--color-border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className="px-5 py-3 text-sm font-semibold transition-all duration-150 relative"
              style={{
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'mine' && (
          <div>
            {authLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : isGuest ? (
              <div
                className="border p-12 text-center"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-5"
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                >
                  <Sparkles size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
                  Lưu prompt cá nhân
                </h2>
                <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--color-text-muted)' }}>
                  Đăng nhập Google để lưu các prompt cá nhân. Prompt tạo từ chatbot sẽ xuất hiện tại đây.
                </p>
                <button onClick={signInWithGoogle} type="button" className="btn-primary inline-flex items-center gap-2">
                  <LogIn size={15} />
                  Đăng nhập bằng Google
                </button>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : savedPrompts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    title={prompt.purpose || 'Prompt học tập'}
                    subtitle={[prompt.subject, prompt.chapter].filter(Boolean).join(' · ')}
                    content={prompt.prompt_content}
                    badge={prompt.book_series || undefined}
                    onDelete={() => handleDeletePrompt(prompt.id)}
                    deleting={deletingId === prompt.id}
                  />
                ))}
              </div>
            ) : (
              <div
                className="border p-12 text-center"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: 'var(--color-bg-muted)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                >
                  <BookOpen size={24} style={{ color: 'var(--color-text-light)' }} />
                </div>
                <h2 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                  Chưa có prompt nào
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Hãy thử chatbot Tạo Prompt Học Tập — prompt đã lưu sẽ hiển thị tại đây.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reference' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {referencePrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                title={prompt.title}
                subtitle={prompt.description}
                content={prompt.content}
                badge={prompt.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
