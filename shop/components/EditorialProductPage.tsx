'use client';

import { useCart } from '@/lib/cart-context';
import { EditorialProduct, formatPrice, getAvailabilityLabel } from '@/lib/product-utils';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, ZoomIn, Package, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EditorialProductPage({ product }: { product: EditorialProduct }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<EditorialProduct[]>([]);

  const currentPrice = product.price || 0;
  const isAvailable = product.availability_status === 'available' || product.availability_status === 'limited';
  const isReference = product.availability_status === 'reference';
  const images = product.images || [];
  const selectedImage = images[selectedImageIndex] || images[0];

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
    if (!isAvailable || isReference) return;
    
    setIsAdding(true);
    addToCart(product as any);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const getFullDescription = () => {
    return product.editorial_note || product.description || 'This piece was selected for its quality, purpose, and ability to enhance everyday living spaces with thoughtful design.';
  };

  const getShortDescription = () => {
    const text = getFullDescription();
    if (text.length <= 150) return text;
    return text.substring(0, 150).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      <main className="pt-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-600 pb-2">
            <Link href="/" className="hover:text-gray-900 transition-colors flex-shrink-0">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <Link href="/" className="hover:text-gray-900 transition-colors flex-shrink-0">
              All products
            </Link>
            {((product as any).collection_name || product.category) && (
              <>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                <Link 
                  href={(product as any).collection_slug ? `/collections/${(product as any).collection_slug}` : `/category/${product.category}`}
                  className="hover:text-gray-900 transition-colors flex-shrink-0"
                >
                  {(product as any).collection_name || product.category}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium flex-shrink-0">{product.name}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-zoom-in group"
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
              </div>
              
              {/* Thumbnail Grid - Show all images */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square bg-gray-50 overflow-hidden transition-all ${
                        selectedImageIndex === idx 
                          ? 'ring-2 ring-gray-900 ring-offset-2' 
                          : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-2'
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
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Betadomot Pick
                </p>
                <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <div className="text-lg text-gray-600 font-light leading-relaxed">
                  {showFullDescription ? (
                    <>
                      <p>{getFullDescription()}</p>
                      {getFullDescription().length > 150 && (
                        <button
                          onClick={() => setShowFullDescription(false)}
                          className="text-gray-900 hover:text-gray-600 text-sm mt-2 underline"
                        >
                          Show less
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <p>{getShortDescription()}</p>
                      {getFullDescription().length > 150 && (
                        <button
                          onClick={() => setShowFullDescription(true)}
                          className="text-gray-900 hover:text-gray-600 text-sm mt-2 underline"
                        >
                          Read more
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Price & Availability */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-light text-gray-900">
                    {product.price > 0 ? formatPrice(currentPrice) : 'Price on request'}
                  </div>
                  <div className="text-sm font-light text-gray-500">
                    {getAvailabilityLabel(product)}
                  </div>
                </div>

                {isReference ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 font-light">
                      This piece is shown for inspiration and reference
                    </p>
                    {product.external_link && (
                      <a
                        href={product.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center border border-gray-900 text-gray-900 py-4 px-8 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
                      >
                        View at manufacturer
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={!isAvailable || isAdding}
                      className="w-full bg-gray-900 text-white py-4 px-8 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAdding ? 'Added to cart' : isAvailable ? 'Add to cart' : 'Notify when available'}
                    </button>

                    {/* Delivery Info */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Package className="text-gray-700 flex-shrink-0" size={20} strokeWidth={1.5} />
                      <p className="text-sm text-gray-700 font-light">
                        Delivery in 3–5 days (Lagos) • 5–7 days (other regions)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4 pt-6 border-t border-gray-200 text-sm text-gray-600">
                {product.dimensions && (
                  <div className="flex justify-between">
                    <span className="font-light">Dimensions</span>
                    <span className="font-light">{product.dimensions}</span>
                  </div>
                )}
                {product.weight > 0 && (
                  <div className="flex justify-between">
                    <span className="font-light">Weight</span>
                    <span className="font-light">{product.weight}kg</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between">
                    <span className="font-light">Material</span>
                    <span className="font-light">{product.material}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        {(product.dimensions || product.weight > 0 || (product as any).material) && (
          <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100">
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-900">Details</h2>
              <div className="space-y-4 text-sm text-gray-600">
                {product.dimensions && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-light">Dimensions</span>
                    <span className="font-light text-gray-900">{product.dimensions}</span>
                  </div>
                )}
                {product.weight > 0 && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-light">Weight</span>
                    <span className="font-light text-gray-900">{product.weight}kg</span>
                  </div>
                )}
                {(product as any).material && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-light">Material</span>
                    <span className="font-light text-gray-900">{(product as any).material}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
                      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
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
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-base font-light text-gray-900">
                          {relatedProduct.price > 0 ? formatPrice(relatedProduct.price) : 'Price on request'}
                        </p>
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
