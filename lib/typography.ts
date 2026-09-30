export const typography = {
  heroTitle:
    'text-[2rem] leading-tight font-medium tracking-[-0.02em] text-[color:var(--text-primary)]',
  pageTitle:
    'text-2xl font-medium tracking-[-0.02em] text-[color:var(--text-primary)]',
  sectionTitle:
    'mb-3 text-lg font-semibold tracking-[-0.015em] text-[color:var(--text-primary)]',
  itemTitle: 'text-base font-medium leading-6 text-[color:var(--text-primary)]',
  headline: 'text-base leading-6 text-[color:var(--text-secondary)]',
  itemMeta: 'text-base leading-6 text-[color:var(--text-secondary)]',
  // Dates sit a step below descriptions so rows read title → detail → date
  itemDate:
    'whitespace-nowrap text-[0.9375rem] leading-6 tabular-nums text-[color:var(--text-tertiary)]',
  itemDesc: 'text-base leading-6 text-[color:var(--text-soft)]',
  aboutText: 'text-base leading-[1.65] text-[color:var(--text-secondary)]',
  bodyText: 'text-lg leading-[1.6] text-[color:var(--text-secondary)]',
  subtleLink:
    'underline decoration-[color:var(--text-quiet)] decoration-1 underline-offset-[3px] transition-colors hover:decoration-[color:var(--text-secondary)]',
} as const;
