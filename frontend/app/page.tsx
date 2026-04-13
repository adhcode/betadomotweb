import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import CategoryStories from '@/components/home/CategoryStories';
import FeaturedGuidelines from '@/components/home/FeaturedGuidelines';

export default function Home() {
    return (
        <main>
            {/* Hero Section - Full screen editorial cover */}
            <Hero />

            {/* Featured Blog Posts */}
            <FeaturedPosts />

            {/* Category Navigation */}
            <CategoryStories />

            {/* Featured Guides */}
            <FeaturedGuidelines />
        </main>
    );
}
