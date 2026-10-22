import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import { SectionConfig } from '@/types/page';

export interface SiteConfig {
  site: {
    title: string;
    brand?: string;
    description: string;
    favicon: string;
    last_updated?: string;
  };
  author: {
    name: string;
    title: string;
    institution: string;
    avatar: string;
  };
  social: {
    email?: string;
    location?: string;
    location_url?: string;
    location_details?: string[];
    google_scholar?: string;
    orcid?: string;
    github?: string;
    linkedin?: string;
    xiaohongshu?: string;
    wechat?: string;
    [key: string]: string | string[] | undefined;
  };
  features: {
    enable_likes: boolean;
    enable_one_page_mode?: boolean;
  };
  navigation: Array<{
    title: string;
    type: 'section' | 'page' | 'link';
    target: string;
    href: string;
  }>;
  sections?: SectionConfig[];
}

const CONFIG_PATH = path.join(process.cwd(), 'content', 'config.toml');

let cachedConfig: SiteConfig | null = null;
let cachedConfigMtimeMs = 0;

export function getConfig(): SiteConfig {
  try {
    const stat = fs.statSync(CONFIG_PATH);
    if (cachedConfig && stat.mtimeMs === cachedConfigMtimeMs) {
      return cachedConfig;
    }
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = parse(fileContent) as unknown as SiteConfig;
    cachedConfig = config;
    cachedConfigMtimeMs = stat.mtimeMs;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    throw new Error('Failed to load content/config.toml');
  }
}
