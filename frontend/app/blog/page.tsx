"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time: string;
    featured_image: string;
    tags: string[];
    views: number;
}

export default function BlogPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/posts');

                if (!response.ok) {
                    throw new Error(`Failed to fetch posts: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();

        return () => clearTimeout(timer);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleImageError = (postId: string) => {
        console.log('❌ Image failed to load for post:', postId);
        setImageErrors(prev => ({
            ...prev,
            [postId]: true
        }));
    };

    const getImageSrc = (post: BlogPost) => {
        console.log('🔍 Getting image src for post:', post.id, 'featured_image:', post.featured_image);
        if (imageErrors[post.id] || !post.featured_image) {
            console.log('⚠️ Using fallback image for post:', post.id);
            return '/images/blog/image1.jpg'; // Default fallback
        }
        console.log('✅ Using featured image for post:', post.id, 'URL:', post.featured_image);
        return post.featured_image;
    };

    const isExternalImage = (src: string) => {
        const isExternal = src.startsWith('http://') || src.startsWith('https://');
        console.log('🌐 Checking if external image:', src, 'Result:', isExternal);
        return isExternal;
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
                        <div className="animate-pulse">
                            <div className="text-center mb-16">
                                <div className="h-12 bg-neutral-200 rounded w-64 mx-auto mb-8"></div>
                                <div className="h-6 bg-neutral-200 rounded w-96 mx-auto"></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                                <div className="h-96 bg-neutral-200 rounded"></div>
                                <div className="space-y-6">
                                    <div className="h-8 bg-neutral-200 rounded"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                                    <div className="h-20 bg-neutral-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 text-center">
                        <h1 className="font-gilroy font-extra-bold text-4xl text-black mb-8">Unable to Load Posts</h1>
                        <p className="font-gilroy text-lg text-black mb-8">{error}</p>
                        <p className="font-gilroy text-sm text-black mb-8">
                            Please make sure the backend server is running on localhost:8080
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center text-black hover:text-[#236b7c] transition-colors duration-300 font-gilroy tracking-wide"
                        >
                            Back to Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Rest of the component remains the same but with updated font classes
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Page Header */}
                <section className="pt-24 pb-16">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
                        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6 block">
                                Latest Stories
                            </span>
                            <h1 className="font-gilroy font-extra-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black mb-8 leading-tight tracking-tight">
                                The Journal
                            </h1>
                            <p className="font-gilroy font-light text-lg text-black max-w-2xl mx-auto leading-relaxed">
                                Thoughtful perspectives on design, practical living wisdom, and stories that inspire beautiful spaces.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured Post */}
                {featuredPost && (
                    <section className="pb-16">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <Link
                                href={`/blog/${featuredPost.slug}`}
                                className="group block bg-white hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                                    <div className="order-2 lg:order-1">
                                        <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-8 block">
                                            Featured Story
                                        </span>

                                        <div className="flex items-center gap-6 text-sm mb-6">
                                            <span className="font-gilroy font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                {formatDate(featuredPost.published_at)}
                                            </span>
                                            <span className="font-gilroy font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                {featuredPost.read_time}
                                            </span>
                                        </div>

                                        <h2 className="font-gilroy font-extra-bold text-3xl sm:text-4xl lg:text-5xl text-black leading-tight tracking-tight group-hover:text-[#236b7c] transition-colors duration-300">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="font-gilroy font-light text-lg text-black leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center text-[#dca744] font-gilroy tracking-wide group-hover:text-[#236b7c] transition-colors duration-300">
                                            <span>Read Full Story</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    <div className="order-1 lg:order-2">
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            {imageErrors[featuredPost.id] || !featuredPost.featured_image ? (
                                                <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                                                    <div className="text-center text-neutral-400">
                                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="font-gilroy text-sm">Image not available</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={getImageSrc(featuredPost)}
                                                    alt={featuredPost.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={() => handleImageError(featuredPost.id)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Other Posts */}
                {otherPosts.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                                {otherPosts.map((post, index) => (
                                    <article key={post.id} className="group">
                                        <Link href={`/blog/${post.slug}`} className="block">
                                            <div className="space-y-6">
                                                <div className="aspect-[4/3] relative overflow-hidden">
                                                    {imageErrors[post.id] || !post.featured_image ? (
                                                        <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                                                            <div className="text-center text-neutral-400">
                                                                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <p className="text-xs font-light">No image</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={getImageSrc(post)}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={() => handleImageError(post.id)}
                                                        />
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="font-gilroy font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                            {formatDate(post.published_at)}
                                                        </span>
                                                        <span className="font-gilroy font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                            {post.read_time}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-gilroy font-extra-bold text-xl sm:text-2xl text-black leading-tight tracking-tight group-hover:text-[#236b7c] transition-colors duration-300">
                                                        {post.title}
                                                    </h3>

                                                    <p className="font-gilroy font-light text-black leading-relaxed line-clamp-2">
                                                        {post.excerpt}
                                                    </p>

                                                    <button className="w-full text-[#dca744] hover:text-[#236b7c] transition-colors duration-300 flex items-center justify-center gap-2 font-medium py-2 group">
                                                        <span>Read More</span>
                                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Newsletter CTA Section */}
                <section className="py-16 bg-neutral-50">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                        <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6 block">
                            Stay Updated
                        </span>
                        <h2 className="font-gilroy font-extra-bold text-3xl sm:text-4xl text-black mb-4">
                            Design Newsletter
                        </h2>
                        <p className="font-gilroy font-light text-lg text-black max-w-lg mx-auto">
                            Get the latest interior design trends and tips delivered to your inbox.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
} 