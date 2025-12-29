import Link from 'next/link';

export default function PopularNow({ posts = [] as { title: string; slug: string }[] }) {
    if (!posts.length) return null;
    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                    <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-gilroy font-light">Popular Now</span>
                    <h3 className="text-xl sm:text-2xl font-gilroy font-extra-bold text-black mt-2">Trending Reads</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {posts.slice(0, 3).map((p) => (
                        <Link key={p.slug} href={`/blog/${p.slug}`} className="block border border-neutral-200 p-4 sm:p-5 bg-white hover:border-[#236b7c] transition-colors rounded-lg">
                            <h4 className="text-base sm:text-lg font-gilroy font-extra-bold text-black mb-2 line-clamp-3 leading-tight">{p.title}</h4>
                            <span className="text-sm text-[#236b7c] font-gilroy font-medium">Read more</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
} 