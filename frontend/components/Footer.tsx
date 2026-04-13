import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/images/blog/beta-logo2.png"
                                alt="Betadomot"
                                width={100}
                                height={24}
                                style={{ width: 'auto', height: '24px' }}
                            />
                        </Link>
                        <p className="text-base font-light text-gray-600 leading-relaxed max-w-md">
                            Curated stories and guides for creating intentional, beautiful homes
                        </p>
                    </div>

                    {/* Read */}
                    <div>
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-6">
                            Read
                        </h3>
                        <div className="space-y-3">
                            <Link href="/blog" className="block text-sm font-light text-gray-700 hover:text-gray-900 transition-colors">
                                Stories
                            </Link>
                            <Link href="/guides" className="block text-sm font-light text-gray-700 hover:text-gray-900 transition-colors">
                                Guides
                            </Link>
                        </div>
                    </div>

                    {/* Shop & About */}
                    <div>
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-6">
                            More
                        </h3>
                        <div className="space-y-3">
                            <Link href="https://betadomot.com" className="block text-sm font-light text-gray-700 hover:text-gray-900 transition-colors">
                                Shop
                            </Link>
                            <Link href="/about" className="block text-sm font-light text-gray-700 hover:text-gray-900 transition-colors">
                                About
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <p className="text-sm font-light text-gray-500">
                            © 2025 Betadomot
                        </p>
                        <div className="flex items-center space-x-8">
                            <Link href="/privacy" className="text-sm font-light text-gray-500 hover:text-gray-900 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm font-light text-gray-500 hover:text-gray-900 transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
