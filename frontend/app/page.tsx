'use client';

import NewsletterForm from '@/components/NewsletterForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedPosts from '@/components/FeaturedPosts';
import Button from '@/components/Button';

export default function Home() {
    return (
        <>
            <Header />
            <main className="bg-white">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32">
                    <div className="max-w-5xl">
                        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-brand-teal-500 mb-6 sm:mb-8 leading-tight">
                            Ideas and Insights
                            <br />
                            for a Better home.
                        </h1>
                        <p className="font-body text-lg sm:text-xl md:text-2xl text-brand-teal-700 mb-8 sm:mb-12 md:mb-16 leading-relaxed max-w-4xl">
                            Where you find tips, insights, and creative ideas to transform how your home looks, feels, and functions
                        </p>
                        <Button href="/blog" size="lg">
                            Explore Ideas
                        </Button>
                    </div>
                </section>

                {/* Featured Posts Section */}
                <FeaturedPosts />

                {/* Newsletter Section */}
                <section id="newsletter" className="bg-brand-teal-500 py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="max-w-5xl">
                            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 sm:mb-8 leading-tight">
                                Join Our Community
                            </h2>
                            <p className="font-body text-lg sm:text-xl text-brand-teal-100 mb-8 sm:mb-12 leading-relaxed max-w-3xl">
                                Receive weekly inspiration, thoughtful tips, and exclusive content delivered to your inbox.
                            </p>

                            <NewsletterForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
} 