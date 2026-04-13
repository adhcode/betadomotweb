'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import { useCart } from '@/lib/cart-context';

interface OrderDetails {
  id: string;
  order_number: string;
  customer_email: string;
  total: number;
  payment_status: string;
  status: string;
  created_at: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  // Clear cart once on mount
  useEffect(() => {
    clearCart();
  }, []); // Empty array - runs once on mount

  // Verify payment
  useEffect(() => {
    if (reference) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/verify-payment?reference=${reference}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            setOrder(data.order);
          }
        })
        .catch(err => console.error('Error verifying payment:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [reference]);

  const orderNumber = order?.order_number || `BD-${Date.now().toString().slice(-8)}`;

  return (
    <main className="max-w-4xl mx-auto px-6 lg:px-12 pt-32 pb-24">
      <div className="text-center py-20">
        {loading ? (
          <div className="py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-light">Confirming your order...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <svg
                className="w-20 h-20 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
              Order confirmed
            </h1>

            <p className="text-xl text-gray-600 font-light mb-16 max-w-2xl mx-auto">
              Thank you for your order. We'll send you shipping updates via email.
            </p>

            <div className="mb-16 pb-16 border-b border-gray-100">
              <div className="text-sm text-gray-500 font-light uppercase tracking-wider mb-3">
                Order number
              </div>
              <div className="text-3xl font-light text-gray-900">{orderNumber}</div>
              {order?.customer_email && (
                <div className="mt-4 text-sm text-gray-600 font-light">
                  Confirmation sent to {order.customer_email}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 max-w-3xl mx-auto">
              <div className="text-center">
                <p className="text-base font-light text-gray-900 mb-2">Processing</p>
                <p className="text-sm text-gray-500 font-light">
                  Preparing your order
                </p>
              </div>

              <div className="text-center">
                <p className="text-base font-light text-gray-900 mb-2">Shipping</p>
                <p className="text-sm text-gray-500 font-light">
                  3–5 business days
                </p>
              </div>

              <div className="text-center">
                <p className="text-base font-light text-gray-900 mb-2">Updates</p>
                <p className="text-sm text-gray-500 font-light">
                  Via email
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Link
                href="/"
                className="inline-block border border-gray-900 text-gray-900 px-12 py-4 text-sm font-light tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                Return to collection
              </Link>

              <p className="text-sm text-gray-500 font-light">
                Questions?{' '}
                <a href="mailto:hello@betadomot.blog" className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-900">
                  hello@betadomot.blog
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />
      <Suspense fallback={
        <main className="max-w-4xl mx-auto px-6 lg:px-12 pt-32 pb-24">
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-8"></div>
              <div className="h-12 bg-gray-200 w-64 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 w-96 mx-auto"></div>
            </div>
          </div>
        </main>
      }>
        <SuccessContent />
      </Suspense>
      <ShopFooter />
    </div>
  );
}
