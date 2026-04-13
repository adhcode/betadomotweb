'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryConfig {
    name: string;
    slug: string;
    iconPath?: string;
}

const categoryConfigs: CategoryConfig[] = [
    { name: 'Cleaning', slug: 'cleaning', iconPath: '/icons/cleaning.png' },
    { name: 'Organizing', slug: 'organization', iconPath: '/icons/organizing.png' },
    { name: 'Home Life', slug: 'life', iconPath: '/icons/homelife.png' },
    { name: 'Decorating', slug: 'decorating', iconPath: '/icons/decorating.png' },
    { name: 'Energy Savings', slug: 'energy-savings', iconPath: '/icons/energy.png' },
    { name: 'Security & Safety', slug: 'security-safety', iconPath: '/icons/securitytech.png' },
    { name: 'Smart Tech', slug: 'smart-tech', iconPath: '/icons/organizing.png' },
    { name: 'Home Projects', slug: 'home-projects', iconPath: '/icons/homeprojects.png' }
];

export default function CategoryStories() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return (
            <section className="py-32 lg:py-40 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="mb-20 lg:mb-32">
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 w-64"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="animate-pulse p-8 bg-gray-50">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200"></div>
                                <div className="h-5 bg-gray-200 w-20 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 lg:py-32 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="mb-12 lg:mb-20">
                    <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
                        Explore
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900">
                        By category
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                    {categoryConfigs.map((config) => (
                        <Link
                            key={config.name}
                            href={`/category/${config.slug}`}
                            className="group block p-4 md:p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                            <div className="flex flex-col items-center justify-center text-center space-y-2 md:space-y-3">
                                {/* Icon */}
                                {config.iconPath && (
                                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                        <Image
                                            src={config.iconPath}
                                            alt={config.name}
                                            width={40}
                                            height={40}
                                            className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                )}

                                {/* Category Name - Responsive text size */}
                                <h3 className="text-[10px] md:text-xs font-light text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-tight px-1">
                                    {config.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
