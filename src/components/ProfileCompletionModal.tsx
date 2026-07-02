import { useEffect, useState, type FormEvent } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Grade } from '../types/database';

const GRADE_OPTIONS: Grade[] = [10, 11, 12];

export default function ProfileCompletionModal() {
  const { user, profile, displayName, loading, isProfileIncomplete, updateProfile, dismissProfileModal } = useAuth();

  const show = Boolean(user) && !loading && isProfileIncomplete;

  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [school, setSchool] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setFullName(profile?.full_name?.trim() || displayName || '');
      setGrade(profile?.grade ?? '');
      setSchool(profile?.school?.trim() || '');
      setError('');
    }
  }, [show, profile, displayName]);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  if (!show) return null;

  const canSubmit = Boolean(fullName.trim() && grade && school.trim());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !grade) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile({ full_name: fullName.trim(), grade, school: school.trim() });
    } catch {
      setError('Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="relative w-full max-w-md overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
            >
              <GraduationCap size={18} color="#ffffff" />
            </div>
            <div>
              <h2
                id="profile-modal-title"
                className="font-display font-bold text-base"
                style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
              >
                Hoàn thiện hồ sơ
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Giúp EduAI-Hub cá nhân hóa trải nghiệm cho bạn
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Full name */}
          <div>
            <label
              htmlFor="modal-full-name"
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}
            >
              Tên của bạn
            </label>
            <input
              id="modal-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên hiển thị"
              className="input-field"
              required
            />
          </div>

          {/* Grade */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}
            >
              Khối đang học
            </label>
            <div className="flex gap-2">
              {GRADE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className="flex-1 py-2.5 text-sm font-semibold border-2 transition-all duration-150"
                  style={
                    grade === g
                      ? { backgroundColor: 'var(--color-primary)', color: '#ffffff', borderColor: 'var(--color-primary)' }
                      : { backgroundColor: 'transparent', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }
                  }
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          {/* School */}
          <div>
            <label
              htmlFor="modal-school"
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}
            >
              Tên trường THPT
            </label>
            <input
              id="modal-school"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="VD: THPT Nguyễn Huệ"
              className="input-field"
              required
            />
          </div>

          {error && (
            <p
              className="text-xs border px-3 py-2.5"
              style={{ color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
            >
              {error}
            </p>
          )}

          <div className="pt-1 space-y-2">
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Đang lưu...</>
              ) : (
                'Lưu thông tin'
              )}
            </button>
            <button
              type="button"
              onClick={dismissProfileModal}
              className="w-full text-xs py-2 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Để sau
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
