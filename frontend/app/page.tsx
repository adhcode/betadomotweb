import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import NewsletterSection from '@/components/NewsletterSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryStories from '@/components/home/CategoryStories';
import FeaturedGuidelines from '@/components/home/FeaturedGuidelines';

export default function Home() {
    return (
        <>
            <Header />
            <main className="bg-white">
                {/* Hero Section with Grid Background */}
                                

                <Hero />

                {/* Featured Blog Section */}
<FeaturedPosts />
                {/* Hub Categories Stories */}
                <CategoryStories />

                {/* Featured Guides Section */}
                <FeaturedGuidelines />

                {/* Newsletter Section with Grid Background */}
            </main>
            <Footer />
        </>
    );
}