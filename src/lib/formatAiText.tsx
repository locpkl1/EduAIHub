import type { ReactNode } from 'react';

type TextBlock = { type: 'paragraph'; lines: string[] };
type HeadingBlock = { type: 'heading'; depth: 1 | 2 | 3; text: string };
type ListBlock = { type: 'ul' | 'ol'; items: string[] };
type CodeBlock = { type: 'code'; code: string; language?: string };
type TableAlign = 'left' | 'center' | 'right';
type TableBlock = {
  type: 'table';
  headers: string[];
  alignments: TableAlign[];
  rows: string[][];
};
type MarkdownBlock = TextBlock | HeadingBlock | ListBlock | CodeBlock | TableBlock;

function isBlank(line: string) {
  return !line.trim();
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return [];

  const withoutOuterPipes = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return withoutOuterPipes.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line: string) {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, '')));
}

function parseAlignment(cell: string): TableAlign {
  const compact = cell.replace(/\s/g, '');
  if (/^:-{3,}:$/.test(compact)) return 'center';
  if (/^-{3,}:$/.test(compact)) return 'right';
  return 'left';
}

function isTableStart(lines: string[], index: number) {
  return Boolean(lines[index]?.includes('|') && lines[index + 1] && isTableSeparator(lines[index + 1]));
}

function isHeading(line: string) {
  return /^(#{1,3})\s+(.+)$/.test(line.trim());
}

function getListMatch(line: string) {
  const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
  if (unordered) return { type: 'ul' as const, text: unordered[1] };

  const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
  if (ordered) return { type: 'ol' as const, text: ordered[1] };

  return null;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-text">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded-md px-1.5 py-0.5 font-mono-code text-[0.92em]"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 78%, transparent)',
            color: 'var(--color-text)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function parseTextBlocks(text: string): MarkdownBlock[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isBlank(line)) {
      index += 1;
      continue;
    }

    const heading = line.trim().match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: 'heading',
        depth: Math.min(heading[1].length, 3) as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableRow(lines[index]);
      const alignments = splitTableRow(lines[index + 1]).map(parseAlignment);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].includes('|') && !isBlank(lines[index])) {
        if (!isTableSeparator(lines[index])) {
          rows.push(splitTableRow(lines[index]));
        }
        index += 1;
      }

      blocks.push({ type: 'table', headers, alignments, rows });
      continue;
    }

    const listMatch = getListMatch(line);
    if (listMatch) {
      const items: string[] = [];
      const listType = listMatch.type;

      while (index < lines.length) {
        const current = getListMatch(lines[index]);
        if (!current || current.type !== listType) break;
        items.push(current.text.trim());
        index += 1;
      }

      blocks.push({ type: listType, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      !isBlank(lines[index]) &&
      !isHeading(lines[index]) &&
      !isTableStart(lines, index) &&
      !getListMatch(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: paragraphLines });
    } else {
      index += 1;
    }
  }

  return blocks;
}

function parseMarkdown(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const fenceRegex = /```([^\n`]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before.trim()) blocks.push(...parseTextBlocks(before));

    blocks.push({
      type: 'code',
      language: match[1]?.trim() || undefined,
      code: match[2].replace(/\n$/, ''),
    });

    lastIndex = match.index + match[0].length;
  }

  const rest = text.slice(lastIndex);
  if (rest.trim()) blocks.push(...parseTextBlocks(rest));
  return blocks;
}

function renderParagraph(block: TextBlock, key: number) {
  return (
    <p key={key} className="leading-7 text-text">
      {block.lines.map((line, index) => (
        <span key={`${key}-${index}`}>
          {index > 0 && <br />}
          {renderInline(line)}
        </span>
      ))}
    </p>
  );
}

function renderHeading(block: HeadingBlock, key: number) {
  const className =
    block.depth === 1
      ? 'mt-5 mb-3 font-display text-base font-bold leading-6 text-text'
      : block.depth === 2
        ? 'mt-4 mb-2 font-display text-sm font-bold leading-6 text-text'
        : 'mt-4 mb-2 text-sm font-bold leading-6 text-text';

  const content = renderInline(block.text);
  if (block.depth === 1) return <h1 key={key} className={className}>{content}</h1>;
  if (block.depth === 2) return <h2 key={key} className={className}>{content}</h2>;
  return <h3 key={key} className={className}>{content}</h3>;
}

function renderList(block: ListBlock, key: number) {
  const ListTag = block.type;
  return (
    <ListTag
      key={key}
      className={`my-3 space-y-1.5 pl-5 leading-7 text-text ${block.type === 'ul' ? 'list-disc' : 'list-decimal'}`}
    >
      {block.items.map((item, index) => (
        <li key={`${key}-${index}`} className="pl-1">
          {renderInline(item)}
        </li>
      ))}
    </ListTag>
  );
}

function renderCode(block: CodeBlock, key: number) {
  return (
    <pre
      key={key}
      className="my-3 overflow-x-auto rounded-xl p-3 font-mono-code text-xs leading-relaxed"
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      <code>{block.code}</code>
    </pre>
  );
}

function renderTable(block: TableBlock, key: number) {
  const columnCount = Math.max(block.headers.length, ...block.rows.map((row) => row.length), 1);
  const columns = Array.from({ length: columnCount });

  return (
    <div
      key={key}
      className="my-4 overflow-x-auto rounded-xl border"
      style={{ borderColor: 'color-mix(in srgb, var(--color-border) 78%, transparent)' }}
    >
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-muted) 78%, var(--color-bg-card))' }}>
            {columns.map((_, columnIndex) => (
              <th
                key={columnIndex}
                className="px-3 py-2.5 text-left align-top text-xs font-bold uppercase tracking-[0.08em] text-text"
                style={{ textAlign: block.alignments[columnIndex] ?? 'left' }}
              >
                {renderInline(block.headers[columnIndex] ?? '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((_, columnIndex) => (
                <td
                  key={columnIndex}
                  className="border-t px-3 py-2.5 align-top leading-6 text-text-muted"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                    textAlign: block.alignments[columnIndex] ?? 'left',
                  }}
                >
                  {renderInline(row[columnIndex] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function formatAiText(text: string): ReactNode {
  const blocks = parseMarkdown(text);

  return (
    <div className="ai-markdown space-y-3 text-sm leading-7 text-text">
      {blocks.length > 0
        ? blocks.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return renderParagraph(block, index);
              case 'heading':
                return renderHeading(block, index);
              case 'ul':
              case 'ol':
                return renderList(block, index);
              case 'table':
                return renderTable(block, index);
              case 'code':
                return renderCode(block, index);
            }
          })
        : <p className="leading-7 text-text">{renderInline(text)}</p>}
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
