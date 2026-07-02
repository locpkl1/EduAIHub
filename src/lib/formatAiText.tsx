import type { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function formatAiText(text: string): ReactNode {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre
              key={idx}
              className="text-xs p-3 overflow-x-auto font-mono-code leading-relaxed rounded-lg"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              {code}
            </pre>
          );
        }
        const lines = part.split('\n');
        return (
          <div key={idx}>
            {lines.map((line, li) =>
              line.trim() ? (
                <p key={li} className="leading-relaxed">
                  {renderInline(line)}
                </p>
              ) : (
                <br key={li} />
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Heuristic: AI response likely contains a usable prompt template */
export function looksLikePrompt(content: string): boolean {
  if (/```[\s\S]*?```/.test(content)) return true;
  const lower = content.toLowerCase();
  return (
    /\b(bạn là|you are|act as|vai trò|nhiệm vụ|your role)\b/i.test(content) &&
    content.length >= 80
  ) || /\b(prompt|đề bài)\b/i.test(lower) && content.length >= 60;
}

export function userRequestedSave(userText: string): boolean {
  return /\b(lưu|save)\b/i.test(userText);
}
