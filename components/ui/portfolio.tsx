import Link from 'next/link';
import { PortfolioDatabase } from '@/types';
import { parser } from '@/components/ui/parser';
import { Separator } from '@/components/ui/separator';
import {
  formatYearFromDate,
  formatTimespanFromDate,
  extractSiteNameFromUrl,
} from '@/lib/utils';
import { ExternalLink, Link as LinkIcon, Mail } from 'lucide-react';

const About = ({ about }: { about: PortfolioDatabase['about'] }) => {
  return (
    <section className="text-lg tracking-tight text-neutral-700 dark:text-neutral-200">
      {parser(about.desc)}
    </section>
  );
};

const Headline = ({
  headline,
}: {
  headline: PortfolioDatabase['headline'];
}) => {
  return (
    <div className="w-full text-lg -tracking-[0.0175em] text-neutral-700 dark:text-neutral-200">
      {parser(headline.desc)}
    </div>
  );
};

const Postscript = ({
  postscript,
}: {
  postscript: PortfolioDatabase['postscript'];
}) => {
  return (
    <div className="w-full text-sm text-neutral-500 dark:text-neutral-400">
      {parser(postscript.desc)}
    </div>
  );
};

const Socials = ({ socials }: { socials: PortfolioDatabase['socials'] }) => {
  const socialIcons = {
    email: (
      <Mail className="w-5 h-5 text-neutral-600 dark:text-neutral-300 hover:text-gray-800 transition-colors duration-200" />
    ),
    twitter: (
      <svg
        className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200"
        height="20px"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <title>Twitter</title>
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
      </svg>
    ),
    linkedin: (
      <svg
        className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200"
        height="20px"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>LinkedIn</title>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
      </svg>
    ),
    github: (
      <svg
        className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200"
        height="20px"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/"
      >
        <title>Github</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
      </svg>
    ),
    substack: (
      <svg
        className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Substack</title>
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
    buymeacoffee: (
      <svg
        className="w-5 h-5 fill-neutral-600 dark:fill-neutral-300 hover:text-gray-800 transition-colors duration-200"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Buy Me A Coffee</title>
        <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      {socials.reverse().map((social, index) => {
        const content =
          Object.values(socialIcons).filter(
            (icon, index) =>
              Object.keys(socialIcons)[index] === social.name.toLowerCase()
          ) || social.name;

        return social.link && social.link !== '' ? (
          <Link
            key={index}
            target="_blank"
            href={social.link}
            className="hover:opacity-75 text-black text-sm"
          >
            {content}
          </Link>
        ) : (
          <div key={index} className="hover:opacity-75 text-black text-sm">
            {content}
          </div>
        );
      })}
    </div>
  );
};

const Work = ({ positions }: { positions: PortfolioDatabase['positions'] }) => {
  return (
    <section id="work" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight">Work</h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {positions.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-row items-center justify-between py-2"
          >
            <div className="flex flex-row items-center gap-2 w-full min-w-0">
              {item.link && item.link !== '' ? (
                <Link
                  href={item.link}
                  target="_blank"
                  className="flex flex-row items-center gap-2 flex-shrink-0"
                >
                  <img
                    className="rounded-sm w-6 h-6"
                    src={item.files[0]?.url || ''}
                    alt={`${item.name} logo`}
                  />
                  <span className="-tracking-[0.0175em] text-base whitespace-nowrap">
                    {item.group}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-row items-center gap-2 flex-shrink-0">
                  <img
                    className="rounded-sm w-6 h-6"
                    src={item.files[0]?.url || ''}
                    alt={`${item.name} logo`}
                  />
                  <span className="tracking-tight text-base whitespace-nowrap">
                    {item.group}
                  </span>
                </div>
              )}
              <span className="text-[14px] tracking-normal truncate whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                {item.name}
              </span>
            </div>
            <span className="text-[14px] whitespace-nowrap text-neutral-500 dark:text-neutral-400">
              {formatTimespanFromDate(item.startDate, item.endDate)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Projects = ({
  projects,
}: {
  projects: PortfolioDatabase['projects'];
}) => {
  return (
    <section id="projects" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight">Projects</h2>
      <div className="flex flex-col md:grid grid-cols-2 gap-3">
        {projects.map((item, index) => {
          const content = (
            <div
              key={index}
              className="border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl"
            >
              <div className="flex flex-row gap-2 items-center tracking-tight">
                <span>{item.name}</span>
                <span className="text-[15px] whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                  {formatYearFromDate(item.startDate)}
                </span>
              </div>
              <div className="text-[14px] tracking-[.000125em] text-neutral-500 dark:text-neutral-400">
                {parser(item.desc)}
              </div>
            </div>
          );

          return item.link && item.link !== '' ? (
            <Link
              className="relative hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
              href={item.link}
              target="_blank"
              key={index}
            >
              {content}
              <ExternalLink className="w-4 h-4 absolute top-[14px] right-3 opacity-50" />
            </Link>
          ) : (
            content
          );
        })}
      </div>
    </section>
  );
};

const Writing = ({ writing }: { writing: PortfolioDatabase['writing'] }) => {
  return (
    <section id="writing" className="flex flex-col">
      <h2 className="text-xl mb-3 tracking-tight">Writing</h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {writing.map((item, index) => {
          const content = (
            <div key={index} className="flex flex-col px-2 py-3 cursor-pointer">
              <div className="flex flex-row gap-2 items-center tracking-tight">
                <span>
                  {item.name}
                  <span className="ml-2 inline lg:hidden text-[15px] text-neutral-500 dark:text-neutral-400">
                    {formatYearFromDate(item.datePublished)}
                  </span>
                </span>
                <span className="hidden lg:block text-[15px] whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                  {formatYearFromDate(item.datePublished)}
                </span>
              </div>
              <div className="text-[14px] tracking-[.000125em] text-neutral-500 dark:text-neutral-400">
                {parser(item.desc)}
              </div>
              <div className="text-xs mt-[2px] text-neutral-500 dark:text-neutral-400 underline decoration-[1px] underline-offset-1 decoration-neutral-400 mr-[3px] tracking-tight text-neutral-500 dark:text-neutral-400">
                {extractSiteNameFromUrl(item.link)}
              </div>
            </div>
          );

          return item.link && item.link !== '' ? (
            <Link
              href={item.link}
              target="_blank"
              key={index}
              className="relative hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
            >
              {content}
              <ExternalLink className="w-4 h-4 absolute top-[14px] right-3 opacity-50" />
            </Link>
          ) : (
            content
          );
        })}
      </div>
    </section>
  );
};

const Awards = ({ awards }: { awards: PortfolioDatabase['awards'] }) => {
  return (
    <section id="awards">
      <h2 className="text-xl mb-3 tracking-tight">Awards</h2>
      <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700 border-y border-dashed border-neutral-200 dark:border-neutral-700">
        {awards.map((item, index) => {
          const content = (
            <div
              key={index}
              className="px-2 py-2 flex flex-row items-center justify-between gap-1"
            >
              <div className="flex flex-row items-center">
                <div className="flex flex-col">
                  <span className="text-[15px] flex flex-row items-center gap-1 tracking-tight">
                    <span>
                      {item.name}
                      <span className="ml-2 inline lg:hidden text-[15px] text-neutral-500 dark:text-neutral-400">
                        {formatYearFromDate(item.dateReceived)}
                      </span>
                    </span>
                    <span className="hidden lg:block ml-1 text-[15px] tracking-tight text-neutral-500 dark:text-neutral-400">
                      {formatYearFromDate(item.dateReceived)}
                    </span>
                  </span>
                  <div className="text-[14px] tracking-[.000125em] text-neutral-500 dark:text-neutral-400">
                    {parser(item.desc)}
                  </div>
                </div>
              </div>
            </div>
          );

          return item.link && item.link !== '' ? (
            <Link
              className="relative hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
              key={index}
              href={item.link}
              target="_blank"
            >
              {content}
              <ExternalLink className="w-4 h-4 absolute top-[10px] right-3 opacity-50" />
            </Link>
          ) : (
            content
          );
        })}
      </div>
    </section>
  );
};

const Press = ({ press }: { press: PortfolioDatabase['press'] }) => {
  return (
    <section id="press">
      <h2 className="text-xl mb-3 tracking-tight">Press</h2>
      <Separator />
      <div className="flex flex-row flex-wrap py-3">
        {press.map((item, index) => {
          const content = (
            <span>
              {item.group}
              {/* {item.datePublished &&
                ` ${formatYearFromDate(item.datePublished)}`} */}
              {index + 1 != press.length && ', '}
            </span>
          );

          return item.link && item.link !== '' ? (
            <Link
              href={item.link}
              target="_blank"
              key={index}
              className="text-sm tracking-[.000125em] text-neutral-500 dark:text-neutral-400 underline decoration-[1px] underline-offset-1 decoration-neutral-400 mr-[3px] hover:opacity-75"
            >
              {content}
            </Link>
          ) : (
            <div
              key={index}
              className="text-sm tracking-[.000125em] text-neutral-500 dark:text-neutral-400 mr-[3px]"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export {
  About,
  Headline,
  Postscript,
  Socials,
  Work,
  Projects,
  Writing,
  Awards,
  Press,
};
