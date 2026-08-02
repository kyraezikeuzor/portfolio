import { Portfolio } from '@/lib/portfolio';
import { Projects } from '@/components/ui/portfolio';

export const revalidate = 60;

export default async function ProjectsPage() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <section className="flex flex-col justify-center gap-8">
      <Projects
        projects={portfolio.projects}
        description="Click on a project to learn more."
      />
    </section>
  );
}
