'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    Search,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    X,
    Star,
    Lightbulb
} from 'lucide-react';
import Link from 'next/link';

interface Guide {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    published_at: string;
    views: number;
    read_time: string;
    featured_image?: string;
    tags: string[];
    category?: string;
    featured?: boolean;
    featured_hero?: boolean;
}

export default function GuidesPage() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        featured_image: '',
        tags: '',
        category: '',
        read_time: '5 min read',
        featured: false,
        featured_hero: false,
    });

    const router = useRouter();

    const GUIDE_CATEGORIES = [
        'Getting Started',
        'Best Practices',
        'Tutorials',
        'Tips & Tricks',
        'Advanced',
        'Troubleshooting'
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

    const loadGuides = async () => {
        setLoading(true);
        setError('');
        try {
            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';

            const response = await fetch(`${base}/guides?limit=100`, {
                headers: { Authorization: authHeader }
            });

            if (response.status === 401) {
                router.push('/admin/login');
                return;
            }

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            setGuides(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load guides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGuides();
    }, []);

    const handleCreateGuide = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';

            const response = await fetch(`${base}/guides`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    content: formData.content,
                    featured_image: formData.featured_image,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    category: formData.category,
                    read_time: formData.read_time,
                    featured: formData.featured,
                    featured_hero: formData.featured_hero,
                }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setSuccess('Guide created successfully!');
            setShowCreateForm(false);
            setFormData({
                title: '',
                description: '',
                content: '',
                featured_image: '',
                tags: '',
                category: '',
                read_time: '5 min read',
                featured: false,
                featured_hero: false,
            });
            loadGuides();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create guide');
        }
    };

    const handleToggleFeaturedHero = async (guide: Guide) => {
        try {
            const authHeader = getAuthHeader();
            if (!authHeader) return;

            const base = process.env.NODE_ENV === 'production'
                ? 'https://betadomotweb-production.up.railway.app'
                : 'http://localhost:8080';

            if (guide.featured_hero) {
                await fetch(`${base}/admin/guides/${guide.slug}/featured-hero`, {
                    method: 'DELETE',
                    headers: { Authorization: authHeader }
                });
                setSuccess('Removed from featured hero');
            } else {
                await fetch(`${base}/admin/guides/${guide.slug}/featured-hero`, {
                    method: 'POST',
                    headers: { Authorization: authHeader }
                });
                setSuccess('Set as featured hero!');
            }

            loadGuides();
        } catch (err) {
            setError('Failed to update featured hero status');
        }
    };

    const filteredGuides = guides.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#236b7c]" />
                    <span className="text-gray-600">Loading guides...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Guides</h1>
                    <p className="text-gray-500 mt-1">Manage comprehensive guides and tutorials</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#236b7c] text-white rounded-lg hover:bg-[#1d5766] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Guide
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-800">{error}</p>
                    </div>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-green-800">{success}</p>
                    </div>
                    <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Create Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-medium text-gray-900">Create New Guide</h2>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateGuide} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content (Markdown) *
                                </label>
                                <textarea
                                    required
                                    rows={10}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent font-mono text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                    >
                                        <option value="">Select category</option>
                                        {GUIDE_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Read Time
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.read_time}
                                        onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                        placeholder="5 min read"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Featured Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.featured_image}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                                    placeholder="guide, tutorial, howto"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 text-[#236b7c] border-gray-300 rounded focus:ring-[#236b7c]"
                                    />
                                    <span className="text-sm text-gray-700">Featured</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured_hero}
                                        onChange={(e) => setFormData({ ...formData, featured_hero: e.target.checked })}
                                        className="w-4 h-4 text-[#236b7c] border-gray-300 rounded focus:ring-[#236b7c]"
                                    />
                                    <span className="text-sm text-gray-700">Featured Hero</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#236b7c] text-white rounded-lg hover:bg-[#1d5766] transition-colors"
                                >
                                    Create Guide
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search guides..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236b7c] focus:border-transparent"
                />
            </div>

            {/* Guides List */}
            <div className="bg-white rounded-lg border border-gray-200">
                {filteredGuides.length === 0 ? (
                    <div className="p-12 text-center">
                        <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No guides yet</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#236b7c] text-white rounded-lg hover:bg-[#1d5766] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Guide
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredGuides.map((guide) => (
                            <div
                                key={guide.id}
                                className={`p-5 hover:bg-gray-50 transition-colors ${
                                    guide.featured_hero ? 'bg-yellow-50/50' : ''
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {guide.title}
                                            </h3>
                                            {guide.featured_hero && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex-shrink-0">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    Hero
                                                </span>
                                            )}
                                            {guide.featured && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex-shrink-0">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {guide.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span>{new Date(guide.published_at).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {guide.views}
                                            </span>
                                            {guide.category && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                                    {guide.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleToggleFeaturedHero(guide)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                guide.featured_hero
                                                    ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                                                    : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-600'
                                            }`}
                                            title={guide.featured_hero ? 'Remove from Hero' : 'Set as Hero'}
                                        >
                                            <Star className={`w-4 h-4 ${guide.featured_hero ? 'fill-current' : ''}`} />
                                        </button>
                                        <Link
                                            href={`/guides/${guide.slug}`}
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
                                            title="View guide"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
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
