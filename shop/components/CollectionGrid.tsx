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

interface CollectionGridProps {
  products: Product[];
}

export default function CollectionGrid({ products }: CollectionGridProps) {
  if (products.length === 0) {
    return null;
  }

  // Extract short description (first 8 words)
  const getShortDesc = (desc: string) => {
    if (!desc) return '';
    const words = desc.split(' ').slice(0, 8).join(' ');
    return words + (desc.split(' ').length > 8 ? '...' : '');
  };

  return (
    <div className="space-y-32">
      {/* Full Collection Grid - Shows all products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 lg:gap-x-20 lg:gap-y-32">
        {products.map((product, idx) => {
          return (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group block relative"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
