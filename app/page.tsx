import { Portfolio } from '@/lib/portfolio';
import {
  About,
  Header,
  Work,
  Projects,
  Writing,
} from '@/components/ui/portfolio';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <section className="flex flex-col justify-center gap-8">
      <Header
        portrait={portfolio.portrait}
        headline={portfolio.headline}
        socials={portfolio.socials}
      />
      <About about={portfolio.about} />
      <Work positions={portfolio.positions} />
      <Projects projects={portfolio.projects} />
      <Writing writing={portfolio.writing} />
    </section>
  );
}
