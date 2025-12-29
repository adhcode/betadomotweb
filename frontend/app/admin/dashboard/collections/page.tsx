'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { Plus, Trash2, Edit3, Save, X, BookOpen, ShoppingBag, Eye, EyeOff } from 'lucide-react';

interface BlogToProductCollection {
    id: string;
    blog_category: string;
    blog_description: string;
    blog_color: string;
    product_category_title: string;
    product_badge: string;
    product_badge_color: string;
    active: boolean;
    display_order: number;
    show_on_homepage: boolean;
    show_on_products_page: boolean;
}

interface LifestyleCollection {
    id: string;
    title: string;
    subtitle: string;
    badge_text: string;
    badge_color: string;
    title_color: string;
    active: boolean;
    display_order: number;
    show_on_homepage: boolean;
    show_on_products_page: boolean;
}

export default function CollectionsPage() {
    const [blogCollections, setBlogCollections] = useState<BlogToProductCollection[]>([]);
    const [lifestyleCollections, setLifestyleCollections] = useState<LifestyleCollection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'blog' | 'lifestyle'>('blog');

    // Form states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        setLoading(true);
        setError('');
        try {
            const [blogData, lifestyleData] = await Promise.all([
                adminAPI.getBlogToProductCollections(),
                adminAPI.getLifestyleCollections()
            ]);
            setBlogCollections(blogData);
            setLifestyleCollections(lifestyleData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load collections');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (activeTab === 'blog') {
                if (editingId) {
                    await adminAPI.updateBlogToProductCollection(editingId, formData);
                } else {
                    await adminAPI.createBlogToProductCollection(formData);
                }
            } else {
                if (editingId) {
                    await adminAPI.updateLifestyleCollection(editingId, formData);
                } else {
                    await adminAPI.createLifestyleCollection(formData);
                }
            }

            setEditingId(null);
            setShowNewForm(false);
            setFormData({});
            await loadCollections();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save collection');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            if (activeTab === 'blog') {
                await adminAPI.deleteBlogToProductCollection(id);
            } else {
                await adminAPI.deleteLifestyleCollection(id);
            }
            await loadCollections();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete collection');
        }
    };

    const startEdit = (collection: any) => {
        setEditingId(collection.id);
        setFormData({ ...collection });
        setShowNewForm(false);
    };

    const startNew = () => {
        setEditingId(null);
        setShowNewForm(true);
        if (activeTab === 'blog') {
            setFormData({
                blog_category: '',
                blog_description: '',
                blog_color: 'text-blue-600',
                product_category_title: '',
                product_badge: '',
                product_badge_color: 'bg-blue-500',
                active: true,
                display_order: 50,
                show_on_homepage: true,
                show_on_products_page: false
            });
        } else {
            setFormData({
                title: '',
                subtitle: '',
                badge_text: '',
                badge_color: 'bg-blue-500',
                title_color: 'text-blue-600',
                active: true,
                display_order: 50,
                show_on_homepage: false,
                show_on_products_page: true
            });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setShowNewForm(false);
        setFormData({});
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dca744] mx-auto"></div>
                    <p className="mt-4 text-neutral-600">Loading collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                    <div className="mb-8">
                        <h1 className="font-gilroy font-extra-bold text-3xl text-black mb-2">
                            Collections Management
                        </h1>
                        <p className="text-neutral-600">
                            Manage your blog-to-product collections and lifestyle collections
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="mb-8">
                        <div className="border-b border-neutral-200">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('blog')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'blog'
                                        ? 'border-[#dca744] text-[#dca744]'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4 inline mr-2" />
                                    Blog-to-Product Collections ({blogCollections.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('lifestyle')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'lifestyle'
                                        ? 'border-[#dca744] text-[#dca744]'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                                        }`}
                                >
                                    <ShoppingBag className="w-4 h-4 inline mr-2" />
                                    Lifestyle Collections ({lifestyleCollections.length})
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Add New Button */}
                    <div className="mb-6">
                        <button
                            onClick={startNew}
                            className="px-6 py-2 bg-[#dca744] text-white rounded-lg hover:bg-[#c4963d] transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add New {activeTab === 'blog' ? 'Blog-to-Product' : 'Lifestyle'} Collection
                        </button>
                    </div>

                    {/* Form for New/Edit */}
                    {(showNewForm || editingId) && (
                        <div className="mb-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                            <h3 className="font-medium text-lg mb-4">
                                {editingId ? 'Edit' : 'Create New'} {activeTab === 'blog' ? 'Blog-to-Product' : 'Lifestyle'} Collection
                            </h3>

                            {activeTab === 'blog' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Blog Category (e.g., 'DIY & Home Projects')"
                                        value={formData.blog_category || ''}
                                        onChange={(e) => setFormData({ ...formData, blog_category: e.target.value })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Product Category Title (e.g., 'Shop DIY Tools')"
                                        value={formData.product_category_title || ''}
                                        onChange={(e) => setFormData({ ...formData, product_category_title: e.target.value })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                                    />
                                    <textarea
                                        placeholder="Blog Description"
                                        value={formData.blog_description || ''}
                                        onChange={(e) => setFormData({ ...formData, blog_description: e.target.value })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                                        rows={3}
                                    />
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Product Badge (e.g., 'DIY Ready')"
                                            value={formData.product_badge || ''}
                                            onChange={(e) => setFormData({ ...formData, product_badge: e.target.value })}
                                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent w-full"
                                        />
                                        <select
                                            value={formData.blog_color || 'text-blue-600'}
                                            onChange={(e) => setFormData({ ...formData, blog_color: e.target.value })}
                                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent w-full"
                                        >
                                            <option value="text-blue-600">Blue</option>
                                            <option value="text-green-600">Green</option>
                                            <option value="text-purple-600">Purple</option>
                                            <option value="text-amber-600">Amber</option>
                                            <option value="text-red-600">Red</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Title (e.g., 'fresh-picked favorites')"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Badge Text (e.g., '✓' or 'Space Saver')"
                                        value={formData.badge_text || ''}
                                        onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                                    />
                                    <textarea
                                        placeholder="Subtitle/Description"
                                        value={formData.subtitle || ''}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                                        rows={3}
                                    />
                                    <div className="space-y-2">
                                        <select
                                            value={formData.title_color || 'text-blue-600'}
                                            onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent w-full"
                                        >
                                            <option value="text-blue-600">Blue</option>
                                            <option value="text-green-600">Green</option>
                                            <option value="text-purple-600">Purple</option>
                                            <option value="text-amber-600">Amber</option>
                                            <option value="text-red-600">Red</option>
                                        </select>
                                        <select
                                            value={formData.badge_color || 'bg-blue-500'}
                                            onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent w-full"
                                        >
                                            <option value="bg-blue-500">Blue Badge</option>
                                            <option value="bg-green-500">Green Badge</option>
                                            <option value="bg-purple-500">Purple Badge</option>
                                            <option value="bg-amber-500">Amber Badge</option>
                                            <option value="bg-red-500">Red Badge</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Display Order"
                                        value={formData.display_order || 50}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent w-full"
                                    />
                                </div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.show_on_homepage || false}
                                        onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Show on Homepage</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.show_on_products_page || false}
                                        onChange={(e) => setFormData({ ...formData, show_on_products_page: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Show on Products Page</span>
                                </label>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-[#dca744] text-white rounded-lg hover:bg-[#c4963d] transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Collection
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="px-6 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Collections List */}
                    <div className="space-y-4">
                        {activeTab === 'blog' ? (
                            blogCollections.map((collection) => (
                                <div key={collection.id} className="p-4 bg-white border border-neutral-200 rounded-lg hover:border-[#dca744]/30 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-black">{collection.blog_category}</h3>
                                            <p className="text-sm text-neutral-600 mt-1">{collection.blog_description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                                                    → {collection.product_category_title}
                                                </span>
                                                <span className={`px-2 py-1 text-white text-xs rounded ${collection.product_badge_color}`}>
                                                    {collection.product_badge}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    {collection.show_on_homepage && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Homepage</span>}
                                                    {collection.show_on_products_page && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Products</span>}
                                                    {!collection.active && <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Inactive</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEdit(collection)}
                                                className="p-2 text-[#dca744] hover:bg-[#dca744]/10 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(collection.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            lifestyleCollections.map((collection) => (
                                <div key={collection.id} className="p-4 bg-gradient-to-r from-[#dca744]/5 to-[#236b7c]/5 border border-[#dca744]/20 rounded-lg hover:border-[#dca744]/40 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-black">{collection.title}</h3>
                                            {collection.subtitle && <p className="text-sm text-neutral-600 mt-1">{collection.subtitle}</p>}
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className={`px-2 py-1 text-white text-xs rounded ${collection.badge_color}`}>
                                                    {collection.badge_text}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    {collection.show_on_homepage && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Homepage</span>}
                                                    {collection.show_on_products_page && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Products</span>}
                                                    {!collection.active && <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Inactive</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEdit(collection)}
                                                className="p-2 text-[#dca744] hover:bg-[#dca744]/10 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(collection.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {(activeTab === 'blog' ? blogCollections : lifestyleCollections).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-neutral-500">No {activeTab === 'blog' ? 'blog-to-product' : 'lifestyle'} collections found.</p>
                            <button
                                onClick={startNew}
                                className="mt-4 px-6 py-2 bg-[#dca744] text-white rounded-lg hover:bg-[#c4963d] transition-colors"
                            >
                                Create your first {activeTab === 'blog' ? 'blog-to-product' : 'lifestyle'} collection
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 