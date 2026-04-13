'use client';

import { useCart } from '@/lib/cart-context';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializePayment } from '@/lib/payment';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  // Updated: 2026-04-12 - Gold buttons

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: items.map(item => ({
          product_id: item.id,
          product_slug: item.slug,
          name: item.name,
          price: item.sale_price || item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalPrice,
        shipping_cost: shippingCost,
        tax: tax,
        total: finalTotal,
        payment_method: formData.paymentMethod,
      };

      console.log('[Checkout] Submitting order:', orderData);

      // Initialize payment with backend
      const paymentResponse = await initializePayment(orderData);

      console.log('[Checkout] Payment initialized:', paymentResponse);

      // Store order info in sessionStorage for success page
      sessionStorage.setItem('pending_order', JSON.stringify({
        order_id: paymentResponse.order_id,
        order_number: paymentResponse.order_number,
        payment_reference: paymentResponse.payment_reference,
      }));

      // Clear cart before redirecting
      clearCart();

      // Redirect to Paystack checkout
      window.location.href = paymentResponse.authorization_url;

    } catch (err) {
      console.error('[Checkout] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setIsProcessing(false);
    }
  };

  const shippingCost = totalPrice > 50000 ? 0 : 2500;
  const tax = Math.round(totalPrice * 0.075);
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <EditorialHeader />
        <main className="max-w-4xl mx-auto px-6 lg:px-12 pt-32 pb-24">
          <div className="text-center py-32">
            <p className="text-2xl font-light text-gray-900 mb-4">Your cart is empty</p>
            <p className="text-base text-gray-500 font-light mb-12">Add products to continue</p>
            <Link
              href="/"
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 text-sm font-light tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Return to collection
            </Link>
          </div>
        </main>
        <ShopFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      <main className="max-w-6xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Checkout</h1>
          <p className="text-base text-gray-500 font-light">Complete your order</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-light">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Contact */}
              <div>
                <h2 className="text-sm text-gray-500 uppercase tracking-wider font-light mb-8">
                  Contact
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      placeholder="+234"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-sm text-gray-500 uppercase tracking-wider font-light mb-8">
                  Shipping
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-light mb-2">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-light mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-light mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-light mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-light mb-2">
                        Postal code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 text-base font-light transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-sm text-gray-500 uppercase tracking-wider font-light mb-8">
                  Payment
                </h2>
                <div className="space-y-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="text-base font-light text-gray-900">Card</div>
                      <div className="text-sm text-gray-500 font-light">Secure payment</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="text-base font-light text-gray-900">Bank transfer</div>
                      <div className="text-sm text-gray-500 font-light">Direct transfer</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="delivery"
                      checked={formData.paymentMethod === 'delivery'}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="text-base font-light text-gray-900">Pay on delivery</div>
                      <div className="text-sm text-gray-500 font-light">Cash or card</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#dca744] text-gray-900 py-4 text-sm font-bold tracking-wide hover:bg-[#e6b85c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? 'Processing order...' : 'Complete order'}
              </button>

              <p className="text-center text-sm text-gray-500 font-light">
                Secure checkout · Terms apply
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h2 className="text-sm text-gray-500 uppercase tracking-wider font-light mb-8">
                Summary
              </h2>

              <div className="space-y-6 mb-12">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-50 shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-light text-sm text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-light">Qty {item.quantity}</span>
                        <span className="font-light text-gray-900">
                          ₦{((item.sale_price || item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Subtotal</span>
                  <span className="font-light text-gray-900">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Shipping</span>
                  <span className="font-light text-gray-900">
                    {shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Tax</span>
                  <span className="font-light text-gray-900">₦{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base pt-4 border-t border-gray-100">
                  <span className="font-light text-gray-900">Total</span>
                  <span className="font-light text-gray-900">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {totalPrice < 50000 && (
                <div className="mt-8 p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 font-light">
                    Free shipping on orders over ₦50,000
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}
