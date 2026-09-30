import { getPortfolioData } from '@/lib/portfolio';
import { resumeData } from '@/app/resume/data';
import type { ParsedRichText, PortfolioDatabase } from '@/types';

type NotionPosition = PortfolioDatabase['positions'][number];
type NotionProject = PortfolioDatabase['projects'][number];
type NotionSkill = PortfolioDatabase['skills'][number];
type NotionAward = PortfolioDatabase['awards'][number];

export type ResumeRole = {
  id: string;
  title: string;
  date: string;
  bullets: string[];
  link: string;
  startDate: string;
  sortDate: number;
};

export type ResumeOrganization = {
  name: string;
  location: string;
  link: string;
  roles: ResumeRole[];
};

export type ResumeProject = {
  id: string;
  name: string;
  organization: string;
  date: string;
  bullets: string[];
  link: string;
  startDate: string;
  sortDate: number;
};

export type ResumeDocument = {
  static: typeof resumeData;
  experience: ResumeOrganization[];
  projects: ResumeProject[];
};

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function parseDate(date: string) {
  if (!date) return 0;
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(date: string) {
  return date ? monthYear.format(new Date(`${date}T00:00:00Z`)) : '';
}

function formatRange(startDate: string, endDate: string) {
  const start = formatDate(startDate);
  if (!start) return '';
  if (endDate && start === formatDate(endDate)) return start;
  return `${start} - ${endDate ? formatDate(endDate) : 'Present'}`;
}

function orderingDate(startDate: string, endDate: string) {
  return endDate ? parseDate(endDate) : Number.MAX_SAFE_INTEGER;
}

function richTextToBullets(desc: ParsedRichText[]) {
  const text = desc
    .map((part) => part.text)
    .join('')
    .trim();
  if (!text) return [];

  return text
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/^[-*•]\s*/, '')
        .trim()
    )
    .filter(Boolean);
}

function normalizeHref(href: string) {
  if (!href || /^(https?:|mailto:)/i.test(href)) return href;
  return `https://${href}`;
}

function skillItemsFromNotion(skill: NotionSkill) {
  return skill.desc
    .map((part) => part.text)
    .join('')
    .split(/[\n,;]+/)
    .map((item) => item.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

function mergeSkills(skills: NotionSkill[]) {
  const notionSkills = new Map<string, { label: string; items: string[] }>();

  skills.forEach((skill) => {
    const label = skill.name.trim();
    const items = skillItemsFromNotion(skill);

    if (label && items.length) {
      notionSkills.set(label.toLowerCase(), { label, items });
    }
  });

  // Same here — an empty Notion skills set renders nothing rather than
  // resurrecting resumeData.skills.
  if (!notionSkills.size) return [];

  const preferredOrder: Record<string, number> = {
    programming: 0,
    'development tools': 1,
    'technical tools': 1,
    languages: 2,
  };

  return Array.from(notionSkills.values()).sort(
    (a, b) =>
      (preferredOrder[a.label.toLowerCase()] ?? 10) -
        (preferredOrder[b.label.toLowerCase()] ?? 10) ||
      a.label.localeCompare(b.label)
  );
}

// Every published award, under the name it carries in Notion. Deliberately
// no rename/priority overrides: Notion is the source of truth, so editing an
// award's name there is all it takes to change what the resume shows.
function awardsFromNotion(awards: NotionAward[]) {
  return awards
    .map((award) => {
      const name = award.name.trim();
      const year = award.dateReceived.slice(0, 4);

      return {
        date: parseDate(award.dateReceived),
        text: name ? `${name}${year ? ` (${year})` : ''}` : '',
      };
    })
    .filter((award) => award.text)
    .sort((a, b) => b.date - a.date)
    .map((award) => award.text);
}

function roleFromPosition(position: NotionPosition): ResumeRole {
  const override =
    resumeData.notion.roleOverrides[position.id] ||
    resumeData.notion.roleOverrides[`${position.group}::${position.name}`];

  return {
    id: position.id,
    title: override?.displayTitle || position.name,
    date: formatRange(position.startDate, position.endDate),
    bullets: override?.bullets || richTextToBullets(position.desc),
    link: normalizeHref(position.link),
    startDate: position.startDate,
    sortDate: orderingDate(position.startDate, position.endDate),
  };
}

function buildResumeDocument(
  portfolio: Pick<
    PortfolioDatabase,
    'positions' | 'projects' | 'awards' | 'skills'
  >
): ResumeDocument {
  const developmentPhone =
    process.env.NODE_ENV === 'development'
      ? process.env.RESUME_PHONE?.trim()
      : undefined;
  const developmentContactLinks = developmentPhone
    ? [
        {
          label: developmentPhone,
          href: `tel:${developmentPhone.replace(/[^+\d]/g, '')}`,
        },
      ]
    : [];
  const hidden = new Set(resumeData.notion.hiddenItemIds);
  const groups = new Map<string, ResumeOrganization>();

  portfolio.positions
    .filter((position) => !hidden.has(position.id))
    .forEach((position) => {
      const organizationName = position.group || 'Independent';
      const metadata = resumeData.notion.organizations[organizationName];
      const existing = groups.get(organizationName) || {
        name: metadata?.displayName || organizationName,
        location: metadata?.location || '',
        link: '',
        roles: [],
      };
      existing.roles.push(roleFromPosition(position));
      groups.set(organizationName, existing);
    });

  const experience = Array.from(groups.values())
    .map((organization) => {
      const roles = organization.roles.sort(
        (a, b) =>
          b.sortDate - a.sortDate ||
          parseDate(b.startDate) - parseDate(a.startDate)
      );

      return {
        ...organization,
        link: roles.find((role) => role.link)?.link || '',
        roles,
      };
    })
    .sort((a, b) => (b.roles[0]?.sortDate || 0) - (a.roles[0]?.sortDate || 0));

  const projects = portfolio.projects
    .filter((project) => !hidden.has(project.id))
    .map((project: NotionProject) => {
      const organization = resumeData.notion.organizations[project.group];
      const override = resumeData.notion.projectOverrides[project.id];

      return {
        id: project.id,
        name: override?.displayName || project.name,
        organization: organization?.displayName || project.group,
        date: formatRange(project.startDate, project.endDate),
        bullets: override?.bullets || richTextToBullets(project.desc),
        link: normalizeHref(project.link),
        startDate: project.startDate,
        sortDate: orderingDate(project.startDate, project.endDate),
      };
    })
    .sort(
      (a, b) =>
        b.sortDate - a.sortDate ||
        parseDate(b.startDate) - parseDate(a.startDate)
    );

  return {
    static: {
      ...resumeData,
      contact: {
        ...resumeData.contact,
        links: [...resumeData.contact.links, ...developmentContactLinks],
      },
      // Unfiltered: every published award shows. hiddenItemIds still applies
      // to positions and projects, but awards are shown as published.
      awards: awardsFromNotion(portfolio.awards),
      skills: mergeSkills(portfolio.skills),
    },
    experience,
    projects,
  };
}

export async function getResumeDocument() {
  const portfolio = await getPortfolioData();
  return buildResumeDocument(portfolio);
}
