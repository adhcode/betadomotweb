import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  name: string;
  images: string[];
}

interface LifestyleCategoryProps {
  title: string;
  description?: string;
  products: Product[];
  viewAllLink?: string;
}

export default function LifestyleCategory({ 
  title, 
  description, 
  products,
  viewAllLink 
}: LifestyleCategoryProps) {
  // Show max 4 products in preview
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Category Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-base text-gray-600 font-light leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Product Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {displayProducts.map((product) => (
            <Link 
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              {/* Product Image - Smaller and quieter */}
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                )}
              </div>

              {/* Product Name - Minimal */}
              <p className="text-sm font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                {product.name}
              </p>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {viewAllLink && (
          <div className="mt-12 text-center">
            <Link 
              href={viewAllLink}
              className="inline-block text-sm text-gray-900 font-light hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
            >
              View all
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
