'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeInUp } from '@/components/ui/DesignSystem';
import Image from 'next/image';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://betadomotweb-production.up.railway.app'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time?: string;
    featured_image?: string;
    tags?: string[];
    views?: number;
    category?: string;
}

interface CategoryConfig {
    name: string;
    slug: string;
    iconPath?: string;
    lucideIcon?: any;
    color: string;
    bgColor: string;
}

const categoryConfigs: CategoryConfig[] = [
    {
        name: 'Cleaning',
        slug: 'cleaning',
        iconPath: '/icons/cleaning.png',
        color: '#236b7c',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Organizing',
        slug: 'organization',
        iconPath: '/icons/organizing.png',
        color: '#dca744',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Life',
        slug: 'life',
        iconPath: '/icons/homelife.png',
        color: '#236b7c',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Decorating',
        slug: 'decorating',
        iconPath: '/icons/decorating.png',
        color: '#dca744',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Energy Savings',
        slug: 'energy-savings',
        iconPath: '/icons/energy.png',
        color: '#236b7c',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Safety',
        slug: 'security-safety',
        iconPath: '/icons/securitytech.png',
        color: '#dca744',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Smart & Tech',
        slug: 'smart-tech',
        iconPath: '/icons/organizing.png',
        color: '#236b7c',
        bgColor: '#f8f9fa'
    },
    {
        name: 'Home Projects',
        slug: 'home-projects',
        iconPath: '/icons/homeprojects.png',
        color: '#dca744',
        bgColor: '#f8f9fa'
    }
];

export default function CategoryStories() {
    const [categoryPosts, setCategoryPosts] = useState<{ [key: string]: BlogPost | null }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategoryPosts() {
            try {
                const res = await fetch(`${API_BASE_URL}/posts`);
                if (!res.ok) {
                    setCategoryPosts({});
                    return;
                }

                const allPosts: BlogPost[] = await res.json();
                const posts: { [key: string]: BlogPost | null } = {};

                // Get the most recent post for each category
                categoryConfigs.forEach(config => {
                    const categoryPosts = allPosts.filter(post =>
                        post.category === config.name
                    );

                    if (categoryPosts.length > 0) {
                        // Sort by published date and get the most recent
                        const sortedPosts = categoryPosts.sort((a, b) =>
                            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
                        );
                        posts[config.name] = sortedPosts[0];
                    } else {
                        posts[config.name] = null;
                    }
                });

                setCategoryPosts(posts);
            } catch (error) {
                console.error('Failed to fetch category posts:', error);
                setCategoryPosts({});
            } finally {
                setLoading(false);
            }
        }

        fetchCategoryPosts();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                    <div className="mb-16">
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="animate-pulse p-6 bg-white border border-gray-200 rounded-xl">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-xl"></div>
                                    <div className="h-5 bg-gray-200 rounded w-20 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                <FadeInUp delay={0}>
                    <div className="mb-16">
                        <h2 className="font-cormorant text-3xl md:text-4xl font-normal text-gray-800 leading-tight tracking-tight">
                            Read by category
                        </h2>
                    </div>
                </FadeInUp>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 lg:gap-8">
                    {categoryConfigs.map((config, index) => {
                        return (
                            <FadeInUp key={config.name} delay={index * 50}>
                                <Link
                                    href={`/category/${config.slug}`}
                                    className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-300"
                                >
                                    <div className="text-center">
                                        {/* Icon */}
                                        <div
                                            className="w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                                            style={{
                                                backgroundColor: config.bgColor
                                            }}
                                        >
                                            {config.iconPath ? (
                                                <Image
                                                    src={config.iconPath}
                                                    alt={config.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            ) : config.lucideIcon ? (
                                                <config.lucideIcon
                                                    className="w-12 h-12"
                                                    style={{ color: config.color }}
                                                    strokeWidth={1.5}
                                                />
                                            ) : null}
                                        </div>

                                        {/* Category Name */}
                                        <h3 className="font-gilroy font-semibold text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                            {config.name}
                                        </h3>
                                    </div>
                                </Link>
                            </FadeInUp>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}