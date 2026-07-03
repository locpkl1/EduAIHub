import { useEffect, useState, type FormEvent } from 'react';
import { GraduationCap, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Grade } from '../types/database';

const GRADE_OPTIONS: Grade[] = [10, 11, 12];

const STRENGTH_OPTIONS = [
  'Tư duy logic',
  'Sáng tạo',
  'Ghi nhớ tốt',
  'Viết tốt',
  'Tự học tốt',
  'Dùng công nghệ tốt',
  'Giao tiếp tốt',
];

const WEAKNESS_OPTIONS = [
  'Trì hoãn',
  'Mất tập trung',
  'Mất gốc',
  'Không biết bắt đầu',
  'Dễ nản',
  'Không biết đặt câu hỏi',
  'Hay chép đáp án',
];

const COMMON_PROBLEM_OPTIONS = [
  'Không biết dùng AI đúng cách',
  'AI trả lời lan man',
  'Không biết kiểm chứng thông tin',
  'Không biết biến bài học thành prompt',
  'Không biết tự đánh giá prompt',
  'Học nhưng không nhớ lâu',
];

const LEARNING_GOAL_OPTIONS = [
  'Học hiệu quả hơn',
  'Tạo prompt tốt hơn',
  'Ôn kiểm tra',
  'Học tiếng Anh',
  'Viết bài tốt hơn',
  'Quản lý thời gian',
  'Tự học có kỷ luật',
];

const LEARNING_STYLE_OPTIONS = [
  'Giải thích đơn giản',
  'Từng bước',
  'Ví dụ thực tế',
  'Ngắn gọn',
  'Hỏi đáp Socratic',
  'Thử thách nâng cao',
];

const AI_EXPERIENCE_OPTIONS = [
  'Mới biết AI',
  'Đã dùng cơ bản',
  'Dùng khá thường xuyên',
  'Muốn dùng AI chuyên nghiệp hơn',
];

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
              className="border px-3 py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: active ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                color: active ? '#ffffff' : 'var(--color-text-muted)',
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
    } catch {
      setError('Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <div className="shrink-0 px-5 py-4 sm:px-6" style={{ backgroundColor: 'var(--color-primary)' }}>
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))',
              }}
            >
              <GraduationCap size={19} color="#ffffff" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                <Sparkles size={12} />
                Hồ sơ học tập
              </p>
              <h2 id="profile-modal-title" className="font-display text-lg font-bold text-white">
                Cá nhân hóa EduAI-Hub cho cách bạn học
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/75">
                Những thông tin này giúp chatbot hiểu lớp học, điểm mạnh, điểm kẹt và cách giải thích phù hợp với bạn.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
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
                  className="input-field"
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
                      className="py-2.5 text-sm font-semibold transition-colors"
                      style={
                        grade === g
                          ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' }
                          : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)' }
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
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="modal-background" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                  Bối cảnh học tập
                </label>
                <textarea
                  id="modal-background"
                  value={personalBackground}
                  onChange={(e) => setPersonalBackground(e.target.value)}
                  placeholder="VD: Em đang ôn thi học kỳ, hơi yếu phần tự học Toán..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="modal-learning-style" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-light">
                    Cách học thích hợp
                  </label>
                  <select
                    id="modal-learning-style"
                    value={preferredLearningStyle}
                    onChange={(e) => setPreferredLearningStyle(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Chọn cách học</option>
                    {LEARNING_STYLE_OPTIONS.map((option) => (
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
                    className="input-field"
                  >
                    <option value="">Chọn mức độ</option>
                    {AI_EXPERIENCE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <ChoiceGroup label="Điểm mạnh" options={STRENGTH_OPTIONS} values={strengths} onChange={setStrengths} />
              <ChoiceGroup label="Điểm đang kẹt" options={WEAKNESS_OPTIONS} values={weaknesses} onChange={setWeaknesses} />
              <ChoiceGroup
                label="Vấn đề thường gặp với AI"
                options={COMMON_PROBLEM_OPTIONS}
                values={commonProblems}
                onChange={setCommonProblems}
              />
              <ChoiceGroup label="Mục tiêu học tập" options={LEARNING_GOAL_OPTIONS} values={learningGoals} onChange={setLearningGoals} />
            </div>
          </div>

          {error && (
            <p className="mt-5 border px-3 py-2.5 text-xs" style={{ color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
              {error}
            </p>
          )}

          <div className="sticky bottom-0 -mx-5 mt-6 flex flex-col gap-2 border-t px-5 pt-4 sm:-mx-6 sm:flex-row sm:items-center sm:justify-end sm:px-6"
            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <button type="button" onClick={dismissProfileModal} className="px-4 py-2 text-xs font-bold text-text-muted transition-colors hover:text-text">
              Để sau
            </button>
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
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
