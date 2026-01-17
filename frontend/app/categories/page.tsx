"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/DesignSystem';
import { fetchPosts } from '@/lib/api-client';

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    featured_image?: string;
    published_at: string;
    read_time?: string;
    category: string;
}

interface CategoryConfig {
    name: string;
    slug: string;
    iconPath: string;
    color: string;
    bgColor: string;
    description: string;
}

const CATEGORIES: CategoryConfig[] = [
    {
        name: 'Cleaning',
        slug: 'cleaning',
        iconPath: '/icons/cleaning.png',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        description: 'Keep your home fresh and spotless with our cleaning tips and tricks.'
    },
    {
        name: 'Organizing',
        slug: 'organization',
        iconPath: '/icons/organizing.png',
        color: '#dca744',
        bgColor: '#f8f9fa',
        description: 'Transform your space with smart organization solutions.'
    },
    {
        name: 'Life',
        slug: 'life',
        iconPath: '/icons/homelife.png',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        description: 'Discover lifestyle tips and ways to make your home a haven.'
    },
    {
        name: 'Decorating',
        slug: 'decorating',
        iconPath: '/icons/decorating.png',
        color: '#dca744',
        bgColor: '#f8f9fa',
        description: 'Get inspired with beautiful decor ideas and styling tips.'
    },
    {
        name: 'Energy Savings',
        slug: 'energy-savings',
        iconPath: '/icons/energy.png',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        description: 'Save money and the planet with energy-efficient solutions.'
    },
    {
        name: 'Security & Safety',
        slug: 'security-safety',
        iconPath: '/icons/securitytech.png',
        color: '#dca744',
        bgColor: '#f8f9fa',
        description: 'Protect your home and family with security tips and safety guides.'
    },
    {
        name: 'Home Tech',
        slug: 'smart-tech',
        iconPath: '/icons/organizing.png',
        color: '#236b7c',
        bgColor: '#f8f9fa',
        description: 'Upgrade your home with smart technology and innovative solutions.'
    },
    {
        name: 'Home Projects',
        slug: 'home-projects',
        iconPath: '/icons/homeprojects.png',
        color: '#dca744',
        bgColor: '#f8f9fa',
        description: 'DIY projects and hands-on guides to improve your home.'
    }
];

export default function CategoriesPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const postsData = await fetchPosts();
                setPosts(postsData);
            } catch (err) {
                console.error('Error loading posts:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    const getPostsByCategory = (categoryName: string) => {
        return posts
            .filter(post => post.category === categoryName)
            .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
            .slice(0, 3); // Show max 3 posts per category
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="pt-32 pb-12">
                    <Container>
                        <h1 className="font-gilroy text-5xl lg:text-6xl !font-semibold mb-12 text-black">
                            Articles
                        </h1>
                        
                        {/* Category Icons Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-16">
                            {CATEGORIES.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                                >
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: category.bgColor }}
                                    >
                                        <Image
                                            src={category.iconPath}
                                            alt={category.name}
                                            width={28}
                                            height={28}
                                            className="w-7 h-7 object-contain"
                                        />
                                    </div>
                                    <span className="font-proza text-sm text-gray-900">
                                        {category.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Categories with Posts */}
                <section className="pb-20">
                    <Container>
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {CATEGORIES.map((category) => {
                                const categoryPosts = getPostsByCategory(category.name);
                                
                                // Skip categories with no posts
                                if (categoryPosts.length === 0) return null;
                                
                                return (
                                    <div key={category.slug} className="space-y-6">
                                        {/* Category Header - Simple text with View All */}
                                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                            <h2 className="font-gilroy text-3xl lg:text-4xl font-bold text-black">
                                                {category.name}
                                            </h2>

                                            {/* View All Link */}
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="font-gilroy font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm"
                                                style={{ color: category.color }}
                                            >
                                                <span>View All</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>

                                        {/* Posts Grid */}
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {categoryPosts.map((post) => (
                                                <Link
                                                    key={post.id}
                                                    href={`/blog/${post.slug}`}
                                                    className="group"
                                                >
                                                    <article className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-100">
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

                                                        <div className="p-5">
                                                            <div className="font-proza flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                                <span>
                                                                    {new Date(post.published_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                                {post.read_time && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{post.read_time}</span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <h3 className="font-gilroy text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:underline">
                                                                {post.title}
                                                            </h3>

                                                            <p className="font-proza text-gray-600 text-sm line-clamp-2">
                                                                {post.excerpt}
                                                            </p>
                                                        </div>
                                                    </article>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    </Container>
                </section>
            </main>
            <Footer />
        </>
    );
}
