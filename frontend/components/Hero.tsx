'use client';

import { Body, Container, PrimaryButton } from '@/components/ui/DesignSystem';
import { useState, useEffect } from 'react';
import { fetchFeaturedHeroPost } from '@/lib/api-client';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

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
    const [newsletterEmail, setNewsletterEmail] = useState('');
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
                setNewsletterEmail('');
                setTimeout(() => setNewsletterStatus('idle'), 5000);
            } else {
                setNewsletterStatus('error');
                setTimeout(() => setNewsletterStatus('idle'), 3000);
            }
        } catch (error) {
            setNewsletterStatus('error');
            setTimeout(() => setNewsletterStatus('idle'), 3000);
        }
    };

    // Skeleton loader while loading
    if (loading) {
        return (
            <section className="relative bg-white overflow-hidden pb-10">
                <Container className="relative z-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Skeleton for category badge */}
                        <div className="text-center mb-6">
                            <div className="inline-block h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                        </div>

                        {/* Skeleton for image - taller on mobile */}
                        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-xl overflow-hidden mb-10 bg-gray-200 animate-pulse" />

                        {/* Skeleton for title */}
                        <div className="text-center mb-6 space-y-3">
                            <div className="h-8 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
                            <div className="h-8 bg-gray-200 rounded-lg max-w-xl mx-auto animate-pulse" />
                        </div>

                        {/* Skeleton for excerpt */}
                        <div className="text-center mb-6 space-y-2">
                            <div className="h-5 bg-gray-200 rounded-lg max-w-3xl mx-auto animate-pulse" />
                            <div className="h-5 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
                        </div>

                        {/* Skeleton for metadata */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Skeleton for button */}
                        <div className="flex justify-center">
                            <div className="h-11 w-36 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <>
            {/* Featured Hero Section - Shows when content is featured */}
            {!loading && featuredPost && (
                <section className="relative bg-white overflow-hidden">
                    {/* Full-width Featured Image - starts at header, taller on mobile */}
                    <Link href={featuredPost.type === 'guide' ? `/guides/${featuredPost.slug}` : `/blog/${featuredPost.slug}`}>
                        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] cursor-pointer group overflow-hidden">
                            {featuredPost.featured_image ? (
                                <img
                                    src={featuredPost.featured_image}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <span className="text-gray-300 text-6xl font-light">
                                        {featuredPost.title.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Category and Headline Below Image */}
                    <Container className="relative z-10 mt-6 mb-10">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Category Badge */}
                            {featuredPost.category && (
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold tracking-wide uppercase rounded-full">
                                        {featuredPost.category}
                                    </span>
                                </div>
                            )}

                            {/* Minimal Headline with Read More */}
                            <Link href={featuredPost.type === 'guide' ? `/guides/${featuredPost.slug}` : `/blog/${featuredPost.slug}`}>
                                <div className="group">
                                    <h2 className="font-gilroy text-base md:text-lg lg:text-xl !font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-200 cursor-pointer leading-relaxed mb-3">
                                        {featuredPost.title}
                                    </h2>
                                    <div className="inline-flex items-center gap-2 text-sm text-gray-500 group-hover:text-[#236b7c] transition-colors duration-200">
                                        <span className="font-proza font-light">Read {featuredPost.type === 'guide' ? 'Guide' : 'Article'}</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Container>
                </section>
            )}

            {/* Default Hero Section - Newsletter focused with light gray background */}
            <section className={`relative overflow-hidden ${featuredPost ? 'pt-16 pb-20' : 'pt-20 pb-20'}`} style={{
                backgroundColor: '#E0E0E0'
            }}>
                <Container className="relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Left side - Content */}
                            <div className="text-left">
                                <h1 className="font-gilroy text-3xl md:text-4xl lg:text-5xl !font-semibold text-gray-800 leading-tight mb-6">
                                    <span className="block">Better Homes,</span>
                                    <span className="block text-gray-500">one email</span>
                                    <span className="block text-[#dca744]">at a time.</span>
                                </h1>

                                <p className="font-proza text-lg text-gray-600 font-light mb-8 leading-relaxed">
                                    Curated tips, décor ideas, and smart home finds—delivered free.                                </p>

                                {/* Newsletter Form */}
                                {newsletterStatus === 'success' ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">✓</span>
                                            <div>
                                                <h3 className="font-gilroy font-semibold text-green-900 mb-1">You're in!</h3>
                                                <p className="font-proza text-sm text-green-700 leading-relaxed">
                                                    We just sent you a welcome email. Check your inbox (and maybe spam folder) to confirm your subscription.
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
                                        }} className="flex flex-col sm:flex-row gap-3 mb-3">
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                disabled={newsletterStatus === 'loading'}
                                                placeholder="your@email.com"
                                                className="font-proza flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#236b7c] focus:border-transparent disabled:opacity-50"
                                            />
                                            <button
                                                type="submit"
                                                disabled={newsletterStatus === 'loading'}
                                                className="font-gilroy font-bold uppercase px-6 py-3 bg-[#dca744] text-gray-900 rounded-lg hover:bg-[#e6b85c] transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                            </button>
                                        </form>

                                        {newsletterStatus === 'error' && (
                                            <p className="font-proza text-sm text-red-600 font-light mb-3">
                                                Something went wrong. Mind trying again?
                                            </p>
                                        )}

                                        <p className="font-proza text-xs text-gray-500 font-light">
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Right side - Visual element or secondary CTA */}

                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}