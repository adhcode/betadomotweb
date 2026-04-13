import Link from 'next/link';
import Image from 'next/image';

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

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-32">
        <h3 className="text-2xl font-light text-gray-900 mb-4">No products yet</h3>
        <p className="text-gray-600 font-light">Our collection is being curated. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((product: Product) => (
        <Link 
          key={product.id} 
          href={`/products/${product.slug}`}
          className="group"
        >
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50" />
            )}
            
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-light text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <span className="text-sm font-light text-gray-600 whitespace-nowrap">
                  ₦{(product.sale_price || product.price).toLocaleString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 font-light line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              
              {product.stock === 0 && (
                <span className="inline-block text-xs text-gray-500 font-light mt-2">
                  Currently unavailable
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
