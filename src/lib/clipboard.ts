/** Preserve the legacy clipboard path for browsers without the async API. */
export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const field = document.createElement('textarea');
  field.value = text;
  field.readOnly = true;
  field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  // A native modal makes the rest of the document inert.
  const host = document.querySelector('dialog[open]') ?? document.body;
  host.appendChild(field);
  try {
    field.select();
    if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
  } finally {
    field.remove();
    active?.focus({ preventScroll: true });
  }
}
