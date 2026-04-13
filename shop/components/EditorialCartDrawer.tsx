'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus } from 'lucide-react';
import { useEffect } from 'react';

export default function EditorialCartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isOpen, closeCart } = useCart();

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
        className="fixed inset-0 bg-black/20 z-50 transition-opacity backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="text-xl font-light text-gray-900">
            Cart ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-lg text-gray-500 font-light mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400 font-light">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                  <Link href={`/products/${item.slug}`} onClick={closeCart}>
                    <div className="relative w-24 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.slug}`} 
                      onClick={closeCart}
                      className="font-light text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 mb-2 block"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="text-sm text-gray-600 font-light mb-3">
                      ₦{(item.sale_price || item.price).toLocaleString()}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="text-sm font-light min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-gray-500 hover:text-gray-900 font-light transition-colors"
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
          <div className="border-t border-gray-100 px-6 py-6 space-y-6 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-light">Subtotal</span>
              <span className="text-lg font-light text-gray-900">₦{totalPrice.toLocaleString()}</span>
            </div>

            {/* Shipping Note */}
            <p className="text-xs text-gray-500 font-light text-center">
              Shipping calculated at checkout
            </p>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#dca744] text-gray-900 text-center py-4 text-sm font-bold tracking-wide hover:bg-[#e6b85c] transition-colors"
            >
              Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
