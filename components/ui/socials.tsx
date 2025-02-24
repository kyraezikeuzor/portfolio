import {
  Mail,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';

import Link from 'next/link';

export const socials = [
  {
    name: 'Mail',
    link: 'mailto:kyra@hackclub.com',
    icon: (
      <Mail
        className="w-5 h-5 hover:text-blue-500 transition-colors duration-200"
        strokeWidth={2}
      />
    ),
  },
  {
    name: 'Twitter',
    link: '',
    icon: (
      <Twitter
        className="w-5 h-5 transition-colors duration-200"
        strokeWidth={2}
      />
    ),
  },
  {
    name: 'LinkedIn',
    link: '',
    icon: (
      <Linkedin
        className="w-5 h-5 transition-colors duration-200"
        strokeWidth={2}
      />
    ),
  },
  {
    name: 'Github',
    link: '',
    icon: (
      <Github
        className="w-5 h-5 hover:text-gray-800 transition-colors duration-200"
        strokeWidth={2}
      />
    ),
  },
];

export const SocialBanner = () => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {socials.map((item, index) => (
        <Link
          key={index}
          target="_blank"
          href={item.link !== '' ? item.link : '/'}
          className="hover:opacity-75 text-black"
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};
