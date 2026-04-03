import { notFound } from 'next/navigation';
import { getBlogPostWithTranslation, getBlogPosts } from '@/lib/content';
import BlogPostPage from '@/components/pages/BlogPostPage';
import { Metadata } from 'next';

export function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map(post => ({
        postSlug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ postSlug: string }> }): Promise<Metadata> {
    const { postSlug } = await params;
    const data = getBlogPostWithTranslation(postSlug);

    if (!data) {
        return {};
    }

    const primary = data.en ?? data.zh;
    return {
        title: primary.title,
        description: primary.summary,
    };
}

export default async function BlogPostRoute({ params }: { params: Promise<{ postSlug: string }> }) {
    const { postSlug } = await params;
    const data = getBlogPostWithTranslation(postSlug);

    if (!data) {
        notFound();
    }

    // Get all posts for prev/next navigation
    const allPosts = getBlogPosts();
    const currentIndex = allPosts.findIndex(p => p.slug === postSlug);
    const prevPost = currentIndex < allPosts.length - 1
        ? { slug: allPosts[currentIndex + 1].slug, title: allPosts[currentIndex + 1].title }
        : null;
    const nextPost = currentIndex > 0
        ? { slug: allPosts[currentIndex - 1].slug, title: allPosts[currentIndex - 1].title }
        : null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <BlogPostPage
                post={data.zh}
                enPost={data.en}
                prevPost={prevPost}
                nextPost={nextPost}
            />
        </div>
    );
}
