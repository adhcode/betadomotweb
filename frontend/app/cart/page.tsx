'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Heart,
    ArrowRight,
    Package,
    Truck,
    Shield
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

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [updatingItem, setUpdatingItem] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setLoading(false);

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        // Dispatch custom event to update header cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdatingItem(productId);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));

        const newCart = cart.map(item =>
            item.product.id === productId
                ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
                : item
        );

        saveCart(newCart);
        setUpdatingItem(null);
    };

    const removeFromCart = async (productId: string) => {
        setUpdatingItem(productId);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));

        const newCart = cart.filter(item => item.product.id !== productId);
        saveCart(newCart);
        setUpdatingItem(null);
    };

    const moveToWishlist = (productId: string) => {
        const item = cart.find(item => item.product.id === productId);
        if (!item) return;

        // Add to wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const isInWishlist = wishlist.some((product: Product) => product.id === productId);

        if (!isInWishlist) {
            wishlist.push(item.product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        // Remove from cart
        removeFromCart(productId);
    };

    const clearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            saveCart([]);
        }
    };

    const getItemPrice = (item: CartItem) => {
        return item.product.sale_price && item.product.sale_price > 0
            ? item.product.sale_price
            : item.product.price;
    };

    const subtotal = cart.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over ₦50,000
    const tax = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + shipping + tax;

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-body font-light text-neutral-500 tracking-[0.1em] uppercase text-sm">Loading Cart</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-20">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20 md:py-24">
                        <div className={`text-center transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <ShoppingCart className="w-16 h-16 text-neutral-400" />
                            </div>
                            <h1 className="font-cutive font-normal text-3xl sm:text-4xl md:text-5xl text-primary-900 mb-6">
                                Your cart is empty
                            </h1>
                            <p className="font-body font-light text-neutral-600 text-lg mb-12 max-w-2xl mx-auto">
                                Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
                            </p>
                            <button
                                onClick={() => router.push('/products')}
                                className="bg-primary-900 text-white px-8 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 inline-flex items-center gap-3"
                            >
                                <span>Continue Shopping</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
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
                {/* Hero Section */}
                <section className="py-16 sm:py-20 md:py-24 bg-neutral-50">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className={`text-center transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <h1 className="font-cutive font-normal text-3xl sm:text-4xl md:text-5xl text-primary-900 mb-6">
                                Shopping Cart
                            </h1>
                            <p className="font-body font-light text-neutral-600 text-lg max-w-2xl mx-auto">
                                Review your selected items and proceed to checkout
                            </p>
                        </div>
                    </div>
                </section>

                {/* Cart Content */}
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className={`transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                    }`}>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-cutive font-normal text-2xl text-primary-900">
                                            Cart Items ({cart.length})
                                        </h2>
                                        <button
                                            onClick={clearCart}
                                            className="font-body font-light text-sm text-neutral-500 hover:text-red-600 transition-colors duration-300 tracking-[0.1em] uppercase"
                                        >
                                            Clear Cart
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {cart.map((item, index) => (
                                            <div
                                                key={item.product.id}
                                                className={`bg-white border border-neutral-200 rounded-sm p-6 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                                    }`}
                                                style={{ transitionDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-24 h-24 bg-neutral-100 rounded-sm overflow-hidden">
                                                            <Image
                                                                src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/images/placeholder.jpg'}
                                                                alt={item.product.name}
                                                                width={96}
                                                                height={96}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                            <div>
                                                                <span className="font-body font-light text-xs tracking-[0.1em] uppercase text-neutral-500 mb-1 block">
                                                                    {item.product.category}
                                                                </span>
                                                                <h3 className="font-cutive font-normal text-xl text-primary-900 mb-2">
                                                                    {item.product.name}
                                                                </h3>
                                                                <p className="font-body font-light text-neutral-600 text-sm mb-3">
                                                                    SKU: {item.product.sku}
                                                                </p>
                                                                <div className="flex items-center gap-3">
                                                                    {item.product.sale_price && item.product.sale_price > 0 ? (
                                                                        <>
                                                                            <span className="font-cutive font-normal text-xl text-primary-900">
                                                                                {formatPrice(item.product.sale_price)}
                                                                            </span>
                                                                            <span className="text-sm text-neutral-400 line-through font-light">
                                                                                {formatPrice(item.product.price)}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="font-cutive font-normal text-xl text-primary-900">
                                                                            {formatPrice(item.product.price)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-4">
                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-body font-light text-sm text-neutral-600">Qty:</span>
                                                                    <div className="flex items-center border border-neutral-300 rounded-sm overflow-hidden">
                                                                        <button
                                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                            disabled={item.quantity <= 1 || updatingItem === item.product.id}
                                                                            className="p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                        >
                                                                            <Minus className="w-3 h-3 text-primary-900" />
                                                                        </button>
                                                                        <span className="px-4 py-2 text-primary-900 font-light min-w-[50px] text-center">
                                                                            {updatingItem === item.product.id ? '...' : item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                            disabled={item.quantity >= item.product.stock || updatingItem === item.product.id}
                                                                            className="p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                        >
                                                                            <Plus className="w-3 h-3 text-primary-900" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Item Total */}
                                                                <div className="text-right">
                                                                    <span className="font-cutive font-normal text-xl text-primary-900">
                                                                        {formatPrice(getItemPrice(item) * item.quantity)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-neutral-200">
                                                            <button
                                                                onClick={() => moveToWishlist(item.product.id)}
                                                                disabled={updatingItem === item.product.id}
                                                                className="flex items-center gap-2 font-body font-light text-sm text-neutral-600 hover:text-primary-900 transition-colors duration-300 disabled:opacity-50"
                                                            >
                                                                <Heart className="w-4 h-4" />
                                                                Move to Wishlist
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromCart(item.product.id)}
                                                                disabled={updatingItem === item.product.id}
                                                                className="flex items-center gap-2 font-body font-light text-sm text-neutral-600 hover:text-red-600 transition-colors duration-300 disabled:opacity-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className={`bg-neutral-50 p-8 rounded-sm sticky top-24 transition-all duration-1200 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                    }`}>
                                    <h3 className="font-cutive font-normal text-2xl text-primary-900 mb-6">
                                        Order Summary
                                    </h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="font-body font-light text-neutral-600">Subtotal</span>
                                            <span className="font-body font-light text-primary-900">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-body font-light text-neutral-600">Shipping</span>
                                            <span className="font-body font-light text-primary-900">
                                                {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-body font-light text-neutral-600">Tax (7.5%)</span>
                                            <span className="font-body font-light text-primary-900">{formatPrice(tax)}</span>
                                        </div>
                                        <div className="border-t border-neutral-200 pt-4">
                                            <div className="flex justify-between">
                                                <span className="font-cutive font-normal text-xl text-primary-900">Total</span>
                                                <span className="font-cutive font-normal text-xl text-primary-900">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {shipping > 0 && (
                                        <div className="bg-blue-50 p-4 rounded-sm mb-6">
                                            <p className="font-body font-light text-sm text-blue-800">
                                                Add {formatPrice(50000 - subtotal)} more to get free shipping!
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => router.push('/checkout')}
                                        className="w-full bg-primary-900 text-white py-4 px-6 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 flex items-center justify-center gap-3 mb-4"
                                    >
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => router.push('/products')}
                                        className="w-full border border-neutral-300 text-primary-900 py-4 px-6 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-50 transition-colors duration-300"
                                    >
                                        Continue Shopping
                                    </button>

                                    {/* Trust Indicators */}
                                    <div className="space-y-3 mt-8 pt-8 border-t border-neutral-200">
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-4 h-4 text-neutral-500" />
                                            <span className="font-body font-light text-sm text-neutral-600">Free shipping over ₦50,000</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-neutral-500" />
                                            <span className="font-body font-light text-sm text-neutral-600">Secure checkout</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Package className="w-4 h-4 text-neutral-500" />
                                            <span className="font-body font-light text-sm text-neutral-600">30-day return policy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
} 