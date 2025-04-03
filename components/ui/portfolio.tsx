import Link from 'next/link';
import { PortfolioDto } from '@/schema';
import { parser } from '@/components/ui/parser';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatTimespan } from '@/lib/utils';
import { ExternalLink, Mail } from 'lucide-react';

const About = ({ about }: { about: PortfolioDto['about'] }) => {
  return (
    <section className="text-lg tracking-tight text-neutral-700 dark:text-neutral-200">
      {parser(about.desc)}
    </section>
  );
};

const Headline = ({ headline }: { headline: PortfolioDto['headline'] }) => {
  return <div className="w-full text-lg tracking-tight text-neutral-700 dark:text-neutral-200">{parser(headline.desc)}</div>;
};

const Socials = ({ socials }: { socials: PortfolioDto['socials'] }) => {

  const socialIcons = {
    email: <Mail className="w-5 h-5 text-neutral-600 dark:text-neutral-300 hover:text-gray-800 transition-colors duration-200"/>,
    twitter: <svg className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200" height="20px" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>,
    linkedin: <svg className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>,
    github: <svg className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/"><title>Github</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>,
    substack: <svg className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Substack</title><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      {socials.reverse().map((social, index) => (
        <Link
          key={index}
          target="_blank"
          href={social.link !== '' ? social.link : '/'}
          className="hover:opacity-75 text-black text-sm"
        >
          {Object.values(socialIcons).filter((icon,index)=>(Object.keys(socialIcons)[index]===social.name.toLowerCase())) || social.name }
        </Link>
      ))}
    </div>
  )
}

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
                  alt={`${item.name} logo`}
                />
                <span className="tracking-tight text-base whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
              <span className="tracking-tight text-sm truncate whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                {parser(item.desc)}
              </span>
            </div>
            <span className="tracking-tight text-sm whitespace-nowrap text-neutral-500 dark:text-neutral-400">
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
      <h2 className="text-xl mb-3 tracking-tight">
        Projects
      </h2>
      <div className="flex flex-col md:grid grid-cols-2 gap-3">
        {projects.map((item, index) => {
          console.log(`Project ${index} link:`, item.link);
          return (
            <div
              key={index}
              className="relative border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
            >
              <Link
                href={item.link}
                className="flex flex-row gap-1 items-center tracking-tight"
              >
                <span>{item.name}</span>
                <span className="mt-[2px] text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                  {formatDate(item.startDate)}
                </span>
              </Link>
              
              <div className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400">{parser(item.desc)}</div>
              {item.link !== '' && item.link !== undefined && <ExternalLink className="w-4 h-4 absolute top-3 right-3 opacity-50" />}
            </div>
          );
        })}
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
            <div className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400">{parser(item.desc)}</div>
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

export { About, Headline, Socials, Work, Projects, Writing, Awards, Press };
