import Link from 'next/link';

import { typography } from '@/lib/typography';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))] flex-col items-center justify-center">
      <span className={typography.bodyText}>
        Page not found.{' '}
        <Link href="/" className={typography.subtleLink}>
          Back home.
        </Link>
      </span>
    </div>
  );
}
