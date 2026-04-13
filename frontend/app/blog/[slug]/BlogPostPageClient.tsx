"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, Share2, MessageCircle } from "lucide-react";
import Comments from "@/components/Comments";

// Clap icon using the SVG from public folder
function ClapIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 1200 1200" fill="currentColor" {...props}>
            <path d="m1012.5 655c26.25-33.75 25-83.75-6.25-115-10-10-23.75-17.5-37.5-21.25 5-11.25 7.5-23.75 7.5-36.25 0-23.75-8.75-45-25-61.25-31.25-31.25-78.75-33.75-112.5-8.75-3.75-10-8.75-20-16.25-28.75-16.25-17.5-38.75-28.75-62.5-28.75-22.5-1.25-45 7.5-61.25 23.75-2.5-3.75-5-8.75-8.75-11.25-16.25-17.5-38.75-28.75-62.5-28.75-25-1.25-47.5 8.75-63.75 25l-125 123.75c-13.75-52.5-63.75-88.75-118.75-82.5-15 1.25-28.75 8.75-38.75 18.75-22.5-25-57.5-40-93.75-36.25-33.75 3.75-60 32.5-60 67.5l1.25 181.25c0 47.5-6.25 96.25-17.5 138.75v1.25c-25 87.5 0 181.25 63.75 245 66.25 66.25 155 102.5 247.5 102.5 7.5 0 16.25 0 23.75-1.25 35 11.25 72.5 17.5 108.75 17.5 90 0 180-33.75 247.5-102.5l241.25-242.5c16.25-16.25 25-38.75 25-61.25 0-23.75-8.75-45-25-61.25-8.75-7.5-20-13.75-31.25-17.5zm-412.5-255c7.5-7.5 17.5-10 26.25-10 10 0 18.75 5 25 11.25 3.75 5 6.25 11.25 6.25 17.5l-206.25 211.25-6.25-76.25zm-388.75 586.25c-51.25-51.25-70-125-51.25-193.75 13.75-50 20-102.5 20-155l-1.25-181.25c0-7.5 6.25-15 13.75-15 32.5-3.75 61.25 20 65 51.25l2.5 30 1.25 131.25c0 47.5-6.25 95-16.25 137.5 0 1.25-1.25 1.25-1.25 2.5-25 87.5 0 181.25 63.75 245 6.25 6.25 13.75 12.5 20 18.75-43.75-15-83.75-38.75-116.25-71.25zm796.25-226.25-241.25 242.5c-116.25 116.25-306.25 116.25-422.5 0-50-50-70-123.75-51.25-192.5v-1.25c13.75-51.25 20-102.5 20-155v-181.25c0-7.5 6.25-15 13.75-15 32.5-3.75 61.25 20 65 51.25l8.75 126.25c2.5 18.75 15 35 32.5 41.25 18.75 6.25 37.5 1.25 51.25-11.25l247.5-247.5c7.5-7.5 13.75-11.25 26.25-10 10 0 18.75 5 25 11.25 11.25 12.5 10 37.5-3.75 51.25l-183.75 185c-10 10-10 26.25 0 36.25 5 5 11.25 7.5 18.75 7.5 6.25 0 13.75-2.5 18.75-7.5l233.75-233.75c13.75-13.75 36.25-13.75 50 0 6.25 6.25 10 15 10 25s-3.75 18.75-10 25l-235 233.75c-10 10-10 26.25 0 36.25 5 5 11.25 7.5 18.75 7.5s13.75-2.5 18.75-7.5l201.25-201.25c13.75-13.75 36.25-13.75 50 0s13.75 36.25 0 50l-47.5 47.5-35 33.75-120 120c-10 10-10 26.25 0 36.25 5 5 11.25 7.5 18.75 7.5s13.75-2.5 18.75-7.5l153.75-153.75c13.75-13.75 36.25-13.75 50 0 6.25 6.25 10 15 10 25s-3.75 18.75-11.25 25zm-161.25-532.5 63.75-136.25c6.25-12.5 21.25-18.75 33.75-12.5s18.75 21.25 12.5 33.75l-62.5 137.5c-5 10-13.75 15-23.75 15-3.75 0-7.5-1.25-11.25-2.5-12.5-6.25-17.5-22.5-12.5-35zm-133.75-138.75c-3.75-13.75 5-27.5 18.75-31.25s27.5 3.75 31.25 17.5l38.75 145c3.75 13.75-5 27.5-18.75 31.25-2.5 0-5 1.25-6.25 1.25-11.25 0-21.25-7.5-25-18.75zm373.75 175-136.25 63.75c-3.75 1.25-7.5 2.5-11.25 2.5-10 0-18.75-5-23.75-15-6.25-12.5 0-28.75 12.5-33.75l136.25-63.75c12.5-6.25 28.75 0 33.75 12.5 7.5 12.5 1.25 27.5-11.25 33.75z" />
        </svg>
    );
}

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    published_at: string;
    read_time?: string;
    featured_image?: string;
    tags?: string[];
    views?: number;
    category?: string;
    related_products?: string[];
}

interface BlogPostPageClientProps {
    initialPost: BlogPost;
}

export default function BlogPostPageClient({ initialPost }: BlogPostPageClientProps) {
    const [post] = useState<BlogPost>(initialPost);
    const [imageError, setImageError] = useState(false);
    const [userClaps, setUserClaps] = useState<number>(0);
    const [totalClaps, setTotalClaps] = useState<number>(0);
    const [justClapped, setJustClapped] = useState<boolean>(false);
    const [showShare, setShowShare] = useState<boolean>(false);
    const [commentsCount, setCommentsCount] = useState<number>(0);

    useEffect(() => {
        // Fetch engagement data for the post
        const loadEngagementData = async () => {
            try {
                const base = process.env.NODE_ENV === 'production'
                    ? 'https://betadomotweb-production.up.railway.app'
                    : 'http://localhost:8080';

                // Fetch claps
                const clapRes = await fetch(`${base}/posts/${initialPost.slug}/claps`);
                if (clapRes.ok) {
                    const clapData = await clapRes.json();
                    setTotalClaps(clapData.claps || 0);
                }

                // Fetch comments count
                const commentsRes = await fetch(`${base}/posts/${initialPost.slug}/comments`);
                if (commentsRes.ok) {
                    const commentsData = await commentsRes.json();
                    setCommentsCount(Array.isArray(commentsData) ? commentsData.length : 0);
                }
            } catch (error) {
                console.error('Error fetching engagement data:', error);
            }
        };

        loadEngagementData();
    }, [initialPost.slug]);

    // Load user claps from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(`claps:user:${post.id}`);
        if (stored) {
            const val = parseInt(stored, 10);
            if (!isNaN(val)) setUserClaps(val);
        }
    }, [post.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatContent = (content: string) => {
        if (!content) return '';

        let html = content;

        // Split content into paragraphs and process each one
        const paragraphs = html.split(/\n\s*\n/);

        html = paragraphs.map(paragraph => {
            paragraph = paragraph.trim();
            if (!paragraph) return '';

            // Convert headings with design system styling
            if (paragraph.startsWith('### ')) {
                return `<h3 class="text-2xl font-light text-gray-900 mb-6 mt-12 tracking-tight">${paragraph.substring(4)}</h3>`;
            }
            if (paragraph.startsWith('## ')) {
                return `<h2 class="text-3xl font-light text-gray-900 mb-8 mt-16 tracking-tight border-b border-gray-100 pb-4">${paragraph.substring(3)}</h2>`;
            }
            if (paragraph.startsWith('# ')) {
                return `<h1 class="text-4xl font-light text-gray-900 mb-8 mt-12 tracking-tight">${paragraph.substring(2)}</h1>`;
            }

            // Convert bullet points
            if (paragraph.includes('- ')) {
                const lines = paragraph.split('\n');
                const listItems = lines
                    .filter(line => line.trim().startsWith('- '))
                    .map(line => `<li class="mb-3 text-gray-700 text-lg leading-relaxed">${line.trim().substring(2)}</li>`)
                    .join('');
                const nonListContent = lines
                    .filter(line => !line.trim().startsWith('- '))
                    .join(' ')
                    .trim();

                let result = '';
                if (nonListContent) {
                    result += `<p class="text-lg leading-relaxed text-gray-700 mb-6">${nonListContent}</p>`;
                }
                if (listItems) {
                    result += `<ul class="list-disc pl-6 mb-8 space-y-1">${listItems}</ul>`;
                }
                return result;
            }

            // Convert numbered lists
            if (/\d+\./.test(paragraph)) {
                const lines = paragraph.split('\n');
                const listItems = lines
                    .filter(line => /^\d+\./.test(line.trim()))
                    .map(line => `<li class="mb-3 text-gray-700 text-lg leading-relaxed">${line.trim().replace(/^\d+\.\s*/, '')}</li>`)
                    .join('');
                const nonListContent = lines
                    .filter(line => !/^\d+\./.test(line.trim()))
                    .join(' ')
                    .trim();

                let result = '';
                if (nonListContent) {
                    result += `<p class="text-lg leading-relaxed text-gray-700 mb-6">${nonListContent}</p>`;
                }
                if (listItems) {
                    result += `<ol class="list-decimal pl-6 mb-8 space-y-1">${listItems}</ol>`;
                }
                return result;
            }

            // Convert code blocks
            if (paragraph.includes('```')) {
                return `<pre class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-8 text-sm font-mono"><code>${paragraph.replace(/```[\w]*\n?/, '').replace(/```$/, '')}</code></pre>`;
            }

            // Convert inline code
            paragraph = paragraph.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-gray-800 text-base font-mono">$1</code>');

            // Convert bold text
            paragraph = paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-medium text-gray-900">$1</strong>');

            // Convert italic text
            paragraph = paragraph.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-600">$1</em>');

            // Convert links
            paragraph = paragraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gray-900 hover:text-gray-600 transition-colors duration-300 underline underline-offset-2">$1</a>');

            // Convert blockquotes
            if (paragraph.startsWith('> ')) {
                return `<blockquote class="border-l-4 border-gray-300 pl-6 py-4 my-8 bg-gray-50 rounded-r-lg italic text-lg text-gray-600">${paragraph.substring(2)}</blockquote>`;
            }

            // Regular paragraph
            return `<p class="text-lg leading-relaxed text-gray-700 mb-6">${paragraph}</p>`;
        }).join('');

        return html;
    };

    const formatClaps = (n: number) => {
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    };

    const handleClap = async () => {
        if (!post) return;

        // Optimistic update
        const newUserClaps = Math.min(userClaps + 1, 50); // Cap at 50 like Medium
        setUserClaps(newUserClaps);
        setTotalClaps(prev => prev + 1);
        setJustClapped(true);

        // Store in localStorage
        localStorage.setItem(`claps:user:${post.id}`, String(newUserClaps));

        try {
            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';
            const res = await fetch(`${base}/posts/${post.slug}/clap`, { method: 'POST' });
            if (!res.ok) {
                // Revert on failure
                setUserClaps(prev => Math.max(prev - 1, 0));
                setTotalClaps(prev => Math.max(prev - 1, 0));
            }
        } catch (error) {
            console.error('Error clapping:', error);
            // Revert on failure
            setUserClaps(prev => Math.max(prev - 1, 0));
            setTotalClaps(prev => Math.max(prev - 1, 0));
        }

        setTimeout(() => setJustClapped(false), 500);
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post?.title || '';

    const handleImageError = () => {
        setImageError(true);
    };

    const isExternalImage = (src: string) => {
        return src.startsWith('http://') || src.startsWith('https://');
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Back Button - Simple and Minimal */}
            <div className="fixed top-20 left-6 lg:left-12 z-40">
                <Link 
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-light tracking-wide">Back</span>
                </Link>
            </div>

            {/* Article */}
            <article className="pt-32 pb-24">
                {/* Title & Meta */}
                <div className="max-w-[680px] mx-auto px-6 mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-8 leading-[1.1]">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-light mb-8">
                        <time>{formatDate(post.published_at)}</time>
                        <span>·</span>
                        <span>{post.read_time || '6 min read'}</span>
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-gray-600 font-light leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}
                </div>

                {/* Featured Image */}
                {post.featured_image && !imageError && (
                    <div className="max-w-[1200px] mx-auto px-6 mb-16">
                        <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                onError={handleImageError}
                                priority
                                unoptimized={isExternalImage(post.featured_image)}
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-[680px] mx-auto px-6">
                    {/* Article Body */}
                    <div 
                        className="prose prose-lg max-w-none"
                        style={{
                            fontSize: '18px',
                            lineHeight: '1.8',
                            color: '#000000'
                        }}
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-gray-100">
                            <div className="flex flex-wrap gap-3">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-sm text-gray-600 font-light px-4 py-2 border border-gray-200 rounded-full hover:border-gray-900 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Newsletter CTA - Subtle */}
                    <div className="mt-16 pt-12 border-t border-gray-100">
                        <div className="text-center max-w-md mx-auto">
                            <h3 className="text-2xl font-light text-gray-900 mb-4">
                                More like this
                            </h3>
                            <p className="text-base text-gray-600 font-light mb-6 leading-relaxed">
                                One thoughtful email a week with home ideas, tips, and curated finds.
                            </p>
                            <form className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:border-gray-400 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gray-900 text-white text-sm font-light rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 font-light mt-3">
                                No spam. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="mt-16 pt-12 border-t border-gray-100">
                        <Comments postSlug={post.slug} />
                    </div>
                </div>
            </article>

            {/* Fixed Clap Button - Bottom Left */}
            <div className="fixed bottom-8 left-8 z-40 hidden md:block">
                <button
                    onClick={handleClap}
                    disabled={userClaps >= 50}
                    className={`flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all ${
                        justClapped ? 'scale-110' : ''
                    } ${userClaps >= 50 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-900'}`}
                >
                    <ClapIcon className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium text-gray-900">{totalClaps}</span>
                </button>
            </div>

            {/* Fixed Share Button - Bottom Right */}
            <div className="fixed bottom-8 right-8 z-40 hidden md:block">
                <div className="relative">
                    <button
                        onClick={() => setShowShare(!showShare)}
                        className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:border-gray-900 transition-all"
                    >
                        <Share2 size={18} className="text-gray-900" />
                        <span className="text-sm font-medium text-gray-900">Share</span>
                    </button>

                    {showShare && (
                        <div className="absolute bottom-full right-0 mb-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    setShowShare(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                                Copy link
                            </button>
                            <button
                                onClick={() => {
                                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
                                    setShowShare(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-100"
                            >
                                Share on X
                            </button>
                            <button
                                onClick={() => {
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                                    setShowShare(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-100"
                            >
                                Share on Facebook
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Engagement Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleClap}
                        disabled={userClaps >= 50}
                        className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full ${
                            justClapped ? 'scale-110' : ''
                        } ${userClaps >= 50 ? 'opacity-50' : ''}`}
                    >
                        <ClapIcon className="w-4 h-4 text-gray-900" />
                        <span className="text-sm font-medium text-gray-900">{totalClaps}</span>
                    </button>

                    <button
                        onClick={() => setShowShare(!showShare)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full"
                    >
                        <Share2 size={16} className="text-gray-900" />
                        <span className="text-sm font-medium text-gray-900">Share</span>
                    </button>
                </div>
            </div>
        </main>
    );
}