import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterHero() {
    return (
        <section className="py-8 sm:py-10 lg:py-12 bg-neutral-50 border-y border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-gilroy font-light">Newsletter</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-gilroy font-extra-bold text-black mt-2 mb-3 sm:mb-4 leading-tight">
                    We'll send you beautiful, useful finds for your home
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mt-2 max-w-xl lg:max-w-2xl mx-auto leading-relaxed font-gilroy font-light px-4 sm:px-0">
                    Weekly ideas for homes that breathe, save, and belong—plus the best curated finds we discover in Nigerian stores.
                </p>
                <div className="mt-4 sm:mt-6 max-w-sm sm:max-w-xl mx-auto px-4 sm:px-0">
                    <NewsletterForm variant="inline" source="hero_inline" />
                </div>
            </div>
        </section>
    );
} 