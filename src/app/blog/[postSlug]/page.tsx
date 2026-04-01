import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/content';
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
    const post = getBlogPost(postSlug);

    if (!post) {
        return {};
    }

    return {
        title: post.title,
        description: post.summary,
    };
}

export default async function BlogPostRoute({ params }: { params: Promise<{ postSlug: string }> }) {
    const { postSlug } = await params;
    const post = getBlogPost(postSlug);

    if (!post) {
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
            <BlogPostPage post={post} prevPost={prevPost} nextPost={nextPost} />
        </div>
    );
}
