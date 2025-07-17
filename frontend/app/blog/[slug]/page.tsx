"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Calendar, Clock, Eye, Facebook, Twitter, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Comments from "@/components/Comments";
import NewsletterForm from "@/components/NewsletterForm";
import { fetchPost } from "@/lib/api-client";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time: string;
    featured_image: string;
    tags: string[];
    views: number;
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                console.log('Fetching post with slug:', resolvedParams.slug);
                const data = await fetchPost(resolvedParams.slug);
                
                if (!data) {
                    console.log('Post not found');
                    notFound();
                    return;
                }
                
                console.log('Fetched post data:', data);
                setPost(data);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch post');
            } finally {
                setLoading(false);
            }
        };

        loadPost();

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [resolvedParams.slug]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatContent = (content: string) => {
        if (!content) return '';

        let html = content;

        // Split content into paragraphs and process each one
        const paragraphs = html.split(/\n\s*\n/);

        html = paragraphs.map(paragraph => {
            paragraph = paragraph.trim();
            if (!paragraph) return '';

            // Convert headings
            if (paragraph.startsWith('### ')) {
                return `<h3 class="text-2xl font-bold text-black mb-4 mt-8">${paragraph.substring(4)}</h3>`;
            }
            if (paragraph.startsWith('## ')) {
                return `<h2 class="text-3xl font-bold text-black mb-6 mt-10 border-b border-neutral-200 pb-3">${paragraph.substring(3)}</h2>`;
            }
            if (paragraph.startsWith('# ')) {
                return `<h1 class="text-4xl font-bold text-black mb-6 mt-8">${paragraph.substring(2)}</h1>`;
            }

            // Convert bullet points
            if (paragraph.includes('- ')) {
                const lines = paragraph.split('\n');
                const listItems = lines
                    .filter(line => line.trim().startsWith('- '))
                    .map(line => `<li class="mb-2 text-black text-lg leading-relaxed">${line.trim().substring(2)}</li>`)
                    .join('');
                const nonListContent = lines
                    .filter(line => !line.trim().startsWith('- '))
                    .join(' ')
                    .trim();

                let result = '';
                if (nonListContent) {
                    result += `<p class="text-lg leading-relaxed text-black mb-6">${nonListContent}</p>`;
                }
                if (listItems) {
                    result += `<ul class="list-disc pl-6 mb-6 space-y-2">${listItems}</ul>`;
                }
                return result;
            }

            // Convert numbered lists
            if (/\d+\./.test(paragraph)) {
                const lines = paragraph.split('\n');
                const listItems = lines
                    .filter(line => /^\d+\./.test(line.trim()))
                    .map(line => `<li class="mb-2 text-black text-lg leading-relaxed">${line.trim().replace(/^\d+\.\s*/, '')}</li>`)
                    .join('');
                const nonListContent = lines
                    .filter(line => !/^\d+\./.test(line.trim()))
                    .join(' ')
                    .trim();

                let result = '';
                if (nonListContent) {
                    result += `<p class="text-lg leading-relaxed text-black mb-6">${nonListContent}</p>`;
                }
                if (listItems) {
                    result += `<ol class="list-decimal pl-6 mb-6 space-y-2">${listItems}</ol>`;
                }
                return result;
            }

            // Convert code blocks
            if (paragraph.includes('```')) {
                return `<pre class="bg-neutral-900 text-white p-6 rounded-lg overflow-x-auto mb-6 text-sm"><code>${paragraph.replace(/```[\w]*\n?/, '').replace(/```$/, '')}</code></pre>`;
            }

            // Convert inline code
            paragraph = paragraph.replace(/`([^`]+)`/g, '<code class="bg-neutral-100 px-2 py-1 rounded text-[#236b7c] text-base">$1</code>');

            // Convert bold text
            paragraph = paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-[#236b7c]">$1</strong>');

            // Convert italic text
            paragraph = paragraph.replace(/\*([^*]+)\*/g, '<em class="italic text-[#dca744]">$1</em>');

            // Convert links
            paragraph = paragraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#dca744] hover:text-[#236b7c] transition-colors duration-300 underline">$1</a>');

            // Convert blockquotes
            if (paragraph.startsWith('> ')) {
                return `<blockquote class="border-l-4 border-[#236b7c] pl-6 py-4 my-6 bg-neutral-50 rounded-r-lg italic text-lg text-black">${paragraph.substring(2)}</blockquote>`;
            }

            // Regular paragraph
            return `<p class="text-lg leading-relaxed text-black mb-6">${paragraph}</p>`;
        }).join('');

        return html;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post?.title || '';

    const handleImageError = () => {
        setImageError(true);
    };

    const isExternalImage = (src: string) => {
        return src.startsWith('http://') || src.startsWith('https://');
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
                        <div className="animate-pulse">
                            <div className="h-4 bg-neutral-200 rounded w-24 mb-8"></div>
                            <div className="h-12 bg-neutral-200 rounded w-full mb-6"></div>
                            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-8"></div>
                            <div className="aspect-[16/9] bg-neutral-200 rounded mb-12"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-4 bg-neutral-200 rounded w-full"></div>
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
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-center">
                        <h1 className="text-2xl font-gilroy text-black mb-4">Error Loading Post</h1>
                        <p className="text-black mb-8">{error}</p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-black hover:text-[#236b7c] transition-colors duration-300 font-gilroy tracking-wide"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-white pt-20">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-center">
                        <h1 className="text-2xl font-gilroy text-black mb-4">Post Not Found</h1>
                        <p className="text-black mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-black hover:text-[#236b7c] transition-colors duration-300 font-gilroy tracking-wide"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
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
                {/* Back to Blog Button */}
                <div className="pt-24 pb-8">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8">
                        <Link
                            href="/blog"
                            className={`inline-flex items-center text-black hover:text-[#236b7c] transition-all duration-300 font-gilroy tracking-wide group ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Blog
                        </Link>
                    </div>
                </div>

                <article className="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
                    {/* Article Meta */}
                    <div className={`flex flex-wrap items-center gap-6 text-sm mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center text-black">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-gilroy tracking-wide">{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center text-black">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-gilroy tracking-wide">{post.read_time}</span>
                        </div>
                        <div className="flex items-center text-black">
                            <Eye className="w-4 h-4 mr-2" />
                            <span className="font-gilroy tracking-wide">{post.views} views</span>
                        </div>
                    </div>

                    {/* Article Title */}
                    <h1 className={`font-gilroy font-extra-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black leading-tight tracking-tight mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {post.title}
                    </h1>

                    {/* Article Excerpt */}
                    <div className={`font-gilroy font-light text-xl text-black leading-relaxed mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <p className="text-xl leading-relaxed italic border-l-4 border-[#dca744] pl-6 py-4 bg-neutral-50 rounded-r-lg">
                            {post.excerpt}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-gilroy tracking-wide rounded-full hover:bg-[#dca744] hover:text-white transition-colors duration-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Share Buttons */}
                    <div className={`flex items-center gap-4 mb-12 pb-8 border-b border-neutral-200 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <span className="font-gilroy text-sm text-black tracking-wide">Share:</span>
                        <div className="flex gap-3">
                            <a
                                href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-black hover:text-[#236b7c] transition-colors duration-300"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featured_image && !imageError && (
                        <div className={`mb-12 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <Image
                                src={post.featured_image}
                                alt={post.title}
                                width={800}
                                height={450}
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                                onError={handleImageError}
                                priority
                                unoptimized={isExternalImage(post.featured_image)}
                            />
                        </div>
                    )}

                    {/* Fallback when image fails to load */}
                    {(imageError || !post.featured_image) && (
                        <div className={`mb-12 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="w-full aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center">
                                <div className="text-center text-neutral-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-gilroy text-sm">Image not available</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div
                            className="blog-content font-gilroy"
                            style={{ lineHeight: '1.8' }}
                            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                        />
                    </div>

                    {/* Reading Progress Indicator */}
                    <div className="mt-16 pt-8 border-t border-neutral-200">
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{post.read_time}</span>
                                </div>
                                <div className="flex items-center">
                                    <Eye className="w-4 h-4 mr-2" />
                                    <span>{post.views} views</span>
                                </div>
                            </div>
                            <div className="text-neutral-400">
                                Published {formatDate(post.published_at)}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Newsletter Subscription Section */}
                <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    <NewsletterForm variant="blog-post" />
                </div>

                {/* Comments Section */}
                <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
                    <Comments postSlug={post.slug} />
                </div>
            </main>
            <Footer />
        </>
    );
} 