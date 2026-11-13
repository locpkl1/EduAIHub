import { useId, useState } from 'react';
import { Search, X } from 'lucide-react';
import { aiExperienceLevelOptions, commonProblemOptions, learningGoalOptions, preferredLearningStyleOptions, strengthOptions, weaknessOptions } from '../../data/profileOptions';
import type { Grade } from '../../types/database';

import type { ProfileDraft, ProfileSection, ProfileSetters } from './profileFormModel';

function MultiChoice({ label, options, values, onChange }: { label: string; options: string[]; values: string[]; onChange: (values: string[]) => void }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const allOptions = [...new Set([...options, ...values])];
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi').replace(/đ/g, 'd');
  const filtered = allOptions.filter(option => normalize(option).includes(normalize(query.trim())));
  function toggle(option: string) { onChange(values.includes(option) ? values.filter(item => item !== option) : [...values, option]); }
  return <fieldset className="min-w-0">
    <legend className="mb-2 text-sm font-semibold">{label}</legend>
    {values.length > 0 && <div className="mb-2 flex flex-wrap items-center gap-2">
      {values.slice(0, 2).map(value => <button key={value} type="button" onClick={() => toggle(value)} className="flex min-h-11 max-w-full items-center gap-2 rounded-control bg-primary-light px-3 py-2 text-left text-sm text-primary-text" aria-label={`Bỏ ${value}`}><span className="break-words">{value}</span><X size={14} className="shrink-0" aria-hidden="true" /></button>)}
      {values.length > 2 && <span className="text-sm text-text-muted">+{values.length - 2} lựa chọn</span>}
    </div>}
    <details className="rounded-input border border-border-interactive bg-bg-card" onKeyDown={event => {
      if (event.key === 'Escape' && event.currentTarget.open) { event.stopPropagation(); event.preventDefault(); event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); }
    }} onToggle={event => { if (!event.currentTarget.open) setQuery(''); }}>
      <summary className="min-h-11 cursor-pointer px-3 py-3 text-sm">{values.length ? `Thay đổi lựa chọn (${values.length})` : `Chọn ${label.toLocaleLowerCase('vi')}`}</summary>
      <div className="border-t border-border px-3 pb-3 pt-2">
        <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm text-text-muted"><Search size={15} aria-hidden="true" />Tìm trong {label.toLocaleLowerCase('vi')}</label>
        <input id={id} type="search" onKeyDown={event => { if (event.key === 'Enter') event.preventDefault(); }} value={query} onChange={event => setQuery(event.target.value)} className="input-field mb-2" autoComplete="off" placeholder="Gõ để tìm…" />
        <div className="space-y-1">{filtered.map(option => <label key={option} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-control px-2 py-2 hover:bg-bg-muted"><input type="checkbox" checked={values.includes(option)} onChange={() => toggle(option)} className="mt-1 h-5 w-5 shrink-0" /><span className="text-sm leading-6">{option}</span></label>)}</div>
        {!filtered.length && <p role="status" className="py-3 text-sm text-text-muted">Không có lựa chọn khớp. Thử từ khóa khác.</p>}
      </div>
    </details>
  </fieldset>;
}

export default function ProfileFields({ section, values: v, setters: set, prefix }: { section: ProfileSection; values: ProfileDraft; setters: ProfileSetters; prefix: string }) {
  const selectField = (key: 'preferredLearningStyle' | 'aiExperienceLevel', label: string, options: string[]) => <div><label htmlFor={`${prefix}-${key}`} className="mb-2 block text-sm font-semibold">{label}</label><select id={`${prefix}-${key}`} name={key} value={v[key]} onChange={event => set[key](event.target.value)} className="input-field"><option value="">Chọn khi phù hợp</option>{[...new Set([...options, ...(v[key] ? [v[key]] : [])])].map(option => <option key={option} value={option}>{option}</option>)}</select></div>;
  if (section === 'basic') return <div className="space-y-5">
    <div><label htmlFor={`${prefix}-full-name`} className="mb-2 block text-sm font-semibold">Tên hiển thị</label><input id={`${prefix}-full-name`} name="full_name" autoComplete="name" value={v.fullName} onChange={event => set.fullName(event.target.value)} className="input-field" required /></div>
    <fieldset><legend className="mb-2 text-sm font-semibold">Khối lớp</legend><div className="grid grid-cols-3 gap-2">{([10, 11, 12] as Grade[]).map(grade => <label key={grade} className={`flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-control border px-2 py-2 text-sm ${v.grade === grade ? 'border-primary bg-primary-light text-primary-text' : 'border-border-interactive'}`}><input type="radio" name={`${prefix}-grade`} checked={v.grade === grade} onChange={() => set.grade(grade)} required />Lớp {grade}</label>)}</div></fieldset>
    <div><label htmlFor={`${prefix}-school`} className="mb-2 block text-sm font-semibold">Trường học</label><input id={`${prefix}-school`} name="school" autoComplete="organization" value={v.school} onChange={event => set.school(event.target.value)} className="input-field" placeholder="Ví dụ: THPT Nguyễn Huệ…" required /></div>
  </div>;
  if (section === 'goals') return <div className="space-y-5"><MultiChoice label="Mục tiêu học tập" options={learningGoalOptions} values={v.learningGoals} onChange={set.learningGoals} /><p className="text-sm leading-6 text-text-muted">Có thể chọn nhiều mục tiêu và thay đổi bất cứ lúc nào. Ngữ cảnh bạn nhập trong Cách học giúp làm rõ nhu cầu hỗ trợ.</p></div>;
  return <div className="space-y-5">
    <div><label htmlFor={`${prefix}-background`} className="mb-2 block text-sm font-semibold">Bạn đang cần hỗ trợ điều gì?</label><textarea id={`${prefix}-background`} name="personal_background" value={v.personalBackground} onChange={event => set.personalBackground(event.target.value)} rows={3} className="input-field resize-y" placeholder="Chia sẻ việc đang học và chỗ bạn thường vướng…" /></div>
    <MultiChoice label="Vấn đề khi dùng AI" options={commonProblemOptions} values={v.commonProblems} onChange={set.commonProblems} />
    <div className="grid gap-5 sm:grid-cols-2"><MultiChoice label="Điểm mạnh" options={strengthOptions} values={v.strengths} onChange={set.strengths} /><MultiChoice label="Điểm cần cải thiện" options={weaknessOptions} values={v.weaknesses} onChange={set.weaknesses} /></div>
    <div className="grid gap-5 sm:grid-cols-2">{selectField('preferredLearningStyle', 'Phong cách học mong muốn', preferredLearningStyleOptions)}{selectField('aiExperienceLevel', 'Mức độ dùng AI', aiExperienceLevelOptions)}</div>
  </div>;
}
