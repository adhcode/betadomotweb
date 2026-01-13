'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { H2, H3, Body, MonoText, FadeInUp } from '@/components/ui/DesignSystem';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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
                const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/posts?limit=3`);
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
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                    <div className="mb-16">
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                                    <div className="h-6 bg-gray-200 rounded-lg w-full"></div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
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
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                <FadeInUp delay={0}>
                    <div className="mb-16 flex items-center justify-between">
                        <h2 className="font-gilroy text-3xl md:text-4xl !font-semibold text-gray-800 leading-tight tracking-tight">
                            Latest Stories
                        </h2>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors duration-200"
                        >
                            See more
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </FadeInUp>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {posts.map((post, index) => (
                        <FadeInUp key={post.id} delay={index * 100}>
                            <Link href={`/blog/${post.slug}`} className="group block h-full">
                                <div className="flex flex-col h-full">
                                    {/* Post Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 mb-6 rounded-lg flex-shrink-0">
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
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={() => handleImageError(post.id)}
                                                unoptimized={isExternalImage(getImageSrc(post))}
                                            />
                                        )}
                                        
                                        {/* Subtle Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        
                                        {/* Centered Arrow Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-14 h-14 rounded-full bg-[#dca744] flex items-center justify-center shadow-md">
                                                <ArrowUpRight className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="flex flex-col flex-grow">
                                        {/* Category */}
                                        {post.category && (
                                            <span className="font-gilroy font-semibold inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs tracking-wide uppercase rounded-full mb-4 self-start">
                                                {post.category}
                                            </span>
                                        )}

                                        <h3 className="font-gilroy text-xl !font-semibold text-gray-800 leading-tight group-hover:text-gray-600 transition-colors duration-300 mb-4 flex-grow">
                                            {post.title}
                                        </h3>

                                        <div className="font-proza flex items-center gap-4 text-gray-400 text-sm font-light mt-auto">
                                            <span>{formatDate(post.published_at)}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span>{post.read_time}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeInUp>
                    ))}
                </div>
            </div>
        </section>
    );
} 