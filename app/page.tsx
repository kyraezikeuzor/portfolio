import { Portfolio } from '@/lib/notion'
import { About, Headline, Work, Projects, Writing, Press } from '@/components/ui/portfolio'
import { SocialBanner } from '@/components/ui/socials'

export const revalidate = 60; // Revalidate every hour

export default async function Home() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <section className="flex flex-col justify-center gap-8">
      <header className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
        <img className='w-32 h-fit sm:w-32 sm:h-32 rounded-full' src='/selfie.png' alt='Picture of me'/>
        <div className='flex flex-col items-start gap-3'>
          <div className='flex flex-col items-start gap-1'>
            <h1 className='text-4xl font-semibold tracking-tighter text-neutral-600 dark:text-neutral-300'>Kyra Ezikeuzor</h1>
            <Headline headline={portfolio.headline}/>
          </div>
          <SocialBanner/>
        </div>
      </header>
      <About about={portfolio.about}/>
      <Work positions={portfolio.positions}/>
      <Projects projects={portfolio.projects}/>
      <Writing articles={portfolio.articles}/>
      <Press press={portfolio.press}/>
    </section>
  );
}