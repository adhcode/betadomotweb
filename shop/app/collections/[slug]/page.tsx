import { fetchProducts } from '@/lib/api-client';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import CollectionGrid from '@/components/CollectionGrid';
import { lifestyleCategories, filterProductsByCategory } from '@/lib/lifestyle-categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Mark as dynamic since we fetch products on every request
export const dynamic = 'force-dynamic';

export default async function CollectionPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Find the lifestyle category
  const category = lifestyleCategories.find(cat => cat.id === slug);
  
  if (!category) {
    notFound();
  }

  // Fetch all products and filter by category
  const allProducts = await fetchProducts();
  const categoryProducts = filterProductsByCategory(allProducts, category.filter);

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Breadcrumb */}
        <div className="mb-12">
          <Link 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 font-light transition-colors"
          >
            Collection
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-20 lg:mb-32 max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <CollectionGrid products={categoryProducts} />
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
              Return to collection
            </Link>
          </div>
        )}

        {/* Editorial Note */}
        {categoryProducts.length > 0 && (
          <div className="mt-32 pt-32 border-t border-gray-100">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <p className="text-sm text-gray-500 font-light uppercase tracking-wider">
                From the journal
              </p>
              <p className="text-lg text-gray-600 font-light">
                Read more about creating intentional spaces
              </p>
              <Link 
                href="https://betadomot.blog"
                className="inline-block text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
              >
                Visit Betadomot Journal
              </Link>
            </div>
          </div>
        )}
      </main>

      <ShopFooter />
    </div>
  );
}

// Generate static params for all lifestyle categories
export async function generateStaticParams() {
  return lifestyleCategories.map((category) => ({
    slug: category.id,
  }));
}
