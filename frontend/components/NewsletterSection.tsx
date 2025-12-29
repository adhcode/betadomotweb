'use client';

import { useState } from 'react';
import { H2, Body, Container, Section, PrimaryButton, GhostButton, FadeInUp } from '@/components/ui/DesignSystem';

interface NewsletterSectionProps {
    className?: string;
}

export default function NewsletterSection({ className = '' }: NewsletterSectionProps) {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'homepage_newsletter' }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setEmail('');
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Newsletter subscription error:', err);
            setError('Failed to subscribe. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className={`relative bg-white overflow-hidden ${className}`}>
                {/* Localized Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(to right, #000 1px, transparent 1px),
                            linear-gradient(to bottom, #000 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }} />
                </div>
                <Section>
                    <Container className="relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <FadeInUp>
                                <div className="w-16 h-16 bg-[#236b7c] rounded-full flex items-center justify-center mx-auto mb-8">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                
                                <H2 className="mb-6">
                                    Welcome to Our Community
                                </H2>
                                
                                <Body className="font-proza text-xl mb-8 max-w-2xl mx-auto">
                                    Thank you for subscribing! You'll receive our latest home inspiration, 
                                    practical tips, and curated finds delivered to your inbox.
                                </Body>
                                
                                <GhostButton onClick={() => setIsSubmitted(false)}>
                                    Subscribe Another Email
                                </GhostButton>
                            </FadeInUp>
                        </div>
                    </Container>
                </Section>
            </section>
        );
    }

    return (
        <section className={`relative bg-white overflow-hidden ${className}`}>
            {/* Localized Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(to right, #000 1px, transparent 1px),
                        linear-gradient(to bottom, #000 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }} />
            </div>
            <Section>
                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <FadeInUp>
                            <H2 className="mb-6">
                                Stay Inspired
                            </H2>
                            
                            <Body className="font-proza text-xl mb-12 max-w-2xl mx-auto">
                                Get weekly home inspiration, practical tips, and curated finds 
                                delivered straight to your inbox. Join thousands of homeowners 
                                creating beautiful, functional spaces.
                            </Body>
                        </FadeInUp>

                        <FadeInUp delay={200}>
                            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        disabled={isLoading}
                                        className="font-proza flex-1 px-6 py-4 border border-gray-200 focus:outline-none focus:border-[#236b7c] transition-colors duration-300 font-light tracking-wide text-gray-900 placeholder-gray-400"
                                    />
                                    <PrimaryButton 
                                        type="submit" 
                                        disabled={isLoading || !email}
                                        className="px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Subscribing...' : 'Subscribe'}
                                    </PrimaryButton>
                                </div>
                                
                                {error && (
                                    <div className="mb-4 p-4 bg-gray-50 border border-gray-200">
                                        <Body className="font-proza text-sm text-gray-700">{error}</Body>
                                    </div>
                                )}
                            </form>
                        </FadeInUp>

                        <FadeInUp delay={400}>
                            <div className="font-proza flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-light tracking-wide">No spam, ever</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="font-light tracking-wide">Unsubscribe anytime</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-light tracking-wide">Weekly insights</span>
                                </div>
                            </div>
                        </FadeInUp>
                    </div>
                </Container>
            </Section>
        </section>
    );
}