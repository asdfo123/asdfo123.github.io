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
