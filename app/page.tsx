import { getPortfolioData } from '@/lib/portfolio';
import {
  About,
  Header,
  Work,
  Projects,
  Writing,
} from '@/components/ui/portfolio';

export const revalidate = 60;

export default async function Home() {
  const portfolio = await getPortfolioData();

  return (
    <section className="flex flex-col justify-center gap-10 sm:gap-14">
      <div className="flex flex-col gap-5 sm:gap-6">
        <Header
          portrait={portfolio.portrait}
          headline={portfolio.headline}
          socials={portfolio.socials}
        />
        <About about={portfolio.about} />
      </div>
      <Work positions={portfolio.positions} />
      <Projects projects={portfolio.projects} />
      <Writing writing={portfolio.writing} />
    </section>
  );
}
