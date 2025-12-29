"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Calendar, ArrowLeft, Lightbulb } from "lucide-react";
import { H1, H2, Body, Container, Section, MinimalCard } from "@/components/ui/DesignSystem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import MarkdownContent from "@/components/MarkdownContent";

interface Guide {
    id: string;
    title: string;
    description: string;
    content: string;
    featured_image?: string;
    read_time: string;
    category?: string;
    slug: string;
    featured: boolean;
    views: number;
    published_at: string;
}

export default function GuidePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [guide, setGuide] = useState<Guide | null>(null);
    const [relatedGuides, setRelatedGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://betadomotweb-production.up.railway.app'
        : 'http://localhost:8080';

    useEffect(() => {
        if (!slug) return;

        const fetchGuide = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/guides/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setGuide(data);

                    const relatedResponse = await fetch(`${API_BASE_URL}/guides?limit=3`);
                    if (relatedResponse.ok) {
                        const relatedData = await relatedResponse.json();
                        setRelatedGuides(relatedData.filter((g: Guide) => g.slug !== slug).slice(0, 3));
                    }
                } else {
                    setError('Guide not found');
                }
            } catch (err) {
                console.error('Error fetching guide:', err);
                setError('Unable to load guide');
            } finally {
                setLoading(false);
            }
        };

        fetchGuide();
    }, [slug]);

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
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                            <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !guide) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-center">
                        <H1 className="mb-8 font-cormorant">Guide Not Found</H1>
                        <Body className="text-lg mb-8 font-proza">{error || 'This guide does not exist'}</Body>
                        <Link
                            href="/guides"
                            className="inline-flex items-center gap-2 text-gray-900 hover:text-[#236b7c] transition-colors duration-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Guides
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <Section className="pt-24 pb-8">
                    <Container className="max-w-4xl">
                        <Link
                            href="/guides"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#236b7c] transition-colors duration-300 mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <Body className="text-sm font-proza">Back to Guides</Body>
                        </Link>

                        {guide.category && (
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-[#dca744]/10 text-[#dca744] text-xs font-gilroy font-semibold rounded-full">
                                    {guide.category}
                                </span>
                            </div>
                        )}

                        <H1 className="mb-6 font-cormorant">{guide.title}</H1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <Body className="text-sm font-proza">{formatDate(guide.published_at)}</Body>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <Body className="text-sm font-proza">{guide.read_time}</Body>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <Body className="text-sm font-proza">{guide.views} views</Body>
                            </div>
                        </div>

                        <Body className="text-lg text-gray-600 mb-8 font-proza">
                            {guide.description}
                        </Body>
                    </Container>
                </Section>

                {guide.featured_image && (
                    <Section className="pb-8">
                        <Container className="max-w-4xl">
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                <Image
                                    src={guide.featured_image}
                                    alt={guide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </Container>
                    </Section>
                )}

                <Section className="py-8">
                    <Container className="max-w-4xl">
                        <article className="prose prose-lg max-w-none">
                            <MarkdownContent content={guide.content} />
                        </article>
                    </Container>
                </Section>

                <Section className="py-16 bg-gray-50">
                    <Container className="max-w-4xl">
                        <MinimalCard className="bg-[#236b7c] text-white">
                            <div className="text-center py-8">
                                <H2 className="text-white mb-4 font-cormorant">Found this guide helpful?</H2>
                                <Body className="text-white/90 mb-6 font-proza">
                                    Subscribe to get more guides like this delivered to your inbox.
                                </Body>
                                <div className="max-w-md mx-auto">
                                    <NewsletterForm variant="inline" source={`guide_${guide.slug}`} />
                                </div>
                            </div>
                        </MinimalCard>
                    </Container>
                </Section>

                {relatedGuides.length > 0 && (
                    <Section className="py-16">
                        <Container>
                            <H2 className="mb-8 font-cormorant">Related Guides</H2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedGuides.map((relatedGuide) => (
                                    <MinimalCard key={relatedGuide.id} className="hover:border-[#dca744]">
                                        <Link href={`/guides/${relatedGuide.slug}`} className="block group">
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-4">
                                                {relatedGuide.featured_image ? (
                                                    <Image
                                                        src={relatedGuide.featured_image}
                                                        alt={relatedGuide.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <Lightbulb className="w-12 h-12 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="font-proza">{relatedGuide.read_time}</span>
                                                </div>

                                                <Body className="font-medium group-hover:text-[#236b7c] transition-colors line-clamp-2 font-cormorant">
                                                    {relatedGuide.title}
                                                </Body>
                                            </div>
                                        </Link>
                                    </MinimalCard>
                                ))}
                            </div>
                        </Container>
                    </Section>
                )}
            </main>
            <Footer />
        </>
    );
}
