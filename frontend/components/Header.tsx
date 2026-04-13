'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Menu } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Main Header - Minimal Editorial Style */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - Centered vertically */}
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/blog/beta-logo2.png"
                                alt="Betadomot"
                                width={100}
                                height={24}
                                className="h-6 w-auto"
                                priority
                            />
                        </Link>

                        {/* Menu Icon - Centered vertically */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center"
                            aria-label="Open menu"
                        >
                            <Menu size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Full-Screen Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                    {/* Close Button */}
                    <div className="absolute top-6 right-6 lg:top-12 lg:right-12">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Menu Content */}
                    <div className="min-h-full flex items-center justify-center px-6 py-24">
                        <div className="max-w-6xl w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-20">
                                
                                {/* Read */}
                                <div className="space-y-6">
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                                        Read
                                    </h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/blog"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Stories
                                        </Link>
                                        <Link
                                            href="/guides"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Guides
                                        </Link>
                                    </div>
                                </div>

                                {/* Categories - Column 1 */}
                                <div className="space-y-6">
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                                        Categories
                                    </h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/category/cleaning"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Cleaning
                                        </Link>
                                        <Link
                                            href="/category/organization"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Organizing
                                        </Link>
                                        <Link
                                            href="/category/life"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Home Life
                                        </Link>
                                        <Link
                                            href="/category/decorating"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Decorating
                                        </Link>
                                    </div>
                                </div>

                                {/* Categories - Column 2 */}
                                <div className="space-y-6">
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                                        &nbsp;
                                    </h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/category/energy-savings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Energy Savings
                                        </Link>
                                        <Link
                                            href="/category/security-safety"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Security & Safety
                                        </Link>
                                        <Link
                                            href="/category/smart-tech"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Smart Tech
                                        </Link>
                                        <Link
                                            href="/category/home-projects"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Home Projects
                                        </Link>
                                    </div>
                                </div>

                                {/* Shop */}
                                <div className="space-y-6">
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                                        Shop
                                    </h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="https://betadomot.com"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Browse Products
                                        </Link>
                                    </div>
                                </div>

                                {/* About */}
                                <div className="space-y-6">
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                                        About
                                    </h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/about"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            Our Story
                                        </Link>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
