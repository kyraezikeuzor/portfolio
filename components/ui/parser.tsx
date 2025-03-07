import { Text } from '@/schema';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Using your existing utils

export function parser(content: Text[]) {
  if (!Array.isArray(content)) return null;

  const body = content.map((line, index) => {
    // Use cn utility to properly combine classes
    const styles = cn(
      'whitespace-pre-wrap',
      line.link &&
        'underline decoration-[1px] decoration-dashed underline-offset-4 decoration-neutral-400 hover:opacity-75',
      line.bold && 'font-semibold',
      line.italic && 'italic font-normal',
      line.strikethrough && 'line-through',
      line.underline && 'underline',
      line.color !== 'default' && line.color
    );

    if (line.link) {
      return (
        <Link
          key={index}
          href={line.link.url}
          className={cn('underline', styles)}
        >
          {line.text}
        </Link>
      );
    }

    return (
      <span key={index} className={cn(styles)}>
        {line.text}
      </span>
    );
  });

  return <div className="inline">{body}</div>;
}
