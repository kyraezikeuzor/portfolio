import { ParsedRichText } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

function renderRichText(content: ParsedRichText[], keyPrefix = 'rich-text') {
  return content.map((line, index) => {
    const styles = cn(
      'whitespace-pre-wrap',
      line.link && typography.subtleLink,
      line.bold && 'font-semibold',
      line.italic && 'italic font-normal',
      line.strikethrough && 'line-through',
      line.underline && 'underline',
      line.code && 'font-mono text-[0.9em]'
    );

    if (line.link) {
      return (
        <Link
          key={`${keyPrefix}-${index}`}
          href={line.link.url}
          target="_blank"
          rel="noreferrer"
          className={styles}
        >
          {line.text}
        </Link>
      );
    }

    return (
      <span key={`${keyPrefix}-${index}`} className={cn(styles)}>
        {line.text}
      </span>
    );
  });
}

function splitRichTextIntoSentences(content: ParsedRichText[]) {
  const fullText = content.map((line) => line.text).join('');
  const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
  const ranges = Array.from(segmenter.segment(fullText)).flatMap(
    ({ segment, index }) => {
      const trimmed = segment.trim();

      if (!trimmed) return [];

      const leadingWhitespace = segment.length - segment.trimStart().length;
      return [
        {
          start: index + leadingWhitespace,
          end: index + leadingWhitespace + trimmed.length,
        },
      ];
    }
  );

  return ranges.map(({ start, end }) => {
    let offset = 0;

    return content.flatMap((line) => {
      const lineStart = offset;
      const lineEnd = offset + line.text.length;
      offset = lineEnd;

      const overlapStart = Math.max(start, lineStart);
      const overlapEnd = Math.min(end, lineEnd);

      if (overlapStart >= overlapEnd) return [];

      return [
        {
          ...line,
          text: line.text.slice(
            overlapStart - lineStart,
            overlapEnd - lineStart
          ),
        },
      ];
    });
  });
}

export function parser(content: ParsedRichText[]) {
  if (!Array.isArray(content)) return null;

  return <div className="inline">{renderRichText(content)}</div>;
}

export function sentenceBlockParser(content: ParsedRichText[]) {
  if (!Array.isArray(content)) return null;

  const sentences = splitRichTextIntoSentences(content);

  return (
    <div className="flex flex-col gap-3">
      {sentences.map((sentence, index) => (
        <p key={index}>{renderRichText(sentence, `sentence-${index}`)}</p>
      ))}
    </div>
  );
}
