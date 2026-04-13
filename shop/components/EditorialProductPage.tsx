'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

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

export default function EditorialProductPage({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const currentPrice = product.sale_price || product.price || 0;
  const isAvailable = product.stock > 0;

  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return 'Price on request';
    return `₦${price.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  // Extract a short descriptive line from description (first sentence or first 60 chars)
  const getShortDescription = () => {
    if (!product.description) return 'A thoughtfully selected piece for your home';
    const firstSentence = product.description.split('.')[0];
    if (firstSentence.length <= 60) return firstSentence;
    return product.description.substring(0, 60).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-light tracking-wide">Back to collection</span>
          </Link>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Main Image */}
            <div className="space-y-6">
              <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  {getShortDescription()}
                </p>
              </div>

              {/* Primary Action */}
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-light text-gray-900">
                    {formatPrice(currentPrice)}
                  </div>
                  <div className="text-sm font-light text-gray-600">
                    {isAvailable ? 'In stock' : 'Currently unavailable'}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isAdding}
                  className="w-full bg-[#dca744] text-gray-900 py-4 px-8 text-sm font-bold tracking-wide hover:bg-[#e6b85c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isAdding ? 'Added to cart' : isAvailable ? 'Add to home' : 'Notify when available'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Product */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-gray-900">Why we chose this</h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed">
              {product.description || 'This piece was selected for its quality, purpose, and ability to enhance everyday living spaces with thoughtful design.'}
            </p>
          </div>
        </section>

        {/* In Use - Additional Images */}
        {product.images && product.images.length > 1 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
            <h2 className="text-2xl font-light text-gray-900 mb-12">In use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.name} in context ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* What It's Good For */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-gray-100">
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-gray-900">What it's good for</h2>
            <ul className="space-y-4">
              {product.tags && product.tags.length > 0 ? (
                product.tags.slice(0, 5).map((tag, idx) => (
                  <li key={idx} className="text-lg font-light text-gray-700 leading-relaxed">
                    {tag}
                  </li>
                ))
              ) : (
                <>
                  <li className="text-lg font-light text-gray-700 leading-relaxed">
                    Adding character to everyday spaces
                  </li>
                  <li className="text-lg font-light text-gray-700 leading-relaxed">
                    Creating moments of calm in your home
                  </li>
                  <li className="text-lg font-light text-gray-700 leading-relaxed">
                    Thoughtful living with quality materials
                  </li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* What to Know */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-gray-100">
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-gray-900">What to know</h2>
            <div className="space-y-6 text-base font-light text-gray-700 leading-relaxed">
              {product.dimensions && (
                <p>Dimensions: {product.dimensions}</p>
              )}
              {product.weight > 0 && (
                <p>Weight: {product.weight}kg</p>
              )}
              <p>Category: {product.category}</p>
              <p className="pt-4 border-t border-gray-100">
                Care: Handle with care. Clean gently with appropriate materials for best longevity.
              </p>
              <p>
                Best suited for: Living spaces, bedrooms, and areas where you spend intentional time.
              </p>
            </div>
          </div>
        </section>

        {/* Delivery & Shipping */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-gray-100">
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-gray-900">Delivery & shipping</h2>
            <div className="space-y-4 text-base font-light text-gray-700 leading-relaxed">
              <p>
                We deliver across Nigeria with care. Your order will arrive within 3–5 business days 
                in Lagos, and 5–7 days for other regions.
              </p>
              <p>
                Each item is packaged thoughtfully to ensure it reaches you in perfect condition. 
                Free shipping on orders over ₦50,000.
              </p>
            </div>
          </div>
        </section>

        {/* How We'd Style It */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-gray-100">
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-gray-900">How we'd style it</h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed">
              This piece works beautifully in spaces where you want to create a sense of calm and intention. 
              Place it where natural light can interact with its form throughout the day. It pairs well with 
              neutral tones and natural materials—think linen, wood, and stone.
            </p>
          </div>
        </section>

        {/* From the Journal */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-gray-100">
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-gray-900">From the Betadomot journal</h2>
            <p className="text-base font-light text-gray-600">
              Read more about creating intentional spaces in our editorial.
            </p>
            <Link 
              href="https://betadomot.blog"
              className="inline-block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
            >
              Visit the journal →
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-2xl font-light text-gray-900 mb-2">{product.name}</div>
              <div className="text-lg font-light text-gray-600">{formatPrice(currentPrice)}</div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || isAdding}
              className="bg-[#dca744] text-gray-900 py-4 px-12 text-sm font-bold tracking-wide hover:bg-[#e6b85c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? 'Added to cart' : isAvailable ? 'Add to home' : 'Notify when available'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
