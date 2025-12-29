'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { adminAPI } from '@/lib/admin-api';
import { Plus, Trash2, Edit3, Save, X, Package, Grid, Star, Eye, EyeOff, Home, ShoppingBag, Link2, Search, Check, Minus, Users } from 'lucide-react';

interface Collection {
    id: string;
    name: string;
    title?: string;
    blog_category?: string;
    type: 'blog-to-product' | 'lifestyle' | 'product-category';
    assigned_products?: string[];
    active: boolean;
    show_on_homepage: boolean;
    show_on_products_page: boolean;
}

interface Product {
    slug: string;
    name: string;
    price: number;
    image: string;
    category: string;
    in_stock: boolean;
}

export default function ProductAssignmentsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [assignedProducts, setAssignedProducts] = useState<Product[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'blog-to-product' | 'lifestyle' | 'product-category'>('blog-to-product');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedCollection) {
            loadCollectionProducts();
        }
    }, [selectedCollection]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [
                blogCollections,
                lifestyleCollections,
                productCategories,
                allProducts
            ] = await Promise.all([
                adminAPI.getBlogToProductCollections(),
                adminAPI.getLifestyleCollections(),
                adminAPI.getProductCategories(),
                adminAPI.getProducts()
            ]);

            const allCollections: Collection[] = [
                ...blogCollections.map((c: any) => ({
                    ...c,
                    type: 'blog-to-product' as const,
                    name: c.blog_category
                })),
                ...lifestyleCollections.map((c: any) => ({
                    ...c,
                    type: 'lifestyle' as const,
                    name: c.title
                })),
                ...productCategories.map((c: any) => ({
                    ...c,
                    type: 'product-category' as const
                }))
            ];

            setCollections(allCollections);
            setProducts(allProducts);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCollectionProducts = async () => {
        if (!selectedCollection) return;

        try {
            const collectionProducts = await adminAPI.getCollectionProducts(
                selectedCollection.type,
                selectedCollection.id
            );

            const assignedSlugs = new Set(collectionProducts.map((p: Product) => p.slug));
            const assigned = products.filter(p => assignedSlugs.has(p.slug));
            const available = products.filter(p => !assignedSlugs.has(p.slug));

            setAssignedProducts(assigned);
            setAvailableProducts(available);
        } catch (error) {
            console.error('Failed to load collection products:', error);
            setAssignedProducts([]);
            setAvailableProducts(products);
        }
    };

    const filteredCollections = collections.filter(c => c.type === activeTab);

    const filteredAvailableProducts = availableProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map(p => p.category))];

    const assignProduct = async (product: Product) => {
        if (!selectedCollection) return;

        setSaving(true);
        try {
            await adminAPI.assignProducts(
                selectedCollection.type,
                selectedCollection.id,
                [product.slug],
                'add'
            );

            setAvailableProducts(prev => prev.filter(p => p.slug !== product.slug));
            setAssignedProducts(prev => [...prev, product]);
        } catch (error) {
            console.error('Failed to assign product:', error);
        } finally {
            setSaving(false);
        }
    };

    const removeProduct = async (product: Product) => {
        if (!selectedCollection) return;

        setSaving(true);
        try {
            await adminAPI.assignProducts(
                selectedCollection.type,
                selectedCollection.id,
                [product.slug],
                'remove'
            );

            setAssignedProducts(prev => prev.filter(p => p.slug !== product.slug));
            setAvailableProducts(prev => [...prev, product]);
        } catch (error) {
            console.error('Failed to remove product:', error);
        } finally {
            setSaving(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'blog-to-product': return <Home className="w-4 h-4" />;
            case 'lifestyle': return <ShoppingBag className="w-4 h-4" />;
            case 'product-category': return <Grid className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'blog-to-product': return 'Blog-to-Product';
            case 'lifestyle': return 'Lifestyle';
            case 'product-category': return 'Product Category';
            default: return 'Collection';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dca744] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product assignments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="px-8 py-6 bg-gradient-to-r from-[#dca744] to-[#c4963d]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Product Assignments</h1>
                                <p className="mt-2 text-white/90">
                                    Assign products to collections for homepage and products page display
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <Users className="w-6 h-6" />
                                <span className="font-medium">{products.length} Products</span>
                            </div>
                        </div>
                    </div>

                    {/* Collection Type Tabs */}
                    <div className="px-8 pt-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8">
                                {[
                                    { key: 'blog-to-product', label: 'Blog-to-Product', icon: Home },
                                    { key: 'lifestyle', label: 'Lifestyle Collections', icon: ShoppingBag },
                                    { key: 'product-category', label: 'Product Categories', icon: Grid }
                                ].map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key as any)}
                                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === key
                                                ? 'border-[#dca744] text-[#dca744]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 inline mr-2" />
                                        {label} ({filteredCollections.length})
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Collections List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            {getTypeIcon(activeTab)}
                            {getTypeLabel(activeTab)} Collections
                        </h2>

                        <div className="space-y-3">
                            {filteredCollections.map(collection => (
                                <div
                                    key={collection.id}
                                    onClick={() => setSelectedCollection(collection)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCollection?.id === collection.id
                                            ? 'border-[#dca744] bg-[#dca744]/5'
                                            : 'border-gray-200 hover:border-[#dca744] hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{collection.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {collection.show_on_homepage && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                                        Homepage
                                                    </span>
                                                )}
                                                {collection.show_on_products_page && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                        Products Page
                                                    </span>
                                                )}
                                                {!collection.active && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-600">
                                                {collection.assigned_products?.length || 0}
                                            </span>
                                            <p className="text-xs text-gray-500">products</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available Products */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Available Products
                            </h2>
                            <span className="text-sm text-gray-500">
                                {filteredAvailableProducts.length} available
                            </span>
                        </div>

                        {/* Search and Filter */}
                        <div className="space-y-3 mb-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent text-sm"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent text-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredAvailableProducts.map(product => (
                                <div
                                    key={product.slug}
                                    className="p-3 rounded-lg border border-gray-200 hover:border-[#dca744] hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 relative rounded overflow-hidden">
                                            <Image src={product.image || '/images/placeholder-product.jpg'} alt={product.name} fill className="object-cover" sizes="48px" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{product.category}</span>
                                                <span>•</span>
                                                <span>₦{product.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => assignProduct(product)}
                                            disabled={!selectedCollection || saving}
                                            className="w-8 h-8 rounded-full bg-[#dca744] text-white flex items-center justify-center hover:bg-[#c4963d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assigned Products */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-600" />
                                Assigned Products
                            </h2>
                            <span className="text-sm text-gray-500">
                                {assignedProducts.length} assigned
                            </span>
                        </div>

                        {selectedCollection ? (
                            <div>
                                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                    <h3 className="font-medium text-gray-900 text-sm">{selectedCollection.name}</h3>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {getTypeLabel(selectedCollection.type)}
                                    </p>
                                </div>

                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {assignedProducts.map(product => (
                                        <div
                                            key={product.slug}
                                            className="p-3 rounded-lg bg-green-50 border border-green-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 relative overflow-hidden rounded">
                                                    <Image src={product.image || '/images/placeholder-product.jpg'} alt={product.name} fill className="object-cover" sizes="40px" />
                                                </div>
                                                 <div className="flex-1">
                                                     <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                                                     <p className="text-xs text-gray-500">₦{product.price.toLocaleString()}</p>
                                                 </div>
                                                 <button
                                                     onClick={() => removeProduct(product)}
                                                     disabled={saving}
                                                     className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                                                 >
                                                     <Minus className="w-3 h-3" />
                                                 </button>
                                             </div>
                                         </div>
                                     ))}

                                    {assignedProducts.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm">No products assigned</p>
                                            <p className="text-xs">Select products from the available list</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Grid className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Select a collection</p>
                                <p className="text-xs">Choose a collection to assign products</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}