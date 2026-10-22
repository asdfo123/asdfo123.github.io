import { Publication } from './publication';

export interface BasePageConfig {
  type: 'about' | 'publication' | 'card' | 'text' | 'blog';
  title: string;
  description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
  type: 'publication';
  source: string;
}

export interface TextPageConfig extends BasePageConfig {
  type: 'text';
  source: string;
  pdf?: string;
}

export interface CardItem {
  title: string;
  subtitle?: string;
  date?: string;
  content?: string;
  tags?: string[];
  link?: string;
  image?: string;
}

export interface CardPageConfig extends BasePageConfig {
  type: 'card';
  items: CardItem[];
}

export interface BlogPageConfig extends BasePageConfig {
  type: 'blog';
}

export interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list' | 'awards' | 'competitions' | 'projects' | 'internships' | 'cards';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: Array<{ date: string; content: string; icon?: string }>;
  awards?: Array<{ date: string; awards: string[]; suffix?: string }>;
  competitions?: Array<{ date: string; name: string; url?: string; prize: string; role: string }>;
  projects?: Array<{
    name: string;
    description: string;
    highlight?: string;
    github?: string;
    date?: string;
    image?: string;
    video?: string;
    tags?: string[];
    links?: Array<{ label: string; url: string }>;
  }>;
  internships?: Array<{
    period: string;
    role: string;
    company: string;
    location: string;
    logo?: string;
    url?: string;
  }>;
}

export type PageData =
  | { type: 'about'; id: string; sections: SectionConfig[] }
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; id: string; config: TextPageConfig; content: string }
  | { type: 'card'; id: string; config: CardPageConfig };

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
  contentType: 'markdown' | 'notion';
  notionUrl?: string;
  lang: 'zh' | 'en';
  hasTranslation?: boolean;
}

export interface BlogPostWithTranslation {
  zh: BlogPost;
  en: BlogPost | null;
}
