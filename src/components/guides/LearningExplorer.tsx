import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { guideLessons, guideStages } from '../../data/guideLessons';

const stageAccents = ['var(--color-primary-text)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-text)'];
const stageLabels = ['Hiểu và giao tiếp với AI', 'Học chủ động cùng AI', 'Xây hệ thống tự học', 'Tự chủ và có trách nhiệm'];

export default function LearningExplorer() {
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const legacyStage = /^#guide-stage-([1-4])$/.exec(hash)?.[1];
  const requested = Number(legacyStage ?? params.get('stage') ?? 1);
  const active = guideStages.some(stage => stage.number === requested) ? requested : 1;
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  function selectStage(number: number) {
    if (number === active && params.get('stage') === String(number) && !legacyStage) return;
    const next = new URLSearchParams(params);
    next.set('stage', String(number));
    setParams(next, { state: { preserveDocumentScroll: { x: window.scrollX, y: window.scrollY } } });
  }
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : null;
    if (next === null) return;
    event.preventDefault();
    triggers.current[next]?.focus();
    selectStage(next + 1);
  }

  return <section className="learning-explorer" aria-label="Khám phá bốn chặng học AI">
    <div role="tablist" aria-label="Chọn chặng học" className="learning-stage-tabs">
      {guideStages.map((stage, index) => <button key={stage.number} ref={node => { triggers.current[index] = node; }} id={`stage-tab-${stage.number}`} type="button" role="tab" aria-label={`Chặng ${stage.number}: ${stage.title}`} aria-selected={active === stage.number} aria-controls={`guide-stage-${stage.number}`} tabIndex={active === stage.number ? 0 : -1} onClick={() => selectStage(stage.number)} onKeyDown={event => navigateTabs(event, index)} className="learning-stage-tab" style={{ '--stage-color': stageAccents[index] } as CSSProperties}>
        <span className="font-display text-xl font-bold">{String(stage.number).padStart(2, '0')}</span><span className="text-left text-sm font-semibold leading-6 text-text">{stageLabels[index]}<span className="block text-xs font-normal text-text-muted">{guideLessons.filter(lesson => lesson.stage === stage.number).length} bài</span></span>
      </button>)}
    </div>
    {guideStages.map(stage => {
      const lessons = guideLessons.filter(lesson => lesson.stage === stage.number);
      return <div key={stage.number} role="tabpanel" id={`guide-stage-${stage.number}`} aria-labelledby={`stage-tab-${stage.number}`} tabIndex={active === stage.number ? 0 : -1} hidden={active !== stage.number} className="p-4 sm:p-6">
        <header className="mb-5 max-w-3xl"><p className="text-sm font-semibold text-text-muted">Chặng {stage.number} / 4 · {lessons.length} bài</p><h2 className="mt-2 text-2xl font-bold">{stage.title}</h2><p className="mt-3 text-sm leading-7 text-text-muted">{stage.description}</p></header>
        <ol className="divide-y divide-border border-y border-border">{lessons.map(lesson => <li key={lesson.slug} className="flex items-start gap-3 py-4 sm:gap-5"><span className="pt-1 font-display text-lg text-primary-text" aria-hidden="true">{String(lesson.number).padStart(2, '0')}</span><div className="min-w-0 flex-1"><h3 className="text-lg font-bold"><Link className="hover:text-primary-text" to={`/guides/${lesson.slug}`}>{lesson.title}</Link></h3><p className="mt-2 text-sm leading-7 text-text-muted">{lesson.cardDescription}</p><div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-text-muted">{lesson.readTime}</span><Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-text" to={`/guides/${lesson.slug}`} aria-label={`Đọc bài ${lesson.number}: ${lesson.title}`}>Đọc bài <ArrowRight size={15} aria-hidden="true" /></Link></div></div></li>)}</ol>
      </div>;
    })}
  </section>;
}
