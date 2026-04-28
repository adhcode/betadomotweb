'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function EditorialHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/images/beta-logo2.png"
                alt="Betadomot"
                width={100}
                height={24}
                style={{ width: 'auto', height: '24px' }}
                priority
              />
            </Link>

            {/* Right Side: Menu + Cart */}
            <div className="flex items-center gap-4">
              {/* Menu Icon */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              {/* Cart Icon - Only show if items exist */}
              {totalItems > 0 && (
                <button
                  onClick={openCart}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-light leading-none px-1">
                    {totalItems}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          {/* Close Button */}
          <div className="absolute top-6 right-6 lg:top-12 lg:right-12">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="min-h-full flex items-center justify-center px-6 py-24">
            <div className="max-w-5xl w-full">
              {/* All Products - Prominent Link */}
              <div className="mb-16 pb-16 border-b border-gray-100">
                <Link
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-block text-4xl md:text-5xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                >
                  All Products
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                
                {/* Explore by Space */}
                <div className="space-y-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                    Explore by Space
                  </h3>
                  <div className="space-y-4">
                    <Link
                      href="/?space=living-room"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Living Room
                    </Link>
                    <Link
                      href="/?space=bedroom"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Bedroom
                    </Link>
                    <Link
                      href="/?space=kitchen"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Kitchen
                    </Link>
                    <Link
                      href="/?space=work"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Work
                    </Link>
                  </div>
                </div>

                {/* Explore by Purpose */}
                <div className="space-y-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                    Explore by Purpose
                  </h3>
                  <div className="space-y-4">
                    <Link
                      href="/?purpose=power"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Power
                    </Link>
                    <Link
                      href="/?purpose=comfort"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Comfort
                    </Link>
                    <Link
                      href="/?purpose=light"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Light
                    </Link>
                    <Link
                      href="/?purpose=storage"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Storage
                    </Link>
                  </div>
                </div>

                {/* Read */}
                <div className="space-y-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                    Read
                  </h3>
                  <div className="space-y-4">
                    <Link
                      href="https://betadomot.blog/guides"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Guides
                    </Link>
                    <Link
                      href="https://betadomot.blog"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Stories
                    </Link>
                    <Link
                      href="https://betadomot.blog/category/field-notes"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Field Notes
                    </Link>
                  </div>
                </div>

                {/* Studio */}
                <div className="space-y-6">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-light mb-8">
                    Studio
                  </h3>
                  <div className="space-y-4">
                    <Link
                      href="/how-we-choose"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      How We Choose
                    </Link>
                    <div className="block text-2xl font-light text-gray-400 cursor-not-allowed">
                      Coming Soon
                      <p className="text-sm text-gray-400 font-light mt-1">
                        Future hardware & software
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
