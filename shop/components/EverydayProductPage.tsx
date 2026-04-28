'use client';

import { useCart } from '@/lib/cart-context';
import { EverydayProduct, formatPrice } from '@/lib/product-utils';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Truck, Shield, RotateCcw, X, ZoomIn, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EverydayProductPageProps {
  product: EverydayProduct;
}

export default function EverydayProductPage({ product }: EverydayProductPageProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<EverydayProduct[]>([]);

  const images = product.images || [];
  const selectedImage = images[selectedImageIndex] || images[0];

  const currentPrice = product.sale_price || product.price;
  const hasDiscount = !!product.sale_price && product.sale_price < product.price;
  const savings = hasDiscount ? product.price - currentPrice : 0;
  const discountPercent = hasDiscount && product.price > 0 ? Math.round((savings / product.price) * 100) : 0;
  const isAvailable = product.stock > 0;

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        
        // Try to fetch by collection first, then category
        let url = `${backendUrl}/products?limit=4`;
        
        // Check if product has collection_slug or category
        const collectionSlug = (product as any).collection_slug;
        if (collectionSlug) {
          url += `&collection=${collectionSlug}`;
        } else if (product.category) {
          url += `&category=${product.category}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Filter out current product
          const filtered = data.filter((p: any) => p.slug !== product.slug).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [product.slug, product.category]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const getFullDescription = () => {
    return product.description || 'This product was selected for its quality, reliability, and value for everyday use.';
  };

  const getShortDescription = () => {
    const text = getFullDescription();
    if (text.length <= 200) return text;
    return text.substring(0, 200).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      <main className="pt-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to shop</span>
          </Link>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                {selectedImage ? (
                  <>
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                )}
                {hasDiscount && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg z-10">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>
              
              {/* Thumbnail Grid - Show all images */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border transition-all ${
                        selectedImageIndex === idx 
                          ? 'border-[#236b7c] ring-2 ring-[#236b7c] ring-offset-2' 
                          : 'border-gray-100 hover:border-[#236b7c]'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-[#236b7c] font-semibold uppercase tracking-wider">
                  {product.category || 'Everyday Essential'}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="pt-4">
                  {hasDiscount ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-red-600">
                          {formatPrice(currentPrice)}
                        </span>
                        <span className="text-2xl text-gray-400 line-through font-light">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                        <span className="font-semibold">Save {formatPrice(savings)}</span>
                        <span className="font-light">({discountPercent}% off)</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(currentPrice)}
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-semibold">
                        In Stock ({product.stock} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-semibold">Out of Stock</span>
                    </>
                  )}
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900">Select Option</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                          selectedVariant === variant.id
                            ? 'border-[#dca744] bg-[#dca744] text-gray-900'
                            : 'border-gray-200 hover:border-[#dca744]'
                        }`}
                      >
                        {variant.name}
                        {variant.price_adjustment !== 0 && (
                          <span className="ml-2 text-sm">
                            ({variant.price_adjustment > 0 ? '+' : ''}{formatPrice(variant.price_adjustment)})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isAdding}
                  className="w-full bg-gray-900 text-white py-4 px-8 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isAdding ? 'Added to cart' : isAvailable ? 'Add to cart' : 'Out of stock'}
                </button>

                {/* Delivery Info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Package className="text-gray-700 flex-shrink-0" size={20} strokeWidth={1.5} />
                  <p className="text-sm text-gray-700 font-light">
                    Delivery in 3–5 days (Lagos) • 5–7 days (other regions)
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-gray-900" />
                  <div className="font-light">
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-xs">Orders over ₦50,000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-900" />
                  <div className="font-light">
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-xs">Protected checkout</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={20} className="text-gray-900" />
                  <div className="font-light">
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-xs">7-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100">
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-gray-900">Description</h2>
            <div className="text-lg font-light text-gray-700 leading-relaxed">
              {showFullDescription ? (
                <>
                  <p>{getFullDescription()}</p>
                  {getFullDescription().length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-gray-900 hover:text-gray-600 text-sm mt-4 underline"
                    >
                      Show less
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p>{getShortDescription()}</p>
                  {getFullDescription().length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-gray-900 hover:text-gray-600 text-sm mt-4 underline"
                    >
                      Read more
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        {product.care_instructions && (
          <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100">
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-900">Care & maintenance</h2>
              <p className="text-base font-light text-gray-700 leading-relaxed">
                {product.care_instructions}
              </p>
            </div>
          </section>
        )}

        {/* Return Policy */}
        <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100">
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-gray-900">Returns & exchanges</h2>
            <p className="text-base font-light text-gray-700 leading-relaxed">
              {product.return_policy || 'Easy returns within 7 days. Items must be unused and in original packaging.'}
            </p>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100">
            <div className="space-y-12">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-light text-gray-900">You might also like</h2>
                <p className="text-gray-600 font-light">More from this collection</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.slug}
                    href={`/products/${relatedProduct.slug}`}
                    className="group"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        {relatedProduct.images?.[0] ? (
                          <Image
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                        )}
                        {relatedProduct.sale_price && relatedProduct.sale_price < relatedProduct.price && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            SALE
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {relatedProduct.sale_price && relatedProduct.sale_price < relatedProduct.price ? (
                            <>
                              <span className="text-base font-semibold text-red-600">
                                {formatPrice(relatedProduct.sale_price)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(relatedProduct.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-base font-semibold text-gray-900">
                              {formatPrice(relatedProduct.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>

          <div className="max-w-7xl w-full h-full flex flex-col items-center justify-center gap-6">
            {/* Main Lightbox Image */}
            <div className="relative w-full h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-contain"
                quality={100}
              />
            </div>

            {/* Lightbox Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto max-w-full px-4" onClick={(e) => e.stopPropagation()}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 bg-gray-900 overflow-hidden transition-all ${
                      selectedImageIndex === idx 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ShopFooter />
    </div>
  );
}
