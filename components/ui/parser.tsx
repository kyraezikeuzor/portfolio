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
        'underline decoration-2 decoration-dotted underline-offset-2 decoration-neutral-400 opacity-85 text-neutral-600 dark:text-neutral-400',
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
