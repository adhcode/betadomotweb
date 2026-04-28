import { fetchCollection, fetchCollectionProducts } from '@/lib/api-client';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import CollectionGrid from '@/components/CollectionGrid';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

// Mark as dynamic since we fetch data on every request
export const dynamic = 'force-dynamic';

export default async function CollectionPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Fetch collection data
  const collection = await fetchCollection(slug);
  
  if (!collection) {
    notFound();
  }

  // Fetch products in this collection
  const products = await fetchCollectionProducts(slug);

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      {/* Hero Section - Calm image with collection piece */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-50">
          {collection.image_url ? (
            <Image
              src={collection.image_url}
              alt={collection.name}
              fill
              className="object-cover opacity-90"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
          )}
        </div>
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-white/20" />
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="py-6 border-b border-gray-100">
          <nav className="flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">
              Collections
            </Link>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-900 font-medium shrink-0">{collection.name}</span>
          </nav>
        </div>

        {/* Collection Title & Intro */}
        <div className="py-16 md:py-24 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-tight">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
              {collection.description}
            </p>
          )}
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
              This collection is being curated
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
