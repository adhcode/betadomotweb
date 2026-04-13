'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import EditorialHeader from './EditorialHeader';
import ShopFooter from './ShopFooter';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  sku: string;
  weight: number;
  dimensions: string;
}

export default function AppleEditorialProductPage({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPrice = product.sale_price || product.price || 0;
  const isAvailable = product.stock > 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1200);
  };

  // Extract Apple-style tagline (first sentence, max 60 chars)
  const getTagline = () => {
    if (!product.description) return 'Designed for modern living';
    const firstSentence = product.description.split('.')[0].trim();
    if (firstSentence.length <= 60) return firstSentence;
    return product.description.substring(0, 60).trim() + '...';
  };

  console.log('[AppleEditorialProductPage] Rendering product:', product);

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      {/* 1. Opening Spread */}
      <section className="pt-32 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-20">
          {/* Product Image */}
          <div className="relative aspect-[4/3] mb-12 overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
            )}
          </div>

          {/* Product Name & Tagline */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light">
              {getTagline()}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Editorial Note */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <p className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
            {product.description || 'A thoughtfully selected piece that brings intention and quality to everyday spaces.'}
          </p>
        </div>
      </section>

      {/* 3. Detail Focus */}
      {product.images && product.images.length > 1 && (
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              {product.images.slice(1, 3).map((img, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <Image
                      src={img}
                      alt={`${product.name} detail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {idx === 0 && <p className="text-sm text-gray-500 font-light text-center">Form</p>}
                  {idx === 1 && <p className="text-sm text-gray-500 font-light text-center">Detail</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. In Use */}
      {product.images && product.images.length > 3 && (
        <section className="py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={product.images[3] || product.images[0]}
                alt={`${product.name} in use`}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-500 font-light text-center mt-6">
              In everyday spaces
            </p>
          </div>
        </section>
      )}

      {/* 5. Why It Matters */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {product.tags && product.tags.length > 0 ? (
              product.tags.slice(0, 3).map((tag, idx) => (
                <div key={idx} className="text-center space-y-3">
                  <p className="text-lg font-light text-gray-900">{tag}</p>
                </div>
              ))
            ) : (
              <>
                <div className="text-center space-y-3">
                  <p className="text-lg font-light text-gray-900">Thoughtfully designed</p>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-lg font-light text-gray-900">Built to last</p>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-lg font-light text-gray-900">Everyday essential</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. Practical Layer */}
      <section className="py-24 lg:py-32 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Delivery</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Ships within 3–5 business days across Nigeria. Packaged with care.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Care</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Handle with care. Clean gently. Designed for longevity.
              </p>
            </div>
          </div>

          {(product.dimensions || product.weight > 0) && (
            <div className="mt-12 pt-12 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {product.dimensions && (
                  <div>
                    <p className="text-sm text-gray-500 font-light mb-1">Dimensions</p>
                    <p className="text-base text-gray-900 font-light">{product.dimensions}</p>
                  </div>
                )}
                {product.weight > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 font-light mb-1">Weight</p>
                    <p className="text-base text-gray-900 font-light">{product.weight}kg</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. Decision Moment */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center space-y-8">
          <div className="space-y-2">
            {currentPrice > 0 ? (
              <p className="text-4xl font-light text-gray-900">
                ₦{currentPrice.toLocaleString()}
              </p>
            ) : (
              <p className="text-2xl font-light text-gray-600">
                Price available upon request
              </p>
            )}
            <p className="text-sm text-gray-500 font-light">
              {isAvailable ? 'Available now' : 'Currently unavailable'}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className="inline-block bg-[#dca744] text-gray-900 px-12 py-4 text-sm font-bold tracking-wide hover:bg-[#e6b85c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isAdding ? 'Added to cart' : isAvailable ? 'Add to cart' : 'Notify when available'}
          </button>
        </div>
      </section>

      {/* 8. Editorial Cross-link */}
      <section className="py-24 lg:py-32 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center space-y-6">
          <p className="text-sm text-gray-500 font-light uppercase tracking-wider">
            From the journal
          </p>
          <p className="text-lg text-gray-600 font-light">
            Read more about creating intentional spaces in our editorial.
          </p>
          <Link 
            href="https://betadomot.blog"
            className="inline-block text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
          >
            Visit Betadomot Journal
          </Link>
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
