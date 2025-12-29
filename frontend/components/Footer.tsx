import Link from 'next/link';
import Image from 'next/image';
import { Body, Container, MinimalButton } from './ui/DesignSystem';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12 sm:mt-16 md:mt-24">
            <Container className="py-16 sm:py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="group inline-block mb-8">
                            <Image
                                src="/images/blog/beta-logo2.png"
                                alt="BetaDomot"
                                width={100}
                                height={24}
                                className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>
                        <Body className="max-w-sm mb-6 text-gray-600 font-proza">
                            Smart living, beautiful spaces, better homes. Practical guides and everyday systems for Nigerian homes.
                        </Body>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            <MinimalButton
                                className="text-gray-400 hover:text-[#236b7c] p-2"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </MinimalButton>
                            <MinimalButton
                                className="text-gray-400 hover:text-[#236b7c] p-2"
                                aria-label="X (Twitter)"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </MinimalButton>
                            <MinimalButton
                                className="text-gray-400 hover:text-[#236b7c] p-2"
                                aria-label="Pinterest"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.222.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                                </svg>
                            </MinimalButton>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:space-x-12 space-y-8 sm:space-y-0">
                            <div className="flex-1">
                                <h3 className="text-sm font-gilroy font-bold text-gray-900 mb-3">Explore</h3>
                                <div className="space-y-3">
                                    <Link href="/blog">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Blog
                                        </MinimalButton>
                                    </Link>
                                    <Link href="/guides">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Guides
                                        </MinimalButton>
                                    </Link>
                                    <Link href="/about">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            About
                                        </MinimalButton>
                                    </Link>
                                    <a href="https://betadomot.com" target="_blank" rel="noopener noreferrer">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Shop
                                        </MinimalButton>
                                    </a>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-gilroy font-bold text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-3">
                                    <Link href="/category/cleaning">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Cleaning
                                        </MinimalButton>
                                    </Link>
                                    <Link href="/category/organization">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Organization
                                        </MinimalButton>
                                    </Link>
                                    <Link href="/category/decorating">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Decorating
                                        </MinimalButton>
                                    </Link>
                                    <Link href="/category/energy-savings">
                                        <MinimalButton className="text-gray-600 hover:text-[#236b7c] text-sm block font-proza">
                                            Energy Savings
                                        </MinimalButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <Body className="text-gray-500 text-sm font-proza">
                            © 2025 BetaDomot. We build content for homes that breathe, save, and belong.
                        </Body>
                        <div className="flex items-center space-x-8">
                            <Link href="/privacy">
                                <MinimalButton className="text-gray-500 hover:text-[#236b7c] text-sm font-proza">
                                    Privacy
                                </MinimalButton>
                            </Link>
                            <Link href="/terms">
                                <MinimalButton className="text-gray-500 hover:text-[#236b7c] text-sm font-proza">
                                    Terms
                                </MinimalButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
} 