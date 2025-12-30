import { notFound } from "next/navigation";
import { Metadata } from "next";
import GuideClient from "@/components/GuideClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://betadomotweb-production.up.railway.app'
    : 'http://localhost:8080';

async function fetchGuide(slug: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/guides/${slug}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching guide:', error);
        return null;
    }
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    
    try {
        const guide = await fetchGuide(resolvedParams.slug);
        
        if (!guide) {
            return {
                title: 'Guide Not Found',
                description: 'The guide you are looking for does not exist.',
            };
        }

        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://betadomot.blog'
            : 'http://localhost:3000';
        
        const guideUrl = `${baseUrl}/guides/${guide.slug}`;
        const imageUrl = guide.featured_image 
            ? (guide.featured_image.startsWith('http') ? guide.featured_image : `${baseUrl}${guide.featured_image}`)
            : `${baseUrl}/images/og-default.jpg`;

        return {
            title: `${guide.title} | BetaDomot Guides`,
            description: guide.description || guide.content?.substring(0, 160),
            authors: [{ name: 'BetaDomot' }],
            openGraph: {
                type: 'article',
                title: guide.title,
                description: guide.description || guide.content?.substring(0, 160),
                url: guideUrl,
                siteName: 'BetaDomot',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: guide.title,
                    },
                ],
                publishedTime: guide.published_at,
                authors: ['BetaDomot'],
            },
            twitter: {
                card: 'summary_large_image',
                title: guide.title,
                description: guide.description || guide.content?.substring(0, 160),
                images: [imageUrl],
                creator: '@betadomot',
            },
            alternates: {
                canonical: guideUrl,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'BetaDomot Guides',
            description: 'Your guide to a beautiful and happy home.',
        };
    }
}

interface GuidePageProps {
    params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
    const resolvedParams = await params;
    
    try {
        const guide = await fetchGuide(resolvedParams.slug);
        if (!guide) {
            notFound();
        }

        return (
            <>
                <Header />
                <GuideClient guide={guide} />
                <Footer />
            </>
        );
    } catch (error) {
        console.error('Error fetching guide:', error);
        notFound();
    }
}
