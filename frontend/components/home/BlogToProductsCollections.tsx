'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ArrowRight, BookOpen, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    images: string[];
    slug: string;
    category: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
    tags?: string[];
}

interface BlogToProductCollection {
    id: string;
    blogCategory: string;
    blogDescription: string;
    blogColor: string;
    blogPosts: BlogPost[];
    productCategoryTitle: string;
    productBadge: string;
    productBadgeColor: string;
    products: Product[];
}

interface BlogToProductsCollectionsProps {
    products: Product[];
    blogPosts: BlogPost[];
}

export default function BlogToProductsCollections({ products, blogPosts }: BlogToProductsCollectionsProps) {
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

    const scroll = (direction: 'left' | 'right', containerId: string) => {
        const container = document.getElementById(containerId);
        if (container) {
            const scrollAmount = 300;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Blog Category to Product Collections - Nigerian lifestyle focused
    const blogToProductCollections: BlogToProductCollection[] = [
        {
            id: 'home-health-safety',
            blogCategory: 'Home Health & Safety',
            blogDescription: 'Mold prevention, air quality, pest control, and family-safe solutions for your home',
            blogColor: 'text-green-600',
            blogPosts: blogPosts.filter(post => post.tags?.includes('Safety') || post.tags?.includes('Health')).slice(0, 4),
            productCategoryTitle: 'Shop Health & Safety Products',
            productBadge: 'Safe Home',
            productBadgeColor: 'bg-green-500',
            products: products.filter(p => ['Home Decor', 'Tools & Hardware'].includes(p.category)).slice(0, 8)
        },
        {
            id: 'diy-home-projects',
            blogCategory: 'DIY & Home Projects',
            blogDescription: 'Weekend builds, rental fixes, and practical improvements for your home',
            blogColor: 'text-amber-600',
            blogPosts: blogPosts.filter(post => post.tags?.includes('DIY')).slice(0, 4),
            productCategoryTitle: 'Shop DIY Tools & Materials',
            productBadge: 'DIY Ready',
            productBadgeColor: 'bg-amber-500',
            products: products.filter(p => ['Furniture', 'Tools & Hardware'].includes(p.category)).slice(0, 8)
        },
        {
            id: 'kitchen-daily-living',
            blogCategory: 'Kitchen & Daily Living',
            blogDescription: 'Meal prep, organization, and daily routines that works',
            blogColor: 'text-blue-600',
            blogPosts: blogPosts.filter(post => post.tags?.includes('Kitchen')).slice(0, 4),
            productCategoryTitle: 'Shop Kitchen Essentials',
            productBadge: 'Kitchen Pro',
            productBadgeColor: 'bg-blue-500',
            products: products.filter(p => ['Kitchen & Dining', 'Storage Solutions'].includes(p.category)).slice(0, 8)
        },
        {
            id: 'afrocentric-living',
            blogCategory: 'Afrocentric Living & Inspiration',
            blogDescription: 'Styling African pieces, textiles, and cultural elements in modern spaces',
            blogColor: 'text-purple-600',
            blogPosts: blogPosts.filter(post => post.tags?.includes('African') || post.tags?.includes('Culture')).slice(0, 4),
            productCategoryTitle: 'Shop African-Inspired Decor',
            productBadge: 'Cultural',
            productBadgeColor: 'bg-purple-500',
            products: products.filter(p => ['Home Decor', 'Living Essentials'].includes(p.category)).slice(0, 8)
        }
    ];

    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="font-gilroy font-extra-bold text-2xl sm:text-3xl text-black mb-3 sm:mb-4">
                        Discover, Learn, Shop
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
                        Find everyday home inspiration in our blog, then choose pieces that feel just right for you
                    </p>
                </div>

                <div className="space-y-16 sm:space-y-20">
                    {blogToProductCollections.map((collection) => (
                        <div key={collection.id} className="relative">

                            {/* 1. Blog Category Header */}
                            <div className="mb-6 sm:mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className={`font-gilroy font-bold text-xl sm:text-2xl ${collection.blogColor} mb-2`}>
                                            {collection.blogCategory}
                                        </h3>
                                        <p className="text-neutral-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                                            {collection.blogDescription}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/blog?category=${encodeURIComponent(collection.blogCategory)}`}
                                        className={`self-start text-xs sm:text-sm ${collection.blogColor} hover:underline flex items-center gap-2 px-3 sm:px-4 py-2 border border-current rounded-full hover:bg-current hover:text-white transition-all whitespace-nowrap`}
                                    >
                                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">View All Articles</span>
                                        <span className="sm:hidden">View All</span>
                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* 2. Featured Blog Posts with Images */}
                            {collection.blogPosts.length > 0 && (
                                <div className="mb-8 sm:mb-12">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {collection.blogPosts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blog/${post.slug}`}
                                                className="group"
                                            >
                                                <div className="space-y-3">
                                                    <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100 rounded-lg">
                                                        {post.featured_image ? (
                                                            <Image
                                                                src={post.featured_image}
                                                                alt={post.title}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-gilroy font-medium text-sm sm:text-base text-black group-hover:text-[#236b7c] transition-colors line-clamp-2">
                                                            {post.title}
                                                        </h4>
                                                        {post.excerpt && (
                                                            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2">
                                                                {post.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Related Products Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <ShoppingBag className="w-5 h-5 text-[#236b7c]" />
                                    <div>
                                        <h4 className="font-gilroy font-bold text-xl text-[#236b7c] mb-1">
                                            {collection.productCategoryTitle}
                                        </h4>

                                    </div>
                                    <span className={`px-3 py-1 text-white text-xs font-medium rounded-full ${collection.productBadgeColor}`}>
                                        {collection.productBadge}
                                    </span>
                                    <Link
                                        href={`/products?category=${encodeURIComponent(collection.productCategoryTitle)}`}
                                        className="ml-auto text-sm text-[#236b7c] hover:underline flex items-center gap-2 px-4 py-2 border border-[#236b7c] rounded-full hover:bg-[#236b7c] hover:text-white transition-all"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Shop All Products
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* 4. Products Horizontal Scroll */}
                            <div className="relative group">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => scroll('left', `products-${collection.id}`)}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-neutral-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                                >
                                    <ChevronLeft className="w-5 h-5 text-neutral-600" />
                                </button>

                                <button
                                    onClick={() => scroll('right', `products-${collection.id}`)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-neutral-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                                >
                                    <ChevronRight className="w-5 h-5 text-neutral-600" />
                                </button>

                                {/* Products Grid */}
                                <div
                                    id={`products-${collection.id}`}
                                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {collection.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex-shrink-0 w-56 group cursor-pointer"
                                            onClick={() => router.push(`/products/${product.slug}`)}
                                        >
                                            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 transition-colors duration-300 ${wishlistItems.includes(product.id)
                                                                ? 'text-red-500 fill-current'
                                                                : 'text-neutral-500'
                                                                }`}
                                                        />
                                                    </button>

                                                    {/* Category Badge */}
                                                    <div className={`absolute bottom-3 left-3 text-white px-3 py-1 text-xs font-medium rounded ${collection.productBadgeColor}`}>
                                                        {collection.productBadge}
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-4">
                                                    <h3 className="font-medium text-sm text-black mb-2 line-clamp-2 leading-tight">
                                                        {product.name}
                                                    </h3>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-base text-black">
                                                            {formatPrice(product.sale_price || product.price)}
                                                        </span>
                                                        {product.sale_price && (
                                                            <span className="text-neutral-500 line-through text-sm">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-[#236b7c] font-medium">
                                                        View product →
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Separator between collections */}
                            <div className="mt-16 border-t border-neutral-200"></div>
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