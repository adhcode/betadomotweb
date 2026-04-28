"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, MessageCircle, Share2 } from "lucide-react";
import Comments from "@/components/Comments";
import MarkdownContent from "@/components/MarkdownContent";

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

    const cleanContent = (content: string) => {
        if (!content) return '';
        return content
            .replace(/<NewsletterSignup\s*\/?>\s*/g, '')
            .trim();
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
    const handleImageError = () => {
        setImageError(true);
    };

    const isExternalImage = (src: string) => {
        return src.startsWith('http://') || src.startsWith('https://');
    };

    return (
        <main className="min-h-screen bg-[#faf9f6]">
            {/* Article */}
            <article className="pt-24 pb-24">
                <div className="mx-auto max-w-4xl bg-white px-6 py-8 shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-gray-100 md:px-10 md:py-12">
                    <div>
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 text-sm font-light tracking-wide text-gray-500 transition-colors hover:text-gray-800"
                        >
                            <ArrowLeft size={16} className="text-gray-500 transition-transform group-hover:-translate-x-1 group-hover:text-gray-800" />
                            Back to articles
                        </Link>
                    </div>

                    <header className="mt-12 max-w-3xl">
                        {post.category && (
                            <div className="mb-5">
                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-gray-600">
                                    {post.category}
                                </span>
                            </div>
                        )}

                        <h1 className="max-w-3xl text-4xl font-extralight leading-[1.05] tracking-[-0.03em] text-gray-900 md:text-5xl lg:text-6xl">
                            {post.title}
                        </h1>

                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <time>{formatDate(post.published_at)}</time>
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{post.read_time || '6 min read'}</span>
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>{commentsCount} comments</span>
                            </span>
                        </div>

                        {post.excerpt && (
                            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl md:leading-9">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleClap}
                                disabled={userClaps >= 50}
                                className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#fcfcfb] px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-white hover:text-gray-900 ${
                                    justClapped ? 'scale-[1.02]' : ''
                                } ${userClaps >= 50 ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <ClapIcon className="h-4 w-4 text-gray-700" />
                                <span>{formatClaps(totalClaps)}</span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowShare(!showShare)}
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#fcfcfb] px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-white hover:text-gray-900"
                                >
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>

                                {showShare && (
                                    <div className="absolute left-0 top-full z-20 mt-3 w-64 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(shareUrl);
                                                setShowShare(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            Copy link
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`, '_blank');
                                                setShowShare(false);
                                            }}
                                            className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            Share on X
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                                                setShowShare(false);
                                            }}
                                            className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            Share on Facebook
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {post.featured_image && !imageError && (
                        <div className="mt-12 overflow-hidden border border-gray-100 bg-gray-50">
                            <div className="relative aspect-[16/9]">
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

                    <div className="mt-14 max-w-2xl border-t border-gray-100 pt-10">
                        <MarkdownContent content={cleanContent(post.content)} />
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-16 border-t border-gray-100 pt-10">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs uppercase tracking-[0.22em] text-gray-500"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-16 border-t border-gray-100 pt-10">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-cormorant font-normal tracking-[-0.02em] text-gray-900">
                                More like this
                            </h2>
                            <p className="mt-3 text-base leading-7 text-gray-600">
                                One careful note a week with home ideas, practical tips, and curated finds.
                            </p>
                            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="min-w-0 flex-1 border border-gray-200 bg-white px-4 py-3 text-sm font-light text-gray-900 outline-none transition-colors focus:border-gray-900"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center border border-[#b8871d] bg-[#dca744] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition-colors hover:border-[#a87718] hover:bg-[#e6b85c]"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <p className="mt-3 text-xs text-gray-500">
                                No spam. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-gray-100 pt-10">
                        <Comments postSlug={post.slug} />
                    </div>
                </div>
            </article>
        </main>
    );
}
