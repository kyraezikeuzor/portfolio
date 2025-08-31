import { PHASE_DEVELOPMENT_SERVER } from 'next/dist/shared/lib/constants';
import {
  PageObjectResponse,
  ImageBlockObjectResponse,
  FileBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

// ============== Portfolio Types ==============
export interface PortfolioPage {
  id: string;
  name?: string;
  desc?: ParsedRichText[] | string;
  group?: string;
  type?: string;
  link?: string;
  published?: boolean;
  startDate?: string;
  endDate?: string;
  files?: ParsedFile[];
}

export interface PortfolioDatabase {
  about: {
    id: string;
    desc: ParsedRichText[];
  };
  headline: {
    id: string;
    desc: ParsedRichText[];
  };
  postscript: {
    id: string;
    desc: ParsedRichText[];
  };
  portrait: {
    id: string;
    files: ParsedFile[];
    desc: string;
  };
  summary: {
    id: string;
    desc: string;
  };
  thumbnail: {
    id: string;
    files: ParsedFile[];
    desc: string;
  };
  projects: {
    id: string;
    name: string;
    desc: ParsedRichText[];
    link: string;
    startDate: string;
    endDate: string;
    group: string;
  }[];
  socials: {
    id: string;
    name: string;
    desc: ParsedRichText[];
    link: string;
  }[];
  writing: {
    id: string;
    name: string;
    desc: ParsedRichText[];
    link: string;
    group: string;
    datePublished: string;
  }[];
  press: {
    id: string;
    name: string;
    desc: string;
    link: string;
    group: string;
    datePublished: string;
  }[];
  positions: {
    id: string;
    name: string;
    desc: ParsedRichText[];
    link: string;
    startDate: string;
    endDate: string;
    files: {
      name: string;
      url: string;
    }[];
    group: string;
  }[];
  awards: {
    id: string;
    name: string;
    dateReceived: string;
    desc: ParsedRichText[];
    group: string;
    link: string;
  }[];
  certifications: {
    id: string;
    name: string;
    link: string;
    dateReceived: string;
    group: string;
  }[];
  education: {
    id: string;
    name: string;
    desc: ParsedRichText[] | string;
    link: string;
    startDate: string;
    endDate: string;
    group: string;
  }[];
  skills: {
    id: string;
    name: string;
  }[];
}

export type PortfolioCategory =
  | 'about'
  | 'headline'
  | 'postscript'
  | 'summary'
  | 'portrait'
  | 'thumbnail'
  | 'project'
  | 'social'
  | 'writing'
  | 'press'
  | 'position'
  | 'award'
  | 'certification'
  | 'education'
  | 'skill';

// ============== Parsed Types ==============
export interface ParsedRichText {
  text: string;
  link: { url: string } | null;
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: 'default' | 'red';
}

export interface ParsedFile {
  name: string;
  url: string;
}

// ============== Notion Database Types ==============
export type NotionImageOptions =
  | undefined
  | PageObjectResponse['cover']
  | PageObjectResponse['icon']
  | ImageBlockObjectResponse['image']
  | Extract<PageObjectResponse['properties'][string], { type: 'files' }>;

export type NotionDatabaseProperties = {
  Name: Extract<PageObjectResponse['properties'][string], { type: 'title' }>;
  Description: Extract<
    PageObjectResponse['properties'][string],
    { type: 'rich_text' }
  >;
  Group: Extract<
    PageObjectResponse['properties'][string],
    { type: 'rich_text' }
  >;
  Type: Extract<PageObjectResponse['properties'][string], { type: 'select' }>;
  Link: Extract<PageObjectResponse['properties'][string], { type: 'url' }>;
  Publish: Extract<
    PageObjectResponse['properties'][string],
    { type: 'checkbox' }
  >;
  Timeline: Extract<PageObjectResponse['properties'][string], { type: 'date' }>;
  Files: Extract<PageObjectResponse['properties'][string], { type: 'files' }>;
};

// ============== Cloudinary Types ==============
export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}
