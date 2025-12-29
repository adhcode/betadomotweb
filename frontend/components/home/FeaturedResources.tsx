'use client';

import { Download, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'download' | 'guide' | 'checklist';
    downloadUrl?: string;
    slug?: string;
    category: string;
    fileSize?: string;
    downloads?: number;
}

// Sample resources - you can replace this with API data later
const sampleResources: Resource[] = [
    {
        id: '1',
        title: 'Lagos Apartment Setup Checklist',
        description: 'Complete checklist for setting up your first apartment in Lagos, from utilities to security.',
        type: 'checklist',
        downloadUrl: '/resources/lagos-apartment-checklist.pdf',
        category: 'Moving & Setup',
        fileSize: '2.1 MB',
        downloads: 1247
    },
    {
        id: '2',
        title: 'DIY Home Security Guide',
        description: 'Step-by-step guide to securing your home on a budget with practical DIY solutions.',
        type: 'guide',
        slug: 'diy-home-security-guide',
        category: 'Home Security',
        downloads: 892
    },
    {
        id: '3',
        title: 'NEPA-Proof Kitchen Organization',
        description: 'Downloadable meal prep and kitchen organization templates that work with power outages.',
        type: 'download',
        downloadUrl: '/resources/nepa-proof-kitchen.pdf',
        category: 'Kitchen & Living',
        fileSize: '1.8 MB',
        downloads: 634
    }
];

interface FeaturedResourcesProps {
    resources?: Resource[];
}

export default function FeaturedResources({ resources = sampleResources }: FeaturedResourcesProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'download':
                return <Download className="w-5 h-5" />;
            case 'guide':
                return <FileText className="w-5 h-5" />;
            case 'checklist':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    const handleResourceClick = (resource: Resource) => {
        // Track resource interaction
        if (typeof window !== 'undefined') {
            const dl = (window as any).dataLayer;
            if (Array.isArray(dl)) {
                dl.push({
                    event: 'resource_click',
                    resource_title: resource.title,
                    resource_type: resource.type,
                    resource_category: resource.category
                });
            }
        }

        // Handle download or navigation
        if (resource.downloadUrl) {
            window.open(resource.downloadUrl, '_blank');
        } else if (resource.slug) {
            window.location.href = `/resources/${resource.slug}`;
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2 block">
                        Resources
                    </span>
                    <h2 className="font-cormorant text-3xl sm:text-4xl text-black mb-4">
                        Practical Home Resources
                    </h2>
                    <p className="font-proza text-lg text-neutral-700 max-w-2xl mx-auto">
                        Download guides, checklists, and templates to help you create your perfect home space.
                    </p>
                </div>

                {/* Resources Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {resources.map((resource) => (
                        <div
                            key={resource.id}
                            className="group bg-neutral-50 rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-neutral-200"
                            onClick={() => handleResourceClick(resource)}
                        >
                            {/* Resource Type & Category */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-[#dca744]">
                                    {getIcon(resource.type)}
                                    <span className="font-gilroy font-medium text-sm uppercase tracking-wide">
                                        {resource.type}
                                    </span>
                                </div>
                                <span className="font-gilroy font-light text-xs text-neutral-500 uppercase tracking-wide">
                                    {resource.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-cormorant text-xl text-black mb-3 group-hover:text-[#dca744] transition-colors duration-300">
                                {resource.title}
                            </h3>

                            {/* Description */}
                            <p className="font-proza text-neutral-700 mb-4 leading-relaxed">
                                {resource.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-sm text-neutral-500">
                                <div className="font-proza flex items-center gap-4">
                                    {resource.fileSize && (
                                        <span>
                                            {resource.fileSize}
                                        </span>
                                    )}
                                    {resource.downloads && (
                                        <span>
                                            {resource.downloads.toLocaleString()} downloads
                                        </span>
                                    )}
                                </div>
                                <div className="text-[#dca744] group-hover:translate-x-1 transition-transform duration-300">
                                    {resource.downloadUrl ? (
                                        <Download className="w-4 h-4" />
                                    ) : (
                                        <FileText className="w-4 h-4" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Resources CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/resources"
                        className="inline-block px-8 py-4 border-2 border-[#dca744] text-[#dca744] font-gilroy font-medium text-sm tracking-[0.1em] uppercase rounded-lg hover:bg-[#dca744] hover:text-white transition-all duration-300"
                    >
                        View All Resources
                    </Link>
                </div>
            </div>
        </section>
    );
}