import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterSplit() {
    return (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4 block">Stay Updated</span>
                        <h2 className="font-gilroy font-extra-bold text-3xl sm:text-4xl text-black mb-4">Design Newsletter</h2>
                        <p className="font-body font-light text-neutral-700 text-lg leading-relaxed max-w-md">
                            Weekly insights on small spaces, modern Nigerian living, and beautiful, functional homes.
                        </p>
                    </div>
                    <div>
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </section>
    );
} 