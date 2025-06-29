"use client";

import { useState } from "react";
import Button from "./Button";

interface NewsletterFormProps {
    variant?: 'default' | 'inline' | 'sidebar';
    className?: string;
}

export default function NewsletterForm({
    variant = 'default',
    className = ''
}: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Newsletter signup:", email);
            setIsSubmitted(true);
            setEmail("");
            setIsLoading(false);
        }, 1000);
    };

    // Success state
    if (isSubmitted) {
        return (
            <div className={`${getVariantStyles(variant).container} ${className}`}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-brand-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-2xl text-brand-teal-500 mb-3">
                        🎉 You&apos;re In!
                    </h3>
                    <p className="font-body text-brand-teal-700">
                        Check your inbox for your welcome email and get ready for amazing home inspiration!
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4 text-brand-orange-500 font-body font-medium hover:text-brand-orange-600 transition-colors"
                    >
                        Subscribe another email
                    </button>
                </div>
            </div>
        );
    }

    const styles = getVariantStyles(variant);

    return (
        <div className={`${styles.container} ${className}`}>
            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <div className="relative flex-1">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            disabled={isLoading}
                            className={styles.input}
                        />
                        {variant === 'inline' && (
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        size={variant === 'sidebar' ? 'sm' : 'md'}
                        className={variant === 'sidebar' ? 'w-full' : 'w-full'}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Subscribing...
                            </div>
                        ) : (
                            <>
                                Subscribe
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Trust indicators */}
            <p className="text-sm text-gray-600 mb-4">
                Join thousands who&apos;ve transformed their homes with our weekly insights.
            </p>

        </div>
    );
}

function getVariantStyles(variant: string) {
    const styles = {
        default: {
            container: "max-w-lg mx-auto",
            form: "mb-6",
            inputGroup: "flex flex-col gap-4",
            input: "w-full px-6 py-4 font-body text-brand-teal-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange-500 placeholder-gray-400 text-lg transition-all duration-300",
            trustIndicators: "mt-6"
        },
        inline: {
            container: "bg-gradient-to-r from-brand-teal-50 to-brand-orange-50 rounded-2xl p-8 my-12 border border-brand-teal-100",
            form: "mb-4",
            inputGroup: "flex flex-col sm:flex-row gap-3 max-w-md mx-auto",
            input: "flex-1 pl-12 pr-4 py-3 font-body text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-300 focus:border-brand-orange-500 placeholder-gray-400 transition-all duration-300",
            trustIndicators: "mt-4"
        },
        sidebar: {
            container: "bg-white rounded-xl p-6 shadow-lg border border-gray-100 sticky top-8",
            form: "",
            inputGroup: "space-y-3",
            input: "w-full px-4 py-3 font-body text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-300 focus:border-brand-orange-500 placeholder-gray-400 text-sm transition-all duration-300",
            trustIndicators: ""
        }
    };

    return styles[variant as keyof typeof styles] || styles.default;
} 