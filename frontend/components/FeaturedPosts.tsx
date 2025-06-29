import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import Button from '@/components/Button';

export default function FeaturedPosts() {
    const featuredPosts = blogPosts.slice(0, 3);

    return (
        <section className="bg-gradient-to-br from-gray-50 to-brand-ivory-50 py-16 sm:py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-12 sm:mb-16 md:mb-20">
                    <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-teal-500 mb-6 sm:mb-8">
                        From the Journal
                    </h2>
                    <p className="font-body text-lg sm:text-xl text-brand-teal-700 max-w-3xl leading-relaxed">
                        Thoughtful perspectives on home design, practical living wisdom, and stories that inspire beautiful spaces.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                    {featuredPosts.map((post) => (
                        <article key={post.id} className="card group overflow-hidden hover:border-brand-teal-300">
                            <Link href={`/blog/${post.id}`} className="block">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                                    <div className="flex items-center text-sm text-brand-teal-500 font-medium">
                                        <time>{post.date}</time>
                                        <span className="mx-3 text-brand-orange-400">•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="font-heading font-semibold text-xl sm:text-2xl text-brand-teal-600 group-hover:text-brand-orange-500 transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="font-body text-brand-teal-700 leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-brand-orange-500 font-body font-medium">
                                        Read Article
                                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="mt-12 sm:mt-16 md:mt-20">
                    <Button href="/blog">
                        View All Articles
                    </Button>
                </div>
            </div>
        </section>
    );
} 