'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Search,
    Grid,
    List,
    Star,
    ShoppingCart,
    Heart,
    Eye,
    ArrowRight,
    Filter,
    SlidersHorizontal
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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [isVisible, setIsVisible] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const router = useRouter();

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');

            let url = 'http://localhost:8080/products';
            const params = new URLSearchParams();

            if (selectedCategory) {
                params.append('category', selectedCategory);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedCategory]);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return (a.sale_price || a.price) - (b.sale_price || b.price);
            case 'price-high':
                return (b.sale_price || b.price) - (a.sale_price || a.price);
            case 'name':
                return a.name.localeCompare(b.name);
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    const categories = [...new Set(products.map(product => product.category))];

    const addToCart = (product: Product) => {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cartItems.find((item: any) => item.product_id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                product_id: product.id,
                product_slug: product.slug,
                name: product.name,
                price: product.sale_price || product.price,
                image: product.images[0] || '',
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    };

    const ProductCard = ({ product, index }: { product: Product; index: number }) => (
        <div
            className={`group transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="bg-white border border-neutral-200 overflow-hidden hover:border-[#dca744] transition-all duration-500 hover:shadow-xl hover:shadow-black/10 transform hover:-translate-y-1">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                    <img
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Sale Badge */}
                    {product.sale_price && (
                        <div className="absolute top-4 left-4 bg-[#dca744] text-white px-3 py-1 text-sm font-medium">
                            -{getDiscountPercentage(product.price, product.sale_price)}%
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 bg-white border border-neutral-200 hover:border-[#236b7c] hover:bg-[#236b7c] hover:text-white transition-all duration-300">
                            <Heart className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => router.push(`/products/${product.slug}`)}
                            className="p-2 bg-white border border-neutral-200 hover:border-[#236b7c] hover:bg-[#236b7c] hover:text-white transition-all duration-300"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-[#236b7c] text-white py-3 hover:bg-[#1a5463] transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-cutive text-xl text-primary-900 group-hover:text-[#236b7c] transition-colors duration-300">
                            {product.name}
                        </h3>
                        <p className="font-body font-light text-neutral-600 text-sm line-clamp-2">
                            {product.description}
                        </p>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-body tracking-wide rounded-none">
                            {product.category}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="font-cutive text-2xl text-primary-900">
                                {formatPrice(product.sale_price || product.price)}
                            </span>
                            {product.sale_price && (
                                <span className="font-body text-neutral-500 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>

                    {/* View Product Link */}
                    <button
                        onClick={() => router.push(`/products/${product.slug}`)}
                        className="w-full text-[#dca744] hover:text-[#236b7c] transition-colors duration-300 flex items-center justify-center gap-2 font-medium py-2 group"
                    >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section className="relative py-20 sm:py-24 md:py-32 bg-white overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-[0.015]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #0A0A0A 1px, transparent 0)`,
                            backgroundSize: '60px 60px'
                        }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <div className={`transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6 block">
                                    Curated Collection
                                </span>
                                <h1 className="font-cutive font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-900 mb-8 leading-tight tracking-tight">
                                    Our Products
                                </h1>
                                <p className="font-body font-light text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                                    Thoughtfully designed pieces that transform your space into a sanctuary of style and comfort
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Search */}
                <section className="border-t border-neutral-200 py-8 bg-neutral-50">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className={`transition-all duration-1200 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-[#236b7c] focus:ring-2 focus:ring-[#236b7c]/20 rounded-none bg-white transition-all duration-300"
                                    />
                                </div>

                                {/* Filter Controls */}
                                <div className="flex items-center gap-4">
                                    {/* Category Filter */}
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-3 border border-neutral-200 focus:border-[#236b7c] focus:ring-2 focus:ring-[#236b7c]/20 rounded-none bg-white transition-all duration-300"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>

                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-3 border border-neutral-200 focus:border-[#236b7c] focus:ring-2 focus:ring-[#236b7c]/20 rounded-none bg-white transition-all duration-300"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="name">Name A-Z</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>

                                    {/* View Mode */}
                                    <div className="flex border border-neutral-200 rounded-none overflow-hidden">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-3 transition-colors duration-300 ${viewMode === 'grid'
                                                ? 'bg-[#236b7c] text-white'
                                                : 'bg-white text-neutral-600 hover:bg-neutral-50'
                                                }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-3 transition-colors duration-300 ${viewMode === 'list'
                                                ? 'bg-[#236b7c] text-white'
                                                : 'bg-white text-neutral-600 hover:bg-neutral-50'
                                                }`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Results Count */}
                            <div className="mt-6 text-neutral-600 font-body">
                                {loading ? (
                                    <span>Loading products...</span>
                                ) : (
                                    <span>
                                        Showing {sortedProducts.length} of {products.length} products
                                        {selectedCategory && ` in "${selectedCategory}"`}
                                        {searchTerm && ` matching "${searchTerm}"`}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-16 sm:py-20">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-square bg-neutral-200 rounded mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-neutral-200 rounded w-full"></div>
                                            <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                                            <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20">
                                <div className="text-red-600 mb-4">Error: {error}</div>
                                <button
                                    onClick={loadProducts}
                                    className="px-6 py-3 bg-[#236b7c] text-white hover:bg-[#1a5463] transition-colors duration-300 font-body tracking-wide"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="font-cutive text-2xl text-primary-900 mb-4">No Products Found</h3>
                                <p className="text-neutral-600 mb-8">
                                    {searchTerm || selectedCategory
                                        ? "Try adjusting your search or filter criteria."
                                        : "No products available at the moment."
                                    }
                                </p>
                                {(searchTerm || selectedCategory) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('');
                                        }}
                                        className="px-6 py-3 bg-[#dca744] text-white hover:bg-[#c4963d] transition-colors duration-300 font-body tracking-wide"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className={`grid gap-8 ${viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1'
                                }`}>
                                {sortedProducts.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
} 