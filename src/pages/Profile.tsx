import { useState, useEffect, useRef, type FormEvent } from 'react';
import { AlertCircle, User, Save, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import ProfileFields from '../components/profile/ProfileFields';
import { profileSections, type ProfileSection, type ProfileSetters } from '../components/profile/profileFormModel';
import { getProfileSaveErrorMessage } from '../lib/profileSaveError';
import type { Grade } from '../types/database';

export default function Profile() {
  const { user, profile, displayName, avatarUrl, loading, isGuest, signInWithGoogle, updateProfile } = useAuth();


  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [school, setSchool] = useState('');
  const [personalBackground, setPersonalBackground] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [commonProblems, setCommonProblems] = useState<string[]>([]);
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [preferredLearningStyle, setPreferredLearningStyle] = useState('');
  const [aiExperienceLevel, setAiExperienceLevel] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [imgErr, setImgErr] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [section, setSection] = useState<ProfileSection | null>(null);
  const editorHeading = useRef<HTMLHeadingElement>(null);
  const groupTriggers = useRef<Partial<Record<ProfileSection, HTMLButtonElement | null>>>({});
  useEffect(() => { if (section) { editorHeading.current?.focus({ preventScroll: true }); editorHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); } }, [section]);

  const hydratedVersion = useRef('');
  const draftOwner = useRef<string | null>(null);
  const draftDirty = useRef(false);
  useEffect(() => {
    if (profile) {
      if (draftOwner.current === profile.id && draftDirty.current) return;
      draftOwner.current = profile.id;
      draftDirty.current = false;
      const version = `${profile.id}:${profile.updated_at}`;
      if (hydratedVersion.current === version) return;
      hydratedVersion.current = version;
      setFullName(profile.full_name?.trim() || displayName || '');
      setGrade(profile.grade ?? '');
      setSchool(profile.school?.trim() || '');
      setPersonalBackground(profile.personal_background || '');
      setStrengths(profile.strengths || []);
      setWeaknesses(profile.weaknesses || []);
      setCommonProblems(profile.common_problems || []);
      setLearningGoals(profile.learning_goals || []);
      setPreferredLearningStyle(profile.preferred_learning_style || '');
      setAiExperienceLevel(profile.ai_experience_level || '');
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
      await updateProfile({
        full_name: fullName.trim(),
        grade: grade as Grade,
        school: school.trim(),
        personal_background: personalBackground.trim(),
        strengths,
        weaknesses,
        common_problems: commonProblems,
        learning_goals: learningGoals,
        preferred_learning_style: preferredLearningStyle,
        ai_experience_level: aiExperienceLevel,
        onboarding_completed: true,
      });
      draftDirty.current = false;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      if (import.meta.env.DEV) {
        console.error('Profile page updateProfile failed:', saveError);
      }
      setError(getProfileSaveErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading && !user) {
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
          style={{ backgroundColor: 'var(--color-primary-light)' }}
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

  const values = { fullName, grade, school, personalBackground, strengths, weaknesses, commonProblems, learningGoals, preferredLearningStyle, aiExperienceLevel };
  const setters: ProfileSetters = {
    fullName: value => { draftDirty.current = true; setSaved(false); setFullName(value); },
    grade: value => { draftDirty.current = true; setSaved(false); setGrade(value); },
    school: value => { draftDirty.current = true; setSaved(false); setSchool(value); },
    personalBackground: value => { draftDirty.current = true; setSaved(false); setPersonalBackground(value); },
    strengths: value => { draftDirty.current = true; setSaved(false); setStrengths(value); },
    weaknesses: value => { draftDirty.current = true; setSaved(false); setWeaknesses(value); },
    commonProblems: value => { draftDirty.current = true; setSaved(false); setCommonProblems(value); },
    learningGoals: value => { draftDirty.current = true; setSaved(false); setLearningGoals(value); },
    preferredLearningStyle: value => { draftDirty.current = true; setSaved(false); setPreferredLearningStyle(value); },
    aiExperienceLevel: value => { draftDirty.current = true; setSaved(false); setAiExperienceLevel(value); }
  };
  return <div className="page-container max-w-5xl py-8 sm:py-12">
    <header className="flex items-start gap-4 border-b border-border pb-6">
      {avatarUrl && !imgErr ? <img src={avatarUrl} alt="" width={64} height={64} onError={() => setImgErr(true)} referrerPolicy="no-referrer" className="h-16 w-16 shrink-0 rounded-full object-cover" /> : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-text" aria-hidden="true"><User size={26} /></span>}
      <div className="min-w-0"><h1 className="page-title">Hồ sơ học tập</h1><p className="mt-3 break-words font-semibold">{displayName || fullName || 'Học sinh'}</p><p className="mt-1 break-words text-sm text-text-muted">{profile?.grade ? `Lớp ${profile.grade}` : 'Chưa chọn lớp'} · {profile?.school || 'Chưa có trường'}</p><p className="mt-1 break-all text-sm text-text-muted">{user?.email}</p></div>
    </header>
    <ProfileCompletionModal isOpen={setupOpen} onSaved={() => { draftDirty.current = false; hydratedVersion.current = ''; setSaved(true); }} onClose={() => setSetupOpen(false)} />
    <button type="button" className="btn-ghost mt-4" disabled={loading || saving} onClick={() => setSetupOpen(true)}>Thiết lập hồ sơ từng bước</button>
    <p className="my-6 text-base leading-7 text-text-muted">Chọn phần bạn muốn cập nhật. Các thông tin khác được giữ nguyên trong bản chỉnh sửa.</p>
    <div className="grid gap-3 sm:grid-cols-3" aria-label="Nhóm chỉnh sửa hồ sơ">
      {profileSections.map(item => <button key={item.id} ref={node => { groupTriggers.current[item.id] = node; }} type="button" aria-expanded={section === item.id} aria-controls={section === item.id ? 'profile-editor' : undefined} onClick={() => { setSection(item.id); setSaved(false); }} className={`min-w-0 rounded-card border p-4 text-left ${section === item.id ? 'border-primary bg-primary-light' : 'border-border-interactive bg-bg-card hover:border-primary'}`}><span className="block font-display text-lg font-bold">{item.title}</span><span className="mt-2 block text-sm leading-6 text-text-muted">{item.id === 'goals' && learningGoals.length ? `${learningGoals.slice(0, 2).join(' · ')}${learningGoals.length > 2 ? ` · +${learningGoals.length - 2}` : ''}` : item.description}</span></button>)}
    </div>
    {section && <form onSubmit={handleSubmit} id="profile-editor" className="mt-6 rounded-card border border-border bg-bg-card p-4 sm:p-6">
      <h2 ref={editorHeading} tabIndex={-1} className="mb-5 text-2xl font-bold">{profileSections.find(item => item.id === section)?.title}</h2>
      <fieldset disabled={saving} className="min-w-0"><ProfileFields prefix="profile" section={section} values={values} setters={setters} /></fieldset>
      {error && <p role="alert" className="mt-5 flex gap-2 rounded-card bg-accent-light p-4 text-sm text-accent"><AlertCircle size={18} className="shrink-0" />{error}</p>}
      {saved && <p role="status" className="mt-5 text-sm text-success">Thông tin đã được lưu thành công.</p>}
      {(!fullName.trim() || !grade || !school.trim()) && section !== 'basic' && <p className="mt-4 text-sm text-accent">Hoàn thiện tên, lớp và trường trong Thông tin cơ bản trước khi lưu.</p>}
      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4"><button type="submit" disabled={!fullName.trim() || !grade || !school.trim() || saving} className="btn-primary">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Đang lưu…' : 'Lưu thông tin'}</button><button type="button" className="btn-ghost" disabled={saving} onClick={() => { setSection(null); groupTriggers.current[section]?.focus({ preventScroll: true }); }}>Thu gọn</button></div>
    </form>}
  </div>;
}
