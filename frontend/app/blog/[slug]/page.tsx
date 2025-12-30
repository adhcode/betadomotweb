import { Metadata } from "next";
import { fetchPost } from "@/lib/api-client";
import { notFound } from "next/navigation";
import BlogPostPageClient from "./BlogPostPageClient";

// Generate metadata for social sharing - runs on server
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
        
        // Construct absolute image URL
        let imageUrl = `${baseUrl}/images/logo.png`; // fallback
        
        if (post.featured_image) {
            if (post.featured_image.startsWith('http://') || post.featured_image.startsWith('https://')) {
                imageUrl = post.featured_image;
            } else if (post.featured_image.startsWith('/')) {
                imageUrl = `${baseUrl}${post.featured_image}`;
            } else {
                imageUrl = `${baseUrl}/${post.featured_image}`;
            }
        }

        return {
            title: `${post.title} | BetaDomot`,
            description: post.excerpt || post.content?.substring(0, 160) || '',
            keywords: post.tags?.join(', '),
            authors: [{ name: 'BetaDomot' }],
            openGraph: {
                type: 'article',
                title: post.title,
                description: post.excerpt || post.content?.substring(0, 160) || '',
                url: postUrl,
                siteName: 'BetaDomot',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                        type: 'image/jpeg',
                    },
                ],
                publishedTime: post.published_at,
                authors: ['BetaDomot'],
                tags: post.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content?.substring(0, 160) || '',
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

// Server component that fetches data and passes to client
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    
    try {
        const post = await fetchPost(resolvedParams.slug);
        
        if (!post) {
            notFound();
        }

        // Pass post data to client component
        return <BlogPostPageClient initialPost={post} />;
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }
}
