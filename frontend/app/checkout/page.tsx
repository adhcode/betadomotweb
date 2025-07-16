'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    MapPin,
    User,
    Mail,
    Phone,
    Lock,
    Check,
    ArrowLeft,
    Package,
    Truck,
    Shield,
    AlertCircle
} from 'lucide-react';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    category: string;
    tags: string[];
    stock: number;
    sku: string;
    weight: number;
    dimensions: string;
    featured: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CheckoutForm {
    // Customer Information
    email: string;
    firstName: string;
    lastName: string;
    phone: string;

    // Shipping Address
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;

    // Billing Address
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingPostalCode: string;
    billingCountry: string;

    // Payment
    paymentMethod: 'card' | 'bank_transfer' | 'paystack';
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;

    // Options
    sameAsBilling: boolean;
    saveInfo: boolean;
    newsletter: boolean;
}

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState<CheckoutForm>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingPostalCode: '',
        billingCountry: 'Nigeria',
        paymentMethod: 'paystack',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        sameAsBilling: true,
        saveInfo: false,
        newsletter: false
    });

    const router = useRouter();

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            setCart(cartData);

            // Redirect to cart if empty
            if (cartData.length === 0) {
                router.push('/cart');
                return;
            }
        } else {
            router.push('/cart');
            return;
        }

        setLoading(false);

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [router]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getItemPrice = (item: CartItem) => {
        return item.product.sale_price && item.product.sale_price > 0
            ? item.product.sale_price
            : item.product.price;
    };

    const subtotal = cart.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    const shipping = subtotal > 50000 ? 0 : 5000;
    const tax = subtotal * 0.075;
    const total = subtotal + shipping + tax;

    const updateForm = (field: keyof CheckoutForm, value: string | boolean) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            // Customer Information
            if (!form.email) newErrors.email = 'Email is required';
            if (!form.firstName) newErrors.firstName = 'First name is required';
            if (!form.lastName) newErrors.lastName = 'Last name is required';
            if (!form.phone) newErrors.phone = 'Phone number is required';
        } else if (step === 2) {
            // Shipping Address
            if (!form.address) newErrors.address = 'Address is required';
            if (!form.city) newErrors.city = 'City is required';
            if (!form.state) newErrors.state = 'State is required';
            if (!form.postalCode) newErrors.postalCode = 'Postal code is required';

            // Billing Address (if different)
            if (!form.sameAsBilling) {
                if (!form.billingAddress) newErrors.billingAddress = 'Billing address is required';
                if (!form.billingCity) newErrors.billingCity = 'Billing city is required';
                if (!form.billingState) newErrors.billingState = 'Billing state is required';
                if (!form.billingPostalCode) newErrors.billingPostalCode = 'Billing postal code is required';
            }
        } else if (step === 3) {
            // Payment Information
            if (form.paymentMethod === 'card') {
                if (!form.cardNumber) newErrors.cardNumber = 'Card number is required';
                if (!form.expiryDate) newErrors.expiryDate = 'Expiry date is required';
                if (!form.cvv) newErrors.cvv = 'CVV is required';
                if (!form.cardName) newErrors.cardName = 'Cardholder name is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(3)) return;

        setProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Clear cart
            localStorage.removeItem('cart');

            // Redirect to success page
            router.push('/checkout/success');
        } catch (error) {
            console.error('Payment failed:', error);
            // Handle error
        } finally {
            setProcessing(false);
        }
    };

    const nigerianStates = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
        'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
        'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
        'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ];

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-body font-light text-neutral-500 tracking-[0.1em] uppercase text-sm">Loading Checkout</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section className="py-16 sm:py-20 md:py-24 bg-neutral-50">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className={`transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => router.push('/cart')}
                                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-300"
                                >
                                    <ArrowLeft className="w-5 h-5 text-primary-900" />
                                </button>
                                <h1 className="font-cutive font-normal text-3xl sm:text-4xl md:text-5xl text-primary-900">
                                    Checkout
                                </h1>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center gap-8 mb-8">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body font-light text-sm transition-colors duration-300 ${step <= currentStep
                                            ? 'bg-primary-900 text-white'
                                            : 'bg-neutral-200 text-neutral-500'
                                            }`}>
                                            {step < currentStep ? <Check className="w-4 h-4" /> : step}
                                        </div>
                                        <span className={`font-body font-light text-sm tracking-[0.1em] uppercase ${step <= currentStep ? 'text-primary-900' : 'text-neutral-500'
                                            }`}>
                                            {step === 1 ? 'Information' : step === 2 ? 'Shipping' : 'Payment'}
                                        </span>
                                        {step < 3 && (
                                            <div className={`w-16 h-px ${step < currentStep ? 'bg-primary-900' : 'bg-neutral-200'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Checkout Content */}
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Checkout Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Customer Information */}
                                    {currentStep === 1 && (
                                        <div className={`space-y-8 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                            }`}>
                                            <div>
                                                <h2 className="font-cutive font-normal text-2xl text-primary-900 mb-6">
                                                    Customer Information
                                                </h2>

                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                            Email Address
                                                        </label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                            <input
                                                                type="email"
                                                                value={form.email}
                                                                onChange={(e) => updateForm('email', e.target.value)}
                                                                className={`w-full pl-10 pr-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.email ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                                placeholder="your@email.com"
                                                            />
                                                        </div>
                                                        {errors.email && (
                                                            <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.email}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                                First Name
                                                            </label>
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                                <input
                                                                    type="text"
                                                                    value={form.firstName}
                                                                    onChange={(e) => updateForm('firstName', e.target.value)}
                                                                    className={`w-full pl-10 pr-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.firstName ? 'border-red-500' : 'border-neutral-300'
                                                                        }`}
                                                                    placeholder="John"
                                                                />
                                                            </div>
                                                            {errors.firstName && (
                                                                <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.firstName}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                                Last Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={form.lastName}
                                                                onChange={(e) => updateForm('lastName', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.lastName ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                                placeholder="Doe"
                                                            />
                                                            {errors.lastName && (
                                                                <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.lastName}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                            Phone Number
                                                        </label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                            <input
                                                                type="tel"
                                                                value={form.phone}
                                                                onChange={(e) => updateForm('phone', e.target.value)}
                                                                className={`w-full pl-10 pr-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.phone ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                                placeholder="+234 800 123 4567"
                                                            />
                                                        </div>
                                                        {errors.phone && (
                                                            <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="bg-primary-900 text-white px-8 py-3 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                                                >
                                                    Continue to Shipping
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Shipping Address */}
                                    {currentStep === 2 && (
                                        <div className={`space-y-8 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                            }`}>
                                            <div>
                                                <h2 className="font-cutive font-normal text-2xl text-primary-900 mb-6">
                                                    Shipping Address
                                                </h2>

                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                            Address
                                                        </label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-4 w-4 h-4 text-neutral-400" />
                                                            <textarea
                                                                value={form.address}
                                                                onChange={(e) => updateForm('address', e.target.value)}
                                                                rows={3}
                                                                className={`w-full pl-10 pr-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 resize-none ${errors.address ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                                placeholder="123 Main Street, Apartment 4B"
                                                            />
                                                        </div>
                                                        {errors.address && (
                                                            <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.address}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                                City
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={form.city}
                                                                onChange={(e) => updateForm('city', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.city ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                                placeholder="Lagos"
                                                            />
                                                            {errors.city && (
                                                                <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.city}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                                State
                                                            </label>
                                                            <select
                                                                value={form.state}
                                                                onChange={(e) => updateForm('state', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.state ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                            >
                                                                <option value="">Select State</option>
                                                                {nigerianStates.map(state => (
                                                                    <option key={state} value={state}>{state}</option>
                                                                ))}
                                                            </select>
                                                            {errors.state && (
                                                                <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.state}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                                Postal Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={form.postalCode}
                                                                onChange={(e) => updateForm('postalCode', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 ${errors.postalCode ? 'border-red-500' : 'border-neutral-300'
                                                                    }`}
                                                                placeholder="100001"
                                                            />
                                                            {errors.postalCode && (
                                                                <p className="text-red-500 text-sm mt-1 font-body font-light">{errors.postalCode}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block font-body font-light text-sm text-primary-900 tracking-[0.1em] uppercase mb-2">
                                                                Country
                                                            </label>
                                                            <select
                                                                value={form.country}
                                                                onChange={(e) => updateForm('country', e.target.value)}
                                                                className="w-full px-4 py-3 border border-neutral-300 rounded-sm font-body font-light focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300"
                                                            >
                                                                <option value="Nigeria">Nigeria</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="border border-neutral-300 text-primary-900 px-8 py-3 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-50 transition-colors duration-300"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="bg-primary-900 text-white px-8 py-3 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                                                >
                                                    Continue to Payment
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Payment */}
                                    {currentStep === 3 && (
                                        <div className={`space-y-8 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                            }`}>
                                            <div>
                                                <h2 className="font-cutive font-normal text-2xl text-primary-900 mb-6">
                                                    Payment Method
                                                </h2>

                                                <div className="space-y-6">
                                                    {/* Payment Method Selection */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <input
                                                                type="radio"
                                                                id="paystack"
                                                                name="paymentMethod"
                                                                value="paystack"
                                                                checked={form.paymentMethod === 'paystack'}
                                                                onChange={(e) => updateForm('paymentMethod', e.target.value as 'paystack')}
                                                                className="w-4 h-4 text-primary-900 focus:ring-primary-900"
                                                            />
                                                            <label htmlFor="paystack" className="font-body font-light text-primary-900 cursor-pointer">
                                                                Paystack (Recommended)
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <input
                                                                type="radio"
                                                                id="bank_transfer"
                                                                name="paymentMethod"
                                                                value="bank_transfer"
                                                                checked={form.paymentMethod === 'bank_transfer'}
                                                                onChange={(e) => updateForm('paymentMethod', e.target.value as 'bank_transfer')}
                                                                className="w-4 h-4 text-primary-900 focus:ring-primary-900"
                                                            />
                                                            <label htmlFor="bank_transfer" className="font-body font-light text-primary-900 cursor-pointer">
                                                                Bank Transfer
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Payment Details */}
                                                    {form.paymentMethod === 'paystack' && (
                                                        <div className="bg-blue-50 p-6 rounded-sm">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <Lock className="w-5 h-5 text-blue-600" />
                                                                <span className="font-body font-light text-blue-900">
                                                                    Secure payment with Paystack
                                                                </span>
                                                            </div>
                                                            <p className="font-body font-light text-sm text-blue-800">
                                                                You will be redirected to Paystack to complete your payment securely.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {form.paymentMethod === 'bank_transfer' && (
                                                        <div className="bg-amber-50 p-6 rounded-sm">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                                                <span className="font-body font-light text-amber-900">
                                                                    Bank Transfer Instructions
                                                                </span>
                                                            </div>
                                                            <div className="space-y-2 text-sm font-body font-light text-amber-800">
                                                                <p><strong>Account Name:</strong> BetaDomot Ltd</p>
                                                                <p><strong>Account Number:</strong> 1234567890</p>
                                                                <p><strong>Bank:</strong> First Bank of Nigeria</p>
                                                                <p><strong>Amount:</strong> {formatPrice(total)}</p>
                                                                <p className="mt-4">
                                                                    Please use your order number as the transfer reference.
                                                                    Your order will be processed once payment is confirmed.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="border border-neutral-300 text-primary-900 px-8 py-3 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-50 transition-colors duration-300"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-primary-900 text-white px-8 py-3 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-4 h-4" />
                                                            Complete Order
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className={`bg-neutral-50 p-8 rounded-sm sticky top-24 transition-all duration-1200 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                    }`}>
                                    <h3 className="font-cutive font-normal text-2xl text-primary-900 mb-6">
                                        Order Summary
                                    </h3>

                                    {/* Order Items */}
                                    <div className="space-y-4 mb-6">
                                        {cart.map((item) => (
                                            <div key={item.product.id} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-white rounded-sm overflow-hidden">
                                                    <Image
                                                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/images/placeholder.jpg'}
                                                        alt={item.product.name}
                                                        width={64}
                                                        height={64}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-body font-light text-sm text-primary-900 mb-1">
                                                        {item.product.name}
                                                    </h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-body font-light text-xs text-neutral-600">
                                                            Qty: {item.quantity}
                                                        </span>
                                                        <span className="font-body font-light text-sm text-primary-900">
                                                            {formatPrice(getItemPrice(item) * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="space-y-4 mb-6 pt-6 border-t border-neutral-200">
                                        <div className="flex justify-between">
                                            <span className="font-body font-light text-neutral-600">Subtotal</span>
                                            <span className="font-body font-light text-primary-900">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-body font-light text-neutral-600">Shipping</span>
                                            <span className="font-body font-light text-primary-900">
                                                {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-body font-light text-neutral-600">Tax (7.5%)</span>
                                            <span className="font-body font-light text-primary-900">{formatPrice(tax)}</span>
                                        </div>
                                        <div className="border-t border-neutral-200 pt-4">
                                            <div className="flex justify-between">
                                                <span className="font-cutive font-normal text-xl text-primary-900">Total</span>
                                                <span className="font-cutive font-normal text-xl text-primary-900">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trust Indicators */}
                                    <div className="space-y-3 pt-6 border-t border-neutral-200">
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-4 h-4 text-neutral-500" />
                                            <span className="font-body font-light text-sm text-neutral-600">Free shipping over ₦50,000</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-neutral-500" />
                                            <span className="font-body font-light text-sm text-neutral-600">Secure checkout</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Package className="w-4 h-4 text-neutral-500" />
                                            <span className="font-body font-light text-sm text-neutral-600">30-day return policy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
} 