'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  read_time?: string;
  featured_image: string;
  tags: string[];
  views?: number;
  author?: string;
  category?: string;
  related_products?: string[];
}

interface EditorialBlogPostProps {
  post: BlogPost;
}

// Clap icon
function ClapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M7 14c-1.1 0-2-.9-2-2V9c0-.6.4-1 1-1s1 .4 1 1v3c0 .6.4 1 1 1" />
      <path d="M5 9V6c0-.6-.4-1-1-1s-1 .4-1 1v5c0 1.7 1.3 3 3 3" />
      <path d="M7 9V6c0-.6-.4-1-1-1s-1 .4-1 1v3" />
      <path d="M17 14c1.1 0 2-.9 2-2V9c0-.6-.4-1-1-1s-1 .4-1 1v3c0 .6-.4 1-1 1" />
      <path d="M19 9V6c0-.6.4-1 1-1s1 .4 1 1v5c0 1.7-1.3 3-3 3" />
      <path d="M17 9V6c0-.6.4-1 1-1s1 .4 1 1v3" />
      <path d="M12 5v2M10 6l1 1M14 6l-1 1" opacity="0.6" />
    </svg>
  );
}

export default function EditorialBlogPost({ post }: EditorialBlogPostProps) {
  const [imageError, setImageError] = useState(false);
  const [userClaps, setUserClaps] = useState<number>(0);
  const [totalClaps, setTotalClaps] = useState<number>(0);
  const [justClapped, setJustClapped] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem(`claps:user:${post.id}`);
    if (stored) setUserClaps(parseInt(stored, 10) || 0);
  }, [post.id]);

  useEffect(() => {
    const fetchClaps = async () => {
      try {
        const base = process.env.NODE_ENV === 'production' 
          ? 'https://betadomotweb-production.up.railway.app' 
          : 'http://localhost:8080';
        const res = await fetch(`${base}/posts/${post.slug}/claps`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.claps === 'number') setTotalClaps(data.claps);
        }
      } catch {}
    };
    fetchClaps();
  }, [post.slug]);

  const handleClap = async () => {
    if (userClaps >= 50) return;
    
    setUserClaps(prev => {
      const next = Math.min(prev + 1, 50);
      localStorage.setItem(`claps:user:${post.id}`, String(next));
      return next;
    });
    setTotalClaps(prev => prev + 1);
    setJustClapped(true);
    setTimeout(() => setJustClapped(false), 500);

    try {
      const base = process.env.NODE_ENV === 'production' 
        ? 'https://betadomotweb-production.up.railway.app' 
        : 'http://localhost:8080';
      await fetch(`${base}/posts/${post.slug}/clap`, { method: 'POST' });
    } catch {}
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/###\s+(.*?)(?=\n|$)/g, '<h3>$1</h3>')
      .replace(/##\s+(.*?)(?=\n|$)/g, '<h2>$1</h2>');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-light tracking-wide"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to articles
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="pt-32 pb-24">
        {/* Title & Meta */}
        <div className="max-w-[680px] mx-auto px-6 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 font-light">
            <time>{formatDate(post.published_at)}</time>
            <span>·</span>
            <span>{post.read_time || '6 min read'}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && !imageError && (
          <div className="max-w-[1200px] mx-auto px-6 mb-16">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-[680px] mx-auto px-6">
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-12 pb-12 border-b border-gray-100">
              {post.excerpt}
            </p>
          )}

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none"
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#000000'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: `<p>${formatContent(post.content)}</p>` }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-100">
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-600 font-light px-4 py-2 border border-gray-200 rounded-full hover:border-gray-900 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter CTA - Subtle */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="text-center max-w-md mx-auto">
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                More like this
              </h3>
              <p className="text-base text-gray-600 font-light mb-6 leading-relaxed">
                One thoughtful email a week with home ideas, tips, and curated finds.
              </p>
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:border-gray-900 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 font-light mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Fixed Clap Button - Bottom Left */}
      <div className="fixed bottom-8 left-8 z-40">
        <button
          onClick={handleClap}
          disabled={userClaps >= 50}
          className={`flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all ${
            justClapped ? 'scale-110' : ''
          } ${userClaps >= 50 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-900'}`}
        >
          <ClapIcon className="w-5 h-5 text-gray-900" />
          <span className="text-sm font-medium text-gray-900">{totalClaps}</span>
        </button>
      </div>

      {/* Fixed Share Button - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="relative">
          <button
            onClick={() => setShowShare(!showShare)}
            className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:border-gray-900 transition-all"
          >
            <Share2 size={18} className="text-gray-900" />
            <span className="text-sm font-medium text-gray-900">Share</span>
          </button>

          {showShare && (
            <div className="absolute bottom-full right-0 mb-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setShowShare(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Copy link
              </button>
              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`, '_blank');
                  setShowShare(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                Share on X
              </button>
              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                  setShowShare(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                Share on Facebook
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
