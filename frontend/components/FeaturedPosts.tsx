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
}

export default function FeaturedPosts() {
    const [isVisible, setIsVisible] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

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
            <section className="py-20 sm:py-24 md:py-32 bg-white border-t border-neutral-200 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center mb-16 sm:mb-20">
                        <div className="animate-pulse">
                            <div className="h-4 bg-neutral-200 rounded w-24 mx-auto mb-6"></div>
                            <div className="h-12 bg-neutral-200 rounded w-64 mx-auto mb-8"></div>
                            <div className="h-6 bg-neutral-200 rounded w-96 mx-auto"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/3] bg-neutral-200 rounded mb-6"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-neutral-200 rounded w-32"></div>
                                    <div className="h-6 bg-neutral-200 rounded w-full"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
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
        <section className="py-20 sm:py-24 md:py-32 bg-white border-t border-neutral-200 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.015]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #0A0A0A 1px, transparent 0)`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <div className={`transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}>
                        <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6 block">
                            Latest Stories
                        </span>
                        <h2 className="font-cutive font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-900 mb-8 leading-tight tracking-tight">
                            From the Journal
                        </h2>
                        <p className="font-body font-light text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                            Thoughtful perspectives on home design, practical living wisdom, and stories that inspire beautiful spaces
                        </p>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-16">
                    {posts.map((post, index) => (
                        <article
                            key={post.id}
                            className={`group transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="bg-white border border-neutral-200 overflow-hidden hover:border-[#dca744] transition-all duration-500 hover:shadow-lg hover:shadow-black/5">
                                <Link href={`/blog/${post.slug}`} className="block">
                                    {/* Post Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
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
                                    <div className="p-8 space-y-4">
                                        <div className="flex items-center text-sm">
                                            <span className="font-body font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                {formatDate(post.published_at)}
                                            </span>
                                            <span className="mx-2 text-neutral-300">•</span>
                                            <span className="font-body font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                {post.read_time}
                                            </span>
                                        </div>

                                        <h3 className="font-cutive font-normal text-xl sm:text-2xl text-primary-900 leading-tight tracking-tight group-hover:text-[#236b7c] transition-colors duration-300">
                                            {post.title}
                                        </h3>

                                        <p className="font-body font-light text-neutral-600 leading-relaxed line-clamp-2">
                                            {post.excerpt}
                                        </p>

                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {post.tags.slice(0, 2).map((tag, tagIndex) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-body tracking-wide rounded-none hover:bg-[#dca744] hover:text-white transition-colors duration-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center text-[#dca744] font-body tracking-wide group-hover:text-[#236b7c] transition-colors duration-300 pt-2">
                                            <span className="mr-2">Read More</span>
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View All Button */}
                <div className={`text-center transition-all duration-1200 ease-out delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}>
                    <Link
                        href="/blog"
                        className="inline-flex items-center bg-primary-900 text-white px-8 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-all duration-300 group"
                    >
                        <span className="mr-3">View All Stories</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    );
} 