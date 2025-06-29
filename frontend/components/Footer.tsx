import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-16 sm:mt-20 md:mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
                    {/* Brand */}
                    <div className="sm:col-span-2 md:col-span-2">
                        <Link href="/" className="logo text-2xl sm:text-3xl text-brand-teal-500 hover:text-brand-orange-500 transition-colors font-heading font-bold">
                            BetaDomot
                        </Link>
                        <p className="font-body text-brand-teal-700 mt-4 sm:mt-6 leading-relaxed max-w-md text-base sm:text-lg">
                            Your guide to creating beautiful, functional homes that tell your unique story.
                            Thoughtful ideas and practical wisdom for modern living.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-heading font-semibold text-brand-teal-500 mb-4 sm:mb-6 text-lg sm:text-xl">Navigate</h3>
                        <ul className="space-y-3 sm:space-y-4 text-left">
                            <li>
                                <Link href="/" className="font-body text-brand-teal-700 hover:text-brand-orange-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="font-body text-brand-teal-700 hover:text-brand-orange-500 transition-colors">
                                    Journal
                                </Link>
                            </li>
                            <li>
                                <Link href="#newsletter" className="font-body text-brand-teal-700 hover:text-brand-orange-500 transition-colors">
                                    Newsletter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-heading font-semibold text-brand-teal-500 mb-4 sm:mb-6 text-lg sm:text-xl">Connect</h3>
                        <ul className="space-y-3 sm:space-y-4 text-left">
                            <li>
                                <a href="#" className="font-body text-brand-teal-700 hover:text-brand-orange-500 transition-colors">
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="font-body text-brand-teal-700 hover:text-brand-orange-500 transition-colors">
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a href="#" className="font-body text-brand-teal-700 hover:text-brand-orange-500 transition-colors">
                                    Pinterest
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-100 pt-8 sm:pt-12 mt-12 sm:mt-16">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <p className="font-body text-brand-teal-600 text-sm sm:text-base">
                            © 2024 BetaDomot. All rights reserved.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
                            <Link href="#" className="font-body text-brand-teal-600 hover:text-brand-orange-500 transition-colors text-sm sm:text-base">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="font-body text-brand-teal-600 hover:text-brand-orange-500 transition-colors text-sm sm:text-base">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 