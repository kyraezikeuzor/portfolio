import NotionClient from '@/lib/notion';
import {
  PortfolioDatabase,
  PortfolioCategory,
  PortfolioPage,
  NotionDatabaseProperties,
  ParsedRichText,
} from '@/types';
import Logger from '@/lib/logger';
import type {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export class Portfolio {
  private connector: NotionClient;
  private databaseId: string;
  private data: PortfolioDatabase;

  constructor() {
    this.connector = new NotionClient(
      process.env.NOTION_TOKEN || '',
      new Logger('debug')
    );
    this.databaseId = process.env.NOTION_DB_ID || '';
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

  private async processDatabasePage(
    page:
      | PageObjectResponse
      | PartialPageObjectResponse
      | PartialDatabaseObjectResponse
      | DatabaseObjectResponse
  ): Promise<PortfolioPage> {
    if (!('properties' in page)) {
      throw new Error('Invalid page object: missing properties');
    }

    const properties = page.properties as Record<string, any>;

    return {
      id: page.id,
      name: properties['Name']?.title?.[0]?.text?.content || '',
      desc: properties['Description']?.rich_text?.map((line: any) => ({
        text: line.plain_text,
        link: line.text.link,
        bold: line.annotations.bold,
        italic: line.annotations.italic,
        strikethrough: line.annotations.strikethrough,
        underline: line.annotations.underline,
        code: line.annotations.code,
        color: line.annotations.color,
      })),
      group: properties['Group']?.rich_text
        .map(
          (line: NotionDatabaseProperties['Group']['rich_text'][number]) =>
            line.plain_text
        )
        .join(''),
      type: properties['Type']?.select?.name,
      link: properties['Link']?.url || '',
      published: properties['Publish']?.checkbox || false,
      startDate: properties['Timeline']?.date?.start || '',
      endDate: properties['Timeline']?.date?.end || '',
      files: properties['Files']?.files?.map(
        (file: NotionDatabaseProperties['Files']['files'][number]) => ({
          name: file.name || '',
          url: 'external' in file ? file.external.url : file.file.url,
        })
      ),
    };
  }

  private categorizePages(pages: PortfolioPage[]): void {
    pages.forEach((page) => {
      if (!page.type || !page.published) {
        return;
      }
      if (!page.type || !page.published) return;

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
            desc: Array.isArray(parsedPage.desc)
              ? parsedPage.desc.map((line: any) => line.text).join('')
              : parsedPage.desc,
          };
          break;
        case 'portrait':
          this.data.portrait = {
            id: parsedPage.id,
            files: parsedPage.files,
            desc: Array.isArray(parsedPage.desc)
              ? parsedPage.desc.map((line: any) => line.text).join('')
              : parsedPage.desc,
          };
          break;
        case 'thumbnail':
          this.data.thumbnail = {
            id: parsedPage.id,
            files: parsedPage.files,
            desc: Array.isArray(parsedPage.desc)
              ? parsedPage.desc.map((line: any) => line.text).join('')
              : parsedPage.desc,
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
            desc: Array.isArray(parsedPage.desc)
              ? parsedPage.desc.map((line: any) => line.text).join('')
              : parsedPage.desc,
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
          this.data.skills.push({ id: parsedPage.id, name: parsedPage.name });
          break;
      }
    });
  }

  async getPortfolio(
    category?: Lowercase<PortfolioCategory>
  ): Promise<PortfolioDatabase> {
    const response = await this.connector.getPagesFromDatabase(
      this.databaseId,
      'Timeline',
      'descending'
    );

    const pages = await Promise.all(response.map(this.processDatabasePage));

    if (category) {
      const newPages = pages.filter(
        (page) => page.type?.toLowerCase() === category && page.published
      );
      this.categorizePages(newPages);
      //console.log(this.data);
    } else if (!category) {
      this.categorizePages(pages);
    }

    return this.data;
  }
}
