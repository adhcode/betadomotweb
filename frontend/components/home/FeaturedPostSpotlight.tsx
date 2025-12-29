import Link from 'next/link';
import Image from 'next/image';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time?: string;
    featured_image?: string;
    tags?: string[];
    views?: number;
}

export default function FeaturedPostSpotlight({ post }: { post: BlogPost }) {
    if (!post) return null;

    return (
        <section className="pt-20 sm:pt-28 pb-8 sm:pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4 sm:mb-6 block">
                                Featured Story
                            </span>
                            <h1 className="font-gilroy font-extra-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-black leading-tight tracking-tight mb-3 sm:mb-4 group-hover:text-[#236b7c] transition-colors">
                                {post.title}
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-sm text-neutral-600 mb-4 sm:mb-6">
                                <span className="font-gilroy font-light tracking-[0.1em] uppercase text-xs sm:text-sm">
                                    {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                {post.read_time && (
                                    <span className="font-gilroy font-light tracking-[0.1em] uppercase text-xs sm:text-sm">{post.read_time}</span>
                                )}
                            </div>
                            <p className="font-gilroy font-light text-base sm:text-lg text-neutral-700 leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                                {post.excerpt}
                            </p>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="px-2 sm:px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-gilroy tracking-wide border border-neutral-200 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] relative overflow-hidden border border-neutral-200 bg-neutral-50 rounded-lg">
                                {post.featured_image ? (
                                    <Image
                                        src={post.featured_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                                        <div className="text-center text-neutral-400">
                                            <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs font-light">Image not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
} 