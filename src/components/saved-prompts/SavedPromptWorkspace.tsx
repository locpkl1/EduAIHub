import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Eye,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import Modal from '../Modal';
import CopyButton from '../ui/CopyButton';
import { DEFAULT_BOOK_SERIES, isTargetBookSeries } from '../../data/educationData';
import type { SavedPrompt } from '../../types/database';

type DetailMode = 'view' | 'edit' | 'delete';

interface SavedPromptCollectionProps {
  prompts: SavedPrompt[];
  onUpdate: (id: string, promptContent: string) => Promise<SavedPrompt>;
  onDelete: (id: string) => Promise<void>;
  className?: string;
}

function promptTitle(prompt: SavedPrompt) {
  const storedContext = prompt.purpose?.trim() || prompt.subject?.trim();
  if (storedContext) return storedContext;

  const preview = prompt.prompt_content.replace(/\s+/g, ' ').trim();
  return preview.length > 64 ? `${preview.slice(0, 64).trim()}…` : preview || 'Prompt học tập';
}

function promptMetadata(prompt: SavedPrompt) {
  return [
    prompt.subject?.trim() || null,
    prompt.chapter?.trim() || null,
    isTargetBookSeries(prompt.book_series) ? DEFAULT_BOOK_SERIES : null,
  ].filter((value): value is string => Boolean(value));
}

function formatSavedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function SavedPromptCard({
  prompt,
  onOpen,
  onEdit,
  onDelete,
}: {
  prompt: SavedPrompt;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const metadata = promptMetadata(prompt);
  const savedDate = formatSavedDate(prompt.created_at);

  return (
    <article
      className="card-hover flex h-full min-w-0 flex-col p-5"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <button type="button" onClick={onOpen} className="min-h-11 min-w-0 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-snug text-text">
              {promptTitle(prompt)}
            </h3>
          </div>
          <Eye size={18} className="mt-1 flex-shrink-0 text-primary" aria-hidden="true" />
        </div>

        {metadata.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metadata.map((item) => <span key={item} className="tag">{item}</span>)}
          </div>
        )}

        <p className="mt-4 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-text-muted">
          {prompt.prompt_content}
        </p>
      </button>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
        <span className="inline-flex items-center gap-1.5 text-xs text-text-light">
          <CalendarDays size={14} /> {savedDate ? `Đã lưu ${savedDate}` : 'Prompt đã lưu'}
        </span>
        <div className="flex items-center gap-1.5">
          <CopyButton text={prompt.prompt_content} label="Sao chép" />
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-11 w-11 items-center justify-center rounded-control border text-text-muted transition-colors hover:text-primary"
            style={{ borderColor: 'var(--color-border)' }}
            aria-label="Chỉnh sửa prompt"
            title="Chỉnh sửa"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-11 w-11 items-center justify-center rounded-control border text-text-muted transition-colors hover:text-red-600"
            style={{ borderColor: 'var(--color-border)' }}
            aria-label="Xóa prompt"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function SavedPromptDetailModal({
  prompt,
  initialMode,
  onClose,
  onUpdate,
  onDelete,
}: {
  prompt: SavedPrompt;
  initialMode: DetailMode;
  onClose: () => void;
  onUpdate: (id: string, promptContent: string) => Promise<SavedPrompt>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<DetailMode>(initialMode);
  const [draft, setDraft] = useState(prompt.prompt_content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [operationError, setOperationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const metadata = promptMetadata(prompt);
  const savedDate = formatSavedDate(prompt.created_at);
  const busy = saving || deleting;

  useEffect(() => {
    setMode(initialMode);
    setDraft(prompt.prompt_content);
    setOperationError('');
    setSuccessMessage('');
  }, [initialMode, prompt.id, prompt.prompt_content]);

  function changeMode(nextMode: DetailMode) {
    setMode(nextMode);
    setDraft(prompt.prompt_content);
    setOperationError('');
    setSuccessMessage('');
  }

  async function handleSave() {
    const nextContent = draft.trim();
    if (!nextContent) {
      setOperationError('Nội dung prompt không được để trống.');
      return;
    }
    if (saving) return;

    setSaving(true);
    setOperationError('');
    try {
      await onUpdate(prompt.id, nextContent);
      setMode('view');
      setSuccessMessage('Đã lưu thay đổi.');
    } catch {
      setOperationError('Chưa thể lưu thay đổi. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    setOperationError('');
    try {
      await onDelete(prompt.id);
      onClose();
    } catch {
      setOperationError('Chưa thể xóa prompt. Dữ liệu của bạn vẫn được giữ nguyên.');
      setDeleting(false);
    }
  }

  return (
    <Modal isOpen onClose={busy ? () => undefined : onClose} size="lg" showCloseButton={!busy} label={mode === 'edit' ? 'Chỉnh sửa prompt' : mode === 'delete' ? 'Xác nhận xóa prompt' : promptTitle(prompt)}>
      <div className="flex min-h-0 max-h-[90vh] flex-col">
        <header className="border-b px-5 py-5 pr-14 sm:px-7 sm:py-6" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-display text-2xl font-bold leading-tight text-text sm:text-3xl">
            {mode === 'edit' ? 'Chỉnh sửa prompt' : mode === 'delete' ? 'Xóa prompt này?' : promptTitle(prompt)}
          </h2>
          {mode === 'view' && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {metadata.map((item) => <span key={item} className="tag">{item}</span>)}
              {savedDate && <span className="text-xs text-text-light">Đã lưu {savedDate}</span>}
            </div>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {mode === 'edit' ? (
            <div>
              <label htmlFor={`saved-prompt-${prompt.id}`} className="text-sm font-bold text-text">
                Nội dung prompt
              </label>
              <p className="mt-1 text-xs leading-5 text-text-muted">
                Sửa nội dung rồi chọn Lưu thay đổi. Ngữ cảnh đã lưu vẫn được giữ nguyên.
              </p>
              <textarea
                id={`saved-prompt-${prompt.id}`}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  if (operationError) setOperationError('');
                }}
                disabled={saving}
                className="input-field mt-4 min-h-64 w-full resize-y whitespace-pre-wrap text-sm leading-6 sm:min-h-72"
                autoFocus
              />
            </div>
          ) : mode === 'delete' ? (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-text-muted">
                Prompt sẽ bị xóa khỏi Kho Prompt và Dashboard của bạn. Hành động này không thể hoàn tác.
              </p>
              <div className="rounded-card border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
                <p className="font-display font-bold text-text">{promptTitle(prompt)}</p>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-text-muted">
                  {prompt.prompt_content}
                </p>
              </div>
            </div>
          ) : (
            <div>
              {successMessage && (
                <p className="mb-4 rounded-card px-4 py-3 text-sm font-semibold" style={{ backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }} role="status">
                  {successMessage}
                </p>
              )}
              <pre className="max-h-[48vh] overflow-y-auto whitespace-pre-wrap break-words rounded-card border p-4 font-sans text-base leading-8 text-text sm:p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
                {prompt.prompt_content}
              </pre>
            </div>
          )}

          {operationError && (
            <p className="mt-4 rounded-card border px-4 py-3 text-sm leading-6 text-accent" style={{ borderColor: 'color-mix(in srgb, #dc2626 35%, transparent)', backgroundColor: 'color-mix(in srgb, #dc2626 8%, transparent)' }} role="alert">
              {operationError}
            </p>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7" style={{ borderColor: 'var(--color-border)' }}>
          {mode === 'view' && (
            <>
              <button type="button" onClick={() => changeMode('delete')} className="btn-outline min-h-11 justify-center gap-2 sm:mr-auto">
                <Trash2 size={16} /> Xóa
              </button>
              <button type="button" onClick={() => changeMode('edit')} className="btn-outline min-h-11 justify-center gap-2">
                <Pencil size={16} /> Chỉnh sửa
              </button>
              <CopyButton text={prompt.prompt_content} />
            </>
          )}

          {mode === 'edit' && (
            <>
              <button type="button" onClick={() => changeMode('view')} disabled={saving} className="btn-outline min-h-11 justify-center">
                Hủy
              </button>
              <button type="button" onClick={handleSave} disabled={saving || !draft.trim()} className="btn-primary min-h-11 justify-center gap-2">
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
              </button>
            </>
          )}

          {mode === 'delete' && (
            <>
              <button type="button" onClick={() => changeMode('view')} disabled={deleting} className="btn-outline min-h-11 justify-center">
                Giữ lại
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-red-600 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                {deleting ? 'Đang xóa…' : 'Xác nhận xóa'}
              </button>
            </>
          )}
        </footer>
      </div>
    </Modal>
  );
}

export default function SavedPromptCollection({
  prompts,
  onUpdate,
  onDelete,
  className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
}: SavedPromptCollectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [initialMode, setInitialMode] = useState<DetailMode>('view');
  const selectedPrompt = useMemo(
    () => prompts.find((prompt) => prompt.id === selectedId) ?? null,
    [prompts, selectedId],
  );

  function openPrompt(id: string, mode: DetailMode) {
    setInitialMode(mode);
    setSelectedId(id);
  }

  return (
    <>
      <div className={className}>
        {prompts.map((prompt) => (
          <SavedPromptCard
            key={prompt.id}
            prompt={prompt}
            onOpen={() => openPrompt(prompt.id, 'view')}
            onEdit={() => openPrompt(prompt.id, 'edit')}
            onDelete={() => openPrompt(prompt.id, 'delete')}
          />
        ))}
      </div>

      {selectedPrompt && (
        <SavedPromptDetailModal
          prompt={selectedPrompt}
          initialMode={initialMode}
          onClose={() => setSelectedId(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
