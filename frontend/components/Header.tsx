'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronRight, Mail, CheckCircle, AlertCircle, Instagram } from 'lucide-react';
import Image from 'next/image';
import { Container } from './ui/DesignSystem';

// Pinterest icon component (Lucide doesn't have Pinterest)
function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
    );
}

// X (Twitter) icon component
function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    );
}

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
            title: 'Articles',
            hasSubmenu: true,
            items: [
                { label: 'All articles', href: '/categories', isUnderlined: true },
                { label: 'By topics', href: '#', isSubheading: true },
                { label: 'Cleaning', href: '/category/cleaning' },
                { label: 'Organizing', href: '/category/organization' },
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
                                        className="px-4 py-3 text-gray-700 text-sm font-proza rounded-md hover:text-[#236b7c] transition-colors duration-200"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: '300'
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
                                fontWeight: '400',
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

                    {mobileMenuSections.map((section) => (
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
                                            {section.items?.map((item) => {
                                                // Check if it's a subheading
                                                if (item.isSubheading) {
                                                    return (
                                                        <div
                                                            key={item.label}
                                                            style={{
                                                                padding: '12px 12px 8px 12px',
                                                                fontSize: '12px',
                                                                fontFamily: 'var(--font-proza)',
                                                                fontWeight: '600',
                                                                color: '#9ca3af',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em'
                                                            }}
                                                        >
                                                            {item.label}
                                                        </div>
                                                    );
                                                }
                                                
                                                return (
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
                                                            fontWeight: item.isUnderlined ? '500' : '400',
                                                            color: item.isUnderlined ? '#374151' : '#6b7280',
                                                            display: 'block',
                                                            textDecoration: item.isUnderlined ? 'underline' : 'none',
                                                            textUnderlineOffset: '4px'
                                                        }}
                                                    >
                                                        {item.label}
                                                    </button>
                                                );
                                            })}
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
                        padding: isMobile ? '20px' : '24px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        maxWidth: isMobile ? '100%' : '360px'
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
                            fontSize: '13px',
                            fontFamily: 'var(--font-proza)',
                            fontWeight: '400',
                            color: '#6b7280',
                            marginBottom: '16px',
                            lineHeight: '1.6'
                        }}>
                            Get weekly home tips and design inspiration.
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
                                    backgroundColor: '#dca744',
                                    color: '#1f2937',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'var(--font-gilroy)',
                                    fontWeight: '600',
                                    opacity: (newsletterStatus === 'loading' || !newsletterEmail) ? 0.5 : 1
                                }}
                            >
                                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
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
                                color: '#9ca3af',
                                textAlign: 'center',
                                marginTop: '10px',
                                fontFamily: 'var(--font-proza)',
                                fontWeight: '400',
                                lineHeight: '1.4'
                            }}>
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    </div>

                    {/* Social Links */}
                    <div style={{
                        marginTop: '24px',
                        padding: isMobile ? '20px' : '24px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        maxWidth: isMobile ? '100%' : '360px'
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontFamily: 'var(--font-gilroy)',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '16px'
                        }}>
                            Follow Us
                        </h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a
                                href="https://www.instagram.com/betadomot?igsh=MWNhZm5mMW5uN3V6cQ%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#374151';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.color = '#374151';
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a
                                href="https://pin.it/7EhYpm8fd"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E60023';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.color = '#374151';
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                                </svg>
                            </a>
                            <a
                                href="https://x.com/betadomot"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#000000';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.color = '#374151';
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}