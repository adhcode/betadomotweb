'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isOpen, closeCart } = useCart();
  // Updated: 2026-04-12 - Gold buttons

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-[#236b7c]" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Shopping Cart
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6 font-light">Add some products to get started</p>
              <button
                onClick={closeCart}
                className="bg-[#236b7c] text-white px-6 py-3 rounded-lg hover:bg-[#1a5463] transition-colors font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <Link href={`/products/${item.slug}`} onClick={closeCart}>
                    <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.slug}`} 
                      onClick={closeCart}
                      className="font-semibold text-gray-900 hover:text-[#236b7c] transition-colors line-clamp-2 mb-1"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="text-lg font-bold text-gray-900 mb-3">
                      ₦{((item.sale_price || item.price) * item.quantity).toLocaleString()}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors text-gray-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 font-semibold min-w-[2rem] text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-light">Subtotal ({totalItems} items)</span>
              <span className="font-semibold text-gray-900">₦{totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-light">Shipping</span>
              <span className="font-semibold text-gray-900">Calculated at checkout</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#236b7c]">₦{totalPrice.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#dca744] text-gray-900 py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#e6b85c] transition-all hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={closeCart}
                className="w-full mt-3 border-2 border-gray-200 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:border-[#236b7c] hover:text-[#236b7c] transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
