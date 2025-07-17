'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Star,
    Heart,
    Share2,
    Truck,
    Shield,
    ShoppingCart,
    Minus,
    Plus,
    Check,
    Package,
    Ruler,
    Weight,
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

interface CartItem {
    product: Product;
    quantity: number;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);

    const router = useRouter();

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage
    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const loadProduct = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/products/${resolvedParams.slug}`);
            if (!response.ok) throw new Error('Product not found');
            const data = await response.json();
            const product = Array.isArray(data) ? data[0] : data;
            setProduct(product);

            // Load related products from different categories
            if (product && product.category) {
                const relatedResponse = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/products?limit=4`);
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json();
                    // Filter out current product and get products from different categories
                    const filtered = relatedData
                        .filter((p: Product) => p.slug !== product.slug && p.category !== product.category)
                        .slice(0, 4);
                    setRelatedProducts(filtered);
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load product');
        } finally {
            setLoading(false);
        }
    }, [resolvedParams.slug]);

    useEffect(() => {
        loadProduct();

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [loadProduct, resolvedParams.slug]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    };

    const handleAddToCart = async () => {
        if (!product) return;

        setAddingToCart(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

        let newCart: CartItem[];
        if (existingItemIndex >= 0) {
            // Update quantity
            newCart = [...cart];
            newCart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            newCart = [...cart, { product, quantity }];
        }

        saveCart(newCart);

        // Dispatch custom event to update header cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        setAddingToCart(false);

        // Show success message (you could add a toast notification here)
        console.log('Added to cart:', { product: product.slug, quantity });
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
            setQuantity(newQuantity);
        }
    };

    const handleWishlist = () => {
        if (!product) return;

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const isInWishlist = wishlist.some((item: Product) => item.id === product.id);

        let newWishlist;
        if (isInWishlist) {
            newWishlist = wishlist.filter((item: Product) => item.id !== product.id);
        } else {
            newWishlist = [...wishlist, product];
        }

        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setIsWishlisted(!isInWishlist);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name,
                text: product?.description,
                url: window.location.href,
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-body font-light text-neutral-500 tracking-[0.1em] uppercase text-sm">Loading Product</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-neutral-400" />
                        </div>
                        <h3 className="font-cutive font-normal text-2xl text-primary-900 mb-4">Product not found</h3>
                        <p className="text-neutral-600 mb-8 font-light">{error}</p>
                        <button
                            onClick={() => router.push('/products')}
                            className="bg-primary-900 text-white px-8 py-3 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-20">
                {/* Breadcrumb */}
                <section className="border-b border-neutral-200 bg-white">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
                        <div className={`flex items-center space-x-2 text-sm transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <button
                                onClick={() => router.push('/products')}
                                className="font-body font-light text-neutral-600 hover:text-primary-900 transition-colors duration-300 tracking-[0.1em] uppercase"
                            >
                                Products
                            </button>
                            <span className="text-neutral-300">/</span>
                            <span className="font-body font-light text-primary-900 tracking-[0.1em] uppercase">{product.name}</span>
                        </div>
                    </div>
                </section>

                {/* Product Details */}
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                            {/* Product Images */}
                            <div className={`space-y-6 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                {/* Main Image */}
                                <div className="aspect-square bg-white border border-neutral-200 overflow-hidden group">
                                    <Image
                                        src={product.images && product.images.length > 0 ? product.images[selectedImage] : '/images/placeholder.jpg'}
                                        alt={product.name}
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Thumbnail Images */}
                                {product.images && product.images.length > 1 && (
                                    <div className="grid grid-cols-5 gap-3">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`aspect-square overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${selectedImage === index
                                                    ? 'border-primary-900 ring-2 ring-neutral-200'
                                                    : 'border-neutral-200 hover:border-neutral-300'
                                                    }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    width={120}
                                                    height={120}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className={`space-y-8 transition-all duration-1200 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                {/* Category and Tags */}
                                <div>
                                    <span className="font-body font-light text-xs tracking-[0.1em] uppercase text-neutral-500 mb-4 block">
                                        {product.category}
                                    </span>
                                    {product.tags && product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-neutral-100 text-primary-900 text-xs font-light tracking-wide hover:bg-neutral-200 transition-colors duration-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Name */}
                                <h1 className="font-cutive font-normal text-3xl sm:text-4xl md:text-5xl text-primary-900 leading-tight">
                                    {product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < 4 ? 'text-primary-900 fill-current' : 'text-neutral-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-body font-light text-sm text-neutral-600">4.8 (124 reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4">
                                    {product.sale_price && product.sale_price > 0 ? (
                                        <>
                                            <span className="font-cutive font-normal text-4xl text-primary-900">
                                                {formatPrice(product.sale_price)}
                                            </span>
                                            <span className="text-2xl text-neutral-400 line-through font-light">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-light rounded-full">
                                                Save {getDiscountPercentage(product.price, product.sale_price)}%
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-cutive font-normal text-4xl text-primary-900">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <p className="font-body font-light text-neutral-600 leading-relaxed text-lg">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-4 py-6 border-t border-neutral-200">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Package className="w-4 h-4 text-neutral-500" />
                                        <span className="font-body font-light text-neutral-600">SKU: {product.sku}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Weight className="w-4 h-4 text-neutral-500" />
                                        <span className="font-body font-light text-neutral-600">Weight: {product.weight}kg</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Ruler className="w-4 h-4 text-neutral-500" />
                                        <span className="font-body font-light text-neutral-600">Dimensions: {product.dimensions}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="font-body font-light text-neutral-600">
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity and Add to Cart */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="font-body font-light text-primary-900 tracking-[0.1em] uppercase text-sm">Quantity:</span>
                                        <div className="flex items-center border border-neutral-300 rounded-sm overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                disabled={quantity <= 1}
                                                className="p-3 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Minus className="w-4 h-4 text-primary-900" />
                                            </button>
                                            <span className="px-6 py-3 text-primary-900 font-light min-w-[60px] text-center">{quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                                disabled={quantity >= product.stock}
                                                className="p-3 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Plus className="w-4 h-4 text-primary-900" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart || product.stock <= 0}
                                            className="flex-1 bg-[#dca744] text-white py-4 px-6 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {addingToCart ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleWishlist}
                                            className="p-4 border border-neutral-300 hover:border-primary-900 hover:bg-neutral-50 transition-colors duration-300 group"
                                        >
                                            <Heart className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-neutral-600 group-hover:text-primary-900'}`} />
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="p-4 border border-neutral-300 hover:border-primary-900 hover:bg-neutral-50 transition-colors duration-300 group"
                                        >
                                            <Share2 className="w-4 h-4 text-neutral-600 group-hover:text-primary-900 transition-colors duration-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-4 pt-6 border-t border-neutral-200">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-neutral-500" />
                                        <span className="font-body font-light text-neutral-600">Free shipping on orders over ₦50,000</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-neutral-500" />
                                        <span className="font-body font-light text-neutral-600">30-day return policy</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-neutral-500" />
                                        <span className="font-body font-light text-neutral-600">Quality guaranteed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="py-16 sm:py-20 md:py-24 bg-neutral-50">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <div className={`text-center mb-16 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                <h2 className="font-cutive font-normal text-3xl sm:text-4xl md:text-5xl text-primary-900 mb-6">
                                    Your home may also need this
                                </h2>
                                <p className="font-body font-light text-neutral-600 text-lg max-w-2xl mx-auto">
                                    Discover more beautiful pieces to complete your space
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map((relatedProduct, index) => (
                                    <div
                                        key={relatedProduct.id}
                                        className={`group cursor-pointer transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                            }`}
                                        style={{ transitionDelay: `${index * 200}ms` }}
                                        onClick={() => router.push(`/products/${relatedProduct.slug}`)}
                                    >
                                        <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                                            <div className="aspect-square overflow-hidden">
                                                <Image
                                                    src={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : '/images/placeholder.jpg'}
                                                    alt={relatedProduct.name}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <span className="font-body font-light text-xs tracking-[0.1em] uppercase text-neutral-500 mb-2 block">
                                                    {relatedProduct.category}
                                                </span>
                                                <h3 className="font-cutive font-normal text-xl text-primary-900 mb-3 group-hover:text-neutral-700 transition-colors duration-300">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="flex items-center gap-3 mb-4">
                                                    {relatedProduct.sale_price && relatedProduct.sale_price > 0 ? (
                                                        <>
                                                            <span className="font-cutive font-normal text-2xl text-primary-900">
                                                                {formatPrice(relatedProduct.sale_price)}
                                                            </span>
                                                            <span className="text-lg text-neutral-400 line-through font-light">
                                                                {formatPrice(relatedProduct.price)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-cutive font-normal text-2xl text-primary-900">
                                                            {formatPrice(relatedProduct.price)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="w-full bg-primary-900 text-white py-3 px-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 flex items-center justify-center gap-2">
                                                    <span>View Details</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
} 