import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import matter from 'gray-matter';
import { BlogPost } from '@/types/page';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

export function getMarkdownContent(filename: string): string {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading markdown file ${filename}:`, error);
    return '';
  }
}

export function getBibtexContent(filename: string): string {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading bibtex file ${filename}:`, error);
    return '';
  }
}

export function getTomlContent<T>(filename: string): T | null {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return parse(fileContent) as unknown as T;
  } catch (error) {
    console.error(`Error loading TOML file ${filename}:`, error);
    return null;
  }
}

export function getPageConfig<T>(pageName: string): T | null {
  return getTomlContent<T>(`${pageName}.toml`);
}

export function getBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return [];
    }
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
    const posts: BlogPost[] = files.map(filename => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const slug = filename.replace(/\.md$/, '');
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        tags: data.tags || [],
        summary: data.summary || '',
        content,
        contentType: data.type === 'notion' ? 'notion' : 'markdown',
        notionUrl: data.notion_url || undefined,
      };
    });
    // Sort by date descending
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
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

