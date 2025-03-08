import { Portfolio } from '@/lib/notion'
import { About, Headline, Work, Projects, Writing, Press } from '@/components/ui/portfolio'
import { SocialBanner } from '@/components/ui/socials'
import type { Metadata } from "next";
import { thumbnailUrl, selfieUrl } from '@/lib/constants';

export const metadata: Metadata = {
  title: "Kyra Ezikeuzor",
  description: "Student, developer, and writer aspiring to study molecular biology, computer science, cognitive science, and creative writing, aiming for a career in AI medicine research, global health policy, and writing. ",
  openGraph: {
    images: [
      {
        url: thumbnailUrl,
        width: 1200,
        height: 630,
        alt: "Pink, red, and orange gradient art",
      },
    ],
}
};

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <section className="flex flex-col justify-center gap-8">
      <header className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
        <img className='w-32 h-fit sm:w-32 sm:h-32 rounded-full' src={selfieUrl} alt='Picture of me'/>
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