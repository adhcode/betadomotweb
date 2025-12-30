import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchPost } from "@/lib/api-client";
import BlogPostClient from "@/components/BlogPostClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Generate metadata for social sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    
    try {
        const post = await fetchPost(resolvedParams.slug);
        
        if (!post) {
            return {
                title: 'Post Not Found',
                description: 'The blog post you are looking for does not exist.',
            };
        }

        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://betadomot.blog'
            : 'http://localhost:3000';
        
        const postUrl = `${baseUrl}/blog/${post.slug}`;
        const imageUrl = post.featured_image 
            ? (post.featured_image.startsWith('http') ? post.featured_image : `${baseUrl}${post.featured_image}`)
            : `${baseUrl}/images/og-default.jpg`;

        return {
            title: `${post.title} | BetaDomot`,
            description: post.excerpt || post.content.substring(0, 160),
            keywords: post.tags?.join(', '),
            authors: [{ name: 'BetaDomot' }],
            openGraph: {
                type: 'article',
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                url: postUrl,
                siteName: 'BetaDomot',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                publishedTime: post.published_at,
                authors: ['BetaDomot'],
                tags: post.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                images: [imageUrl],
                creator: '@betadomot',
            },
            alternates: {
                canonical: postUrl,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'BetaDomot Blog',
            description: 'Your guide to a beautiful and happy home.',
        };
    }
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    
    // Fetch post data on server
    try {
        const post = await fetchPost(resolvedParams.slug);
        if (!post) {
            notFound();
        }

        return (
            <>
                <Header />
                <BlogPostClient post={post} />
                <Footer />
            </>
        );
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }
}
