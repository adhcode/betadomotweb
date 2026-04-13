import Link from 'next/link';
import Image from 'next/image';

export default function ShopFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/beta-logo2.png"
                alt="BetaDomot"
                width={100}
                height={24}
                style={{ width: 'auto', height: '24px' }}
              />
            </Link>
           
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/?category=home-tech" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Home Tech
                </Link>
              </li>
              <li>
                <Link href="/?category=furniture" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/?category=organization" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Organization
                </Link>
              </li>
              <li>
                <Link href="/?category=health-comfort" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Health & Comfort
                </Link>
              </li>
              <li>
                <Link href="/?category=lighting" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Lighting
                </Link>
              </li>
              <li>
                <Link href="/?category=decor" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://blog.betadomot.com" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Visit Our Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} BetaDomot. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-[#236b7c] transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
