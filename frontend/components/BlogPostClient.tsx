'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Eye, Facebook, Share, MessageCircle, Bookmark, ArrowUpRight, Link2 } from 'lucide-react';
import Comments from '@/components/Comments';
import NewsletterForm from '@/components/NewsletterForm';
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

interface BlogPostClientProps {
    post: BlogPost;
}

// Clap icon with hands clapping motion
function ClapIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            {/* Left hand */}
            <path d="M7 14c-1.1 0-2-.9-2-2V9c0-.6.4-1 1-1s1 .4 1 1v3c0 .6.4 1 1 1" />
            <path d="M5 9V6c0-.6-.4-1-1-1s-1 .4-1 1v5c0 1.7 1.3 3 3 3" />
            <path d="M7 9V6c0-.6-.4-1-1-1s-1 .4-1 1v3" />

            {/* Right hand */}
            <path d="M17 14c1.1 0 2-.9 2-2V9c0-.6-.4-1-1-1s-1 .4-1 1v3c0 .6-.4 1-1 1" />
            <path d="M19 9V6c0-.6.4-1 1-1s1 .4 1 1v5c0 1.7-1.3 3-3 3" />
            <path d="M17 9V6c0-.6.4-1 1-1s1 .4 1 1v3" />

            {/* Clap lines for motion */}
            <path d="M12 5v2M10 6l1 1M14 6l-1 1" opacity="0.6" />
            <path d="M12 17v2M10 18l1-1M14 18l-1-1" opacity="0.4" />
        </svg>
    );
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [userClaps, setUserClaps] = useState<number>(0);
    const [showShare, setShowShare] = useState<boolean>(false);
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [justClapped, setJustClapped] = useState<boolean>(false);
    const [totalClaps, setTotalClaps] = useState<number>(0);
    const [pendingClaps, setPendingClaps] = useState<number>(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem(`claps:user:${post.id}`);
        if (stored) {
            const val = parseInt(stored, 10);
            if (!isNaN(val)) setUserClaps(val);
        }
        const pending = localStorage.getItem(`claps:pending:${post.id}`);
        if (pending) {
            const p = parseInt(pending, 10);
            if (!isNaN(p)) setPendingClaps(p);
        }
    }, [post.id]);

    useEffect(() => {
        // Fetch comments count for the meta bar
        const fetchCount = async () => {
            try {
                const base = process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080';
                const res = await fetch(`${base}/posts/${post.slug}/comments`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setCommentsCount(Array.isArray(data) ? data.length : 0);
                }
            } catch { }
        };
        fetchCount();
    }, [post.slug]);

    useEffect(() => {
        // Fetch total claps for this post
        const fetchClaps = async () => {
            try {
                const base = process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080';
                const res = await fetch(`${base}/posts/${post.slug}/claps`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (typeof data?.claps === 'number') setTotalClaps(data.claps);
                }
            } catch { }
        };
        fetchClaps();
    }, [post.slug]);

    // Try to flush any pending claps to the backend on mount and whenever pending changes
    useEffect(() => {
        const flushPending = async () => {
            if (pendingClaps <= 0) return;
            const base = process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080';
            let remaining = pendingClaps;
            while (remaining > 0) {
                try {
                    const res = await fetch(`${base}/posts/${post.slug}/clap`, { method: 'POST' });
                    if (res.ok) {
                        remaining -= 1;
                        setTotalClaps((prev) => prev + 1);
                        const next = Math.max(remaining, 0);
                        setPendingClaps(next);
                        localStorage.setItem(`claps:pending:${post.id}`, String(next));
                    } else {
                        break;
                    }
                } catch {
                    break;
                }
            }
        };
        flushPending();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingClaps, post.slug]);

    const handleClap = async () => {
        setUserClaps((prev) => {
            const next = Math.min(prev + 1, 50); // cap like Medium
            localStorage.setItem(`claps:user:${post.id}`, String(next));
            return next;
        });
        setTotalClaps((prev) => prev + 1); // optimistic total increment
        setPendingClaps((prev) => {
            const next = prev + 1;
            localStorage.setItem(`claps:pending:${post.id}`, String(next));
            return next;
        });
        setJustClapped(true);
        setTimeout(() => setJustClapped(false), 500);
        // Kick flush without blocking UI
        setTimeout(() => setPendingClaps((p) => p), 0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatContent = (content: string) => {
        if (!content) return '';

        // Enhanced HTML formatting with better styling
        return content
            .replace(/\n/g, '<br>')
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-gray-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
            .replace(/###\s+(.*?)(?=\n|$)/g, '<h3 class="text-2xl font-normal text-gray-900 mt-8 mb-4 font-cutive">$1</h3>')
            .replace(/##\s+(.*?)(?=\n|$)/g, '<h2 class="text-3xl font-normal text-gray-900 mt-10 mb-6 font-cutive">$1</h2>');
    };

    const formatClaps = (n: number) => {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return String(n);
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out this article: ${post.title}`;

    const shareLinks = {
        x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
        }
    };

    return (
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Minimal Hero Section */}
            <section className="pt-24 pb-12 bg-white">
                <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-neutral-600 hover:text-black transition-colors mb-8 text-sm"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </Link>

                    {/* Article Header */}
                    <div>
                        <h1 className="font-gilroy font-extra-bold text-black mb-6 leading-tight text-3xl md:text-4xl lg:text-5xl">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-neutral-500 text-sm mb-8">
                            <span>{formatDate(post.published_at)}</span>
                            <span>•</span>
                            <span>{post.read_time || '6 min read'}</span>
                            <span>•</span>
                            <span>{post.views || 0} views</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {post.featured_image && !imageError && (
                <section className="w-full">
                    <div className="max-w-6xl mx-auto px-6 sm:px-8 -mt-8">
                        <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
                            <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                                priority
                            />
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </section>
            )}

            {/* Actions Bar */}
            <section className="w-full">
                <div className="max-w-6xl mx-auto px-6 sm:px-8">
                    <div className="flex items-center justify-between py-4 text-neutral-600">
                        <div className="flex items-center gap-6">
                            {/* Clap */}
                            <button
                                onClick={handleClap}
                                className={`group inline-flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-200 bg-white transition-all hover:bg-[#dca744]/10 hover:border-[#dca744] ${justClapped ? 'ring-2 ring-[#dca744]/40' : ''}`}
                                aria-label="Clap"
                            >
                                <ClapIcon className="w-5 h-5 text-neutral-800 group-hover:text-[#0A0A0A]" />
                                <span className="font-body text-sm text-neutral-800 group-hover:text-[#0A0A0A]">{formatClaps(totalClaps)}</span>
                            </button>
                            {/* Comments count */}
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-200 bg-white">
                                <MessageCircle size={18} className="text-neutral-600" />
                                <span className="font-body text-sm text-neutral-800">{commentsCount}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                            {/* Share popover */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowShare((v) => !v)}
                                    className="p-2 rounded-full border border-neutral-200 hover:border-[#236b7c] bg-white hover:bg-[#236b7c]/10 transition-all"
                                    aria-label="Share"
                                >
                                    <Share size={18} className="text-neutral-700" />
                                </button>
                                {showShare && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 shadow-xl rounded-lg overflow-hidden z-20">
                                        <div className="px-3 py-2 text-xs uppercase tracking-widest text-neutral-500 bg-neutral-50">Share</div>
                                        <button onClick={() => window.open(shareLinks.x, '_blank')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                            <ArrowUpRight size={16} className="text-neutral-700" />
                                            <span className="text-sm text-neutral-800">Share on X</span>
                                        </button>
                                        <button onClick={() => window.open(shareLinks.facebook, '_blank')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                            <ArrowUpRight size={16} className="text-[#1877F2]" />
                                            <span className="text-sm text-neutral-800">Share on Facebook</span>
                                        </button>
                                        <button onClick={() => { navigator.clipboard.writeText(shareUrl); setShowShare(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                            <Link2 size={16} className="text-neutral-700" />
                                            <span className="text-sm text-neutral-800">Copy link for Instagram</span>
                                        </button>
                                        <button onClick={handleNativeShare} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                            <Share size={16} className="text-neutral-700" />
                                            <span className="text-sm text-neutral-800">System Share</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Excerpt */}
                            {post.excerpt && (
                                <div className="mb-8 pb-6 border-b border-neutral-200">
                                    <p className="text-lg leading-relaxed text-neutral-600 font-body">
                                        {post.excerpt}
                                    </p>
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed font-body text-lg"
                                    style={{
                                        lineHeight: '1.8',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                                />
                            </div>

                            {/* Footer Actions (compact) */}
                            <div className="mt-16 pt-12 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <button onClick={handleClap} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:border-[#dca744] hover:bg-[#dca744]/10 transition-all ${justClapped ? 'ring-2 ring-[#dca744]/40' : ''}`} aria-label="Clap">
                                        <ClapIcon className="w-5 h-5" />
                                        <span className="text-sm">{formatClaps(totalClaps)} Claps</span>
                                    </button>
                                    <div className="relative">
                                        <button onClick={() => setShowShare((v) => !v)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:border-[#236b7c] hover:bg-[#236b7c]/10 transition-all" aria-label="Share">
                                            <Share size={18} />
                                            <span className="text-sm">Share</span>
                                        </button>
                                        {showShare && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 shadow-xl rounded-lg overflow-hidden z-20">
                                                <div className="px-3 py-2 text-xs uppercase tracking-widest text-neutral-500 bg-neutral-50">Share</div>
                                                <button onClick={() => window.open(shareLinks.x, '_blank')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                                    <ArrowUpRight size={16} className="text-neutral-700" />
                                                    <span className="text-sm text-neutral-800">Share on X</span>
                                                </button>
                                                <button onClick={() => window.open(shareLinks.facebook, '_blank')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                                    <ArrowUpRight size={16} className="text-[#1877F2]" />
                                                    <span className="text-sm text-neutral-800">Share on Facebook</span>
                                                </button>
                                                <button onClick={() => { navigator.clipboard.writeText(shareUrl); setShowShare(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                                    <Link2 size={16} className="text-neutral-700" />
                                                    <span className="text-sm text-neutral-800">Copy link for Instagram</span>
                                                </button>
                                                <button onClick={handleNativeShare} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                                                    <Share size={16} className="text-neutral-700" />
                                                    <span className="text-sm text-neutral-800">System Share</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Related Products Section */}
                            {post.related_products && post.related_products.length > 0 && (
                                <div className="mt-16">
                                    <RelatedProducts
                                        productIds={post.related_products}
                                        context={post.category}
                                    />
                                </div>
                            )}

                            {/* Comments Section */}
                            <div className="mt-16">
                                <Comments postSlug={post.slug} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-8">
                                {/* Newsletter Signup */}
                                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                                    <h3 className="text-xl font-normal text-gray-900 mb-2 font-cutive">
                                        Weekly Home Ideas
                                    </h3>
                                    <p className="text-neutral-700 mb-4 text-sm leading-relaxed font-body">
                                        One thoughtful email a week—smart tips, weekend projects, and curated finds made for Nigerian homes.
                                    </p>
                                    <NewsletterForm variant="inline" source="post_sidebar" />
                                </div>

                                {/* Related Topics */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-xl font-normal text-gray-900 mb-6 font-cutive">
                                            Related Topics
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm border border-gray-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Back to Top */}
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="w-full bg-[#dca744] text-white px-6 py-3 rounded-xl hover:bg-[#c9963d] transition-all duration-300 font-medium font-body tracking-wide"
                                >
                                    Back to Top
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}