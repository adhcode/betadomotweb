'use client';

import { useState, useEffect } from 'react';
import { X, Search, Plus, Trash2, Tag, Package } from 'lucide-react';
import { H2, H3, Body, MonoText, GhostButton } from '@/components/ui/DesignSystem';

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

interface FormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    tags: string;
    category: string;
    topics: string[];
    featured: boolean;
    related_products: string[];
    read_time: number;
    author: string;
}

interface AdminPostFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    editingPost?: any;
    formData: FormData;
    setFormData: (data: FormData) => void;
}

// Blog categories
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

// Predefined popular topics/tags
const POPULAR_TOPICS = [
    'DIY', 'Lagos', 'Apartment', 'Budget', 'Organization', 'Kitchen', 'Bedroom',
    'Living Room', 'Balcony', 'Storage', 'Decor', 'African', 'Modern', 'Minimalist',
    'NEPA', 'Generator', 'Security', 'Cleaning', 'Furniture', 'Lighting'
];

export default function AdminPostForm({
    isOpen,
    onClose,
    onSubmit,
    editingPost,
    formData,
    setFormData
}: AdminPostFormProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [topicInput, setTopicInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    // Load products for selection
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/products`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Load selected products when editing
    useEffect(() => {
        if (editingPost && formData.related_products.length > 0) {
            const selected = products.filter(p =>
                formData.related_products.includes(p.id) || formData.related_products.includes(p.slug)
            );
            setSelectedProducts(selected);
        }
    }, [editingPost, formData.related_products, products]);

    // Initialize topics array if not present
    useEffect(() => {
        if (!formData.topics) {
            setFormData({ ...formData, topics: [] });
        }
    }, [formData]);

    const handleTitleChange = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        setFormData({
            ...formData,
            title,
            slug: editingPost ? formData.slug : slug
        });
    };

    const handleAddProduct = (product: Product) => {
        if (!selectedProducts.find(p => p.id === product.id)) {
            const newSelected = [...selectedProducts, product];
            setSelectedProducts(newSelected);
            setFormData({
                ...formData,
                related_products: newSelected.map(p => p.id)
            });
        }
        setProductSearch('');
        setShowProductSearch(false);
    };

    const handleRemoveProduct = (productId: string) => {
        const newSelected = selectedProducts.filter(p => p.id !== productId);
        setSelectedProducts(newSelected);
        setFormData({
            ...formData,
            related_products: newSelected.map(p => p.id)
        });
    };

    const handleAddTopic = (topic: string) => {
        if (!topic.trim()) return;
        const topics = formData.topics || [];
        if (!topics.includes(topic.trim())) {
            setFormData({ ...formData, topics: [...topics, topic.trim()] });
        }
        setTopicInput('');
    };

    const handleRemoveTopic = (topicToRemove: string) => {
        const topics = formData.topics || [];
        setFormData({ ...formData, topics: topics.filter(t => t !== topicToRemove) });
    };

    const handleAddTag = (tag: string) => {
        if (!tag.trim()) return;
        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        if (!currentTags.includes(tag.trim())) {
            const newTags = [...currentTags, tag.trim()].join(', ');
            setFormData({ ...formData, tags: newTags });
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        const newTags = currentTags.filter(tag => tag !== tagToRemove).join(', ');
        setFormData({ ...formData, tags: newTags });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(productSearch.toLowerCase())
    );

    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <H2>{editingPost ? 'Edit Post' : 'Create New Post'}</H2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <MonoText className="text-xs text-gray-700 mb-2">TITLE</MonoText>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza"
                                placeholder="Enter post title..."
                            />
                        </div>
                        <div>
                            <MonoText className="text-xs text-gray-700 mb-2">SLUG</MonoText>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza"
                                placeholder="post-slug"
                            />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">CATEGORY</MonoText>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza"
                        >
                            <option value="">Select a category...</option>
                            {BLOG_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Topics Management */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">TOPICS</MonoText>
                        <MonoText className="text-xs text-gray-500 mb-3">
                            Add specific topics under this category (e.g., "Kitchen Organization", "Solar Power", etc.)
                        </MonoText>

                        {/* Topic input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic(topicInput))}
                                className="flex-1 p-2 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza"
                                placeholder="Add a topic..."
                            />
                            <GhostButton
                                type="button"
                                onClick={() => handleAddTopic(topicInput)}
                                className="px-3 py-2"
                            >
                                <Plus className="w-4 h-4" />
                            </GhostButton>
                        </div>

                        {/* Selected topics */}
                        {formData.topics && formData.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.topics.map(topic => (
                                    <span
                                        key={topic}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-800 text-sm border border-blue-200 rounded-full"
                                    >
                                        {topic}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTopic(topic)}
                                            className="ml-1 hover:text-blue-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">SETTINGS</MonoText>
                        <div className="flex items-center space-x-4 pt-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                <Body className="ml-2 text-sm">Featured Post</Body>
                            </label>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">EXCERPT</MonoText>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={3}
                            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors resize-none font-proza"
                            placeholder="Brief description that appears in previews..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">CONTENT</MonoText>
                        
                        {/* Markdown Help */}
                        <details className="mb-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <summary className="cursor-pointer px-3 py-2 text-xs font-gilroy font-semibold text-blue-900">
                                📝 Markdown Formatting Guide
                            </summary>
                            <div className="px-3 pb-3 pt-2 text-xs font-proza text-blue-900 space-y-2">
                                <div><strong>Bold:</strong> **your text**</div>
                                <div><strong>Italic:</strong> *your text*</div>
                                <div><strong>Heading:</strong> ### Your Heading</div>
                                <div><strong>Bullet List:</strong> - Item one</div>
                                <div><strong>Link:</strong> [link text](https://url.com)</div>
                                <div><strong>Image:</strong> ![description](https://image-url.com/image.jpg)</div>
                                <div className="pt-2 border-t border-blue-200 mt-2">
                                    <strong>💡 Tip:</strong> Upload images to Cloudinary first, then paste the URL in the image syntax
                                </div>
                            </div>
                        </details>

                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={12}
                            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza text-sm resize-none"
                            placeholder="Write your post content here... Use **bold** and *italic* for formatting."
                        />
                        <MonoText className="text-xs text-gray-500 mt-2">
                            Supports: **bold**, *italic*, ### headings, bullet points with -, code blocks with ```, images with ![alt text](url)
                        </MonoText>
                    </div>

                    {/* Tags (for SEO and filtering) */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">TAGS</MonoText>
                        <MonoText className="text-xs text-gray-500 mb-3">
                            Add tags for SEO and additional filtering (e.g., "Lagos", "Budget", "DIY")
                        </MonoText>

                        {/* Popular tags */}
                        <div className="mb-4">
                            <MonoText className="text-xs text-gray-500 mb-2">Popular tags:</MonoText>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_TOPICS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleAddTag(tag)}
                                        disabled={currentTags.includes(tag)}
                                        className={`px-2 py-1 text-xs border transition-colors ${currentTags.includes(tag)
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom tag input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(tagInput))}
                                className="flex-1 p-2 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza"
                                placeholder="Add custom tag..."
                            />
                            <GhostButton
                                type="button"
                                onClick={() => handleAddTag(tagInput)}
                                className="px-3 py-2"
                            >
                                <Plus className="w-4 h-4" />
                            </GhostButton>
                        </div>

                        {/* Selected tags */}
                        {currentTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {currentTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs border border-gray-200"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:text-gray-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Related Products */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Related Products</label>
                        <p className="text-xs text-gray-500 mb-3">
                            Add products that complement this post. They'll appear at the end of the article.
                        </p>

                        {/* Product search */}
                        <div className="relative mb-3">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={productSearch}
                                        onChange={(e) => {
                                            setProductSearch(e.target.value);
                                            setShowProductSearch(e.target.value.length > 0);
                                        }}
                                        onFocus={() => setShowProductSearch(productSearch.length > 0)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-proza"
                                        placeholder="Search products to add..."
                                    />
                                </div>
                            </div>

                            {/* Search results */}
                            {showProductSearch && filteredProducts.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {filteredProducts.slice(0, 8).map(product => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => handleAddProduct(product)}
                                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category} • ₦{product.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected products */}
                        {selectedProducts.length > 0 && (
                            <div className="space-y-2">
                                {selectedProducts.map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.category} • ₦{product.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(product.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Featured Image */}
                    <div>
                        <MonoText className="text-xs text-gray-700 mb-2">FEATURED IMAGE URL</MonoText>
                        <input
                            type="url"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-proza"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <GhostButton onClick={onClose}>
                            Cancel
                        </GhostButton>
                        <GhostButton onClick={() => onSubmit(formData)}>
                            {editingPost ? 'Update Post' : 'Create Post'}
                        </GhostButton>
                    </div>
                </div>
            </div>
        </div>
    );
} 