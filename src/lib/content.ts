import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import matter from 'gray-matter';
import { BlogPost, BlogPostWithTranslation } from '@/types/page';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

const textFileCache = new Map<string, { mtimeMs: number; content: string }>();
const tomlFileCache = new Map<string, { mtimeMs: number; data: unknown }>();

function readCachedTextFile(filePath: string): string {
  const stat = fs.statSync(filePath);
  const cached = textFileCache.get(filePath);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.content;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  textFileCache.set(filePath, { mtimeMs: stat.mtimeMs, content });
  return content;
}

export function getMarkdownContent(filename: string): string {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    return readCachedTextFile(filePath);
  } catch (error) {
    console.error(`Error loading markdown file ${filename}:`, error);
    return '';
  }
}

export function getBibtexContent(filename: string): string {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    return readCachedTextFile(filePath);
  } catch (error) {
    console.error(`Error loading bibtex file ${filename}:`, error);
    return '';
  }
}

export function getTomlContent<T>(filename: string): T | null {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const stat = fs.statSync(filePath);
    const cached = tomlFileCache.get(filePath);
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.data as T;
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = parse(fileContent);
    tomlFileCache.set(filePath, { mtimeMs: stat.mtimeMs, data: parsed });
    return parsed as unknown as T;
  } catch (error) {
    console.error(`Error loading TOML file ${filename}:`, error);
    return null;
  }
}

export function getPageConfig<T>(pageName: string): T | null {
  return getTomlContent<T>(`${pageName}.toml`);
}

function parseBlogFile(filePath: string, slug: string, lang: 'zh' | 'en'): BlogPost {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    tags: data.tags || [],
    summary: data.summary || '',
    content,
    contentType: data.type === 'notion' ? 'notion' : 'markdown',
    notionUrl: data.notion_url || undefined,
    lang,
    hasTranslation: false,
  };
}

export function getBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return [];
    }
    // Only get primary (Chinese) files — exclude .en.md
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') && !f.endsWith('.en.md'));
    const posts: BlogPost[] = files.map(filename => {
      const filePath = path.join(BLOG_DIR, filename);
      const slug = filename.replace(/\.md$/, '');
      const enPath = path.join(BLOG_DIR, `${slug}.en.md`);
      const hasEn = fs.existsSync(enPath);
      // Prefer English version for listing; fall back to Chinese
      const post = hasEn
        ? parseBlogFile(enPath, slug, 'en')
        : parseBlogFile(filePath, slug, 'zh');
      post.hasTranslation = hasEn;
      return post;
    });
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const enPath = path.join(BLOG_DIR, `${slug}.en.md`);
    const post = parseBlogFile(filePath, slug, 'zh');
    post.hasTranslation = fs.existsSync(enPath);
    return post;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

export function getBlogPostWithTranslation(slug: string): BlogPostWithTranslation | null {
  try {
    const zhPath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(zhPath)) {
      return null;
    }
    const zhPost = parseBlogFile(zhPath, slug, 'zh');

    const enPath = path.join(BLOG_DIR, `${slug}.en.md`);
    let enPost: BlogPost | null = null;
    if (fs.existsSync(enPath)) {
      enPost = parseBlogFile(enPath, slug, 'en');
    }

    zhPost.hasTranslation = enPost !== null;

    return { zh: zhPost, en: enPost };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

