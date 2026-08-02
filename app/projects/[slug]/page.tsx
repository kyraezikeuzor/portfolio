import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Portfolio } from '@/lib/portfolio';
import { parser } from '@/components/ui/parser';
import { formatYearFromDate, toSlug } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { ExternalLink } from 'lucide-react';

export const revalidate = 60;

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const portfolio = await new Portfolio().getPortfolio();
  const project = portfolio.projects.find(
    (item) => toSlug(item.name) === params.slug
  );

  if (!project) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/projects"
        className={`${typography.itemDesc} hover:opacity-75 w-fit`}
      >
        ← Projects
      </Link>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-600 dark:text-neutral-300">
            {project.name}
          </h1>
          <span className={typography.itemDate}>
            {formatYearFromDate(project.startDate)}
          </span>
        </div>
        {project.group ? (
          <p className={typography.itemMeta}>{project.group}</p>
        ) : null}
      </div>
      <div className={typography.bodyText}>{parser(project.desc)}</div>
      {project.link ? (
        <Link
          href={project.link}
          target="_blank"
          className={`inline-flex items-center gap-1.5 w-fit ${typography.itemDesc} underline decoration-[1px] underline-offset-2 hover:opacity-75`}
        >
          Visit project
          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
        </Link>
      ) : null}
    </section>
  );
}
