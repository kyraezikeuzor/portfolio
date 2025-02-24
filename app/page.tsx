import type { Metadata } from "next";
import { Portfolio } from '@/lib/notion'
import { About, Headline, Work, Projects, Writing, Press } from '@/components/ui/portfolio'
import { SocialBanner } from '@/components/ui/socials'


export const metadata: Metadata = {
  title: "Kyra Ezikeuzor",
  description: "My personal website.",
};

export default async function Home() {

  const portfolio = await new Portfolio().getPortfolio();

  return (
    <section className="flex flex-col justify-center gap-10">
      
      <header className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
        <img className='w-full h-full sm:w-32 sm:h-32 rounded-full' src='/me.jpeg' alt='Picture of me'/>
        <span className='flex flex-col items-start gap-2'>
          <span className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-5'>
            <h1 className='text-4xl font-semibold tracking-tight text-neutral-600 dark:text-neutral-300'>Kyra Ezikeuzor</h1>
            <SocialBanner/>
          </span>
          <Headline headline={portfolio.headline}/>
        </span>
      </header>

      <About about={portfolio.about}/>
      <Work positions={portfolio.positions}/>
      <Projects projects={portfolio.projects}/>
      <Writing articles={portfolio.articles}/>
      <Press press={portfolio.press}/>

    </section>
  );
}
