'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import Image from 'next/image';

interface CartItem {
    product_id: string;
    product_slug: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(count);
        };

        // Initial cart count
        updateCartCount();

        // Listen for scroll events
        window.addEventListener('scroll', handleScroll);

        // Listen for storage changes (cart updates)
        window.addEventListener('storage', updateCartCount);

        // Custom event for cart updates within the same tab
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleNavigation = (href: string) => {
        router.push(href);
        setIsMenuOpen(false);
    };

    const handleCartClick = () => {
        router.push('/cart');
    };

    const navigationItems = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Blog', href: '/blog' },

    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 border-b border-neutral-200'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => handleNavigation('/')}
                            className="flex items-center space-x-3 group"
                        >
                            <Image src="/images/blog/beta-logo2.png" alt="Betadomot" width={150} height={150} />
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => handleNavigation(item.href)}
                                className="font-gilroy text-black hover:text-[#236b7c] transition-colors duration-300 relative group py-2"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dca744] transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Search */}
                        <button className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Account */}
                        <button className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300">
                            <User className="w-5 h-5" />
                        </button>

                        {/* Cart */}
                        <button
                            onClick={handleCartClick}
                            className="relative p-2 text-black hover:text-[#236b7c] transition-colors duration-300"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#dca744] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen
                        ? 'max-h-80 opacity-100 pb-6'
                        : 'max-h-0 opacity-0'
                        }`}
                >
                    <nav className="pt-6 border-t border-neutral-200">
                        <div className="flex flex-col space-y-4">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => handleNavigation(item.href)}
                                    className="font-gilroy text-left text-black hover:text-[#236b7c] transition-colors duration-300 py-2"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200">
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300">
                                    <User className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={handleCartClick}
                                className="relative p-2 text-black hover:text-[#236b7c] transition-colors duration-300"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#dca744] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
} 