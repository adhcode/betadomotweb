'use client';

import { ArrowRight, Clock, Star, Lightbulb, BookOpen, ArrowUpRight } from 'lucide-react';
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
                const response = await fetch(`${API_BASE_URL}/guides?limit=8`);
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
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                    <div className="mb-12">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow-sm">
                                <div className="aspect-[16/10] bg-gray-200 rounded-md mb-3"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                {/* Section Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        
                        <h2 className="font-gilroy text-2xl md:text-3xl !font-semibold text-gray-800 tracking-tight">
                            Essential Guides
                        </h2>
                    </div>
                    <Link 
                        href="/guides"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                        View all
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {guides.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-proza text-sm font-light text-gray-500 mb-1">No guides yet</h3>
                        <p className="font-proza text-sm text-gray-500">Check back soon for comprehensive guides!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {guides.map((guide) => (
                            <Link
                                key={guide.id}
                                href={`/guides/${guide.slug}`}
                                className="group bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gray-100 hover:border-gray-300"
                            >
                                {/* Compact Image */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    {guide.featured_image ? (
                                        <Image
                                            src={guide.featured_image}
                                            alt={guide.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder-guide.svg';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                                            <Lightbulb className="w-8 h-8 text-gray-300" />
                                        </div>
                                    )}
                                    
                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    
                                    {/* Centered Arrow Button - Appears on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#dca744] flex items-center justify-center shadow-lg">
                                            <ArrowUpRight className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    
                                    {guide.featured && (
                                        <div className="absolute top-2 right-2">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>

                                {/* Compact Content */}
                                <div className="p-4">
                                    {/* Category & Read Time */}
                                    <div className="flex items-center justify-between mb-2">
                                        {guide.category && (
                                            <span className="font-gilroy font-semibold text-xs text-blue-600 uppercase tracking-wide">
                                                {guide.category}
                                            </span>
                                        )}
                                        <div className="font-proza flex items-center gap-1 text-gray-400 text-xs">
                                            <Clock className="w-3 h-3" />
                                            <span>{guide.read_time}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-cormorant text-sm font-normal text-gray-800 mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {guide.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-proza text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                                        {guide.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className="font-proza text-xs text-gray-400">{guide.views} views</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}