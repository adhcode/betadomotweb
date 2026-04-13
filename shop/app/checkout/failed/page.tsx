'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';

function FailedContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <main className="max-w-4xl mx-auto px-6 lg:px-12 pt-32 pb-24">
      <div className="text-center py-20">
        <div className="mb-8">
          <svg
            className="w-20 h-20 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
          Payment failed
        </h1>

        <p className="text-xl text-gray-600 font-light mb-16 max-w-2xl mx-auto">
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>

        {reference && (
          <div className="mb-16 pb-16 border-b border-gray-100">
            <div className="text-sm text-gray-500 font-light uppercase tracking-wider mb-3">
              Transaction reference
            </div>
            <div className="text-lg font-light text-gray-600">{reference}</div>
          </div>
        )}

        <div className="space-y-6">
          <Link
            href="/checkout"
            className="inline-block bg-gray-900 text-white px-12 py-4 text-sm font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
          >
            Try again
          </Link>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-300 hover:border-gray-900"
            >
              Return to collection
            </Link>

            <p className="text-sm text-gray-500 font-light">
              Need help?{' '}
              <a
                href="mailto:hello@betadomot.blog"
                className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-900"
              >
                hello@betadomot.blog
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutFailedPage() {
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
        <FailedContent />
      </Suspense>
      <ShopFooter />
    </div>
  );
}
