'use client';

import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Guide {
    id: string;
    title: string;
    description: string;
    featured_image?: string;
    read_time: string;
    category?: string;
    slug: string;
    featured: boolean;
    views: number;
    published_at: string;
}

export default function FeaturedGuidelines() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://betadomotweb-production.up.railway.app'
        : 'http://localhost:8080';

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/guides?limit=4`);
                if (response.ok) {
                    const data = await response.json();
                    setGuides(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching guides:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, [API_BASE_URL]);

    if (loading) {
        return (
            <section className="py-32 lg:py-40 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="mb-20 lg:mb-32">
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 w-64"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-200 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 w-full"></div>
                                    <div className="h-4 bg-gray-200 w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (guides.length === 0) {
        return null;
    }

    return (
        <section className="py-32 lg:py-40 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="mb-20 lg:mb-32 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
                            Essential Reading
                        </p>
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                            Guides
                        </h2>
                    </div>
                    <Link 
                        href="/guides"
                        className="hidden md:inline-block text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
                    >
                        View all
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {guides.map((guide) => (
                        <Link
                            key={guide.id}
                            href={`/guides/${guide.slug}`}
                            className="group block"
                        >
                            <div className="space-y-6">
                                {/* Guide Image */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                    {guide.featured_image ? (
                                        <Image
                                            src={guide.featured_image}
                                            alt={guide.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-gray-300 text-4xl font-light">
                                                {guide.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Guide Content */}
                                <div className="space-y-3">
                                    {/* Category */}
                                    {guide.category && (
                                        <span className="inline-block text-xs text-gray-500 uppercase tracking-wider font-light">
                                            {guide.category}
                                        </span>
                                    )}

                                    <h3 className="text-xl font-light text-gray-900 leading-tight group-hover:text-gray-600 transition-colors duration-300">
                                        {guide.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-sm text-gray-500 font-light">
                                        <Clock className="w-4 h-4" />
                                        <span>{guide.read_time}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-16 text-center md:hidden">
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-2 text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
                    >
                        View all guides
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
