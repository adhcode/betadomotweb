'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, Star, Package, Upload, X as XIcon } from 'lucide-react';
import Image from 'next/image';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_featured: boolean;
  display_order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_featured: false,
    display_order: 0
  });

  const getAuthHeaders = () => {
    const credentials = JSON.parse(
      localStorage.getItem('adminCredentials') ||
      sessionStorage.getItem('adminCredentials') ||
      '{}'
    );
    return {
      'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
      'Content-Type': 'application/json'
    };
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/collections');
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const openModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        image_url: collection.image_url || '',
        is_featured: collection.is_featured,
        display_order: collection.display_order || 0
      });
    } else {
      setEditingCollection(null);
      setFormData({ name: '', slug: '', description: '', image_url: '', is_featured: false, display_order: 0 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCollection(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCollection
        ? `http://localhost:8080/admin/collections/${editingCollection.id}`
        : 'http://localhost:8080/admin/collections';
      
      const response = await fetch(url, {
        method: editingCollection ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        closeModal();
        fetchCollections();
      }
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/collections/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchCollections();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddProduct = async (productId: string) => {
    if (!selectedCollection) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/collections/${selectedCollection.id}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          product_id: productId,
          display_order: 0
        })
      });

      if (response.ok) {
        alert('✅ Product added to collection!');
      } else if (response.status === 409) {
        // Conflict - product already in collection
        alert('⚠️ This product is already in this collection');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert(`❌ Failed to add product: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error adding product to collection');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://betadomotweb-production.up.railway.app' 
        : 'http://localhost:8080';

      const response = await fetch(`${backendUrl}/admin/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeaders()['Authorization']
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-1">Create curated product collections</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No collections yet</p>
            <button
              onClick={() => openModal()}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Create your first collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-100 relative">
                  {collection.image_url ? (
                    <Image
                      src={collection.image_url}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {collection.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Order: {collection.display_order}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{collection.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {collection.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedCollection(collection);
                        setShowProductSelector(true);
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                      <Package className="w-4 h-4" />
                      Add Products
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(collection)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Living Room Essentials"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., living-room-essentials"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Describe this collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Image
                </label>
                
                {formData.image_url ? (
                  <div className="relative">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={formData.image_url}
                        alt="Collection preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      id="collection-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="collection-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-3"></div>
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 mb-1">
                            Click to upload collection image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on homepage</p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Selector Modal */}
      {showProductSelector && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Add Products to {selectedCollection.name}
              </h2>
              <button
                onClick={() => {
                  setShowProductSelector(false);
                  setSelectedCollection(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">${product.price}</p>
                  <button
                    onClick={() => handleAddProduct(product.id)}
                    className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    Add to Collection
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
