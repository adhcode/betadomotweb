'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Edit,
  FolderTree,
  Layers,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://betadomotweb-production.up.railway.app'
  : 'http://localhost:8080';

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
  product_type: 'editorial' | 'everyday';
  featured: boolean;
  active: boolean;
  created_at: string;
}

interface ProductFormState {
  name: string;
  description: string;
  price: number;
  sale_price: number;
  images: string[];
  category: string;
  tags: string;
  stock: number;
  sku: string;
  product_type: 'editorial' | 'everyday';
  featured: boolean;
  active: boolean;
}

const emptyForm: ProductFormState = {
  name: '',
  description: '',
  price: 0,
  sale_price: 0,
  images: [],
  category: '',
  tags: '',
  stock: 0,
  sku: '',
  product_type: 'everyday',
  featured: false,
  active: true,
};

const getAuthHeaders = () => {
  const credentials = JSON.parse(
    localStorage.getItem('adminCredentials') ||
    sessionStorage.getItem('adminCredentials') ||
    '{}'
  );

  return {
    Authorization: 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
    'Content-Type': 'application/json',
  };
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'editorial' | 'everyday'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProductFormState>(emptyForm);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Failed to load products (${response.status})`);

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('We could not load the product catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openModal = (product?: Product) => {
    setError('');
    setNotice('');

    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price || 0,
        sale_price: product.sale_price || 0,
        images: product.images || [],
        category: product.category || '',
        tags: product.tags?.join(', ') || '',
        stock: product.stock || 0,
        sku: product.sku || '',
        product_type: product.product_type || 'everyday',
        featured: !!product.featured,
        active: !!product.active,
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyForm);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        sale_price: formData.sale_price > 0 ? formData.sale_price : null,
      };

      const response = await fetch(
        editingProduct
          ? `${API_BASE_URL}/admin/products/${editingProduct.slug}`
          : `${API_BASE_URL}/admin/products`,
        {
          method: editingProduct ? 'PUT' : 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(`Save failed (${response.status})`);

      setNotice(editingProduct ? 'Product updated.' : 'Product created.');
      closeModal();
      await loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('We could not save this product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${product.slug}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Delete failed (${response.status})`);

      setNotice('Product deleted.');
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('We could not delete this product.');
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.category || '').toLowerCase().includes(query) ||
        (product.sku || '').toLowerCase().includes(query) ||
        (product.tags || []).some((tag) => tag.toLowerCase().includes(query));

      const matchesType = filterType === 'all' || product.product_type === filterType;
      return matchesSearch && matchesType;
    });
  }, [filterType, products, searchTerm]);

  const stats = useMemo(() => ({
    total: products.length,
    editorial: products.filter((product) => product.product_type === 'editorial').length,
    everyday: products.filter((product) => product.product_type === 'everyday').length,
    featured: products.filter((product) => product.featured).length,
  }), [products]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value || 0);
  };

  const isExternalImage = (src: string) => src.startsWith('http://') || src.startsWith('https://');

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Shop Admin</p>
            <h1 className="mt-2 text-3xl font-light tracking-[-0.03em] text-gray-900 md:text-4xl">Products</h1>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Card-based workspace for product uploads, edits, deletes, and catalog organization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Shop Dashboard
            </Link>
            <Link
              href="/admin/dashboard/shop/categories"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <FolderTree className="h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/admin/dashboard/shop/collections"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <Layers className="h-4 w-4" />
              Collections
            </Link>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>
      </section>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={stats.total} />
        <StatCard label="Editorial" value={stats.editorial} />
        <StatCard label="Everyday" value={stats.everyday} />
        <StatCard label="Featured" value={stats.featured} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, category, SKU, or tag"
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterPill active={filterType === 'all'} onClick={() => setFilterType('all')}>All</FilterPill>
            <FilterPill active={filterType === 'editorial'} onClick={() => setFilterType('editorial')}>Editorial</FilterPill>
            <FilterPill active={filterType === 'everyday'} onClick={() => setFilterType('everyday')}>Everyday</FilterPill>
          </div>

          <button
            type="button"
            onClick={loadProducts}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-light tracking-[-0.02em] text-gray-900">Product Catalog</h2>
            <p className="mt-1 text-sm text-gray-500">{filteredProducts.length} products shown</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
          >
            <Plus className="h-4 w-4" />
            New Product
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center">
            <Package className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <h3 className="text-base font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-500">Try another filter or add a product.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="grid gap-4 lg:grid-cols-[110px_minmax(0,1fr)_180px]">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized={isExternalImage(product.images[0])}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-medium text-gray-900">{product.name}</h3>
                      <Badge tone={product.product_type === 'editorial' ? 'teal' : 'gray'}>{product.product_type}</Badge>
                      {product.featured && <Badge tone="gold">Featured</Badge>}
                      {!product.active && <Badge tone="gray">Inactive</Badge>}
                    </div>

                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {product.description || 'No description added yet.'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(product.price)}
                      </span>
                      {product.sale_price ? <span>Sale {formatCurrency(product.sale_price)}</span> : null}
                      <span>Stock {product.stock}</span>
                      <span>SKU {product.sku || 'Auto'}</span>
                      {product.category ? <span>{product.category}</span> : null}
                    </div>

                    {product.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-end gap-2 lg:flex-col lg:items-stretch">
                    <ActionButton icon={<Edit className="h-4 w-4" />} onClick={() => openModal(product)}>
                      Edit
                    </ActionButton>
                    <ActionButton
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(product)}
                      danger
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-4">
          <div className="mx-auto my-6 w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </p>
                <h2 className="mt-2 text-xl font-light tracking-[-0.02em] text-gray-900">
                  {editingProduct ? editingProduct.name : 'Create Product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-gray-200 p-2 text-gray-400 transition-colors hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-0 lg:grid-cols-[minmax(0,1.3fr)_360px]">
              <div className="space-y-6 bg-white px-6 py-6">
                <FormCard title="Basic Information">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Product Name *">
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="Enter product name"
                      />
                    </Field>
                    <Field label="Category">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="Furniture, Decor, etc."
                      />
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-7 outline-none transition-colors focus:border-gray-900"
                      placeholder="Describe the product"
                    />
                  </Field>
                </FormCard>

                <FormCard title="Pricing & Inventory">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Price *">
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="0.00"
                      />
                    </Field>
                    <Field label="Sale Price">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="0.00"
                      />
                    </Field>
                    <Field label="Stock">
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="0"
                      />
                    </Field>
                  </div>
                </FormCard>

                <FormCard title="Product Images">
                  <ImageUpload
                    images={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                    maxImages={12}
                  />
                </FormCard>

                <FormCard title="Metadata">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="SKU">
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="Optional"
                      />
                    </Field>
                    <Field label="Tags">
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                        placeholder="modern, curated, linen"
                      />
                    </Field>
                  </div>
                </FormCard>
              </div>

              <aside className="space-y-5 border-l border-gray-200 bg-gray-50 px-6 py-6">
                <FormCard title="Settings" subtle>
                  <div className="space-y-2">
                    <ChoiceCard
                      label="Everyday"
                      description="Purchasable product with cart support."
                      checked={formData.product_type === 'everyday'}
                      onChange={() => setFormData({ ...formData, product_type: 'everyday' })}
                    />
                    <ChoiceCard
                      label="Editorial"
                      description="Showcase product without checkout behavior."
                      checked={formData.product_type === 'editorial'}
                      onChange={() => setFormData({ ...formData, product_type: 'editorial' })}
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <ToggleCard
                      label="Featured Product"
                      description="Surface this item in featured placements."
                      checked={formData.featured}
                      onChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <ToggleCard
                      label="Active"
                      description="Keep this product visible on storefront pages."
                      checked={formData.active}
                      onChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                  </div>
                </FormCard>

                <FormCard title="Preview" subtle>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {formData.images[0] ? (
                        <Image
                          src={formData.images[0]}
                          alt={formData.name || 'Preview'}
                          fill
                          className="object-cover"
                          unoptimized={isExternalImage(formData.images[0])}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{formData.product_type}</p>
                      <h3 className="text-base font-medium text-gray-900">{formData.name || 'Product name'}</h3>
                      <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {formData.description || 'Preview appears here as you fill in the form.'}
                      </p>
                    </div>
                  </div>
                </FormCard>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </aside>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-light tracking-[-0.03em] text-gray-900">{value}</p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
        active
          ? 'border border-gray-900 bg-gray-900 text-white'
          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  tone = 'gray',
}: {
  children: ReactNode;
  tone?: 'gray' | 'teal' | 'gold';
}) {
  const styleMap = {
    gray: 'border-gray-200 bg-gray-50 text-gray-600',
    teal: 'border-[#236b7c]/20 bg-[#236b7c]/5 text-[#236b7c]',
    gold: 'border-[#b8871d]/20 bg-[#dca744]/10 text-[#8a6413]',
  } as const;

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] ${styleMap[tone]}`}>
      {children}
    </span>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  danger = false,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        danger
          ? 'border-red-200 bg-white text-red-700 hover:bg-red-50'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function FormCard({
  title,
  children,
  subtle = false,
}: {
  title: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  return (
    <section className={`rounded-xl border p-4 ${subtle ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white'}`}>
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function ChoiceCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
        checked ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
      }`}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className={`mt-1 text-sm leading-6 ${checked ? 'text-white/85' : 'text-gray-500'}`}>{description}</p>
    </button>
  );
}

function ToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
      />
      <span>
        <span className="block text-sm font-medium text-gray-900">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-gray-500">{description}</span>
      </span>
    </label>
  );
}
