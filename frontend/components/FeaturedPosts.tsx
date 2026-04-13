'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

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
    category?: string;
}

export default function FeaturedPosts() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/posts?limit=6`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleImageError = (postId: string) => {
        setImageErrors(prev => ({
            ...prev,
            [postId]: true
        }));
    };

    const getImageSrc = (post: BlogPost) => {
        if (imageErrors[post.id] || !post.featured_image) {
            return '/images/blog/image1.jpg'; // Default fallback
        }
        return post.featured_image;
    };

    const isExternalImage = (src: string) => {
        return src.startsWith('http://') || src.startsWith('https://');
    };

    if (loading) {
        return (
            <section className="py-32 lg:py-40 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="mb-20 lg:mb-32">
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 w-64"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-200 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 w-full"></div>
                                    <div className="h-4 bg-gray-200 w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="py-32 lg:py-40 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="mb-20 lg:mb-32 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
                            Latest Stories
                        </p>
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                            From the journal
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:inline-block text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
                    >
                        View all
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                            <div className="space-y-6">
                                {/* Post Image */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                    {imageErrors[post.id] || !post.featured_image ? (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-gray-300 text-4xl font-light">
                                                {post.title.charAt(0)}
                                            </span>
                                        </div>
                                    ) : (
                                        <Image
                                            src={getImageSrc(post)}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={() => handleImageError(post.id)}
                                            unoptimized={isExternalImage(getImageSrc(post))}
                                        />
                                    )}
                                </div>

                                {/* Post Content */}
                                <div className="space-y-3">
                                    {/* Category */}
                                    {post.category && (
                                        <span className="inline-block text-xs text-gray-500 uppercase tracking-wider font-light">
                                            {post.category}
                                        </span>
                                    )}

                                    <h3 className="text-2xl font-light text-gray-900 leading-tight group-hover:text-gray-600 transition-colors duration-300">
                                        {post.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-sm text-gray-500 font-light">
                                        <span>{formatDate(post.published_at)}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{post.read_time}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-16 text-center md:hidden">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
                    >
                        View all stories
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
} 