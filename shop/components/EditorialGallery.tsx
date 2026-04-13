import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
}

interface EditorialGalleryProps {
  products: Product[];
}

export default function EditorialGallery({ products }: EditorialGalleryProps) {
  // Show only featured products, max 6
  const featured = products.filter(p => p.featured).slice(0, 6);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 6);

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-lg text-gray-500 font-light">Collection coming soon</p>
      </div>
    );
  }

  // Extract short description (first 8 words)
  const getShortDesc = (desc: string) => {
    if (!desc) return '';
    const words = desc.split(' ').slice(0, 8).join(' ');
    return words + (desc.split(' ').length > 8 ? '...' : '');
  };

  return (
    <div className="space-y-32">
      {/* Staggered Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 lg:gap-x-20 lg:gap-y-32">
        {displayProducts.map((product, idx) => {
          return (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group block relative"
              style={{
                // Stagger every other item
                marginTop: idx % 2 === 1 ? '4rem' : '0'
              }}
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                )}

                {/* Hover Overlay with "View Story" */}
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="text-sm font-light">View Story</span>
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                {/* Category Label */}
                <p className="text-xs text-gray-500 uppercase tracking-wider font-light">
                  {product.category}
                </p>

                {/* Product Name */}
                <h3 className="text-2xl font-light text-gray-900 transition-colors group-hover:text-gray-600">
                  {product.name}
                </h3>
                
                {/* Descriptive Line */}
                {product.description && (
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    {getShortDesc(product.description)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
