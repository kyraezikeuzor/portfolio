import { getPortfolioData } from '@/lib/portfolio';
import { Projects } from '@/components/ui/portfolio';

export const revalidate = 60;

export default async function ProjectsPage() {
  const portfolio = await getPortfolioData();

  return (
    <section className="flex flex-col justify-center gap-10 sm:gap-14">
      <Projects
        projects={portfolio.projects}
        description="Click on a project to learn more."
      />
    </section>
  );
}
