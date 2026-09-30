import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import NotionClient from '@/lib/notion';
import {
  PortfolioDatabase,
  PortfolioCategory,
  PortfolioPage,
  NotionDatabaseProperties,
  ParsedRichText,
} from '@/types';
import Logger from '@/lib/logger';
import { requireEnv } from '@/lib/utils';
import type {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

function richTextToPlainText(description: PortfolioPage['desc']) {
  if (typeof description === 'string') return description;
  return description?.map((line) => line.text).join('') || '';
}

export class Portfolio {
  private connector: NotionClient;
  private databaseId: string;
  private data: PortfolioDatabase;
  private log: Logger;

  constructor() {
    this.log = new Logger(
      process.env.NOTION_LOG_LEVEL === 'debug' ? 'debug' : 'error'
    );
    this.connector = new NotionClient(requireEnv('NOTION_TOKEN'), this.log);
    this.databaseId = requireEnv('NOTION_DB_ID');
    this.data = {
      about: { id: '', desc: [] },
      headline: { id: '', desc: [] },
      postscript: { id: '', desc: [] },
      summary: { id: '', desc: '' as string },
      portrait: { id: '', files: [], desc: '' as string },
      thumbnail: { id: '', files: [], desc: '' as string },
      projects: [],
      socials: [],
      writing: [],
      press: [],
      positions: [],
      awards: [],
      certifications: [],
      education: [],
      skills: [],
    };
  }

  private processDatabasePage(
    page:
      | PageObjectResponse
      | PartialPageObjectResponse
      | PartialDatabaseObjectResponse
      | DatabaseObjectResponse
  ): PortfolioPage {
    if (!('properties' in page)) {
      throw new Error('Invalid page object: missing properties');
    }

    const properties =
      page.properties as unknown as Partial<NotionDatabaseProperties>;

    return {
      id: page.id,
      name: properties.Name?.title[0]?.plain_text || '',
      desc: properties.Description?.rich_text.map((line) => ({
        text: line.plain_text,
        link: line.href ? { url: line.href } : null,
        bold: line.annotations.bold,
        italic: line.annotations.italic,
        strikethrough: line.annotations.strikethrough,
        underline: line.annotations.underline,
        code: line.annotations.code,
      })),
      group: properties.Group?.rich_text
        .map((line) => line.plain_text)
        .join(''),
      type: properties.Type?.select?.name,
      link: properties.Link?.url || '',
      published: properties.Publish?.checkbox || false,
      startDate: properties.Timeline?.date?.start || '',
      endDate: properties.Timeline?.date?.end || '',
      files: properties.Files?.files.map((file) => ({
        name: file.name || '',
        url: 'external' in file ? file.external.url : file.file.url,
      })),
    };
  }

  private categorizePages(pages: PortfolioPage[]): void {
    pages.forEach((page) => {
      if (!page.type || !page.published) {
        return;
      }

      const parsedPage = {
        id: page.id,
        name: page.name || '',
        desc: page.desc || [],
        group: page.group || '',
        link: page.link || '',
        startDate: page.startDate || '',
        endDate: page.endDate || '',
        files: page.files || [],
      };

      switch (page.type.toLowerCase() as PortfolioCategory) {
        case 'about':
          this.data.about = {
            id: parsedPage.id,
            desc: parsedPage.desc as ParsedRichText[],
          };
          break;
        case 'postscript':
          this.data.postscript = {
            id: parsedPage.id,
            desc: parsedPage.desc as ParsedRichText[],
          };
          break;
        case 'summary':
          this.data.summary = {
            id: parsedPage.id,
            desc: richTextToPlainText(parsedPage.desc),
          };
          break;
        case 'portrait':
          this.data.portrait = {
            id: parsedPage.id,
            files: parsedPage.files,
            desc: richTextToPlainText(parsedPage.desc),
          };
          break;
        case 'thumbnail':
          this.data.thumbnail = {
            id: parsedPage.id,
            files: parsedPage.files,
            desc: richTextToPlainText(parsedPage.desc),
          };
          break;
        case 'headline':
          this.data.headline = {
            id: parsedPage.id,
            desc: parsedPage.desc as ParsedRichText[],
          };
          break;
        case 'project':
          this.data.projects.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: parsedPage.desc as ParsedRichText[],
            link: parsedPage.link,
            startDate: parsedPage.startDate,
            endDate: parsedPage.endDate,
            group: parsedPage.group,
            files: parsedPage.files,
          });
          break;
        case 'social':
          this.data.socials.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: parsedPage.desc as ParsedRichText[],
            link: parsedPage.link,
          });
          break;
        case 'writing':
          this.data.writing.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: parsedPage.desc as ParsedRichText[],
            group: parsedPage.group,
            link: parsedPage.link,
            datePublished: parsedPage.startDate,
          });
          break;
        case 'press':
          this.data.press.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: richTextToPlainText(parsedPage.desc),
            group: parsedPage.group,
            link: parsedPage.link,
            datePublished: parsedPage.startDate,
          });
          break;
        case 'position':
          this.data.positions.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: parsedPage.desc as ParsedRichText[],
            link: parsedPage.link,
            startDate: parsedPage.startDate,
            endDate: parsedPage.endDate,
            files: parsedPage.files,
            group: parsedPage.group,
          });
          break;
        case 'award':
          this.data.awards.push({
            id: parsedPage.id,
            name: parsedPage.name,
            dateReceived: parsedPage.startDate,
            desc: parsedPage.desc as ParsedRichText[],
            group: parsedPage.group,
            link: parsedPage.link,
          });
          break;
        case 'certification':
          this.data.certifications.push({
            id: parsedPage.id,
            name: parsedPage.name,
            link: parsedPage.link,
            dateReceived: parsedPage.endDate,
            group: parsedPage.group,
          });
          break;
        case 'education':
          this.data.education.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: parsedPage.desc,
            link: parsedPage.link,
            startDate: parsedPage.startDate,
            endDate: parsedPage.endDate,
            group: parsedPage.group,
          });
          break;
        case 'skill':
          this.data.skills.push({
            id: parsedPage.id,
            name: parsedPage.name,
            desc: parsedPage.desc as ParsedRichText[],
          });
          break;
        default:
          // A misspelled Type in Notion would otherwise vanish without trace
          this.log.error(
            `Unrecognized Type "${page.type}" on page ${page.id} ("${parsedPage.name}") — entry skipped`
          );
      }
    });
  }

  async getPortfolio(): Promise<PortfolioDatabase> {
    const response = await this.connector.getPagesFromDatabase(
      this.databaseId,
      'Timeline',
      'descending'
    );

    this.categorizePages(response.map((page) => this.processDatabasePage(page)));

    return this.data;
  }
}

const loadPortfolioData = async () => {
  return new Portfolio().getPortfolio();
};

// Persist one Notion response for 60 seconds across routes and requests. This
// prevents project navigation and concurrent builds from issuing a fresh full
// database query for every layout, page, and metadata render.
const loadCachedPortfolioData = process.env.NEXT_RUNTIME
  ? unstable_cache(loadPortfolioData, ['portfolio-data'], {
      revalidate: 60,
      tags: ['portfolio'],
    })
  : loadPortfolioData;

// React cache also deduplicates multiple calls within the same render pass.
export const getPortfolioData = cache(loadCachedPortfolioData);
