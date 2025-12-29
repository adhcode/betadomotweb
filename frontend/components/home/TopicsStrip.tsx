import Link from 'next/link';

export default function TopicsStrip({ topics = [] as string[] }) {
    if (!topics || topics.length === 0) return null;

    return (
        <section className="py-4 sm:py-6 bg-white border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                    <span className="font-gilroy text-xs tracking-[0.2em] uppercase text-neutral-500 shrink-0 pr-2">
                        Topics
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {topics.slice(0, 8).map((topic, idx) => (
                            <Link
                                key={`${topic}-${idx}`}
                                href={`/blog?tag=${encodeURIComponent(topic)}`}
                                className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-50 hover:bg-[#dca744]/10 border border-neutral-200 hover:border-[#dca744]/30 text-neutral-700 hover:text-[#dca744] rounded-full text-xs sm:text-sm transition-colors font-gilroy whitespace-nowrap"
                            >
                                {topic}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
} 