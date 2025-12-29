'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import Comments from '@/components/Comments';
import RelatedProducts from '@/components/RelatedProducts';

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time?: string;
    featured_image: string;
    tags: string[];
    views?: number;
    author?: string;
    category?: string;
    related_products?: string[];
}

interface MinimalBlogPostProps {
    post: BlogPost;
}

// Minimal clap icon
function ClapIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2l2.09 6.26L20 10l-5.91 4.74L16.18 22 12 19.77 7.82 22l2.09-7.26L4 10l5.91-1.74L12 2z" />
        </svg>
    );
}

export default function MinimalBlogPost({ post }: MinimalBlogPostProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [userClaps, setUserClaps] = useState<number>(0);
    const [totalClaps, setTotalClaps] = useState<number>(0);
    const [justClapped, setJustClapped] = useState<boolean>(false);

    useEffect(() => {
        setIsVisible(true);

        // Fetch claps
        const fetchClaps = async () => {
            try {
                const base = process.env.NODE_ENV === 'production'
                    ? 'https://betadomotweb-production.up.railway.app'
                    : 'http://localhost:8080';
                const res = await fetch(`${base}/posts/${post.slug}/claps`);
                if (res.ok) {
                    const data = await res.json();
                    setTotalClaps(data.claps || 0);
                }
            } catch (error) {
                console.error('Error fetching claps:', error);
            }
        };

        fetchClaps();
    }, [post.slug]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatContent = (content: string) => {
        if (!content) return '';
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    };

    const formatClaps = (n: number) => {
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    };

    const handleClap = async () => {
        try {
            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';
            const res = await fetch(`${base}/posts/${post.slug}/clap`, { method: 'POST' });
            if (res.ok) {
                setTotalClaps(prev => prev + 1);
                setUserClaps(prev => prev + 1);
                setJustClapped(true);
                setTimeout(() => setJustClapped(false), 500);
            }
        } catch (error) {
            console.error('Error clapping:', error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Header */}
            <header className="pt-16 pb-8 bg-white border-b border-neutral-100">
                <div className="max-w-3xl mx-auto px-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-neutral-500 hover:text-black transition-colors mb-8 text-sm font-medium"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Blog
                    </Link>

                    <h1 className="font-gilroy font-extra-bold text-3xl md:text-4xl lg:text-5xl text-black leading-tight mb-4">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6">
                        <span>{formatDate(post.published_at)}</span>
                        <span>•</span>
                        <span>{post.read_time || '5 min read'}</span>
                        <span>•</span>
                        <span>{post.views || 0} views</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleClap}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 transition-all text-sm ${justClapped ? 'ring-2 ring-neutral-200' : ''}`}
                        >
                            <ClapIcon className="w-4 h-4" />
                            <span>{formatClaps(totalClaps)}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 transition-all text-sm"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="bg-white">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="mb-8 pb-6 border-b border-neutral-100">
                            <p className="text-lg text-neutral-600 leading-relaxed font-body">
                                {post.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Article Content */}
                    <article className="prose prose-lg max-w-none">
                        <div
                            className="text-neutral-700 leading-relaxed font-body text-base"
                            style={{ lineHeight: '1.7' }}
                            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                        />
                    </article>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-6 border-t border-neutral-100">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                    <Link
                                        key={index}
                                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                                        className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm rounded-full transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {post.related_products && post.related_products.length > 0 && (
                        <div className="mt-16">
                            <RelatedProducts
                                productIds={post.related_products}
                                context={post.category}
                            />
                        </div>
                    )}

                    {/* Comments */}
                    <div className="mt-16 pt-8 border-t border-neutral-100">
                        <Comments postSlug={post.slug} />
                    </div>
                </div>
            </main>
        </div>
    );
} 