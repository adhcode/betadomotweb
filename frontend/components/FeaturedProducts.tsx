'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Star,
    ShoppingCart,
    Heart,
    Eye,
    ArrowRight
} from 'lucide-react';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    category: string;
    tags: string[];
    stock: number;
    sku: string;
    weight: number;
    dimensions: string;
    featured: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/products?featured=true&limit=4');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to load featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProducts();

        // Trigger animation when component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN'
        }).format(price);
    };

    const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    };

    if (loading) {
        return (
            <section className="py-20 sm:py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-body font-light text-neutral-500 tracking-[0.1em] uppercase text-sm">Loading Products</p>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-20 sm:py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.015]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #0A0A0A 1px, transparent 0)`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <div className={`transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}>
                        <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6 block">
                            Curated Collection
                        </span>
                        <h2 className="font-cutive font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-900 mb-8 leading-tight tracking-tight">
                            Featured Products
                        </h2>
                        <p className="font-body font-light text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                            Discover our handpicked selection of premium products designed to elevate your living space
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-16">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`group transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="bg-white border border-neutral-200 overflow-hidden hover:border-primary-900 transition-all duration-500 hover:shadow-lg hover:shadow-black/5">
                                {/* Product Image */}
                                <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
                                        }}
                                    />
                                    {product.sale_price && product.sale_price > 0 && (
                                        <div className="absolute top-4 left-4 bg-primary-900 text-white px-3 py-1 text-xs font-light tracking-wide">
                                            -{getDiscountPercentage(product.price, product.sale_price)}%
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="p-2 bg-white/95 backdrop-blur-sm hover:bg-white transition-colors rounded-full">
                                            <Heart className="w-4 h-4 text-primary-900" />
                                        </button>
                                        <button className="p-2 bg-white/95 backdrop-blur-sm hover:bg-white transition-colors rounded-full">
                                            <Eye className="w-4 h-4 text-primary-900" />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <div className="mb-3">
                                        <span className="font-body font-light text-xs tracking-[0.1em] uppercase text-neutral-500">
                                            {product.category}
                                        </span>
                                    </div>

                                    <h3 className="font-cutive font-normal text-xl text-primary-900 mb-3 line-clamp-2 group-hover:text-neutral-600 transition-colors duration-300">
                                        {product.name}
                                    </h3>

                                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            {product.sale_price && product.sale_price > 0 ? (
                                                <>
                                                    <span className="text-lg font-light text-primary-900">
                                                        {formatPrice(product.sale_price)}
                                                    </span>
                                                    <span className="text-sm text-neutral-400 line-through">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-light text-primary-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>


                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => router.push(`/products/${product.slug}`)}
                                            className="flex-1 bg-[#dca744] text-white py-3 px-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 flex items-center justify-center gap-2"
                                        >
                                            <span>View Details</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                        <button className="p-3 border border-neutral-300 hover:border-primary-900 hover:bg-neutral-50 transition-colors duration-300">
                                            <ShoppingCart className="w-4 h-4 text-primary-900" />
                                        </button>
                                    </div>

                                    {product.stock <= 0 && (
                                        <div className="mt-3 text-center">
                                            <span className="font-body font-light text-xs text-neutral-500 tracking-[0.1em] uppercase">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className={`text-center transition-all duration-1200 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}>
                    <button
                        onClick={() => router.push('/products')}
                        className="group text-white border border-[#0A0A0A] px-10 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-black/10"
                    >
                        <span className="flex items-center gap-3">
                            View All Products
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
} 