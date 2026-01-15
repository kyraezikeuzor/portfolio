import { Portfolio } from '@/lib/portfolio';
import {
  About,
  Socials,
  Headline,
  Work,
  Projects,
  Writing,
  Press,
  Awards,
} from '@/components/ui/portfolio';
import { defaultPortraitUrl } from '@/lib/constants';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <section className="flex flex-col justify-center gap-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <img
          className="w-32 h-fit sm:w-32 sm:h-32 rounded-full"
          src={portfolio.portrait.files[0].url || defaultPortraitUrl}
          alt={portfolio.portrait.desc || 'Picture of me'}
        />
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-4xl font-semibold tracking-tighter text-neutral-600 dark:text-neutral-300">
              Kyra Ezikeuzor
            </h1>
            <Headline headline={portfolio.headline} />
          </div>
          <Socials socials={portfolio.socials} />
        </div>
      </header>
      <About about={portfolio.about} />
      <Work positions={portfolio.positions} />
      <Projects projects={portfolio.projects} />
      <Writing writing={portfolio.writing} />
      <Press press={portfolio.press} />
    </section>
  );
}
