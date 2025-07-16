'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    Search,
    Package,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Save,
    X,
    Image as ImageIcon
} from 'lucide-react';
import CloudinaryUpload from '../../../../components/CloudinaryUpload';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    category: string;
    tags: string[];
    stock: number;
    sku: string;
    weight: number;
    dimensions: string;
    featured: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        sale_price: 0,
        images: [''],
        category: '',
        tags: '',
        stock: 0,
        sku: '',
        weight: 0,
        dimensions: '',
        featured: false,
        active: true
    });

    const router = useRouter();

    // Load Cloudinary script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        script.onload = () => setCloudinaryLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

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
            const response = await fetch(`http://localhost:8080${endpoint}`, {
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

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await makeAuthenticatedRequest('/admin/products');
            if (data) {
                setProducts(data);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async () => {
        if (!formData.name || formData.price <= 0) {
            setError('Name and price are required');
            return;
        }

        try {
            setError('');
            setSuccess('');

            const productData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                images: formData.images.filter(img => img.trim()),
                sale_price: formData.sale_price > 0 ? formData.sale_price : null
            };

            const response = await makeAuthenticatedRequest('/admin/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });

            if (response) {
                setSuccess('Product created successfully!');
                setShowCreateForm(false);
                resetForm();
                loadProducts();
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create product');
        }
    };

    const handleEditProduct = async () => {
        if (!editingProduct || !formData.name || formData.price <= 0) {
            setError('Name and price are required');
            return;
        }

        try {
            setError('');
            setSuccess('');

            const productData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                images: formData.images.filter(img => img.trim()),
                sale_price: formData.sale_price > 0 ? formData.sale_price : null
            };

            const response = await makeAuthenticatedRequest(`/admin/products/${editingProduct.slug}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });

            if (response) {
                setSuccess('Product updated successfully!');
                setEditingProduct(null);
                setShowCreateForm(false);
                resetForm();
                loadProducts();
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update product');
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            const response = await makeAuthenticatedRequest(`/admin/products/${product.slug}`, {
                method: 'DELETE'
            });

            if (response) {
                setSuccess('Product deleted successfully!');
                loadProducts();
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete product');
        }
    };

    const startEditing = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            sale_price: product.sale_price || 0,
            images: product.images.length > 0 ? product.images : [''],
            category: product.category,
            tags: product.tags.join(', '),
            stock: product.stock,
            sku: product.sku,
            weight: product.weight,
            dimensions: product.dimensions,
            featured: product.featured,
            active: product.active
        });
        setShowCreateForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            sale_price: 0,
            images: [''],
            category: '',
            tags: '',
            stock: 0,
            sku: '',
            weight: 0,
            dimensions: '',
            featured: false,
            active: true
        });
    };

    const addImageField = () => {
        setFormData({
            ...formData,
            images: [...formData.images, '']
        });
    };

    const removeImageField = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index)
        });
    };

    const updateImageField = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({
            ...formData,
            images: newImages
        });
    };

    const handleCloudinaryUpload = (imageUrl: string) => {
        setFormData({
            ...formData,
            images: [...formData.images, imageUrl]
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div className="space-y-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={loadProducts}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowCreateForm(true);
                            setEditingProduct(null);
                            resetForm();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Product</span>
                    </button>
                </div>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingProduct ? 'Edit Product' : 'Create New Product'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowCreateForm(false);
                                setEditingProduct(null);
                                resetForm();
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter product name..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Furniture, Lighting"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe your product..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="modern, minimalist, home"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                                <input
                                    type="text"
                                    value={formData.dimensions}
                                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="L x W x H cm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                            <div className="space-y-4">
                                {/* Cloudinary Upload */}
                                {cloudinaryLoaded && (
                                    <CloudinaryUpload
                                        onUpload={handleCloudinaryUpload}
                                        multiple={true}
                                        className="mb-4"
                                    />
                                )}

                                {/* Current Images Display */}
                                {formData.images.filter(img => img.trim()).length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-gray-700">Uploaded Images:</h4>
                                        {formData.images.filter(img => img.trim()).map((image, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                                <img
                                                    src={image}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-16 h-16 object-cover rounded border"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Error';
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-600 truncate">{image}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Manual URL Input (fallback) */}
                                <div className="border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={addImageField}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        Add Image URL (Manual)
                                    </button>
                                    {formData.images.map((image, index) => (
                                        <div key={`manual-${index}`} className="flex items-center gap-2 mt-2">
                                            <input
                                                type="url"
                                                value={image}
                                                onChange={(e) => updateImageField(index, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.images.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="p-2 text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingProduct(null);
                                    resetForm();
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingProduct ? handleEditProduct : handleCreateProduct}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products by name, category, or SKU..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        All Products ({filteredProducts.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {products.length === 0 ? 'No products yet.' : 'No products match your search.'}
                        </p>
                        {products.length === 0 && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        {product.images && product.images.length > 0 && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                                }}
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {product.name}
                                                </h3>
                                                {product.featured && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                                {!product.active && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mt-1 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                <span>${product.price.toFixed(2)}</span>
                                                {product.sale_price && product.sale_price > 0 && (
                                                    <span className="text-green-600">Sale: ${product.sale_price.toFixed(2)}</span>
                                                )}
                                                <span>Stock: {product.stock}</span>
                                                <span>SKU: {product.sku}</span>
                                                <span>Category: {product.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => router.push(`/products/${product.slug}`)}
                                            className="p-2 text-blue-600 hover:text-blue-700"
                                            title="View Product"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => startEditing(product)}
                                            className="p-2 text-gray-600 hover:text-gray-700"
                                            title="Edit Product"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product)}
                                            className="p-2 text-red-600 hover:text-red-700"
                                            title="Delete Product"
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