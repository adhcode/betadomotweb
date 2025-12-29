import Link from 'next/link';
import Image from 'next/image';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    published_at: string;
    read_time?: string;
    featured_image?: string;
    tags?: string[];
}

export default function LatestPosts({ posts = [], title = 'Latest', limit = 6 }: { posts: BlogPost[]; title?: string; limit?: number; }) {
    if (!posts || posts.length === 0) return null;
    const shown = posts.slice(0, limit);

    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10">
                    <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3 sm:mb-4 block">{title}</span>
                    <h2 className="font-gilroy font-extra-bold text-2xl sm:text-3xl lg:text-4xl text-black">Recent Stories</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {shown.map((post) => (
                        <article key={post.id} className="group">
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50 border border-neutral-200 rounded-lg">
                                        {post.featured_image ? (
                                            <Image src={post.featured_image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                                        )}
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                                            <span className="font-gilroy font-light text-neutral-500 tracking-[0.1em] uppercase">
                                                {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            {post.read_time && (
                                                <span className="font-gilroy font-light text-neutral-500 tracking-[0.1em] uppercase">{post.read_time}</span>
                                            )}
                                        </div>

                                        <h3 className="font-gilroy font-extra-bold text-lg sm:text-xl lg:text-2xl text-black leading-tight group-hover:text-[#236b7c] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="font-gilroy font-light text-sm sm:text-base text-neutral-700 leading-relaxed line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
} 