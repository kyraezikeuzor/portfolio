import Link from 'next/link';
import { PortfolioDto } from '@/schema';
import { parser } from '@/components/ui/parser';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

const About = ({ about }: { about: PortfolioDto['about'] }) => {
  return (
    <section className="text-lg tracking-tight text-neutral-600 dark:text-neutral-400">
      {parser(about.desc)}
    </section>
  );
};

const Headline = ({ headline }: { headline: PortfolioDto['headline'] }) => {
  return <div className="w-full text-neutral-500">{parser(headline.desc)}</div>;
};

const Work = ({ positions }: { positions: PortfolioDto['positions'] }) => {
  return (
    <section id="work" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight text-neutral-600 dark:text-neutral-300">
        Work
      </h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {positions.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-row justify-between items-center py-2 px-1"
          >
            <div className="flex flex-row items-center gap-3 w-full min-w-0">
              <Link
                href={item.link}
                className="flex flex-row items-center gap-3 flex-shrink-0"
              >
                <img
                  className="rounded-sm w-6 h-6"
                  src="https://calix.dev/_next/image?url=%2Fwork%2Framp.png&w=32&q=75"
                  alt="Logo, yellow background with black swoosh"
                />
                <span className="text-neutral-600 dark:text-neutral-400  whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
              <span className="text-neutral-500 text-xs md:text-sm truncate">
                {parser(item.desc)}
              </span>
            </div>
            <span className="text-neutral-500 text-xs md:text-sm whitespace-nowrap">
              {formatDate(item.startDate, item.endDate)}
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
      <div className="grid grid-cols-2 gap-3">
        {projects.map((item, index) => (
          <div
            key={index}
            className="relative border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <Link
              href={item.link}
              className="flex flex-col text-neutral-600 dark:text-neutral-400"
            >
              <span>{item.name}</span>
            </Link>
            <div className="text-sm text-neutral-500">{parser(item.desc)}</div>
            <ExternalLink className="w-4 h-4 absolute top-3 right-3 text-neutral-500" />
          </div>
        ))}
      </div>
    </section>
  );
};

const Writing = ({ articles }: { articles: PortfolioDto['articles'] }) => {
  return (
    <section id="writing" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight text-neutral-600 dark:text-neutral-300">
        Writing
      </h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {articles.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="py-3 px-1 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <span className="flex flex-col text-neutral-600 dark:text-neutral-400">
              <span>{item.name}</span>
            </span>
            <div className="text-neutral-500 text-sm">{parser(item.desc)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Awards = ({ awards }: { awards: PortfolioDto['awards'] }) => {
  return (
    <section id="awards">
      <h2 className="text-xl mb-3 tracking-tight text-neutral-600 dark:text-neutral-300">
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
      <h2 className="text-xl mb-3 tracking-tight text-neutral-600 dark:text-neutral-300">
        Press
      </h2>
      <Separator />
      <div className="flex flex-row flex-wrap py-3">
        {press.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="underline text-neutral-500 text-sm"
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export { About, Headline, Work, Projects, Writing, Awards, Press };
