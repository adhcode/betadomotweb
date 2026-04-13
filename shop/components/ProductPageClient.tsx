'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  images?: string[];
  category?: string;
  tags?: string[];
  stock: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
}

export default function ProductPageClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  // Updated: 2026-04-12 - Gold buttons

  // Safety check
  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  // Safely handle price with defaults
  const price = product?.price || 0;
  const salePrice = product?.sale_price || null;
  const currentPrice = salePrice || price;
  const hasDiscount = !!salePrice && salePrice < price;
  const savings = hasDiscount ? price - currentPrice : 0;
  const discountPercent = hasDiscount && price > 0 ? Math.round((savings / price) * 100) : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Images */}
      <div className="space-y-4">
        {product.images && product.images.length > 0 ? (
          <>
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {hasDiscount && (
                <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:border-[#236b7c] transition-colors cursor-pointer">
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 text-lg font-light">No image available</span>
          </div>
        )}
      </div>
      
      {/* Details */}
      <div>
        <div className="mb-4">
          <span className="text-sm text-[#236b7c] font-semibold uppercase tracking-wider">
            {product.category || 'Uncategorized'}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
          {product.name}
        </h1>
        
        {/* Price */}
        <div className="mb-6">
          {hasDiscount ? (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-red-600">
                  ₦{currentPrice.toLocaleString()}
                </span>
                <span className="text-2xl text-gray-400 line-through font-light">
                  ₦{price.toLocaleString()}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Save ₦{savings.toLocaleString()}</span>
                <span className="font-light">({discountPercent}% off)</span>
              </div>
            </div>
          ) : (
            <span className="text-4xl font-bold text-gray-900">
              ₦{currentPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mb-6">
          {(product.stock || 0) > 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-semibold">
                In Stock ({product.stock} available)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-600 font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button - Prominent */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <button
            onClick={handleAddToCart}
            disabled={(product.stock || 0) === 0 || isAdding}
            className="w-full bg-[#dca744] text-gray-900 py-5 px-8 rounded-xl font-bold text-xl hover:bg-[#e6b85c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-2xl flex items-center justify-center gap-3"
          >
            <ShoppingCart size={26} />
            {isAdding ? 'Added to Cart!' : (product.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        
        {/* Description */}
        {product.description && (
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              {product.description}
            </p>
          </div>
        )}
        
        {/* Secondary Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <button className="border-2 border-gray-200 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:border-[#dca744] hover:text-[#dca744] transition-all flex items-center justify-center gap-2">
              <Heart size={20} />
              Wishlist
            </button>
            <button className="border-2 border-gray-200 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:border-[#dca744] hover:text-[#dca744] transition-all flex items-center justify-center gap-2">
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Truck size={24} className="text-[#236b7c]" />
            <div>
              <div className="font-semibold text-sm">Free Delivery</div>
              <div className="text-xs text-gray-600 font-light">On orders over ₦50,000</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[#236b7c]" />
            <div>
              <div className="font-semibold text-sm">Secure Payment</div>
              <div className="text-xs text-gray-600 font-light">100% protected</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw size={24} className="text-[#236b7c]" />
            <div>
              <div className="font-semibold text-sm">Easy Returns</div>
              <div className="text-xs text-gray-600 font-light">7-day return policy</div>
            </div>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="font-semibold text-gray-900 mb-6 text-lg">Product Details</h3>
          <dl className="space-y-4">
            {product.sku && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-600 font-light">SKU</dt>
                <dd className="text-gray-900 font-medium">{product.sku}</dd>
              </div>
            )}
            {product.weight && product.weight > 0 && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-600 font-light">Weight</dt>
                <dd className="text-gray-900 font-medium">{product.weight}kg</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-600 font-light">Dimensions</dt>
                <dd className="text-gray-900 font-medium">{product.dimensions}</dd>
              </div>
            )}
            {product.category && (
              <div className="flex justify-between py-3">
                <dt className="text-gray-600 font-light">Category</dt>
                <dd className="text-gray-900 font-medium">{product.category}</dd>
              </div>
            )}
          </dl>
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold text-gray-900 mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#236b7c] hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
