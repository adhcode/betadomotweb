'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronRight, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Container } from './ui/DesignSystem';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navigationItems = [
        { label: 'Cleaning', href: '/category/cleaning' },
        { label: 'Organizing', href: '/category/organization' },
        { label: 'Decorating', href: '/category/decorating' },
        { label: 'Energy Saving', href: '/category/energy-savings' },
    ];

    const mobileMenuSections = [
        {
            title: 'Read',
            hasSubmenu: true,
            items: [
                { label: 'Cleaning', href: '/category/cleaning' },
                { label: 'Organizing', href: '/category/organizing' },
                { label: 'Life', href: '/category/life' },
                { label: 'Decorating', href: '/category/decorating' },
                { label: 'Energy Saving', href: '/category/energy-savings' },
                { label: 'Security & Safety', href: '/category/security-safety' },
                { label: 'Home Tech', href: '/category/smart-tech' },
                { label: 'Home Projects', href: '/category/home-projects' }
            ]
        },
        {
            title: 'Shop',
            hasSubmenu: false,
            href: 'https://betadomot.com'
        },
        {
            title: 'Browse Guides',
            hasSubmenu: true,
            items: [
                { label: 'All Guides', href: '/guides' },
                { label: 'Popular Guides', href: '/guides?sort=popular' }
            ]
        }
    ];

    const handleNavigation = (href: string) => {
        if (href.startsWith('http')) {
            window.open(href, '_blank');
        } else {
            router.push(href);
        }
        setIsMenuOpen(false);
    };

    const toggleSection = (title: string) => {
        setExpandedSection(expandedSection === title ? null : title);
    };

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterStatus('loading');

        try {
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newsletterEmail, source: 'header_menu' })
            });

            if (response.ok) {
                setNewsletterStatus('success');
                setNewsletterEmail('');
                setTimeout(() => setNewsletterStatus('idle'), 3000);
            } else {
                setNewsletterStatus('error');
                setTimeout(() => setNewsletterStatus('idle'), 3000);
            }
        } catch (error) {
            setNewsletterStatus('error');
            setTimeout(() => setNewsletterStatus('idle'), 3000);
        }
    };

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200 shadow-sm">
                <Container>
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <button
                            onClick={() => handleNavigation('/')}
                            className="p-2 -ml-2"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Image
                                src="/images/blog/beta-logo2.png"
                                alt="BetaDomot"
                                width={100}
                                height={24}
                                className="h-6 w-auto"
                                priority
                            />
                        </button>

                        {/* Desktop Navigation - Hidden on mobile */}
                        {!isMobile && (
                            <nav className="flex items-center gap-2">
                                {navigationItems.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => handleNavigation(item.href)}
                                        className="px-4 py-3 text-gray-700 text-sm font-gilroy font-bold rounded-md hover:text-[#236b7c] transition-colors duration-200"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        )}

                        {/* Desktop Actions & Mobile Menu */}
                        <div className="flex items-center gap-4">
                            {/* Desktop Search & Menu Button - Hidden on mobile */}
                            {!isMobile && (
                                <div className="flex items-center gap-3">
                                    {/* Desktop Search */}
                                    <div className="relative">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Search articles or guides..."
                                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-proza w-[220px] outline-none focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                        />
                                    </div>

                                    {/* Desktop Menu Button */}
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Menu size={20} />
                                    </button>
                                </div>
                            )}

                            {/* Mobile Menu Button - Visible only on mobile */}
                            {isMobile && (
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 text-gray-700"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            )}
                        </div>
                    </div>
                </Container>
            </header>

            {/* Desktop Menu Backdrop - Only on desktop */}
            {isMenuOpen && !isMobile && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 998
                    }}
                />
            )}

            {/* Menu Overlay - Desktop (slides from right) & Mobile (full screen from top) */}
            {isMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: isMobile ? '64px' : 0,
                        right: isMobile ? 0 : 0,
                        left: isMobile ? 0 : 'auto',
                        bottom: 0,
                        width: isMobile ? '100%' : '400px',
                        backgroundColor: '#ffffff',
                        zIndex: 999,
                        overflowY: 'auto',
                        padding: '20px',
                        boxShadow: isMobile ? 'none' : '-4px 0 6px -1px rgb(0 0 0 / 0.1)',
                        transform: 'translateX(0)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    {/* Desktop Menu Header - Only show on desktop */}
                    {!isMobile && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: '16px',
                            marginBottom: '20px',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontFamily: 'var(--font-gilroy)',
                                fontWeight: '600',
                                color: '#374151',
                                margin: 0
                            }}>
                                Menu
                            </h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    color: '#6b7280',
                                    borderRadius: '6px'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {mobileMenuSections.map((section, idx) => (
                        <div key={section.title} style={{ marginBottom: '24px' }}>
                            {section.hasSubmenu ? (
                                <>
                                    <button
                                        onClick={() => toggleSection(section.title)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontFamily: 'var(--font-gilroy)',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}
                                    >
                                        {section.title}
                                        <ChevronRight
                                            size={20}
                                            style={{
                                                transform: expandedSection === section.title ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>
                                    {expandedSection === section.title && (
                                        <div style={{ paddingLeft: '24px', marginTop: '8px' }}>
                                            {section.items?.map((item) => (
                                                <button
                                                    key={item.href}
                                                    onClick={() => handleNavigation(item.href)}
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '8px 12px',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontFamily: 'var(--font-proza)',
                                                        fontWeight: '400',
                                                        color: '#6b7280',
                                                        display: 'block'
                                                    }}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => handleNavigation(section.href!)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontFamily: 'var(--font-gilroy)',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}
                                >
                                    {section.title}
                                    <ChevronRight size={20} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Newsletter Section */}
                    <div style={{
                        marginTop: '32px',
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontFamily: 'var(--font-gilroy)',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                        }}>
                            Stay Inspired
                        </h3>
                        <p style={{
                            fontSize: '12px',
                            fontFamily: 'var(--font-proza)',
                            fontWeight: '400',
                            color: '#6b7280',
                            marginBottom: '16px',
                            lineHeight: '1.5'
                        }}>
                            Home ideas that inspire, products we actually love, and tips that work—all curated just for you.
                        </p>

                        <form onSubmit={handleNewsletterSubmit}>
                            <div style={{ position: 'relative', marginBottom: '12px' }}>
                                <Mail
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9ca3af'
                                    }}
                                />
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={{
                                        width: '100%',
                                        paddingLeft: '40px',
                                        paddingRight: '16px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'var(--font-proza)',
                                        fontWeight: '400'
                                    }}
                                    disabled={newsletterStatus === 'loading'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={newsletterStatus === 'loading' || !newsletterEmail}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#236b7c',
                                    color: '#ffffff',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'var(--font-gilroy)',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    opacity: (newsletterStatus === 'loading' || !newsletterEmail) ? 0.5 : 1
                                }}
                            >
                                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                            </button>

                            {newsletterStatus === 'success' && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#059669',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-proza)',
                                    marginTop: '8px'
                                }}>
                                    <CheckCircle size={16} />
                                    <span>Welcome! Check your email.</span>
                                </div>
                            )}

                            {newsletterStatus === 'error' && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#dc2626',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-proza)',
                                    marginTop: '8px'
                                }}>
                                    <AlertCircle size={16} />
                                    <span>Oops! Please try again.</span>
                                </div>
                            )}

                            <p style={{
                                fontSize: '11px',
                                color: '#6b7280',
                                textAlign: 'center',
                                marginTop: '8px',
                                fontFamily: 'var(--font-proza)',
                                fontWeight: '400'
                            }}>
                                We respect your inbox. Only the good stuff, promise.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}