import Link from 'next/link';

interface PillarCardProps {
    title: string;
    slug: string;
    description: string;
    filter?: string;
    posts?: { title: string; slug: string }[];
}

function PillarCard({ title, slug, description, filter, posts = [] }: PillarCardProps) {
    const href = `/blog?category=${encodeURIComponent(filter || title)}`;
    return (
        <Link href={href} className="group block border border-neutral-200 bg-white p-6 hover:border-[#dca744] transition-colors">
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-gilroy font-extra-bold text-black mb-2">{title}</h3>
                <span className="text-xs text-neutral-500">Explore</span>
            </div>
            <p className="text-neutral-700 text-sm mb-4">{description}</p>
            {posts.length > 0 && (
                <ul className="space-y-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    {posts.slice(0, 2).map((p) => (
                        <li key={p.slug} className="text-sm text-[#236b7c] hover:underline" style={{ textDecorationColor: '#dca744' }}>{p.title}</li>
                    ))}
                </ul>
            )}
        </Link>
    );
}

export default function CategoryShowcase({
    data,
}: {
    data: Array<{
        title: string;
        slug: string;
        description: string;
        filter?: string;
        posts?: { title: string; slug: string }[];
    }>;
}) {
    if (!data || data.length === 0) return null;
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-8">
                    <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3 block">Category Showcase</span>
                    <h2 className="font-gilroy font-extra-bold text-3xl sm:text-4xl text-black">The Pillars</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.map((item) => (
                        <PillarCard key={item.slug} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
} 