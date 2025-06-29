'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Button from './Button';

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="logo text-2xl md:text-3xl text-brand-teal-500 hover:text-brand-orange-500 transition-colors duration-300 font-heading font-bold"
                        onClick={closeMobileMenu}
                    >
                        BetaDomot
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
                        <Link
                            href="/"
                            className={`font-body font-medium text-base tracking-wide transition-all duration-300 relative ${pathname === '/'
                                ? 'text-brand-orange-500'
                                : 'text-brand-teal-600 hover:text-brand-orange-500'
                                }`}
                        >
                            Home
                            {pathname === '/' && (
                                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-orange-500 rounded-full"></span>
                            )}
                        </Link>
                        <Link
                            href="/blog"
                            className={`font-body font-medium text-base tracking-wide transition-all duration-300 relative ${pathname.startsWith('/blog')
                                ? 'text-brand-orange-500'
                                : 'text-brand-teal-600 hover:text-brand-orange-500'
                                }`}
                        >
                            Journal
                            {pathname.startsWith('/blog') && (
                                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-orange-500 rounded-full"></span>
                            )}
                        </Link>
                        <Button
                            href="#newsletter"
                            variant="outline"
                            size="sm"
                        >
                            Newsletter
                        </Button>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-brand-teal-600 hover:text-brand-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange-300 rounded-lg"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-6 space-y-1 bg-white border-t border-gray-100">
                            <Link
                                href="/"
                                className={`block px-3 py-3 text-base font-body font-medium transition-colors duration-300 rounded-lg ${pathname === '/'
                                    ? 'text-brand-orange-500 bg-brand-orange-50'
                                    : 'text-brand-teal-600 hover:text-brand-orange-500 hover:bg-gray-50'
                                    }`}
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                            <Link
                                href="/blog"
                                className={`block px-3 py-3 text-base font-body font-medium transition-colors duration-300 rounded-lg ${pathname.startsWith('/blog')
                                    ? 'text-brand-orange-500 bg-brand-orange-50'
                                    : 'text-brand-teal-600 hover:text-brand-orange-500 hover:bg-gray-50'
                                    }`}
                                onClick={closeMobileMenu}
                            >
                                Journal
                            </Link>
                            <div className="pt-2">
                                <Button
                                    href="#newsletter"
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={closeMobileMenu}
                                >
                                    Newsletter
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
} 