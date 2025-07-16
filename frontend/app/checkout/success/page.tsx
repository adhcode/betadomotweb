'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    CheckCircle,
    Package,
    Truck,
    Mail,
    ArrowRight,
    Download,
    Star,
    Heart
} from 'lucide-react';

export default function CheckoutSuccessPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [orderNumber] = useState(() =>
        'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    );
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-20">
                {/* Success Hero */}
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                        <div className={`transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            {/* Success Icon */}
                            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>

                            {/* Success Message */}
                            <h1 className="font-cutive font-normal text-3xl sm:text-4xl md:text-5xl text-primary-900 mb-6">
                                Order Confirmed!
                            </h1>
                            <p className="font-body font-light text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
                                Thank you for your purchase. Your order has been successfully placed and is being processed.
                            </p>

                            {/* Order Number */}
                            <div className="bg-neutral-50 p-6 rounded-sm mb-12 max-w-md mx-auto">
                                <p className="font-body font-light text-sm text-neutral-600 tracking-[0.1em] uppercase mb-2">
                                    Order Number
                                </p>
                                <p className="font-cutive font-normal text-2xl text-primary-900">
                                    {orderNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Order Details */}
                <section className="py-16 sm:py-20 md:py-24 bg-neutral-50">
                    <div className="max-w-6xl mx-auto px-6 sm:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* What's Next */}
                            <div className={`bg-white p-8 rounded-sm text-center transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="font-cutive font-normal text-xl text-primary-900 mb-4">
                                    Order Confirmation
                                </h3>
                                <p className="font-body font-light text-neutral-600 text-sm leading-relaxed">
                                    You'll receive an email confirmation with your order details and tracking information.
                                </p>
                            </div>

                            {/* Processing */}
                            <div className={`bg-white p-8 rounded-sm text-center transition-all duration-1200 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Package className="w-8 h-8 text-amber-600" />
                                </div>
                                <h3 className="font-cutive font-normal text-xl text-primary-900 mb-4">
                                    Processing
                                </h3>
                                <p className="font-body font-light text-neutral-600 text-sm leading-relaxed">
                                    Your order is being prepared and will be shipped within 1-2 business days.
                                </p>
                            </div>

                            {/* Delivery */}
                            <div className={`bg-white p-8 rounded-sm text-center transition-all duration-1200 ease-out delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Truck className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-cutive font-normal text-xl text-primary-900 mb-4">
                                    Delivery
                                </h3>
                                <p className="font-body font-light text-neutral-600 text-sm leading-relaxed">
                                    Estimated delivery: <strong>{formatDate(estimatedDelivery)}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8">
                        <div className={`text-center transition-all duration-1200 ease-out delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <h2 className="font-cutive font-normal text-3xl text-primary-900 mb-8">
                                What would you like to do next?
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/products')}
                                    className="bg-primary-900 text-white px-8 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 flex items-center justify-center gap-3"
                                >
                                    <span>Continue Shopping</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="border border-neutral-300 text-primary-900 px-8 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-50 transition-colors duration-300 flex items-center justify-center gap-3"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Receipt</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Support */}
                <section className="py-16 sm:py-20 md:py-24 bg-neutral-50">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8">
                        <div className={`text-center transition-all duration-1200 ease-out delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <h2 className="font-cutive font-normal text-3xl text-primary-900 mb-6">
                                Need Help?
                            </h2>
                            <p className="font-body font-light text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
                                Our customer support team is here to help with any questions about your order.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div className="bg-white p-6 rounded-sm">
                                    <h3 className="font-cutive font-normal text-xl text-primary-900 mb-3">
                                        Email Support
                                    </h3>
                                    <p className="font-body font-light text-neutral-600 text-sm mb-4">
                                        Get help via email within 24 hours
                                    </p>
                                    <a
                                        href="mailto:support@betadomot.com"
                                        className="font-body font-light text-sm text-primary-900 hover:text-neutral-700 transition-colors duration-300"
                                    >
                                        support@betadomot.com
                                    </a>
                                </div>

                                <div className="bg-white p-6 rounded-sm">
                                    <h3 className="font-cutive font-normal text-xl text-primary-900 mb-3">
                                        Phone Support
                                    </h3>
                                    <p className="font-body font-light text-neutral-600 text-sm mb-4">
                                        Call us Monday - Friday, 9AM - 6PM
                                    </p>
                                    <a
                                        href="tel:+2348001234567"
                                        className="font-body font-light text-sm text-primary-900 hover:text-neutral-700 transition-colors duration-300"
                                    >
                                        +234 800 123 4567
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Review Prompt */}
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-4xl mx-auto px-6 sm:px-8">
                        <div className={`bg-gradient-to-r from-primary-900 to-neutral-800 text-white p-12 rounded-sm text-center transition-all duration-1200 ease-out delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <h2 className="font-cutive font-normal text-3xl mb-6">
                                Love Your Purchase?
                            </h2>
                            <p className="font-body font-light text-lg mb-8 opacity-90">
                                Share your experience and help other customers make the right choice.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-primary-900 px-8 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-100 transition-colors duration-300 flex items-center justify-center gap-3">
                                    <Star className="w-4 h-4" />
                                    <span>Leave a Review</span>
                                </button>
                                <button className="border border-white text-white px-8 py-4 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-white hover:text-primary-900 transition-colors duration-300 flex items-center justify-center gap-3">
                                    <Heart className="w-4 h-4" />
                                    <span>Share with Friends</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
} 