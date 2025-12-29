'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    MessageSquare,
    Users,
    TrendingUp,
    Plus,
    RefreshCw,
    Eye,
    Star,
    Sparkles,
    Home,
    Lightbulb,
    Shield,
    Zap
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    total_posts: number;
    total_views: number;
    total_comments: number;
    total_subscribers: number;
}

interface RecentPost {
    id: string;
    title: string;
    slug: string;
    published_at: string;
    views: number;
    category?: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const categories = [
        { name: 'Cleaning', icon: Sparkles, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { name: 'Organization', icon: Home, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
        { name: 'Life', icon: Star, color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-600' },
        { name: 'Decorating', icon: Sparkles, color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
        { name: 'Energy Savings', icon: Zap, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
        { name: 'Security & Safety', icon: Shield, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-600' },
        { name: 'Smart & Tech', icon: Lightbulb, color: 'bg-cyan-500', lightColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
        { name: 'Home Projects', icon: Home, color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600' },
    ];

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const base = process.env.NODE_ENV === 'production'
                    ? 'https://betadomotweb-production.up.railway.app'
                    : 'http://localhost:8080';

                const raw = localStorage.getItem('adminCredentials') || sessionStorage.getItem('adminCredentials') || '{}';
                const credentials = JSON.parse(raw);
                if (!credentials?.username || !credentials?.password) {
                    router.push('/admin/login');
                    return;
                }
                const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);

                // Dashboard stats
                const statsRes = await fetch(`${base}/admin/dashboard`, { headers: { Authorization: authHeader } });
                if (statsRes.status === 401) { router.push('/admin/login'); return; }
                if (!statsRes.ok) throw new Error(`HTTP ${statsRes.status}`);
                const statsJson = await statsRes.json();
                setStats(statsJson);

                // Recent posts
                const postsRes = await fetch(`${base}/admin/posts?limit=5`, { headers: { Authorization: authHeader } });
                if (postsRes.ok) {
                    const postsJson = await postsRes.json();
                    console.log('Posts received:', postsJson);
                    console.log('Is array?', Array.isArray(postsJson));
                    console.log('Length:', postsJson?.length);
                    setRecentPosts(Array.isArray(postsJson) ? postsJson.slice(0, 5) : []);
                } else {
                    console.error('Failed to fetch posts:', postsRes.status, postsRes.statusText);
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#236b7c]" />
                    <span className="text-gray-600">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                    onClick={() => location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-medium text-gray-900">Welcome back</h1>
                <p className="text-gray-500">Here's what's happening with your blog today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                            Active
                        </span>
                    </div>
                    <div className="text-3xl font-light text-gray-900 mb-1">
                        {stats?.total_posts || 0}
                    </div>
                    <p className="text-sm text-gray-500">Total Posts</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Eye className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            +12%
                        </span>
                    </div>
                    <div className="text-3xl font-light text-gray-900 mb-1">
                        {stats?.total_views?.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-gray-500">Total Views</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                            +5
                        </span>
                    </div>
                    <div className="text-3xl font-light text-gray-900 mb-1">
                        {stats?.total_comments || 0}
                    </div>
                    <p className="text-sm text-gray-500">Comments</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                            +8%
                        </span>
                    </div>
                    <div className="text-3xl font-light text-gray-900 mb-1">
                        {stats?.total_subscribers || 0}
                    </div>
                    <p className="text-sm text-gray-500">Subscribers</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-5">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/admin/dashboard/posts?action=create')}
                        className="bg-[#236b7c] text-white rounded-lg p-6 hover:bg-[#1d5766] transition-colors text-left"
                    >
                        <Plus className="w-6 h-6 mb-3 opacity-90" />
                        <h3 className="text-base font-medium mb-1">Create New Post</h3>
                        <p className="text-sm text-white/70">Start writing a new article</p>
                    </button>

                    <button
                        onClick={() => router.push('/admin/dashboard/posts')}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors text-left"
                    >
                        <FileText className="w-6 h-6 mb-3 text-gray-600" />
                        <h3 className="text-base font-medium text-gray-900 mb-1">Manage Posts</h3>
                        <p className="text-sm text-gray-500">Edit and organize content</p>
                    </button>

                    <button
                        onClick={() => router.push('/admin/dashboard/newsletter')}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors text-left"
                    >
                        <TrendingUp className="w-6 h-6 mb-3 text-gray-600" />
                        <h3 className="text-base font-medium text-gray-900 mb-1">Newsletter</h3>
                        <p className="text-sm text-gray-500">Send updates to subscribers</p>
                    </button>
                </div>
            </div>

            {/* Blog Categories */}
            <div className="space-y-5">
                <h2 className="text-lg font-medium text-gray-900">Blog Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.name}
                                href={`/admin/dashboard/posts?category=${category.name}`}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group"
                            >
                                <div className={`w-9 h-9 ${category.lightColor} rounded-lg flex items-center justify-center mb-3`}>
                                    <Icon className={`w-4 h-4 ${category.textColor}`} />
                                </div>
                                <h3 className="font-medium text-gray-900 text-sm mb-0.5">{category.name}</h3>
                                <p className="text-xs text-gray-400">Manage posts</p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Featured Hero Section */}
            <div className="space-y-5">
                <h2 className="text-lg font-medium text-gray-900">Featured Hero</h2>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-yellow-600 fill-current" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">Homepage Hero Content</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Set a post or guide as the featured hero to display it prominently at the top of your homepage.
                                Only one item can be featured at a time.
                            </p>
                            <div className="flex gap-3">
                                <Link
                                    href="/admin/dashboard/posts"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Manage Posts
                                </Link>
                                <Link
                                    href="/admin/dashboard/guides"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Manage Guides
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
                    <Link
                        href="/admin/dashboard/posts"
                        className="text-sm text-[#236b7c] hover:text-[#1d5766]"
                    >
                        View all →
                    </Link>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                    {recentPosts.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm mb-4">No posts yet</p>
                            <button
                                onClick={() => router.push('/admin/dashboard/posts?action=create')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#236b7c] text-white text-sm rounded-lg hover:bg-[#1d5766] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Post
                            </button>
                        </div>
                    ) : (
                        recentPosts.map((post) => (
                            <div key={post.id} className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate mb-2">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {post.views}
                                            </span>
                                            {post.category && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        target="_blank"
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-[#236b7c] hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
