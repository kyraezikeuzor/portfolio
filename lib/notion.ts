import { Client, LogLevel } from '@notionhq/client';
import {
  GetBlockResponse,
  GetPageResponse,
  ListBlockChildrenResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { BLOCK_TYPE_IMAGE } from '@/lib/constants';
import Logger from '@/lib/logger';
import { NotionDatabaseProperties } from '@/types';

export default class NotionClient {
  private client: Client;
  log: Logger;

  constructor(auth: string, log: Logger) {
    this.client = new Client({
      auth,
      logLevel:
        process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.WARN,
    });
    this.log = log;
  }

  async getPagesFromDatabase(
    notionDatabaseId: string,
    sortProperty?: keyof NotionDatabaseProperties,
    sortDirection?: 'ascending' | 'descending'
  ): Promise<GetPageResponse[]> {
    let hasMore = true;
    let nextCursor: string | null = null;
    const pages: GetPageResponse[] = [];

    while (hasMore) {
      this.log.debug(
        `Fetching pages from database ${notionDatabaseId} with cursor ${nextCursor}`
      );

      const result: QueryDatabaseResponse = await this.client.databases.query({
        database_id: notionDatabaseId,
        start_cursor: nextCursor || undefined,
        sorts: sortProperty
          ? [
              {
                property: sortProperty,
                direction: sortDirection || 'descending',
              },
            ]
          : [],
      });

      pages.push(...(result.results as GetPageResponse[]));

      hasMore = result.has_more;
      nextCursor = result.next_cursor;

      if (hasMore) {
        this.log.debug('⚠️ More than 100 pages in db, fetching more...');
      }
    }

    return pages;
  }

  async getPageIdsFromDatabase(notionDatabaseId: string): Promise<string[]> {
    const pages = await this.getPagesFromDatabase(notionDatabaseId);
    return pages.map((page) => page.id);
  }

  async getPage(notionPageId: string): Promise<GetPageResponse> {
    const result = await this.client.pages.retrieve({
      page_id: notionPageId,
    });
    return result;
  }

  async fetchAllBlocks(pageIdOrBlockId: string): Promise<GetBlockResponse[]> {
    let hasMore = true;
    let nextCursor: string | null = null;
    const blocks: GetBlockResponse[] = [];

    while (hasMore) {
      const result: ListBlockChildrenResponse =
        await this.client.blocks.children.list({
          block_id: pageIdOrBlockId,
          start_cursor: nextCursor || undefined,
        });

      blocks.push(...result.results);

      hasMore = result.has_more;
      nextCursor = result.next_cursor;

      if (hasMore) {
        this.log.debug('⚠️ More than 100 blocks in page, fetching more...');
      }
    }

    // Retrieve block children for nested blocks (one level deep), for example toggle blocks
    // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
    const childBlocks = await Promise.all(
      blocks
        .filter((block) => 'has_children' in block && block.has_children)
        .map(async (block) => {
          const childBlocks = await this.fetchAllBlocks(block.id);
          return childBlocks;
        })
    );

    // We don't care about the order they are. Otherwise, we'd group child blocks with their parents
    return [...blocks, ...childBlocks.flat()];
  }

  async fetchAllImageBlocks(
    pageIdOrBlockId: string
  ): Promise<GetBlockResponse[]> {
    const allBlocks = await this.fetchAllBlocks(pageIdOrBlockId);
    const imageBlocks = allBlocks.filter(
      (block) => 'type' in block && block.type === BLOCK_TYPE_IMAGE
    );
    return imageBlocks;
  }

  // NEW METHOD: Update files property with new external URLs
  async updateFilesPropertyExternalUrls(
    pageId: string,
    propertyName: string,
    files: Array<{ name: string; url: string }>
  ) {
    const properties: any = {};

    properties[propertyName] = {
      files: files.map((file) => ({
        name: file.name,
        type: 'external',
        external: {
          url: file.url,
        },
      })),
    };

    return this.client.pages.update({
      page_id: pageId,
      properties,
    });
  }

  async updateImageBlockExternalUrl(blockId: string, url: string) {
    return this.client.blocks.update({
      block_id: blockId,
      image: {
        external: {
          url,
        },
      },
    });
  }

  async updatePageCoverExternalUrl(pageId: string, url: string) {
    return this.client.pages.update({
      page_id: pageId,
      cover: {
        type: 'external',
        external: {
          url,
        },
      },
    });
  }

  async updatePageIconExternalUrl(pageId: string, url: string) {
    return this.client.pages.update({
      page_id: pageId,
      icon: {
        type: 'external',
        external: {
          url,
        },
      },
    });
  }
}
