'use cache'
import { Client } from '@notionhq/client';
import { Category, PortfolioDto, Page } from '@/schema'
import { cache } from 'react'
import { revalidateTag } from 'next/cache';

export class Portfolio {
  private connector: Client;
  private databaseId: string;
  private data: PortfolioDto;

  constructor() {
    this.connector = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_PORTFOLIO_CMS_KEY });
    this.databaseId = process.env.NEXT_PUBLIC_NOTION_DB_ID || "";
    this.data = this.initializeEmptyPortfolio();
  }

  private initializeEmptyPortfolio(): PortfolioDto {
    return {
      about: { desc: [] },
      headline: { desc: [] },
      projects: [],
      contacts: [],
      articles: [],
      publications: [],
      press: [],
      research: [],
      positions: [],
      awards: [],
      certifications: [],
      education: [],
      skills: []
    };
  }
  //desc: page.properties['Description']?.rich_text?.[0]?.text?.content || '',

  private transformPage(page: any): Page {
    return {
      id: page.id,
      name: page.properties['Name']?.title[0]?.text?.content || '',
      desc: page.properties['Description']?.rich_text?.map((line: any) => ({
        text: line.plain_text,
        link: line.text.link,
        bold: line.annotations.bold,
        italic: line.annotations.italic,
        strikethrough: line.annotations.strikethrough,
        underline: line.annotations.underline,
        code: line.annotations.code,
        color: line.annotations.color
      })),
      type: page.properties['Type']?.select?.name,
      link: page.properties['Link']?.url || '',
      published: page.properties['Publish']?.checkbox || false,
      startDate: page.properties['Timeline']?.date?.start || '',
      endDate: page.properties['Timeline']?.date?.end || '',
      files: page.properties['Files'].files.map((file: any) => ({
        name: file.string,
        url: file.file.url
      }))
    };
  }

  
  private categorizePages(pages: Page[]): void {
    pages.forEach(page => {

      if (!page.type || !page.published) {
        //console.log(`Skipping page ${page.id}: type=${page.type}, published=${page.published}`);
        return;
      }if (!page.type || !page.published) return;


      const item = {
        name: page.name || '',
        desc: page.desc || [],
        link: page.link || '',
        startDate: page.startDate || '',
        endDate: page.endDate || '',
        files: page.files || []
      };

      //console.log(`Processing page: ${page.id} with type: ${page.type}`);

      switch (page.type.toLowerCase() as Category) {
        case 'about':
          this.data.about = { desc: item.desc };
          break;
        case 'headline':
          this.data.headline = { desc: item.desc };
          break;
        case 'project':
          this.data.projects.push(item);
          break;
        case 'contact':
          this.data.contacts.push({ name: item.name, desc: item.desc, link: item.link });
          break;
        case 'article':
          this.data.articles.push({ name: item.name, desc: item.desc, link: item.link });
          break;
        case 'publication':
          this.data.publications.push({ name: item.name, desc: item.desc, link: item.link });
          break;
        case 'press':
          this.data.press.push({ name: item.name, desc: item.desc, link: item.link });
          break;
        case 'research':
          this.data.research.push(item);
          break;
        case 'position':
          this.data.positions.push(item);
          break;
        case 'award':
          this.data.awards.push({ name: item.name, dateReceived: item.endDate });
          break;
        case 'certification':
          this.data.certifications.push({ name: item.name, link: item.link, dateReceived: item.endDate });
          break;
        case 'education':
          this.data.education.push({ name: item.name, desc: item.desc, link: item.link, startDate: item.startDate, endDate: item.endDate });
          break;
        case 'skill':
          this.data.skills.push({ name: item.name });
          break;
      }

    });
  }

  
  async getPortfolio(category?: Lowercase<Category>): Promise<PortfolioDto> {
    const response = await this.connector.databases.query({
      database_id: this.databaseId,
      sorts: [
        {
          property: "Timeline",
          direction: "descending"
        }
      ],
    });

    const pages = response.results.map(this.transformPage);
    
    if (category) {
      const newPages = pages.filter(item => 
        item.type?.toLowerCase() === category && item.published
      );
      this.categorizePages(newPages);

    } else if (!category) {
      this.categorizePages(pages)
    }

    return this.data;
  }

   // Add a new method for manual revalidation
   async refreshData(): Promise<boolean> {
    try {
      // This could trigger a rebuild or refresh mechanism
      // The actual implementation depends on your deployment platform
      return true;
    } catch (error) {
      console.error('Error refreshing portfolio data', error);
      return false;
    }
  }

}

