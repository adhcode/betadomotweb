"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Calendar, ArrowLeft, Lightbulb } from "lucide-react";
import { H1, H2, Body, Container, Section, MinimalCard } from "@/components/ui/DesignSystem";
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

interface GuideClientProps {
    guide: Guide;
}

export default function GuideClient({ guide }: GuideClientProps) {
    const [relatedGuides, setRelatedGuides] = useState<Guide[]>([]);

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://betadomotweb-production.up.railway.app'
        : 'http://localhost:8080';

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const relatedResponse = await fetch(`${API_BASE_URL}/guides?limit=3`);
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json();
                    setRelatedGuides(relatedData.filter((g: Guide) => g.slug !== guide.slug).slice(0, 3));
                }
            } catch (err) {
                console.error('Error fetching related guides:', err);
            }
        };

        fetchRelated();
    }, [guide.slug, API_BASE_URL]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
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

                    {guide.description && (
                        <Body className="text-lg text-gray-600 mb-8 font-proza leading-relaxed">
                            {guide.description}
                        </Body>
                    )}
                </Container>
            </Section>

            {guide.featured_image && (
                <Section className="py-0">
                    <Container className="max-w-5xl">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-12">
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
                    <div className="prose prose-lg max-w-none">
                        <MarkdownContent content={guide.content} />
                    </div>
                </Container>
            </Section>

            {relatedGuides.length > 0 && (
                <Section className="py-16 bg-gray-50">
                    <Container className="max-w-6xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Lightbulb className="w-6 h-6 text-[#dca744]" />
                            <H2 className="font-cormorant">More Guides</H2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedGuides.map((relatedGuide) => (
                                <Link key={relatedGuide.id} href={`/guides/${relatedGuide.slug}`}>
                                    <MinimalCard className="h-full hover:shadow-lg transition-shadow duration-300">
                                        {relatedGuide.featured_image && (
                                            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                                                <Image
                                                    src={relatedGuide.featured_image}
                                                    alt={relatedGuide.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-cormorant font-medium mb-2 text-gray-900">
                                            {relatedGuide.title}
                                        </h3>
                                        <Body className="text-sm text-gray-600 font-proza line-clamp-2">
                                            {relatedGuide.description}
                                        </Body>
                                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{relatedGuide.read_time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{relatedGuide.views}</span>
                                            </div>
                                        </div>
                                    </MinimalCard>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </Section>
            )}

            <Section className="py-16 bg-white">
                <Container className="max-w-2xl text-center">
                    <H2 className="mb-4 font-cormorant">Stay Inspired</H2>
                    <Body className="text-lg text-gray-600 mb-8 font-proza">
                        Get weekly home tips and design ideas delivered to your inbox
                    </Body>
                    <NewsletterForm variant="inline" source="guide_page" />
                </Container>
            </Section>
        </main>
    );
}
