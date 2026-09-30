import Link from 'next/link';
import {
  Coffee,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Rss,
  Twitter,
  type LucideIcon,
} from 'lucide-react';
import { parser } from '@/components/ui/parser';
import { defaultPortraitUrl } from '@/lib/constants';
import { typography } from '@/lib/typography';
import {
  cloudinaryImageUrl,
  formatTimespanFromDate,
  formatYearFromDate,
  toSlug,
} from '@/lib/utils';
import { PortfolioDatabase } from '@/types';

const borderedList =
  'flex flex-col divide-y divide-[color:var(--border-subtle)] border-y border-[color:var(--border-subtle)]';
const interactiveRow =
  'transition-colors duration-150 hover:bg-[color:var(--surface-secondary)]';

const socialIcons: Record<string, LucideIcon> = {
  buymeacoffee: Coffee,
  email: Mail,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  substack: Rss,
  twitter: Twitter,
};

function Postscript({
  postscript,
}: {
  postscript: PortfolioDatabase['postscript'];
}) {
  return (
    <div className={`w-full ${typography.itemDesc}`}>
      {parser(postscript.desc)}
    </div>
  );
}

function Socials({ socials }: { socials: PortfolioDatabase['socials'] }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5">
      {[...socials].reverse().map((social) => {
        const Icon = socialIcons[social.name.toLowerCase()];

        if (!social.link) return null;

        return (
          <Link
            key={social.id}
            href={social.link}
            target="_blank"
            rel="noreferrer"
            aria-label={social.name}
            className="rounded-md p-1.5 text-[color:var(--text-soft)] transition-colors duration-150 hover:bg-[color:var(--surface-secondary)] hover:text-[color:var(--text-primary)]"
          >
            {Icon ? (
              <Icon aria-hidden="true" className="h-5 w-5" />
            ) : (
              <span className="text-xs font-medium">{social.name}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function Headline({ headline }: { headline: PortfolioDatabase['headline'] }) {
  return (
    <div className={`w-full ${typography.headline}`}>
      {parser(headline.desc)}
    </div>
  );
}

function Header({
  portrait,
  headline,
  socials,
}: {
  portrait: PortfolioDatabase['portrait'];
  headline: PortfolioDatabase['headline'];
  socials: PortfolioDatabase['socials'];
}) {
  return (
    <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <img
        className="h-28 w-28 rounded-full object-cover"
        width={112}
        height={112}
        src={cloudinaryImageUrl(portrait.files[0]?.url || defaultPortraitUrl, {
          width: 112,
          height: 112,
        })}
        alt={portrait.desc || 'Picture of me'}
      />
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex flex-col items-start gap-0.5">
          <h1 className={typography.heroTitle}>Kyra Ezikeuzor</h1>
          <Headline headline={headline} />
        </div>
        <Socials socials={socials} />
      </div>
    </header>
  );
}

function About({ about }: { about: PortfolioDatabase['about'] }) {
  return (
    <section className={typography.aboutText}>{parser(about.desc)}</section>
  );
}

function Work({ positions }: { positions: PortfolioDatabase['positions'] }) {
  const workDetailsClassName =
    'flex min-w-0 flex-1 flex-row flex-wrap items-start gap-x-2 gap-y-0.5';

  if (!positions.length) return null;

  return (
    <section id="work" className="scroll-mt-24">
      <h2 className={typography.sectionTitle}>Work</h2>
      <div className={borderedList}>
        {positions.map((item) => {
          const logo = item.files[0];
          const content = (
            <>
              <span className="flex items-center gap-2">
                {logo ? (
                  <img
                    className="h-5 w-5 rounded object-cover"
                    width={20}
                    height={20}
                    src={cloudinaryImageUrl(logo.url, {
                      width: 20,
                      height: 20,
                    })}
                    alt=""
                  />
                ) : null}
                <span className={typography.itemTitle}>{item.group}</span>
              </span>
              <span className={typography.itemMeta}>{item.name}</span>
            </>
          );

          return (
            <div
              key={item.id}
              className="flex w-full items-start justify-between gap-4 px-1 py-3.5"
            >
              {item.link ? (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className={workDetailsClassName}
                >
                  {content}
                </Link>
              ) : (
                <div className={workDetailsClassName}>{content}</div>
              )}
              <span className={typography.itemDate}>
                {formatTimespanFromDate(item.startDate, item.endDate)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Projects({
  projects,
  description,
}: {
  projects: PortfolioDatabase['projects'];
  description?: string;
}) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="scroll-mt-24">
      <h2 className={typography.sectionTitle}>Projects</h2>
      {description ? (
        <p className={`-mt-1 mb-3 ${typography.itemDesc}`}>{description}</p>
      ) : null}
      <div className="flex flex-col gap-2.5">
        {projects.map((item) => {
          const coverImage = item.files[0];

          return (
            <Link
              key={item.id}
              href={`/projects/${toSlug(item.name)}`}
              className="group flex w-full overflow-hidden rounded-[13px] border border-[color:var(--border-card)] bg-[color:var(--surface-card)] transition-colors duration-150 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-secondary)]"
            >
              {coverImage ? (
                // Fixed-width rail; self-stretch lets the image fill whatever
                // height the text column ends up at
                <div className="w-24 shrink-0 self-stretch overflow-hidden border-r border-[color:var(--border-card)] sm:w-40">
                  <img
                    src={cloudinaryImageUrl(coverImage.url, {
                      width: 420,
                      height: 300,
                    })}
                    alt={coverImage.name || `${item.name} preview`}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`truncate ${typography.itemTitle}`}>
                    {item.name}
                  </span>
                  <span className={typography.itemDate}>
                    {formatTimespanFromDate(item.startDate, item.endDate)}
                  </span>
                </div>
                <p className={`line-clamp-2 ${typography.itemDesc}`}>
                  {item.desc.map((part) => part.text).join('')}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Writing({ writing }: { writing: PortfolioDatabase['writing'] }) {
  if (!writing.length) return null;

  return (
    <section id="writing" className="scroll-mt-24">
      <h2 className={typography.sectionTitle}>Writing</h2>
      <div className={borderedList}>
        {writing.map((item) => {
          const content = (
            <div className="flex flex-col gap-1 px-1 py-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className={typography.itemTitle}>
                  {item.name}
                  {/* Drawn rather than typed: Inter has no U+2197 glyph, so the
                      character falls back to a system font whose weight and
                      baseline do not match the title. The leading NBSP keeps
                      the arrow on the title's last line. */}
                  <span className="whitespace-nowrap">
                    {'\u00A0'}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 10 10"
                      className="inline-block h-[0.66em] w-[0.66em] align-[-0.02em] text-[color:var(--text-tertiary)] transition-colors duration-150 group-hover:text-[color:var(--text-primary)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.4 7.6 7.5 2.5" />
                      <path d="M3.9 2.5H7.5V6.1" />
                    </svg>
                  </span>
                </span>
                <span className={typography.itemDate}>
                  {formatYearFromDate(item.datePublished)}
                </span>
              </div>
              <div className={typography.itemDesc}>{parser(item.desc)}</div>
            </div>
          );

          return item.link ? (
            <Link
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className={`group ${interactiveRow}`}
            >
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

export { About, Header, Postscript, Projects, Work, Writing };
