'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { adminAPI } from '@/lib/admin-api';
import { X, Search, Package, Check, Plus, Minus } from 'lucide-react';

interface ProductAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    collectionType: 'blog-to-product' | 'lifestyle' | 'product-category';
    collectionId: string;
    collectionName: string;
    onAssignmentComplete: () => void;
}

interface Product {
    slug: string;
    name: string;
    price: number;
    image: string;
    category: string;
    in_stock: boolean;
    assigned?: boolean;
}

export default function ProductAssignmentModal({
    isOpen,
    onClose,
    collectionType,
    collectionId,
    collectionName,
    onAssignmentComplete
}: ProductAssignmentModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [assignedProducts, setAssignedProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, collectionId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [allProducts, collectionProducts] = await Promise.all([
                adminAPI.getProducts(),
                adminAPI.getCollectionProducts(collectionType, collectionId)
            ]);

            const assignedSlugs = new Set(collectionProducts.map((p: Product) => p.slug));
            const productsWithAssignment = allProducts.map((product: Product) => ({
                ...product,
                assigned: assignedSlugs.has(product.slug)
            }));

            setProducts(productsWithAssignment);
            setAssignedProducts(collectionProducts);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map(p => p.category))];

    const toggleProductAssignment = async (product: Product) => {
        setSaving(true);
        try {
            const action = product.assigned ? 'remove' : 'add';
            await adminAPI.assignProducts(collectionType, collectionId, [product.slug], action);

            // Update local state
            setProducts(prev => prev.map(p =>
                p.slug === product.slug ? { ...p, assigned: !p.assigned } : p
            ));

            if (product.assigned) {
                setAssignedProducts(prev => prev.filter(p => p.slug !== product.slug));
            } else {
                setAssignedProducts(prev => [...prev, { ...product, assigned: true }]);
            }
        } catch (error) {
            console.error('Failed to update product assignment:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = () => {
        onAssignmentComplete();
        onClose();
    };

    if (!isOpen) return null;

    const getCollectionTypeLabel = () => {
        switch (collectionType) {
            case 'blog-to-product': return 'Blog-to-Product Collection';
            case 'lifestyle': return 'Lifestyle Collection';
            case 'product-category': return 'Product Category';
            default: return 'Collection';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#dca744] to-[#c4963d]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Assign Products</h2>
                            <p className="text-white/90 text-sm">
                                {getCollectionTypeLabel()}: {collectionName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dca744] focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="flex" style={{ height: 'calc(90vh - 200px)' }}>
                    {/* Available Products */}
                    <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">Available Products</h3>
                            <span className="text-sm text-gray-500">({filteredProducts.length})</span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dca744]"></div>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-full overflow-y-auto">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.slug}
                                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${product.assigned
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-white hover:border-[#dca744] hover:shadow-sm'
                                            }`}
                                        onClick={() => toggleProductAssignment(product)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${product.assigned ? 'bg-green-500' : 'bg-gray-200'
                                                }`}>
                                                {product.assigned ? (
                                                    <Check className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Plus className="w-4 h-4 text-gray-500" />
                                                )}
                                            </div>
                                            <div className="w-12 h-12 relative rounded overflow-hidden">
                                                <Image src={product.image || '/images/placeholder-product.jpg'} alt={product.name} fill className="object-cover" sizes="48px" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{product.category}</span>
                                                    <span>•</span>
                                                    <span>₦{product.price.toLocaleString()}</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${product.in_stock
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assigned Products */}
                    <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
                        <div className="flex items-center gap-2 mb-4">
                            <Check className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-gray-900">Assigned Products</h3>
                            <span className="text-sm text-gray-500">({assignedProducts.length})</span>
                        </div>

                        <div className="space-y-2 max-h-full overflow-y-auto">
                            {assignedProducts.map(product => (
                                <div
                                    key={product.slug}
                                    className="p-3 rounded-lg bg-white border border-green-200 shadow-sm"
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
                                            onClick={() => toggleProductAssignment(product)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {assignedProducts.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No products assigned yet</p>
                                    <p className="text-xs">Click products on the left to assign them</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {assignedProducts.length} products assigned to this {getCollectionTypeLabel().toLowerCase()}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-[#dca744] text-white rounded-lg hover:bg-[#c4963d] transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}