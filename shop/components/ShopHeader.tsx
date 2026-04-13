'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ShopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/beta-logo2.png"
              alt="BetaDomot"
              width={100}
              height={24}
              style={{ width: 'auto', height: '24px' }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              All Products
            </Link>
            <Link href="/?category=home-tech" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              Home Tech
            </Link>
            <Link href="/?category=furniture" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              Furniture
            </Link>
            <Link href="/?category=organization" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              Organization
            </Link>
            <Link href="/?category=health-comfort" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              Health & Comfort
            </Link>
            <Link href="/?category=lighting" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              Lighting
            </Link>
            <Link href="/?category=decor" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
              Decor
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:text-[#236b7c] transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-700 hover:text-[#236b7c] transition-colors">
              <Heart size={20} />
            </button>
            <button 
              onClick={openCart}
              className="p-2 text-gray-700 hover:text-[#236b7c] transition-colors relative"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#dca744] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                All Products
              </Link>
              <Link href="/?category=home-tech" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                Home Tech
              </Link>
              <Link href="/?category=furniture" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                Furniture
              </Link>
              <Link href="/?category=organization" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                Organization
              </Link>
              <Link href="/?category=health-comfort" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                Health & Comfort
              </Link>
              <Link href="/?category=lighting" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                Lighting
              </Link>
              <Link href="/?category=decor" className="text-gray-700 hover:text-[#236b7c] transition-colors font-medium">
                Decor
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
