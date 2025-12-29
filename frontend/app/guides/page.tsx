"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Clock, Star, Lightbulb, BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { H1, H2, H3, Body, Container, Section, Grid, MinimalCard, FadeInUp } from "@/components/ui/DesignSystem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

interface Guide {
    id: string;
    title: string;
    description: string;
    featured_image?: string;
    read_time: string;
    category?: string;
    slug: string;
    featured: boolean;
    views: number;
    published_at: string;
}

export default function GuidesPage() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://betadomotweb-production.up.railway.app'
        : 'http://localhost:8080';

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/guides`);
                if (response.ok) {
                    const data = await response.json();
                    setGuides(Array.isArray(data) ? data : []);
                } else {
                    setError('Failed to load guides');
                }
            } catch (err) {
                console.error('Error fetching guides:', err);
                setError('Unable to connect to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
                        <div className="animate-pulse">
                            <div className="text-center mb-16">
                                <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
                                <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            <div className="h-6 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 text-center">
                        <H1 className="mb-8 font-cormorant">Unable to Load Guides</H1>
                        <Body className="text-lg mb-8 font-proza">{error}</Body>
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-900 hover:text-[#236b7c] transition-colors duration-300 tracking-wide"
                        >
                            Back to Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const featuredGuides = guides.filter(g => g.featured);
    const regularGuides = guides.filter(g => !g.featured);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
                {/* Hero Section with Gradient Background */}
                <Section className="pt-32 pb-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#236b7c]/5 via-transparent to-[#dca744]/5"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-[#dca744]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#236b7c]/10 rounded-full blur-3xl"></div>
                    
                    <Container className="text-center relative z-10">
                        <FadeInUp>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-8">
                                <Sparkles className="w-4 h-4 text-[#dca744]" />
                                <Body className="text-xs tracking-[0.15em] uppercase text-gray-600">
                                    Expert Home Guides
                                </Body>
                            </div>
                            <H1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-cormorant">
                                Transform Your
                                <span className="block bg-gradient-to-r from-[#236b7c] to-[#dca744] bg-clip-text text-transparent">
                                    Living Space
                                </span>
                            </H1>
                            <Body className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed font-proza">
                                Discover comprehensive guides to elevate your home—from organization hacks to smart living solutions.
                            </Body>
                            
                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-8 mt-12">
                                <div className="text-center">
                                    <div className="text-3xl font-light text-[#236b7c] mb-1 font-cormorant">{guides.length}+</div>
                                    <Body className="text-sm text-gray-500 font-proza">Guides</Body>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-light text-[#dca744] mb-1 font-cormorant">
                                        {guides.reduce((sum, g) => sum + g.views, 0).toLocaleString()}
                                    </div>
                                    <Body className="text-sm text-gray-500 font-proza">Total Views</Body>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-light text-[#236b7c] mb-1 font-cormorant">{featuredGuides.length}</div>
                                    <Body className="text-sm text-gray-500 font-proza">Featured</Body>
                                </div>
                            </div>
                        </FadeInUp>
                    </Container>
                </Section>

                {featuredGuides.length > 0 && (
                    <Section className="pb-16">
                        <Container>
                            <div className="mb-8">
                                <H2 className="text-2xl font-cormorant">Featured Guides</H2>
                            </div>
                            <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {featuredGuides.map((guide) => (
                                    <MinimalCard key={guide.id} className="hover:border-gray-300">
                                        <Link href={`/guides/${guide.slug}`} className="block group">
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-4">
                                                {guide.featured_image ? (
                                                    <Image
                                                        src={guide.featured_image}
                                                        alt={guide.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <Lightbulb className="w-12 h-12 text-gray-300" />
                                                    </div>
                                                )}
                                                
                                                {/* Subtle Overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                                
                                                {/* Centered Arrow Button */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-14 h-14 rounded-full bg-[#dca744] flex items-center justify-center shadow-md">
                                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                
                                                {guide.category && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-gilroy font-semibold rounded-full">
                                                            {guide.category}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                <div className="absolute top-4 right-4">
                                                    <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-gilroy font-semibold">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Featured
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-gray-400">
                                                        <Clock className="w-4 h-4" />
                                                        <Body className="text-xs font-proza">{guide.read_time}</Body>
                                                    </div>
                                                    <Body className="text-xs text-gray-400 font-proza">{guide.views} views</Body>
                                                </div>

                                                <H3 className="group-hover:text-[#236b7c] transition-colors duration-300 line-clamp-2 font-cormorant">
                                                    {guide.title}
                                                </H3>

                                                <Body className="text-sm line-clamp-2 font-proza">
                                                    {guide.description}
                                                </Body>
                                            </div>
                                        </Link>
                                    </MinimalCard>
                                ))}
                            </Grid>
                        </Container>
                    </Section>
                )}

                {regularGuides.length > 0 && (
                    <Section className="py-16 bg-gray-50">
                        <Container>
                            <div className="mb-8">
                                <H2 className="text-2xl font-cormorant">All Guides</H2>
                            </div>
                            <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {regularGuides.map((guide) => (
                                    <MinimalCard key={guide.id} className="hover:border-gray-300 bg-white">
                                        <Link href={`/guides/${guide.slug}`} className="block group">
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-4">
                                                {guide.featured_image ? (
                                                    <Image
                                                        src={guide.featured_image}
                                                        alt={guide.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <Lightbulb className="w-12 h-12 text-gray-300" />
                                                    </div>
                                                )}
                                                
                                                {/* Subtle Overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                                
                                                {/* Centered Arrow Button */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-14 h-14 rounded-full bg-[#dca744] flex items-center justify-center shadow-md">
                                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                
                                                {guide.category && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-gilroy font-semibold rounded-full">
                                                            {guide.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-gray-400">
                                                        <Clock className="w-4 h-4" />
                                                        <Body className="text-xs font-proza">{guide.read_time}</Body>
                                                    </div>
                                                    <Body className="text-xs text-gray-400 font-proza">{guide.views} views</Body>
                                                </div>

                                                <H3 className="group-hover:text-[#236b7c] transition-colors duration-300 line-clamp-2 font-cormorant">
                                                    {guide.title}
                                                </H3>

                                                <Body className="text-sm line-clamp-2 font-proza">
                                                    {guide.description}
                                                </Body>
                                            </div>
                                        </Link>
                                    </MinimalCard>
                                ))}
                            </Grid>
                        </Container>
                    </Section>
                )}

                {guides.length === 0 && !loading && (
                    <Section className="py-20">
                        <Container className="text-center">
                            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <H2 className="mb-2 font-cormorant">No guides yet</H2>
                            <Body className="text-gray-500 font-proza">Check back soon for comprehensive guides!</Body>
                        </Container>
                    </Section>
                )}

                <Section className="py-16 bg-neutral-50">
                    <Container className="text-center">
                        <Body className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6 block font-gilroy font-semibold">
                            Stay Updated
                        </Body>
                        <H2 className="mb-4 font-cormorant">
                            Get new guides delivered to your inbox
                        </H2>
                        <Body className="text-lg max-w-xl mx-auto mb-6 font-proza">
                            Subscribe to receive our latest home guides and tips every week.
                        </Body>
                        <div className="max-w-xl mx-auto">
                            <NewsletterForm variant="inline" source="guides_page" />
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
