'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, ExternalLink } from 'lucide-react';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    category: string;
    featured: boolean;
    stock: number;
}

interface RelatedProductsProps {
    productIds: string[];
    context?: string; // e.g., "DIY Projects", "Kitchen Setup"
}

export default function RelatedProducts({ productIds, context }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            if (!productIds.length) {
                setLoading(false);
                return;
            }

            try {
                // Fetch each product by ID/slug
                const productPromises = productIds.map(async (id) => {
                    const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/products/${id}`);
                    if (response.ok) {
                        return await response.json();
                    }
                    return null;
                });

                const results = await Promise.all(productPromises);
                const validProducts = results.filter(Boolean);
                setProducts(validProducts);
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [productIds]);

    const handleImageError = (productId: string) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    const getImageSrc = (product: Product) => {
        if (imageErrors[product.id] || !product.images?.[0]) {
            return '/images/blog/image1.jpg'; // fallback
        }
        return product.images[0];
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <section className="py-12 bg-neutral-50/50 rounded-lg my-12">
                <div className="animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded w-64 mx-auto mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg p-4">
                                <div className="h-48 bg-neutral-200 rounded mb-4"></div>
                                <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                                <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="py-12 bg-neutral-50/50 rounded-lg my-12 border border-neutral-200">
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-8">
                    <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3 block">
                        {context ? `Perfect for ${context}` : 'Shop Related Items'}
                    </span>
                    <h3 className="font-gilroy font-extra-bold text-2xl sm:text-3xl text-black mb-3">
                        Get the Look
                    </h3>
                    <p className="font-body font-light text-neutral-700 max-w-2xl mx-auto">
                        Hand-picked items that complement this guide and help you achieve the same results at home.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-neutral-200 hover:border-[#dca744]/30"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={getImageSrc(product)}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={() => handleImageError(product.id)}
                                />
                                {product.sale_price && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                            Save {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-neutral-50 transition-colors">
                                        <Heart className="w-4 h-4 text-neutral-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-gilroy font-extra-bold text-lg text-black line-clamp-2 flex-1">
                                        {product.name}
                                    </h4>
                                </div>

                                <p className="font-body text-sm text-neutral-600 line-clamp-2 mb-3">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {product.sale_price ? (
                                            <>
                                                <span className="font-gilroy font-extra-bold text-lg text-[#e74c3c]">
                                                    {formatPrice(product.sale_price)}
                                                </span>
                                                <span className="font-body text-sm text-neutral-500 line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-gilroy font-extra-bold text-lg text-black">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <span className="text-xs text-orange-600 font-medium">
                                            Only {product.stock} left
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="flex-1 bg-[#236b7c] hover:bg-[#1a5968] text-white text-center py-2 px-4 rounded-md transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Details
                                    </Link>
                                    <button
                                        className="bg-[#dca744] hover:bg-[#c8953d] text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center justify-center"
                                        onClick={() => {
                                            // Add to cart functionality
                                            console.log('Add to cart:', product.id);
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 font-gilroy font-medium text-[#236b7c] hover:text-[#dca744] transition-colors"
                    >
                        Browse all products
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
} 