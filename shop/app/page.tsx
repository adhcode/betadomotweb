import { fetchProducts, fetchCategories, fetchCollections } from '@/lib/api-client';
import { Product } from '@/lib/product-utils';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch curated picks (limit to 6)
  const curatedProducts = (await fetchProducts({ limit: 6 })) as Product[];
  
  // Fetch featured categories for shop entry
  const categories = await fetchCategories({ featured: true });
  
  // Fetch featured collections for homepage
  const collections = await fetchCollections({ featured: true });

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      {/* 1. HERO SECTION - Brand First, Not Sales */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-50">
          <Image
            src="/images/blog/hero.png"
            alt="Thoughtful living"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6" 
            style={{ color: '#ffffff', textShadow: '0 4px 6px rgba(0, 0, 0, 0.5)' }}
          >
            Better Homes, Better Life
          </h1>
          <p 
            className="text-lg md:text-xl font-normal mb-12 max-w-2xl mx-auto" 
            style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            Products designed to make everyday living feel better.
          </p>
          <Link 
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            Explore the Shop
          </Link>
        </div>
      </section>

      {/* 2. CURATED PICKS - Editorial Authority */}
      {curatedProducts.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                Betadomot Picks
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900">
                Selected for you
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {curatedProducts.slice(0, 6).map((product) => (
                <Link 
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">{product.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Betadomot Pick
                    </p>
                    <h3 className="text-lg font-light text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2">
                      {product.editorial_note || product.description || 'Selected for its design and quality'}
                    </p>
                    <span className="inline-block text-xs text-gray-900 border-b border-gray-300 pb-1">
                      View details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2.5 FEATURED COLLECTIONS - Curated Sets */}
      {collections.length > 0 && (
        <section className="py-24 md:py-32 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                Curated Collections
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900">
                Thoughtfully assembled
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.slice(0, 4).map((collection: any) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/9] bg-gray-100 mb-4 overflow-hidden">
                    {collection.image_url ? (
                      <Image
                        src={collection.image_url}
                        alt={collection.name}
                        width={800}
                        height={450}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">{collection.name}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
                    {collection.description || 'A curated selection of products'}
                  </p>
                  <span className="inline-block text-xs text-gray-900 border-b border-gray-300 pb-1">
                    View collection
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. SHOP ENTRY POINTS - Revenue Layer */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Shop by category
            </h2>
            <p className="text-gray-600 font-light">
              Explore our full collection
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 6).map((category: any) => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="group"
                >
                  <div className="aspect-[4/3] bg-gray-200 mb-4 overflow-hidden">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        width={600}
                        height={450}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">{category.name}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-light mb-3">
                    {category.description || 'Thoughtfully selected pieces'}
                  </p>
                  <span className="inline-block text-xs text-gray-900 font-medium border-b border-gray-900 pb-1">
                    Shop {category.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 font-light">
                Categories coming soon
              </p>
              <Link
                href="/shop"
                className="inline-block mt-6 text-sm text-gray-900 font-medium border-b border-gray-900 pb-1"
              >
                View all products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. EDITORIAL FEATURE SECTION */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              From the Journal
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-relaxed">
              Stories about creating intentional spaces and living with purpose
            </h2>
            <Link
              href="https://betadomot.blog"
              className="inline-block text-sm text-gray-900 font-medium border-b border-gray-900 hover:border-gray-600 hover:text-gray-600 transition-colors pb-1"
            >
              Read the stories
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TRUST & ACCESS CLARIFIER */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            Products sourced from trusted global and local partners, selected for real homes.
          </p>
        </div>
      </section>

      {/* 6. NEWSLETTER - Minimal, Respectful */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Stay informed
          </h3>
          <p className="text-sm text-gray-600 font-light mb-8">
            Thoughtful products, design ideas, and new arrivals — occasionally.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
