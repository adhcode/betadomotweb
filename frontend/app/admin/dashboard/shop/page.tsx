'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  FolderTree,
  Layers,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://betadomotweb-production.up.railway.app'
  : 'http://localhost:8080';

interface ShopProduct {
  product_type: 'editorial' | 'everyday';
}

export default function ShopAdminPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    collections: 0,
    orders: 0,
    editorialProducts: 0,
    everydayProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError('');
        const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/collections`),
        ]);

        if (!productsRes.ok || !categoriesRes.ok || !collectionsRes.ok) {
          throw new Error('Failed to load shop stats');
        }

        const [products, categories, collections] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          collectionsRes.json(),
        ]);

        const editorial = products.filter((p: ShopProduct) => p.product_type === 'editorial').length;
        const everyday = products.filter((p: ShopProduct) => p.product_type === 'everyday').length;

        setStats({
          products: products.length || 0,
          categories: categories.length || 0,
          collections: collections.length || 0,
          orders: 0,
          editorialProducts: editorial,
          everydayProducts: everyday,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('We could not load the latest shop summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Shop Admin</p>
            <h1 className="mt-2 text-3xl font-light tracking-[-0.03em] text-gray-900 md:text-4xl">
              Dashboard
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Clear sections for navigation, catalog overview, and merchandising workflow.
            </p>
          </div>

          <Link
            href="/admin/dashboard/products"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gray-900"
          >
            <Package className="h-4 w-4" />
            Open Products
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={loading ? '...' : stats.products} helper={`${stats.editorialProducts} editorial · ${stats.everydayProducts} everyday`} />
        <StatCard label="Categories" value={loading ? '...' : stats.categories} helper="Catalog groupings" />
        <StatCard label="Collections" value={loading ? '...' : stats.collections} helper="Merchandising sets" />
        <StatCard label="Orders" value={loading ? '...' : stats.orders} helper="Commerce tracking" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <NavCard
          href="/admin/dashboard/products"
          icon={<Package className="h-5 w-5 text-[#236b7c]" />}
          title="Products"
          description="Upload, edit, archive, and remove products."
        />
        <NavCard
          href="/admin/dashboard/shop/categories"
          icon={<FolderTree className="h-5 w-5 text-[#236b7c]" />}
          title="Categories"
          description="Manage product grouping and taxonomy."
        />
        <NavCard
          href="/admin/dashboard/shop/collections"
          icon={<Layers className="h-5 w-5 text-[#236b7c]" />}
          title="Collections"
          description="Create themed shelves and campaigns."
        />
        <NavCard
          href="/admin/dashboard/product-assignments"
          icon={<ShoppingCart className="h-5 w-5 text-[#236b7c]" />}
          title="Assignments"
          description="Attach products to blog and lifestyle collections."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card title="Workflow Guidance" icon={<Sparkles className="h-4 w-4 text-[#236b7c]" />}>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. Create product records with pricing, stock, and SKU.</p>
            <p>2. Upload high quality images and set the first image as primary.</p>
            <p>3. Assign categories and collections for storefront discovery.</p>
            <p>4. Mark featured products to spotlight in editorial sections.</p>
          </div>
        </Card>

        <Card title="Catalog Notes" icon={<TrendingUp className="h-4 w-4 text-[#236b7c]" />}>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              Editorial products are non-checkout showcase items. Everyday products are active commerce listings.
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Quick Links</p>
              <div className="mt-2 space-y-1.5">
                <Link href="/admin/dashboard/products" className="block text-sm text-gray-600 hover:text-gray-900">
                  Add or edit products
                </Link>
                <Link href="/admin/dashboard/shop/categories" className="block text-sm text-gray-600 hover:text-gray-900">
                  Organize categories
                </Link>
                <Link href="/admin/dashboard/shop/collections" className="block text-sm text-gray-600 hover:text-gray-900">
                  Manage collections
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-2">
            <AlertCircle className="h-5 w-5 text-[#236b7c]" />
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-900">Navigation Tip</h2>
            <p className="mt-2 text-sm leading-7 text-gray-600">
              Use the cards above as your main navigation map. The Products card is your primary daily workspace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number | string;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-light tracking-[-0.03em] text-gray-900">{value}</p>
      <p className="mt-2 text-xs text-gray-500">{helper}</p>
    </div>
  );
}

function NavCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-2">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
      </div>
      <h3 className="mt-4 text-base font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-gray-600">{description}</p>
    </Link>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-base font-medium text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}
