'use client';

import NewsletterForm from '@/components/NewsletterForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedPosts from '@/components/FeaturedPosts';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';

export default function Home() {
    return (
        <>
            <Header />
            <main className="bg-white">
                {/* Hero Section */}
                <Hero />
                <FeaturedPosts />
                {/* Featured Products Section */}
                <div id="featured-products">
                    <FeaturedProducts />
                </div>

                {/* Featured Posts Section */}
               

                {/* Newsletter Section */}
                <section id="newsletter" className="bg-white py-16 sm:py-20 md:py-24 border-t border-neutral-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="max-w-5xl mx-auto text-center">
                            <h2 className="font-cutive font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-900 !text-primary-900 mb-6 sm:mb-8 leading-tight">
                                Join Our Community
                            </h2>
                            <p className="font-body text-lg sm:text-xl text-primary-900 !text-primary-900 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto font-light">
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