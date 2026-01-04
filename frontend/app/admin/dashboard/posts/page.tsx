'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    Search,
    Calendar,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    X,
    Star,
    Image as ImageIcon,
    Tag,
    Clock,
    ExternalLink,
    FileText
} from 'lucide-react';
import { fetchAdminPosts, createPost, updatePost, deletePost, setFeaturedHero, unsetFeaturedHero } from '@/lib/api-client';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published_at: string;
    views: number;
    read_time: string;
    featured_image?: string;
    tags: string[];
    author: string;
    category?: string;
    featured?: boolean;
    featured_hero?: boolean;
    related_products?: string[];
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        featured_image: '',
        tags: '',
        category: '',
        read_time: 5,
    });

    const router = useRouter();

    const BLOG_CATEGORIES = [
        'Cleaning',
        'Organization',
        'Life',
        'Decorating',
        'Energy Savings',
        'Security & Safety',
        'Smart & Tech',
        'Home Projects'
    ];

    const getAuthHeader = () => {
        const credentials = JSON.parse(
            localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials') ||
            '{}'
        );

        if (!credentials.username || !credentials.password) {
            router.push('/admin/login');
            return null;
        }

        return 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
    };

    const loadPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const data = await fetchAdminPosts(authHeader);
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleCreatePost = async () => {
        if (!formData.title || !formData.content) {
            setError('Title and content are required');
            return;
        }

        try {
            setError('');
            setSuccess('');

            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                readTime: formData.read_time + ' min read',
                featuredImage: formData.featured_image,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                category: formData.category,
            };

            await createPost(postData, authHeader);
            setSuccess('Post created successfully!');
            setShowCreateForm(false);
            resetForm();
            loadPosts();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create post');
        }
    };

    const handleEditPost = async () => {
        if (!editingPost || !formData.title || !formData.content) {
            setError('Title and content are required');
            return;
        }

        try {
            setError('');
            setSuccess('');

            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                readTime: formData.read_time + ' min read',
                featuredImage: formData.featured_image,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                category: formData.category,
            };

            await updatePost(editingPost.slug, postData, authHeader);
            setSuccess('Post updated successfully!');
            setEditingPost(null);
            setShowCreateForm(false);
            resetForm();
            loadPosts();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update post');
        }
    };

    const handleDeletePost = async (post: Post) => {
        if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            const authHeader = getAuthHeader();
            if (!authHeader) return;

            await deletePost(post.slug, authHeader);
            setSuccess('Post deleted successfully!');
            loadPosts();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete post');
        }
    };

    const handleToggleFeaturedHero = async (post: Post) => {
        try {
            setError('');
            setSuccess('');

            const authHeader = getAuthHeader();
            if (!authHeader) return;

            if (post.featured_hero) {
                await unsetFeaturedHero(post.slug, authHeader);
                setSuccess('Removed from featured hero');
            } else {
                await setFeaturedHero(post.slug, authHeader);
                setSuccess(`"${post.title}" is now the featured hero!`);
            }

            loadPosts();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update featured hero');
        }
    };

    const startEditing = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            featured_image: post.featured_image || '',
            tags: post.tags.join(', '),
            category: post.category || '',
            read_time: parseInt(post.read_time) || 5,
        });
        setShowCreateForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            featured_image: '',
            tags: '',
            category: '',
            read_time: 5,
        });
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !categoryFilter || categoryFilter === post.category;

        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Create and manage your blog content
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadPosts}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => {
                            setShowCreateForm(true);
                            setEditingPost(null);
                            resetForm();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#236b7c] rounded-lg hover:bg-[#1d5766] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700 flex-1">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-700 flex-1">{success}</span>
                    <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingPost ? 'Edit Post' : 'Create New Post'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowCreateForm(false);
                                setEditingPost(null);
                                resetForm();
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                                placeholder="Enter an engaging title..."
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all resize-none"
                                placeholder="Brief description that appears in previews..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={12}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all font-mono text-sm resize-none"
                                placeholder="Write your post content here... (Markdown supported)"
                            />
                        </div>

                        {/* Grid: Category, Read Time, Featured Image */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                                >
                                    <option value="">Select category...</option>
                                    {BLOG_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Read Time (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.read_time}
                                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Featured Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.featured_image}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                                placeholder="home, design, tips (comma separated)"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingPost(null);
                                    resetForm();
                                }}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingPost ? handleEditPost : handleCreatePost}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-[#236b7c] rounded-lg hover:bg-[#1d5766] transition-colors"
                            >
                                {editingPost ? 'Update Post' : 'Create Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent transition-all"
                    >
                        <option value="">All Categories</option>
                        {BLOG_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Posts ({filteredPosts.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#236b7c] mx-auto mb-4" />
                        <p className="text-gray-600">Loading posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                            {posts.length === 0 ? 'No posts yet.' : 'No posts match your search.'}
                        </p>
                        {posts.length === 0 && (
                            <button
                                onClick={() => {
                                    setShowCreateForm(true);
                                    setEditingPost(null);
                                    resetForm();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#236b7c] rounded-lg hover:bg-[#1d5766] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                                    post.featured_hero ? 'bg-yellow-50/50' : ''
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 w-full sm:w-24">
                                        {post.featured_image ? (
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                            <div className="flex-1 w-full">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                        {post.title}
                                                    </h3>
                                                    {post.featured_hero && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex-shrink-0">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            Hero
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">{new Date(post.published_at).toLocaleDateString()}</span>
                                                        <span className="sm:hidden">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {post.views}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {post.read_time}
                                                    </div>
                                                    {post.category && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                                                            {post.category}
                                                        </span>
                                                    )}
                                                </div>
                                                {post.tags && post.tags.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {post.tags.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                            >
                                                                <Tag className="w-3 h-3" />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {post.tags.length > 3 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{post.tags.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                                                <button
                                                    onClick={() => handleToggleFeaturedHero(post)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        post.featured_hero
                                                            ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                                                            : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-600'
                                                    }`}
                                                    title={post.featured_hero ? 'Remove from Hero' : 'Set as Hero'}
                                                >
                                                    <Star className={`w-4 h-4 ${post.featured_hero ? 'fill-current' : ''}`} />
                                                </button>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-[#236b7c] rounded-lg transition-colors"
                                                    title="View Post"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => startEditing(post)}
                                                    className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                                    title="Edit Post"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(post)}
                                                    className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Delete Post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
