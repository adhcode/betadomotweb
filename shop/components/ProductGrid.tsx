import Link from 'next/link';
import Image from 'next/image';
import { Product, isEditorialProduct, getProductBadge, formatPrice, getAvailabilityLabel } from '@/lib/product-utils';

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
      {products.map((product: Product) => {
        const isEditorial = isEditorialProduct(product);
        const badge = getProductBadge(product);
        
        return (
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
                  
                  {/* Badge for editorial products */}
                  {badge && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-light text-gray-700 uppercase tracking-wider">
                      {badge}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50" />
              )}
              
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-light text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  {!isEditorial && (
                    <span className="text-sm font-light text-gray-600 whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                
                {isEditorial ? (
                  <p className="text-sm text-gray-600 font-light line-clamp-2 leading-relaxed">
                    {product.editorial_note || product.description}
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 font-light line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    {product.stock === 0 && (
                      <span className="inline-block text-xs text-gray-500 font-light mt-2">
                        Currently unavailable
                      </span>
                    )}
                    {product.stock > 0 && (
                      <span className="inline-block text-xs text-green-600 font-light mt-2">
                        In stock
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
