"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Leaf, Shield, Zap, Wrench, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchPosts } from '@/lib/api-client';

// Category configurations with brand colors and clean styling
const CATEGORY_CONFIG: Record<string, {
    name: string;
    slug: string;
    color: string;
    bgColor: string;
    iconPath?: string;
    lucideIcon?: any;
    description: string;
    longDescription: string;
    heroImage: string;
    guides: Array<{
        title: string;
        description: string;
        slug: string;
    }>;
}> = {
    'cleaning': {
        name: 'Cleaning',
        slug: 'Cleaning',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        iconPath: '/icons/cleaning.png',
        description: 'Keep your home fresh and spotless with our cleaning tips, tricks, and product recommendations.',
        longDescription: 'A clean home is a better home. Find easy ways to organize your space, the Beta way.',
        heroImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&h=800&fit=crop',
        guides: [
            { title: 'The Complete Home Cleaning Schedule', description: 'A room-by-room guide to keeping your home spotless', slug: 'complete-home-cleaning-schedule' },
            { title: 'Natural Cleaning Solutions', description: 'Safe, effective cleaning with everyday ingredients', slug: 'natural-cleaning-solutions' },
            { title: 'Deep Cleaning Checklist', description: 'Seasonal deep cleaning for every room', slug: 'deep-cleaning-checklist' },
            { title: 'Stain Removal Guide', description: 'Remove any stain from any surface', slug: 'stain-removal-guide' }
        ]
    },
    'organization': {
        name: 'Organizing',
        slug: 'Organizing',
        color: '#dca744',
        bgColor: '#f8f9fa',
        iconPath: '/icons/organizing.png',
        description: 'Transform your space with smart organization solutions and decluttering strategies.',
        longDescription: 'Tired of the clutter? Get your home in order with simple habits that work for any space. Make your home better, the Beta way.',
        heroImage: 'https://res.cloudinary.com/ddh44ruog/image/upload/v1767036918/Wooden_Rattan_Dressers_hzrdkp.png',
        guides: [
            { title: 'Decluttering Your Whole Home', description: 'Room-by-room decluttering strategies', slug: 'decluttering-whole-home' },
            { title: 'Small Space Organization', description: 'Maximize storage in compact homes', slug: 'small-space-organization' },
            { title: 'Closet Organization System', description: 'Create a functional wardrobe system', slug: 'closet-organization-system' },
            { title: 'Kitchen Organization Guide', description: 'Organize your kitchen for efficiency', slug: 'kitchen-organization-guide' }
        ]
    },
    'life': {
        name: 'Home Life',
        slug: 'Life',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        iconPath: '/icons/homelife.png',
        description: 'Discover lifestyle tips, wellness advice, and ways to make your home a haven.',
        longDescription: 'Discover easy ways to stay healthy and feel good in your own home. Live better, the Beta way',
        heroImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop',
        guides: [
            { title: 'Creating a Wellness Routine', description: 'Daily habits for better living', slug: 'wellness-routine-guide' },
            { title: 'Home Meal Prep Guide', description: 'Efficient meal planning and prep', slug: 'home-meal-prep-guide' },
            { title: 'Work from Home Setup', description: 'Create a productive home office', slug: 'work-from-home-setup' },
            { title: 'Family Living Solutions', description: 'Harmonious living for families', slug: 'family-living-solutions' }
        ]
    },
    'decorating': {
        name: 'Decorating',
        slug: 'Decorating',
        color: '#dca744',
        bgColor: '#f8f9fa',
        iconPath: '/icons/decorating.png',
        description: 'Get inspired with beautiful decor ideas, color schemes, and styling tips for every room.',
        longDescription: 'Make your house a home you love. Learn simple ways to decorate and choose the best colors for your rooms. The Beta way.',
        heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop',
        guides: [
            { title: 'Color Scheme Selection', description: 'Choose perfect colors for every room', slug: 'color-scheme-selection' },
            { title: 'Budget Decorating Ideas', description: 'Beautiful decor on any budget', slug: 'budget-decorating-ideas' },
            { title: 'Room Layout Planning', description: 'Optimize your space layout', slug: 'room-layout-planning' },
            { title: 'Lighting Design Guide', description: 'Create ambiance with lighting', slug: 'lighting-design-guide' }
        ]
    },
    'energy-savings': {
        name: 'Energy Saving',
        slug: 'Energy Saving',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        iconPath: '/icons/energy.png',
        description: 'Save money and the planet with energy-efficient solutions and sustainable living tips.',
        longDescription: 'Stop worrying about high electricity bills. Discover how to choose the right appliances and use them smarter to save money every day. The Beta way',
        heroImage: 'https://res.cloudinary.com/ddh44ruog/image/upload/v1767040959/Energy-Saving-Tip-Cielo-1_rgw69z.jpg',
        guides: [
            { title: 'Solar Power for Homes', description: 'Complete guide to home solar systems', slug: 'solar-power-homes' },
            { title: 'Energy-Efficient Appliances', description: 'Choose appliances that save money', slug: 'energy-efficient-appliances' },
            { title: 'Home Insulation Guide', description: 'Keep your home comfortable year-round', slug: 'home-insulation-guide' },
            { title: 'Water Conservation Tips', description: 'Reduce water usage and bills', slug: 'water-conservation-tips' }
        ]
    },
    'security-safety': {
        name: 'Security & Safety',
        slug: 'Security & Safety',
        color: '#dca744',
        bgColor: '#f8f9fa',
        iconPath: '/icons/securitytech.png',
        description: 'Protect your home and family with security tips, safety guides, and peace of mind.',
        longDescription: 'A safe home is a happy home. Discover easy ways to watch over your house and keep your loved ones secure. The Beta way.',
        heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=800&fit=crop',
        guides: [
            { title: 'Home Security Checklist', description: 'Essential security measures for your home', slug: 'home-security-checklist' },
            { title: 'Fire Safety Planning', description: 'Protect your family from fire hazards', slug: 'fire-safety-planning' },
            { title: 'Child Safety at Home', description: 'Create a safe environment for children', slug: 'child-safety-home' },
            { title: 'Emergency Preparedness', description: 'Be ready for any emergency', slug: 'emergency-preparedness' }
        ]
    },
    'smart-tech': {
        name: 'Home Tech',
        slug: 'Home Tech',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        iconPath: '/icons/organizing.png',
        description: 'Upgrade your home with smart technology, gadgets, and innovative solutions.',
        longDescription: 'Home tech is for everyone. Get simple advice on the best devices to buy and how to use them to make your house better. The Beta way.',
        heroImage: 'https://images.unsplash.com/photo-1558089687-e1c6e5e8e6d0?w=1200&h=800&fit=crop',
        guides: [
            { title: 'Smart Home Starter Guide', description: 'Begin your smart home journey', slug: 'smart-home-starter' },
            { title: 'Home Automation Systems', description: 'Automate your daily routines', slug: 'home-automation-systems' },
            { title: 'Smart Security Solutions', description: 'Protect your home with technology', slug: 'smart-security-solutions' },
            { title: 'Energy Monitoring Tech', description: 'Track and reduce energy usage', slug: 'energy-monitoring-tech' }
        ]
    },
    'home-projects': {
        name: 'Home Projects',
        slug: 'Home Projects',
        color: '#dca744',
        bgColor: '#f8f9fa',
        iconPath: '/icons/homeprojects.png',
        description: 'DIY projects, renovations, and hands-on guides to improve your home.',
        longDescription: 'Get simple advice on how to fix common problems and build a more comfortable home. The Beta way.',
        heroImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&h=800&fit=crop',
        guides: [
            { title: 'DIY Home Renovation', description: 'Plan and execute home improvements', slug: 'diy-home-renovation' },
            { title: 'Basic Home Repairs', description: 'Fix common household problems', slug: 'basic-home-repairs' },
            { title: 'Garden & Outdoor Projects', description: 'Enhance your outdoor spaces', slug: 'garden-outdoor-projects' },
            { title: 'Tool Selection Guide', description: 'Choose the right tools for any job', slug: 'tool-selection-guide' }
        ]
    }
};

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.slug as string;
    const config = CATEGORY_CONFIG[categorySlug];

    const [posts, setPosts] = useState<any[]>([]);
    const [guides, setGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://betadomotweb-production.up.railway.app'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load posts
                const postsData = await fetchPosts();
                const filteredPosts = postsData.filter((post: any) => post.category === config?.slug);
                setPosts(filteredPosts);

                // Load guides for this category
                const guidesResponse = await fetch(`${API_BASE_URL}/guides/category/${categorySlug}?limit=4`);
                if (guidesResponse.ok) {
                    const guidesData = await guidesResponse.json();
                    setGuides(guidesData);
                }
            } catch (err) {
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (config) {
            loadData();
        }
    }, [config, categorySlug, API_BASE_URL]);

    if (!config) {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-32 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="font-cormorant text-4xl font-bold mb-4">Category Not Found</h1>
                        <Link href="/" className="font-proza text-[#236b7c] hover:underline">
                            Return Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section - Minimalist with Split Layout */}
                <section className="pt-24 pb-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-0 items-center">
                            {/* Left: Text Content */}
                            <div className="py-12 lg:py-20 lg:pr-16">
                                {/* Icon - Larger and fills container */}
                                <div
                                    className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-8 p-4"
                                    style={{
                                        backgroundColor: config.bgColor,
                                        border: `2px solid ${config.color}`
                                    }}
                                >
                                    {config.iconPath ? (
                                        <Image
                                            src={config.iconPath}
                                            alt={config.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : config.lucideIcon ? (
                                        <config.lucideIcon
                                            className="w-full h-full"
                                            style={{ color: config.color }}
                                            strokeWidth={1.5}
                                        />
                                    ) : null}
                                </div>

                                <h1 className="font-cormorant text-5xl lg:text-6xl font-bold mb-6 leading-tight text-black">
                                    {config.name}
                                </h1>

                                <p className="font-proza text-lg lg:text-xl text-black mb-8 leading-relaxed max-w-xl">
                                    {config.longDescription}
                                </p>

                                <div className="font-proza flex items-center gap-4 text-sm text-black">
                                    <span className="font-medium">{posts.length} Articles</span>
                                    
                                </div>
                            </div>

                            {/* Right: Hero Image */}
                            <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden">
                                <Image
                                    src={config.heroImage}
                                    alt={config.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Subtle overlay */}
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{ backgroundColor: config.color }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Guides Section - Only show if there are real guides */}
                {guides.length > 0 && (
                    <section
                        className="py-8"
                        style={{ backgroundColor: config.color }}
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="font-cormorant text-2xl font-bold text-black mb-6">
                                Our Top Guides
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {guides.map((guide) => (
                                    <Link
                                        key={guide.slug}
                                        href={`/guides/${guide.slug}`}
                                        className="bg-white rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer relative group no-underline"
                                    >
                                        {/* Arrow icon in top right corner */}
                                        <div
                                            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors group-hover:bg-black"
                                            style={{ backgroundColor: config.color }}
                                        >
                                            <ArrowUpRight className="w-3 h-3 text-black group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="font-gilroy font-semibold text-black pr-8 leading-tight text-xs no-underline">
                                            {guide.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Posts Grid */}
                <section className="max-w-7xl mx-auto px-6 py-16">
                    {loading ? (
                        <div className="text-center py-20">
                            <div
                                className="inline-block w-12 h-12 border-4 rounded-full animate-spin"
                                style={{
                                    borderColor: config.bgColor,
                                    borderTopColor: config.color
                                }}
                            />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20">
                            {config.iconPath ? (
                                <Image
                                    src={config.iconPath}
                                    alt={config.name}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 mx-auto mb-4 opacity-30"
                                />
                            ) : config.lucideIcon ? (
                                <config.lucideIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            ) : null}
                            <h3 className="font-cormorant text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
                            <p className="font-proza text-gray-600">Check back soon for new content!</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="font-cormorant text-3xl font-bold text-gray-900">
                                    Latest Articles
                                </h2>
                                <span className="font-proza text-sm text-gray-500">{posts.length} articles</span>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className="group"
                                    >
                                        <article className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-100">
                                            {post.featured_image && (
                                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={post.featured_image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="font-proza flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span>•</span>
                                                    <span>{post.read_time}</span>
                                                </div>

                                                <h3 className="font-cormorant text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:underline">
                                                    {post.title}
                                                </h3>

                                                <p className="font-proza text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>

                                                <div
                                                    className="font-gilroy font-semibold flex items-center group-hover:gap-3 gap-2 transition-all"
                                                    style={{ color: config.color }}
                                                >
                                                    <span>Read Article</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
