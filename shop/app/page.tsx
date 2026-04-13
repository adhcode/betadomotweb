import { fetchProducts } from '@/lib/api-client';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import EditorialGallery from '@/components/EditorialGallery';
import LifestyleCategory from '@/components/LifestyleCategory';
import { lifestyleCategories, filterProductsByCategory } from '@/lib/lifestyle-categories';
import Image from 'next/image';
import Link from 'next/link';

// Mark as dynamic since we fetch products on every request
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await fetchProducts();

  // Sort lifestyle categories by order
  const sortedCategories = [...lifestyleCategories].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      {/* 1. Hero / Opening Cover */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/blog/hero.png"
            alt="Curated living"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Minimal Text */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight" style={{ color: '#ffffff' }}>
Better Homes         </h1>
        </div>
      </section>

      {/* 2. Editor's Selection */}
      <section className="py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20 lg:mb-32 text-center">
            <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
              Editor's Selection
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900">
              Chosen for now
            </h2>
          </div>

          <EditorialGallery products={products} />
        </div>
      </section>

      {/* 3. Lifestyle Categories */}
      <div className="border-t border-gray-100">
        {sortedCategories.map((category) => {
          const categoryProducts = filterProductsByCategory(products, category.filter);
          
          // Only show category if it has products
          if (categoryProducts.length === 0) return null;

          return (
            <LifestyleCategory
              key={category.id}
              title={category.title}
              description={category.description}
              products={categoryProducts}
              viewAllLink={category.viewAllLink}
            />
          );
        })}
      </div>

      {/* 5. Editorial Connection */}
      <section className="py-32 lg:py-40 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center space-y-8">
          <p className="text-sm text-gray-500 font-light uppercase tracking-wider">
            From the Betadomot Journal
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-relaxed">
            Stories about creating intentional spaces and living with purpose
          </h2>
          <Link 
            href="https://betadomot.blog"
            className="inline-block text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
          >
            Read the journal
          </Link>
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
