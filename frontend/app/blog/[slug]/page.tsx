"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { use } from "react";
import React from "react";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = use(params);
    const post = blogPosts.find((p) => p.id === slug);

    if (!post) {
        notFound();
    }

    const markdownComponents = {
        h1: (props: React.ComponentProps<'h1'>) => (
            <h1 {...props} className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6 leading-tight">
                {props.children}
            </h1>
        ),
        h2: (props: React.ComponentProps<'h2'>) => (
            <h2 {...props} className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 mt-6 sm:mt-10 mb-3 sm:mb-5 leading-tight">
                {props.children}
            </h2>
        ),
        h3: (props: React.ComponentProps<'h3'>) => (
            <h3 {...props} className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-gray-900 mt-5 sm:mt-8 mb-3 sm:mb-4 leading-tight">
                {props.children}
            </h3>
        ),
        p: (props: React.ComponentProps<'p'>) => {
            return (
                <p {...props} className="font-body text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                    {props.children}
                </p>
            );
        },
        img: (props: React.ComponentProps<'img'>) => (
            <Image
                src={typeof props.src === 'string' ? props.src : ''}
                alt={props.alt || ''}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-lg object-cover my-4"
                style={{ aspectRatio: '4/3' }}
            />
        ),
        em: (props: React.ComponentProps<'em'>) => {
            // Check if this is likely a caption (italic text after an image)
            const text = props.children?.toString() || '';
            if (text.length > 20) { // Likely a caption
                return (
                    <span className="block text-center mt-2 mb-6 text-sm text-gray-600 italic leading-relaxed">
                        {props.children}
                    </span>
                );
            }
            return (
                <em {...props} className="italic text-gray-800">
                    {props.children}
                </em>
            );
        },
        ul: (props: React.ComponentProps<'ul'>) => (
            <ul {...props} className="font-body text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 pl-4 sm:pl-6 space-y-1 sm:space-y-2">
                {props.children}
            </ul>
        ),
        ol: (props: React.ComponentProps<'ol'>) => (
            <ol {...props} className="font-body text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 pl-4 sm:pl-6 space-y-1 sm:space-y-2">
                {props.children}
            </ol>
        ),
        li: (props: React.ComponentProps<'li'>) => (
            <li {...props} className="list-disc">
                {props.children}
            </li>
        ),
        strong: (props: React.ComponentProps<'strong'>) => (
            <strong {...props} className="font-bold text-gray-900">
                {props.children}
            </strong>
        ),
        blockquote: (props: React.ComponentProps<'blockquote'>) => (
            <blockquote {...props} className="border-l-4 border-brand-teal pl-4 sm:pl-6 my-6 sm:my-8 italic font-body text-base sm:text-lg text-gray-600">
                {props.children}
            </blockquote>
        ),
        code: (props: React.ComponentProps<'code'>) => (
            <code {...props} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                {props.children}
            </code>
        ),
    };

    // Process content to handle newsletter signups
    const processContent = (content: string) => {
        const parts = content.split('<NewsletterSignup />');
        const elements: React.ReactNode[] = [];

        parts.forEach((part, index) => {
            if (part.trim()) {
                elements.push(
                    <ReactMarkdown
                        key={`content-${index}`}
                        components={markdownComponents}
                    >
                        {part}
                    </ReactMarkdown>
                );
            }

            // Add newsletter signup between parts (except after the last part)
            if (index < parts.length - 1) {
                elements.push(
                    <div key={`newsletter-${index}`} className="bg-gradient-to-r from-brand-teal-50 to-brand-orange-50 rounded-2xl p-6 sm:p-8 my-8 sm:my-12 border border-brand-teal-100">
                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-teal-600 mb-2 sm:mb-3">
                                🏠 Want More Lagos Living Tips?
                            </h3>
                            <p className="font-body text-sm sm:text-base text-brand-teal-700 leading-relaxed mb-4 sm:mb-6">
                                Get practical home design advice and space-saving hacks delivered to your inbox weekly.
                            </p>
                            <NewsletterForm variant="inline" />
                        </div>
                    </div>
                );
            }
        });

        return elements;
    };

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    {/* Back Link */}
                    <div className="mb-8 sm:mb-12">
                        <Link
                            href="/blog"
                            className="inline-flex items-center font-body text-gray-600 hover:text-brand-teal transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Journal
                        </Link>
                    </div>

                    {/* Post Header */}
                    <header className="mb-8 sm:mb-12">
                        <div className="flex items-center text-sm text-gray-500 font-body mb-4 sm:mb-6">
                            <time>{post.date}</time>
                            <span className="mx-2">·</span>
                            <span>{post.readTime}</span>
                        </div>

                        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 sm:mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <p className="font-body text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10">
                            {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-body text-sm rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-[16/9] mb-8 sm:mb-12 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-lg max-w-none">
                        {processContent(post.content)}
                    </div>

                    {/* Related Posts Navigation */}
                    <div className="border-t border-gray-200 pt-8 sm:pt-12 mt-12 sm:mt-16">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <Link
                                href="/blog"
                                className="inline-flex items-center font-body font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                All Articles
                            </Link>

                            <div className="flex space-x-4">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
} 