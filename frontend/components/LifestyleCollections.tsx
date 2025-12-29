'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    images: string[];
    slug: string;
    category: string;
    lifestyle_category?: string;
}

interface LifestyleCollection {
    id: string;
    title: string;
    subtitle?: string;
    badgeText: string;
    badgeColor: string;
    titleColor: string;
    products: Product[];
}

interface LifestyleCollectionsProps {
    products: Product[];
}

export default function LifestyleCollections({ products }: LifestyleCollectionsProps) {
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const toggleWishlist = (productId: string) => {
        setWishlistItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const scroll = (direction: 'left' | 'right', collectionId: string) => {
        const container = document.getElementById(collectionId);
        if (container) {
            const scrollAmount = 320;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Nigerian Lifestyle Collections - Shopping focused
    const lifestyleCollections: LifestyleCollection[] = [
        {
            id: 'budget-deals-under-30k',
            title: 'up to 50% OFF: Home Decor Under ₦30,000',
            subtitle: 'Budget-friendly pieces that don\'t compromise on style',
            badgeText: 'up to 50% OFF',
            badgeColor: 'bg-red-500',
            titleColor: 'text-red-600',
            products: products.filter(p => p.sale_price && p.sale_price < 30000).slice(0, 10)
        },
        {
            id: 'fresh-picked-favorites',
            title: 'fresh-picked favorites',
            subtitle: 'Our team\'s latest discoveries for your Nigerian home',
            badgeText: '✓',
            badgeColor: 'bg-purple-600',
            titleColor: 'text-purple-600',
            products: products.slice(0, 10)
        },
        {
            id: 'lagos-apartment-essentials',
            title: 'Lagos Apartment Essentials',
            subtitle: 'Perfect for small Lagos apartments and condos',
            badgeText: 'Space Saver',
            badgeColor: 'bg-blue-500',
            titleColor: 'text-blue-600',
            products: products.filter(p => ['Storage Solutions', 'Furniture'].includes(p.category)).slice(0, 10)
        },
        {
            id: '2-bedroom-apartment-setup',
            title: '2-Bedroom Apartment Complete Setup',
            subtitle: 'Everything you need for a stylish 2-bedroom Nigerian home',
            badgeText: 'Complete Set',
            badgeColor: 'bg-emerald-500',
            titleColor: 'text-emerald-600',
            products: products.slice(2, 12)
        },
        {
            id: 'small-space-big-style',
            title: 'Small Space, Big Style',
            subtitle: 'Smart solutions for compact Nigerian homes',
            badgeText: 'Maximize',
            badgeColor: 'bg-orange-500',
            titleColor: 'text-orange-600',
            products: products.filter(p => ['Storage Solutions', 'Home Decor'].includes(p.category)).slice(0, 10)
        },
        {
            id: 'weekend-diy-projects',
            title: 'Weekend DIY Ready',
            subtitle: 'Tools and materials for quick weekend home improvements',
            badgeText: 'DIY',
            badgeColor: 'bg-green-500',
            titleColor: 'text-green-600',
            products: products.filter(p => ['Tools & Hardware', 'Furniture'].includes(p.category)).slice(0, 10)
        },
        {
            id: 'luxury-under-100k',
            title: 'Luxury Feel Under ₦100,000',
            subtitle: 'High-end look without the high-end price tag',
            badgeText: 'Premium',
            badgeColor: 'bg-amber-500',
            titleColor: 'text-amber-600',
            products: products.filter(p => (p.sale_price || p.price) < 100000).slice(0, 10)
        },
        {
            id: 'naija-cultural-style',
            title: 'Naija Style: Cultural Vibes',
            subtitle: 'Celebrate Nigerian culture in your home decor',
            badgeText: '🇳🇬',
            badgeColor: 'bg-green-600',
            titleColor: 'text-green-600',
            products: products.filter(p => ['Home Decor', 'Living Essentials'].includes(p.category)).slice(0, 10)
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="space-y-12">
                    {lifestyleCollections.map((collection, collectionIndex) => (
                        <div key={collection.id} className="relative">
                            {/* Lifestyle Collection Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h2 className={`font-gilroy font-extra-bold text-2xl ${collection.titleColor} mb-2`}>
                                            {collection.title}
                                        </h2>
                                        {collection.subtitle && (
                                            <p className="text-neutral-600 text-sm">
                                                {collection.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-4 py-2 text-white text-sm font-medium rounded-full ${collection.badgeColor}`}>
                                        {collection.badgeText}
                                    </span>
                                </div>

                                <button
                                    onClick={() => router.push(`/products?lifestyle=${encodeURIComponent(collection.title)}`)}
                                    className={`flex items-center gap-2 ${collection.titleColor} hover:underline font-medium`}
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Products Horizontal Scroll */}
                            <div className="relative group">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => scroll('left', `scroll-${collection.id}`)}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 border border-neutral-200 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <ChevronLeft className="w-4 h-4 text-neutral-600" />
                                </button>

                                <button
                                    onClick={() => scroll('right', `scroll-${collection.id}`)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 border border-neutral-200 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                                </button>

                                {/* Products Grid */}
                                <div
                                    id={`scroll-${collection.id}`}
                                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {collection.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex-shrink-0 w-48 group cursor-pointer"
                                            onClick={() => router.push(`/products/${product.slug}`)}
                                        >
                                            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                                                {/* Product Image */}
                                                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
                                                    <Image
                                                        src={product.images[0] || '/placeholder-product.jpg'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />

                                                    {/* Heart Wishlist */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleWishlist(product.id);
                                                        }}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 transition-colors duration-300 ${wishlistItems.includes(product.id)
                                                                ? 'text-red-500 fill-current'
                                                                : 'text-neutral-500'
                                                                }`}
                                                        />
                                                    </button>

                                                    {/* Collection Badge */}
                                                    {collection.badgeText === '✓' && (
                                                        <div className="absolute top-2 left-2 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                            ✓
                                                        </div>
                                                    )}

                                                    {/* Sale Badge */}
                                                    {collection.id === 'budget-deals-under-30k' && product.sale_price && (
                                                        <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                                                            {collection.badgeText}
                                                        </div>
                                                    )}

                                                    {/* Other Collection Badges */}
                                                    {collection.badgeText !== '✓' && collection.id !== 'budget-deals-under-30k' && (
                                                        <div className={`absolute bottom-2 left-2 text-white px-2 py-1 text-xs font-medium rounded ${collection.badgeColor}`}>
                                                            {collection.badgeText}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-3">
                                                    <h3 className="font-medium text-sm text-black mb-2 line-clamp-2 leading-tight">
                                                        {product.name}
                                                    </h3>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-base text-black">
                                                            {formatPrice(product.sale_price || product.price)}
                                                        </span>
                                                        {product.sale_price && (
                                                            <span className="text-neutral-500 line-through text-sm">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hide scrollbar CSS */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
} 