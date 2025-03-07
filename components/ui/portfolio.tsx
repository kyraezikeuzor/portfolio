import Link from 'next/link';
import { PortfolioDto } from '@/schema';
import { parser } from '@/components/ui/parser';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatTimespan } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

const About = ({ about }: { about: PortfolioDto['about'] }) => {
  return (
    <section className="md:text-lg tracking-tight text-neutral-700 dark:text-neutral-200">
      {parser(about.desc)}
    </section>
  );
};

const Headline = ({ headline }: { headline: PortfolioDto['headline'] }) => {
  return <div className="w-full md:text-lg tracking-tight text-neutral-700 dark:text-neutral-200">{parser(headline.desc)}</div>;
};

const Work = ({ positions }: { positions: PortfolioDto['positions'] }) => {
  return (
    <section id="work" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight">
        Work
      </h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {positions.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-row items-center justify-between py-2"
          >
            <div className="flex flex-row items-center gap-2 w-full min-w-0">
              <Link
                href={item.link}
                className="flex flex-row items-center gap-2 flex-shrink-0"
              >
                <img
                  className="rounded-sm w-6 h-6"
                  src={item.files[0]?.url || ''}
                  alt="Logo, yellow background with black swoosh"
                />
                <span className="tracking-tight text-sm md:text-base whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
              <span className="text-sm truncate whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                {parser(item.desc)}
              </span>
            </div>
            <span className="text-sm whitespace-nowrap text-neutral-500 dark:text-neutral-400">
              {formatTimespan(item.startDate, item.endDate)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Projects = ({ projects }: { projects: PortfolioDto['projects'] }) => {
  return (
    <section id="projects" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight text-neutral-600 dark:text-neutral-300">
        Projects
      </h2>
      <div className="flex flex-col md:grid grid-cols-2 gap-3">
        {projects.map((item, index) => (
          <div
            key={index}
            className="relative border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-sm cursor-pointer"
          >
            <Link
              href={item.link}
              className="flex flex-col tracking-tight"
            >
              <span>{item.name}</span>
            </Link>
            
            <div className="text-sm tracking-tight text-neutral-700 dark:text-neutral-200">{parser(item.desc)}</div>
            <ExternalLink className="w-4 h-4 absolute top-3 right-3" />
            <span className="text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400">
              {formatDate(item.startDate)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Writing = ({ articles }: { articles: PortfolioDto['articles'] }) => {
  return (
    <section id="writing" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight">
        Writing
      </h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {articles.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="py-3 px-1 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <span className="flex flex-col tracking-tight">
              <span>{item.name}</span>
            </span>
            <div className="text-sm tracking-tight text-neutral-700 dark:text-neutral-200">{parser(item.desc)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Awards = ({ awards }: { awards: PortfolioDto['awards'] }) => {
  return (
    <section id="awards">
      <h2 className="text-xl mb-3 tracking-tight">
        Awards
      </h2>
      <Separator />
      <div className="flex flex-col gap-3 py-3">
        {awards.map((item, index) => (
          <div key={index}>
            <span>{item.name}</span>
            <p>{item.dateReceived}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Press = ({ press }: { press: PortfolioDto['press'] }) => {
  return (
    <section id="press">
      <h2 className="text-xl mb-3 tracking-tight">
        Press
      </h2>
      <Separator />
      <div className="flex flex-row flex-wrap py-3">
        {press.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="underline decoration-[1px] decoration-dashed underline-offset-4 decoration-neutral-400 mr-1 text-sm tracking-tight text-neutral-700 dark:text-neutral-200 hover:opacity-75"
          >
            <span>{item.name}{index+1 != press.length && ', '}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export { About, Headline, Work, Projects, Writing, Awards, Press };
