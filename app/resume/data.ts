export type ResumeStaticData = {
  contact: {
    name: string;
    email: string;
    links: { label: string; href?: string }[];
  };
  education: {
    school: string;
    location: string;
    degree: string;
    graduation: string;
    activities: string[];
    coursework: string[];
    gpa: string;
  };
  awards: string[];
  skills: { label: string; items: string[] }[];
  notion: {
    hiddenItemIds: string[];
    organizations: Record<string, { displayName?: string; location?: string }>;
    roleOverrides: Record<
      string,
      { displayTitle?: string; bullets?: string[] }
    >;
    projectOverrides: Record<
      string,
      { displayName?: string; bullets?: string[] }
    >;
  };
};

/**
 * Edit this file for resume-only content. Work, projects, awards, and skills
 * come from published Notion entries; add a Notion page id to hiddenItemIds to
 * omit it here. Note: the `awards` and `skills` arrays below are no longer
 * read — they used to be silent fallbacks when Notion returned nothing, which
 * made a failed sync render a stale resume that looked current.
 */
export const resumeData: ResumeStaticData = {
  contact: {
    name: 'Kyra Ezikeuzor',
    email: 'koe2103@columbia.edu',
    links: [
      {
        label: 'linkedin.com/in/kyraezikeuzor',
        href: 'https://www.linkedin.com/in/kyraezikeuzor/',
      },
      {
        label: 'github.com/kyraezikeuzor',
        href: 'https://www.github.com/kyraezikeuzor',
      },
      { label: 'NYC' },
    ],
  },
  education: {
    school: 'Columbia University',
    location: 'New York, NY',
    degree: 'Bachelor of Arts in Computer Science & Biology',
    graduation: 'Expected May 2028',
    activities: [
      'ColorStack',
      'Science Review',
      'UNICEF Club',
      'Women in Medicine Society',
    ],
    coursework: [
      'Data Structures & Algorithms',
      'Linear Algebra & Probability',
    ],
    gpa: '3.6/4.0',
  },
  awards: [
    'NCWIT Jane Street Visit Day (1/40)',
    'NCWIT National HM (Top 360/3.7K+)',
    '$10K Girls Make Games',
    '$5K Southwest Farmers Market',
    '$4K LEAD',
  ],
  skills: [
    {
      label: 'Programming',
      items: [
        'Python',
        'Java',
        'JavaScript',
        'React.js',
        'Next.js',
        'Node.js',
        'TypeScript',
        'Tailwind',
        'CSS',
        'HTML',
        'SQL',
      ],
    },
    {
      label: 'Development Tools',
      items: [
        'Git',
        'GitHub',
        'AWS',
        'Jupyter',
        'TensorFlow',
        'APIs',
        'Adobe Creative Cloud',
        'Google Suite',
        'Excel',
        'Notion',
      ],
    },
    {
      label: 'Languages',
      items: [
        'English (Native)',
        'Spanish (Conversational)',
        'Igbo (Conversational)',
      ],
    },
  ],
  notion: {
    // Add a Notion page id here to keep that position or project off the
    // resume while leaving it on the site. (SWARM was previously listed.)
    hiddenItemIds: [],
    roleOverrides: {
      // Bullets merged (not rewritten) so each fills its lines instead of
      // spilling a few words onto a mostly-empty one. Facts are unchanged.
      '18e234e7-224a-801f-af25-d9ef4f08f608': {
        bullets: [
          'Grew Omelora\u2019s volunteer network to 3K+ members and raised $5K+ for education programs; collected thousands of school supplies and partnered with Labdoo.org to deliver 30 computers to an orphanage in Enugu, Nigeria.',
          'Built Bridge, a volunteer management portal connecting members with service opportunities and tracking volunteer hours.',
        ],
      },
      '1ba234e7-224a-8022-b74f-ec8a70f0d6ca': {
        bullets: [
          'Constructed plasmid-based gene circuits in bacteria through synthetic biology experiments with Dr Peng, performing PCR, bacterial transformation, plasmid miniprep, restriction digestion, and Golden Gate assembly.',
          'Built activator and inhibitor plasmids with GFP reporters to visualize gene expression and circuit behavior.',
        ],
      },
    },
    projectOverrides: {
      '317234e7-224a-80e3-879a-f8d634d94d1f': {
        bullets: [
          'Built an African language learner covering 80+ phrases with pronunciation correction, using Igbo foundation models from Hugging Face, speech recognition, and text-to-speech.',
        ],
      },
    },
    organizations: {
      // No displayName: the resume shows the Notion group name as written.
      // These entries exist to supply the location, which Notion has no
      // field for.
      'Rice University Biodesign Lab': { location: 'Houston, TX' },
      'Columbia Science Review': { location: 'New York, NY' },
      'Kyra’s College Guide': { location: 'Houston, TX' },
      'Hack Club': { location: 'Remote' },
      Schoolhouse: { location: 'Remote' },
      Omelora: { location: 'Remote' },
      'Compute the Future': { location: 'Houston, TX' },
      Supamagic: { location: 'Remote' },
      'UT Health Houston': { location: 'Houston, TX' },
    },
  },
};
