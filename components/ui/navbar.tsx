import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

// Recessive against body copy, but never faded; hover resolves to primary
const navLink =
  'text-[0.9375rem] leading-6 text-[color:var(--text-nav)] transition-colors duration-150 hover:text-[color:var(--text-primary)]';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-center border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-primary)] py-4">
      <div className="flex w-full max-w-[700px] items-center justify-between px-5">
        <Link
          href="/"
          aria-label="Home"
          className="relative h-8 w-20 overflow-hidden rounded-md transition-opacity hover:opacity-70"
        >
          <img
            src="/kyra-logo.png"
            alt=""
            className="absolute left-1/2 top-1/2 w-20 max-w-none -translate-x-1/2 -translate-y-1/2 transition-[filter] dark:invert"
          />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-5 items-center gap-2">
            <Link href="/#work" className={navLink}>
              Work
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link href="/#projects" className={navLink}>
              Projects
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link href="/#writing" className={navLink}>
              Writing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
