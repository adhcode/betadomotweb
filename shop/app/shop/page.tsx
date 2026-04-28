import { fetchProducts } from '@/lib/api-client';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import CollectionGrid from '@/components/CollectionGrid';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AllProductsPage() {
  // Fetch all products
  const products = await fetchProducts();
  
  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="py-6 border-b border-gray-100">
          <nav className="flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-900 font-medium shrink-0">All products</span>
          </nav>
        </div>

        {/* Page Title & Intro */}
        <div className="py-16 md:py-24 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-tight">
            All Products
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
            Every piece in our collection, selected for quality, purpose, and thoughtful design
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="py-12">
            <CollectionGrid products={products} />
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-2xl font-light text-gray-900 mb-4">
              No products yet
            </p>
            <p className="text-base text-gray-500 font-light mb-12">
              Our collection is being curated
            </p>
            <Link
              href="/"
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 text-sm font-light tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Return home
            </Link>
          </div>
        )}
      </main>

      <ShopFooter />
    </div>
  );
}
