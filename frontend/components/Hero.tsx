'use client';

import { useState, useEffect } from 'react';
import { fetchFeaturedHeroPost } from '@/lib/api-client';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedPost {
    slug: string;
    title: string;
    excerpt: string;
    featured_image?: string;
    read_time: string;
    category?: string;
    published_at: string;
    type?: 'post' | 'guide';
}

export default function Hero() {
    const [featuredPost, setFeaturedPost] = useState<FeaturedPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const loadFeaturedPost = async () => {
            try {
                const post = await fetchFeaturedHeroPost();
                setFeaturedPost(post);
            } catch (error) {
                console.error('Failed to load featured hero post:', error);
            } finally {
                setLoading(false);
            }
        };
        loadFeaturedPost();
    }, []);

    const handleNewsletterSubmit = async (email: string) => {
        setNewsletterStatus('loading');

        try {
            const apiUrl = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';

            const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'hero_section' })
            });

            if (response.ok) {
                setNewsletterStatus('success');
                setTimeout(() => setNewsletterStatus('idle'), 5000);
            } else {
                setNewsletterStatus('error');
                setTimeout(() => setNewsletterStatus('idle'), 3000);
            }
        } catch {
            setNewsletterStatus('error');
            setTimeout(() => setNewsletterStatus('idle'), 3000);
        }
    };

    // Skeleton loader while loading
    if (loading) {
        return (
            <section className="relative">
                <div className="w-full h-screen bg-gray-200 animate-pulse" />
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="h-20 bg-gray-200 animate-pulse w-96"></div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Featured Hero Story - Shows when content is featured */}
            {!loading && featuredPost && (
                <section className="relative">
                    {/* Hero Image - Reduced height */}
                    <Link href={featuredPost.type === 'guide' ? `/guides/${featuredPost.slug}` : `/blog/${featuredPost.slug}`}>
                        <div className="relative w-full h-[70vh] md:h-[80vh] group cursor-pointer">
                            {featuredPost.featured_image ? (
                                <Image
                                    src={featuredPost.featured_image}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                    sizes="100vw"
                                />
                            ) : (
                                <Image
                                    src="/images/blog/hero.png"
                                    alt="Better Homes"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                    sizes="100vw"
                                />
                            )}
                        </div>
                    </Link>

                    {/* Title Below Image - Editorial Style */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                        {featuredPost.category && (
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-light mb-6">
                                {featuredPost.category}
                            </p>
                        )}
                        <Link href={featuredPost.type === 'guide' ? `/guides/${featuredPost.slug}` : `/blog/${featuredPost.slug}`}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 leading-tight hover:text-gray-600 transition-colors">
                                {featuredPost.title}
                            </h1>
                        </Link>
                        {featuredPost.read_time && (
                            <p className="text-sm text-gray-500 font-light mt-6">
                                {featuredPost.read_time}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Default Hero - Only shows when no featured post */}
            {!loading && !featuredPost && (
                <section className="relative">
                    {/* Hero Image - Reduced height */}
                    <div className="relative w-full h-[70vh] md:h-[80vh]">
                        <Image
                            src="/images/blog/hero.png"
                            alt="Better Homes"
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                    </div>

                    {/* Title Below Image - Editorial Style */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900">
                            Better Homes
                        </h1>
                    </div>
                </section>
            )}

            {/* Newsletter Section - Clean and Minimal */}
            <section className="py-32 lg:py-40 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
                        Stay Inspired
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-relaxed mb-8">
                        Curated tips, décor ideas, and smart home finds—delivered free
                    </h2>

                    {newsletterStatus === 'success' ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-4">
                            <div className="flex items-start gap-3 justify-center">
                                <span className="text-2xl">✓</span>
                                <div className="text-left">
                                    <h3 className="font-light text-gray-900 mb-1 text-lg">You&apos;re in</h3>
                                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                                        Check your inbox to confirm your subscription
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const email = (e.target as HTMLFormElement).email.value;
                                handleNewsletterSubmit(email);
                            }} className="flex flex-col sm:flex-row gap-3 mb-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    disabled={newsletterStatus === 'loading'}
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 font-light"
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterStatus === 'loading'}
                                    className="px-8 py-3 bg-[#dca744] text-gray-900 hover:bg-[#e6b85c] transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm tracking-wide"
                                >
                                    {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>

                            {newsletterStatus === 'error' && (
                                <p className="text-sm text-red-600 font-light mb-3">
                                    Something went wrong. Please try again
                                </p>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
