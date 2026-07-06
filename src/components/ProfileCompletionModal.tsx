import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, GraduationCap, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  aiExperienceLevelOptions,
  commonProblemOptions,
  learningGoalOptions,
  preferredLearningStyleOptions,
  strengthOptions,
  weaknessOptions,
} from '../data/profileOptions';
import { getProfileSaveErrorMessage } from '../lib/profileSaveError';
import type { Grade } from '../types/database';

const GRADE_OPTIONS: Grade[] = [10, 11, 12];

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function ChoiceGroup({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-text-light">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(toggleValue(values, option))}
              className="rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5"
              style={{
                backgroundColor: active
                  ? 'var(--color-primary)'
                  : 'color-mix(in srgb, var(--color-bg-muted) 76%, var(--color-bg-card))',
                borderColor: active ? 'var(--color-primary)' : 'color-mix(in srgb, var(--color-border) 72%, transparent)',
                color: active ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: active ? '0 10px 22px -16px var(--color-primary)' : 'none',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      className="space-y-4 rounded-2xl border p-4 sm:p-5"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 84%, var(--color-bg-muted))',
        borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
        boxShadow: '0 18px 40px -36px color-mix(in srgb, var(--color-text) 60%, transparent)',
      }}
    >
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-text-light">{title}</h3>
      {children}
    </section>
  );
}

export default function ProfileCompletionModal() {
  const { user, profile, displayName, loading, isProfileIncomplete, updateProfile, dismissProfileModal } = useAuth();

  const show = Boolean(user) && !loading && isProfileIncomplete;

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

  useEffect(() => {
    if (show) {
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
  }, [show, profile, displayName]);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

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
    } catch (saveError) {
      if (import.meta.env.DEV) {
        console.error('ProfileCompletionModal updateProfile failed:', saveError);
      }
      setError(getProfileSaveErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-[960px] flex-col overflow-hidden rounded-[1.75rem] shadow-2xl sm:max-h-[calc(100dvh-32px)]"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid color-mix(in srgb, var(--color-border) 70%, transparent)',
        }}
      >
        <div
          className="shrink-0 px-5 py-5 sm:px-6"
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 72%, var(--color-secondary)) 56%, color-mix(in srgb, var(--color-primary) 68%, var(--color-accent)) 100%)',
          }}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.24)',
              }}
            >
              <GraduationCap size={19} color="#ffffff" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                <Sparkles size={12} />
                Hồ sơ học tập
              </p>
              <h2 id="profile-modal-title" className="font-display text-xl font-bold text-white sm:text-2xl">
                Cá nhân hóa EduAI-Hub cho cách bạn học
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/80">
                Những thông tin này giúp chatbot hiểu lớp học, điểm mạnh, điểm kẹt và cách giải thích phù hợp với bạn.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <FormSection title="Thông tin cơ bản">
                <div>
                <label htmlFor="modal-full-name" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                  Tên của bạn
                </label>
                <input
                  id="modal-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập tên hiển thị"
                  className="input-field rounded-xl"
                  required
                />
                </div>

                <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-text-light">Khối đang học</p>
                <div className="grid grid-cols-3 gap-2">
                  {GRADE_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className="rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
                      style={
                        grade === g
                          ? {
                              backgroundColor: 'var(--color-primary)',
                              color: '#ffffff',
                              boxShadow: '0 12px 24px -18px var(--color-primary)',
                            }
                          : {
                              backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 78%, var(--color-bg-card))',
                              color: 'var(--color-text-muted)',
                            }
                      }
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
                </div>

                <div>
                <label htmlFor="modal-school" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                  Tên trường THPT
                </label>
                <input
                  id="modal-school"
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="VD: THPT Nguyễn Huệ"
                  className="input-field rounded-xl"
                  required
                />
                </div>
              </FormSection>

              <FormSection title="Bối cảnh học tập cá nhân">
                <div>
                <label htmlFor="modal-background" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                  Hiện tại bạn đang gặp khó khăn gì trong học tập hoặc khi dùng AI?
                </label>
                <textarea
                  id="modal-background"
                  value={personalBackground}
                  onChange={(e) => setPersonalBackground(e.target.value)}
                  placeholder="Ví dụ: Em hay trì hoãn, không biết bắt đầu học từ đâu, dùng AI hay bị chép đáp án..."
                  rows={5}
                  className="input-field resize-none rounded-xl"
                />
                </div>
              </FormSection>

              <FormSection title="Cách bạn học">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                  <label htmlFor="modal-learning-style" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                    Phong cách học mong muốn
                  </label>
                  <select
                    id="modal-learning-style"
                    value={preferredLearningStyle}
                    onChange={(e) => setPreferredLearningStyle(e.target.value)}
                    className="input-field rounded-xl"
                  >
                    <option value="">Chọn cách học</option>
                    {preferredLearningStyleOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  </div>
                  <div>
                  <label htmlFor="modal-ai-level" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                    Mức độ dùng AI
                  </label>
                  <select
                    id="modal-ai-level"
                    value={aiExperienceLevel}
                    onChange={(e) => setAiExperienceLevel(e.target.value)}
                    className="input-field rounded-xl"
                  >
                    <option value="">Chọn mức độ</option>
                    {aiExperienceLevelOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="space-y-5">
              <FormSection title="Điểm mạnh và điểm yếu">
                <ChoiceGroup label="Điểm mạnh" options={strengthOptions} values={strengths} onChange={setStrengths} />
                <ChoiceGroup label="Điểm yếu" options={weaknessOptions} values={weaknesses} onChange={setWeaknesses} />
              </FormSection>
              <FormSection title="Cách bạn dùng AI">
                <ChoiceGroup
                  label="Vấn đề hay gặp khi dùng AI"
                  options={commonProblemOptions}
                  values={commonProblems}
                  onChange={setCommonProblems}
                />
              </FormSection>
              <FormSection title="Mục tiêu học tập">
                <ChoiceGroup label="Bạn muốn EduAI-Hub hỗ trợ điều gì?" options={learningGoalOptions} values={learningGoals} onChange={setLearningGoals} />
              </FormSection>
            </div>
          </div>

          {error && (
            <div
              className="mt-5 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm"
              style={{ color: '#b91c1c', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div
            className="sticky bottom-0 -mx-4 mt-6 flex flex-col gap-2 border-t px-4 pt-4 sm:-mx-6 sm:flex-row sm:items-center sm:justify-end sm:px-6"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 92%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-border) 72%, transparent)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <button type="button" onClick={dismissProfileModal} className="rounded-full px-4 py-2.5 text-xs font-bold text-text-muted transition-colors hover:text-text">
              Để sau
            </button>
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 16px 30px -20px var(--color-primary)' }}
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Đang lưu...</>
              ) : (
                'Lưu hồ sơ học tập'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
