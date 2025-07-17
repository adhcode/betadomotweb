'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    Search,
    Calendar,
    User,
    FileText,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Save,
    X
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published_at: string;
    views: number;
    read_time: number;
    featured_image?: string;
    tags: string[];
    author: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        tags: '',
        read_time: 5,
        author: 'Admin'
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
        const credentials = JSON.parse(
            localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials') ||
            '{}'
        );

        if (!credentials.username || !credentials.password) {
            router.push('/admin/login');
            return null;
        }

        const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (response.status === 401) {
                router.push('/admin/login');
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    const loadPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/admin/posts`);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    const handleCreatePost = async () => {
        if (!formData.title || !formData.content) {
            setError('Title and content are required');
            return;
        }

        try {
            setError('');
            setSuccess('');

            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                readTime: formData.read_time + ' min read',
                featuredImage: formData.featured_image,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                published_at: new Date().toISOString(),
                views: 0
            };

            const response = await makeAuthenticatedRequest('/posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            });

            if (response) {
                setSuccess('Post created successfully!');
                setShowCreateForm(false);
                setFormData({
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    featured_image: '',
                    tags: '',
                    read_time: 5,
                    author: 'Admin'
                });
                loadPosts();
            }
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

            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                readTime: formData.read_time + ' min read',
                featuredImage: formData.featured_image,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            const response = await makeAuthenticatedRequest(`/admin/posts/${editingPost.slug}`, {
                method: 'PUT',
                body: JSON.stringify(postData)
            });

            if (response) {
                setSuccess('Post updated successfully!');
                setEditingPost(null);
                setFormData({
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    featured_image: '',
                    tags: '',
                    read_time: 5,
                    author: 'Admin'
                });
                loadPosts();
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update post');
        }
    };

    const handleDeletePost = async (post: Post) => {
        if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            console.log('🗑️ Attempting to delete post:', post.title, 'with slug:', post.slug);

            const response = await makeAuthenticatedRequest(`/admin/posts/${post.slug}`, {
                method: 'DELETE'
            });

            console.log('✅ Delete response:', response);

            if (response) {
                setSuccess('Post deleted successfully!');
                console.log('🔄 Refreshing posts list...');
                await loadPosts();
                console.log('✅ Posts list refreshed');
            }
        } catch (error) {
            console.error('❌ Delete error:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete post');
        }
    };

    const startEditing = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            featured_image: post.featured_image || '',
            tags: post.tags.join(', '),
            read_time: post.read_time,
            author: post.author
        });
        setShowCreateForm(true);
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        loadPosts();
        // Check if we should show create form
        if (searchParams.get('action') === 'create') {
            setShowCreateForm(true);
        }
    }, [loadPosts, searchParams]);

    return (
        <div className="p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-end space-x-3">
                <button
                    onClick={loadPosts}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Post</span>
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-green-700">{success}</span>
                </div>
            )}

            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="bg-white rounded-xl ring-1 ring-gray-200">
                    <div className="p-6 border-b ring-0 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingPost ? 'Edit Post' : 'Create New Post'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowCreateForm(false);
                                setEditingPost(null);
                                setFormData({
                                    title: '',
                                    slug: '',
                                    excerpt: '',
                                    content: '',
                                    featured_image: '',
                                    tags: '',
                                    read_time: 5,
                                    author: 'Admin'
                                });
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter post title..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="post-slug"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Brief description of the post..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={10}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                placeholder="Write your post content here... (Markdown supported)"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                                <input
                                    type="url"
                                    value={formData.featured_image}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="real estate, tips, home buying"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.read_time}
                                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingPost(null);
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingPost ? handleEditPost : handleCreatePost}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{editingPost ? 'Update Post' : 'Create Post'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl ring-1 ring-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search posts by title, content, or tags..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-xl ring-1 ring-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        All Posts ({filteredPosts.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {posts.length === 0 ? 'No posts yet.' : 'No posts match your search.'}
                        </p>
                        {posts.length === 0 && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(post.published_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="w-4 h-4 mr-1" />
                                                {post.views} views
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {post.author}
                                            </div>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => startEditing(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Post"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleDeletePost.bind(null, post)}
                                            className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                            title="Delete Post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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