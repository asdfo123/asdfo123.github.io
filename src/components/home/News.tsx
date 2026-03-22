'use client';

import { motion } from 'framer-motion';

export interface NewsItem {
    date: string;
    content: string;
    icon?: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

// 解析 Markdown 链接 [text](url) 和加粗 **text**
function parseMarkdownInline(text: string): React.ReactNode[] {
    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        if (match[1] !== undefined) {
            // Link: [text](url)
            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline font-medium"
                >
                    {match[1]}
                </a>
            );
        } else if (match[3] !== undefined) {
            // Bold: **text**
            parts.push(
                <strong key={match.index} className="font-semibold text-primary">
                    {match[3]}
                </strong>
            );
        }
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
}

export default function News({ items, title = 'News' }: NewsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <p className="text-sm text-neutral-700 dark:text-neutral-400">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            {parseMarkdownInline(item.content)}
                        </p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
