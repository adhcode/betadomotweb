"use client";

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogPage() {
    return (
        <>
            <Header />
            <main className="bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-4 sm:mb-6">
                            The Journal
                        </h1>
                        <p className="font-body text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Fresh perspectives on home design, practical living tips, and stories that inspire beautiful spaces.
                        </p>
                    </div>

                    {/* Featured Post */}
                    {blogPosts.length > 0 && (
                        <article className="mb-16 sm:mb-20">
                            <Link href={`/blog/${blogPosts[0].id}`} className="block group">
                                <div className="relative aspect-[16/9] mb-6 sm:mb-8 overflow-hidden rounded-lg bg-gray-100">
                                    <Image
                                        src={blogPosts[0].featuredImage}
                                        alt={blogPosts[0].title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="max-w-3xl">
                                    <div className="flex items-center text-sm text-gray-500 font-body mb-3 sm:mb-4">
                                        <time>{blogPosts[0].date}</time>
                                        <span className="mx-2">·</span>
                                        <span>{blogPosts[0].readTime}</span>
                                        <span className="mx-2">·</span>
                                        <span className="text-brand-teal font-medium">Featured</span>
                                    </div>
                                    <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 group-hover:text-brand-teal transition-colors mb-3 sm:mb-4 leading-tight">
                                        {blogPosts[0].title}
                                    </h2>
                                    <p className="font-body text-base sm:text-lg text-gray-600 leading-relaxed">
                                        {blogPosts[0].excerpt}
                                    </p>
                                </div>
                            </Link>
                        </article>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-12 sm:mb-16"></div>

                    {/* All Posts */}
                    <div className="space-y-8 sm:space-y-12">
                        {blogPosts.slice(1).map((post) => (
                            <article key={post.id} className="group">
                                <Link href={`/blog/${post.id}`} className="block">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                                            <Image
                                                src={post.featuredImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2 sm:space-y-3">
                                            <div className="flex items-center text-sm text-gray-500 font-body">
                                                <time>{post.date}</time>
                                                <span className="mx-2">·</span>
                                                <span>{post.readTime}</span>
                                            </div>
                                            <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 group-hover:text-brand-teal transition-colors leading-tight">
                                                {post.title}
                                            </h3>
                                            <p className="font-body text-gray-600 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center text-brand-teal font-body font-medium text-sm">
                                                Read more
                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>

                    {/* Empty State */}
                    {blogPosts.length === 0 && (
                        <div className="text-center py-16 sm:py-20">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-heading font-semibold text-gray-900 mb-2">No posts yet</h3>
                            <p className="font-body text-gray-600">
                                Check back soon for fresh content and inspiration.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
} 