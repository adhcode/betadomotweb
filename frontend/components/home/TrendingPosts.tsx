import Link from 'next/link';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    views?: number;
}

export default function TrendingPosts({ posts = [], title = 'Trending' }: { posts: BlogPost[]; title?: string; }) {
    if (!posts || posts.length === 0) return null;

    const sorted = [...posts]
        .filter(Boolean)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    if (sorted.length === 0) return null;

    return (
        <section className="py-6 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2" />
                    <aside className="lg:col-span-1">
                        <div className="border border-neutral-200 p-6 bg-white">
                            <h3 className="font-gilroy font-extra-bold text-xl text-black mb-4">{title}</h3>
                            <ol className="space-y-3 list-decimal list-inside">
                                {sorted.map((p) => (
                                    <li key={p.id} className="leading-snug">
                                        <Link href={`/blog/${p.slug}`} className="font-body text-neutral-700 hover:text-[#236b7c] transition-colors">
                                            {p.title}
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
} 