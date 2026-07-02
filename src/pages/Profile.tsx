import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, School, Save, Loader2, LogIn, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Grade } from '../types/database';

const GRADE_OPTIONS: Grade[] = [10, 11, 12];

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

export default function Profile() {
  const { user, profile, displayName, avatarUrl, loading, isGuest, signInWithGoogle, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [school, setSchool] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name?.trim() || displayName || '');
      setGrade(profile.grade ?? '');
      setSchool(profile.school?.trim() || '');
    } else if (displayName) {
      setFullName(displayName);
    }
  }, [profile, displayName]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !grade || !school.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile({ full_name: fullName.trim(), grade: grade as Grade, school: school.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  // Guest — not logged in
  if (isGuest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-primary-light)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
        >
          <User size={28} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h1
          className="font-display font-bold text-3xl mb-3"
          style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
        >
          Thông Tin Cá Nhân
        </h1>
        <p className="text-base mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Đăng nhập để xem và cập nhật thông tin hồ sơ học tập của bạn.
        </p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="btn-primary inline-flex items-center gap-2"
        >
          <LogIn size={16} />
          Đăng nhập bằng Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Page header */}
      <div
        className="border-b py-10"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm mb-5 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={14} />
            Quay lại
          </button>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              {avatarUrl && !imgErr ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={() => setImgErr(true)}
                  className="w-16 h-16 object-cover"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                />
              ) : (
                <div
                  className="w-16 h-16 flex items-center justify-center font-display font-bold text-xl"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                >
                  {getInitials(displayName || '')}
                </div>
              )}
            </div>

            <div>
              <span className="section-label mb-2 inline-flex">Hồ Sơ Học Sinh</span>
              <h1
                className="font-display font-bold text-2xl sm:text-3xl mt-1"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
              >
                {displayName || 'Người dùng'}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left: Stats */}
          <div className="md:col-span-1 space-y-4">
            {/* Info card */}
            <div
              className="border p-5"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
                Tóm tắt hồ sơ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <GraduationCap size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Khối lớp</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      {profile?.grade ? `Lớp ${profile.grade}` : 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <School size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Trường THPT</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      {profile?.school?.trim() || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-bg-muted)' }}
                  >
                    <Shield size={14} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Tài khoản</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Google</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Member since */}
            <div
              className="border p-5"
              style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
            >
              <p className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: 'var(--color-text-light)', letterSpacing: '0.1em' }}>
                Ngày tham gia
              </p>
              <p className="font-display font-bold text-base" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
                  : '—'}
              </p>
            </div>
          </div>

          {/* Right: Edit form */}
          <div className="md:col-span-2">
            <div
              className="border"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h2 className="font-display font-bold text-base" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                  Cập nhật thông tin
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  Thông tin sẽ được dùng để cá nhân hóa trải nghiệm học tập
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Tên hiển thị
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    className="input-field"
                    required
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                    Khối đang học
                  </label>
                  <div className="flex gap-3">
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
                    htmlFor="profile-school"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Tên trường THPT
                  </label>
                  <input
                    id="profile-school"
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
                    className="text-sm border px-4 py-3"
                    style={{ color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
                  >
                    {error}
                  </p>
                )}

                {saved && (
                  <p
                    className="text-sm border px-4 py-3 font-medium"
                    style={{ color: 'var(--color-success)', backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
                  >
                    Thông tin đã được lưu thành công.
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!fullName.trim() || !grade || !school.trim() || saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Lưu thông tin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
