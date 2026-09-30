import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPortfolioData } from '@/lib/portfolio';
import { sentenceBlockParser } from '@/components/ui/parser';
import {
  cloudinaryImageUrl,
  formatFullTimespanFromDate,
  toSlug,
} from '@/lib/utils';
import { typography } from '@/lib/typography';
import { CircleArrowOutUpRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const revalidate = 60;

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const portfolio = await getPortfolioData();
  const project = portfolio.projects.find(
    (item) => toSlug(item.name) === params.slug
  );

  if (!project) {
    notFound();
  }

  const [leadImage, ...remainingImages] = project.files;

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/#projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-1.5">
        <h1 className={typography.pageTitle}>{project.name}</h1>
        {project.group ? (
          <p className={typography.itemMeta}>{project.group}</p>
        ) : null}
      </div>
      {leadImage ? (
        <img
          src={cloudinaryImageUrl(leadImage.url, { width: 1400 })}
          alt={leadImage.name || `${project.name} image`}
          className="h-auto w-full rounded-[13px] border border-[color:var(--border-card)]"
        />
      ) : null}
      <div className="flex flex-col items-start gap-3">
        <span className={typography.itemDate}>
          {formatFullTimespanFromDate(project.startDate, project.endDate)}
        </span>
        {project.link ? (
          <Link
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[color:var(--border-card)] bg-[color:var(--surface-card)] px-5 py-2.5 text-[0.9375rem] font-medium text-[color:var(--text-primary)] transition-colors duration-150 hover:bg-[color:var(--surface-secondary)]"
          >
            <CircleArrowOutUpRight aria-hidden="true" className="h-5 w-5" />
            Visit project
          </Link>
        ) : null}
      </div>
      <div className={typography.bodyText}>
        {sentenceBlockParser(project.desc)}
      </div>
      {remainingImages.length > 0 ? (
        <div className="flex flex-col gap-3 mt-2">
          {remainingImages.map((file) => (
            <img
              key={file.url}
              src={cloudinaryImageUrl(file.url, { width: 1400 })}
              alt={file.name || `${project.name} image`}
              className="h-auto w-full rounded-[13px] border border-[color:var(--border-card)]"
              loading="lazy"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
