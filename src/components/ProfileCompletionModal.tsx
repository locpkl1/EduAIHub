import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, GraduationCap, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { useAuth } from '../contexts/authContextCore';
import ProfileFields from './profile/ProfileFields';
import { profileSections } from './profile/profileFormModel';
import { getProfileSaveErrorMessage } from '../lib/profileSaveError';
import type { Grade } from '../types/database';

export default function ProfileCompletionModal({ isOpen, onClose, onSaved }: { isOpen?: boolean; onClose?: () => void; onSaved?: () => void } = {}) {
  const { user, profile, displayName, loading, isProfileIncomplete, updateProfile, dismissProfileModal } = useAuth();

  const show = Boolean(user) && (isOpen ?? (!loading && isProfileIncomplete));
  function close() { dismissProfileModal(); onClose?.(); }

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
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const scrollPane = useRef<HTMLDivElement>(null);
  useEffect(() => { if (show) { setStep(0); setSaved(false); } }, [show]);
  useEffect(() => { if (show) { stepHeading.current?.focus({ preventScroll: true }); scrollPane.current?.scrollTo(0, 0); } }, [step, show]);

  const hydratedUser = useRef<string | null>(null);
  useEffect(() => {
    if (!show) { hydratedUser.current = null; return; }
    if (hydratedUser.current !== user?.id) {
      hydratedUser.current = user?.id ?? null;
      setFullName(profile?.full_name?.trim() || displayName || '');
      setGrade(profile?.grade ?? '');
      setSchool(profile?.school?.trim() || '');
      setPersonalBackground(profile?.personal_background || '');
      setStrengths(profile?.strengths || []);
      setWeaknesses(profile?.weaknesses || []);
      setCommonProblems(profile?.common_problems || []);
      setLearningGoals(profile?.learning_goals || []);
      setPreferredLearningStyle(profile?.preferred_learning_style || '');
      setAiExperienceLevel(profile?.ai_experience_level || '');
      setError('');
    }
  }, [show, profile, displayName, user?.id]);


  useEffect(() => {
    if (!show) return;
    const viewport = window.visualViewport;
    const update = () => scrollPane.current?.closest('dialog')?.style.setProperty('--dialog-height', `${Math.floor((viewport?.height ?? window.innerHeight) * .9)}px`);
    update(); viewport?.addEventListener('resize', update);
    return () => viewport?.removeEventListener('resize', update);
  }, [show]);

  if (!show) return saved ? <p role="status" className="sr-only">Đã lưu hồ sơ học tập.</p> : null;

  const canSubmit = Boolean(fullName.trim() && grade && school.trim());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !grade) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        full_name: fullName.trim(),
        grade,
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
      setSaved(true);
      onSaved?.();
      onClose?.();
    } catch (saveError) {
      if (import.meta.env.DEV) {
        console.error('ProfileCompletionModal updateProfile failed:', saveError);
      }
      setError(getProfileSaveErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  const values = { fullName, grade, school, personalBackground, strengths, weaknesses, commonProblems, learningGoals, preferredLearningStyle, aiExperienceLevel };
  const setters = { fullName: setFullName, grade: setGrade, school: setSchool, personalBackground: setPersonalBackground, strengths: setStrengths, weaknesses: setWeaknesses, commonProblems: setCommonProblems, learningGoals: setLearningGoals, preferredLearningStyle: setPreferredLearningStyle, aiExperienceLevel: setAiExperienceLevel };
  return <Modal isOpen={show} onClose={saving ? () => undefined : close} size="lg" showCloseButton={false} label="Cập nhật hồ sơ học tập">
    <form className="profile-dialog" onSubmit={event => { if (step < 2) { event.preventDefault(); if (canSubmit) setStep(value => value + 1); } else { handleSubmit(event); } }}>
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3"><GraduationCap size={22} className="shrink-0 text-primary" aria-hidden="true" /><h2 className="text-xl font-bold">Hồ sơ học tập của bạn</h2></div>
        <ol className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm" aria-label="Tiến trình hồ sơ">{profileSections.map((item, index) => <li key={item.id} aria-current={step === index ? 'step' : undefined} className={`border-t-2 pt-2 ${step === index ? 'border-primary font-semibold text-primary-text' : 'border-border text-text-muted'}`}><span className="block">{index + 1}. {item.title}</span></li>)}</ol>
      </header>
      <div ref={scrollPane} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        <h3 ref={stepHeading} tabIndex={-1} className="mb-4 text-xl font-bold">{profileSections[step].title}</h3>
        <p className="sr-only" role="status">Bước {step + 1} trên 3: {profileSections[step].title}</p>
        <fieldset disabled={saving} className="min-w-0"><ProfileFields prefix="onboarding" section={profileSections[step].id} values={values} setters={setters} /></fieldset>
        {error && <p role="alert" className="mt-4 flex gap-2 bg-accent-light p-3 text-sm text-accent"><AlertCircle size={18} className="shrink-0" />{error}</p>}
        {saved && <p role="status" className="mt-4 text-sm text-success">Đã lưu hồ sơ học tập.</p>}
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border bg-bg-card px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:px-6">
        <button type="button" onClick={close} disabled={saving} className="btn-ghost">Để sau</button>
        <div className="flex gap-2">{step > 0 && <button type="button" disabled={saving} className="btn-outline" onClick={() => setStep(value => value - 1)}>Quay lại</button>}<button type="submit" disabled={!canSubmit || saving} className="btn-primary">{saving && <Loader2 size={15} className="animate-spin" />}{saving ? 'Đang lưu…' : step < 2 ? 'Tiếp theo' : 'Lưu hồ sơ'}</button></div>
      </footer>
    </form>
  </Modal>;
}
