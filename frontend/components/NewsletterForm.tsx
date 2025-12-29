"use client";

import { useState } from "react";

interface NewsletterFormProps {
    variant?: 'default' | 'inline' | 'sidebar' | 'blog-post';
    className?: string;
    source?: string;
    helperText?: string | null;
}

export default function NewsletterForm({
    variant = 'default',
    className = '',
    source,
    helperText,
}: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const resolvedSource = source || (variant === 'blog-post' ? 'blog_post_cta' : (variant === 'sidebar' ? 'sidebar' : 'main_form'));

        try {
            const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://betadomotweb-production.up.railway.app' : 'http://localhost:8080'}/newsletter/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: resolvedSource }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setSuccessMessage(data.message || "Thank you for subscribing!");
                setEmail("");
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error('Newsletter subscription error:', err);
            setError("Failed to subscribe. Please check your connection and try again.");
        } finally { setIsLoading(false); }
    };

    if (isSubmitted) {
        return (
            <div className={`${getVariantStyles(variant).container} ${className}`}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className={`${variant === 'blog-post' ? 'font-gilroy font-normal text-2xl text-black' : 'font-cutive font-normal text-2xl text-primary-900 !text-primary-900'} mb-3`}>
                        🎉 You&apos;re In!
                    </h3>
                    <p className={`${variant === 'blog-post' ? 'font-gilroy text-black' : 'font-body text-primary-900 !text-primary-900'} mb-4 font-light`}>
                        {variant === 'blog-post' ? "Welcome to our community! You'll receive our latest insights and design tips every week." : successMessage}
                    </p>
                    <button onClick={() => { setIsSubmitted(false); setSuccessMessage(""); }} className={`${variant === 'blog-post' ? 'text-[#236b7c] font-gilroy' : 'text-primary-900 font-body'} font-medium hover:text-neutral-600 transition-colors`}>
                        Subscribe another email
                    </button>
                </div>
            </div>
        );
    }

    const styles = getVariantStyles(variant);

    return (
        <div className={`${styles.container} ${className}`}>
            {variant === 'blog-post' && (
                <div className="text-center mb-8">
                    <h3 className="font-gilroy font-normal text-2xl sm:text-3xl text-black mb-4">Loved this post? Get more like it.</h3>
                    <p className="font-gilroy font-light text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">Join thousands of readers getting weekly design insights, home tips, and exclusive content delivered straight to their inbox. You also get notified first when we discover cool new finds for your home.</p>
                </div>
            )}

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
                            className={`font-proza ${styles.input}`}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className={styles.button}>
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Subscribing...
                            </div>
                        ) : (
                            'Subscribe'
                        )}
                    </button>
                </div>
                {error && (
                    <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200"><p className={`text-sm ${variant === 'blog-post' ? 'text-black' : 'text-primary-900'}`}>{error}</p></div>
                )}
            </form>

            {variant === 'blog-post' ? (
                <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500 mt-6">
                    <div className="flex items-center"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>No spam, ever</div>
                    <div className="flex items-center"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Unsubscribe anytime</div>
                    <div className="flex items-center"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Weekly insights</div>
                </div>
            ) : (
                helperText !== null && (
                    <p className="text-sm text-primary-900 !text-primary-900 mb-4 font-light">
                        {helperText || "No spam. One thoughtful email a week."}
                    </p>
                )
            )}
        </div>
    );
}

function getVariantStyles(variant: string) {
    const styles = {
        default: {
            container: "max-w-lg mx-auto",
            form: "mb-6",
            inputGroup: "flex flex-col gap-4",
            input: "w-full px-6 py-4 text-primary-900 bg-white border-2 border-neutral-200 focus:outline-none focus:border-primary-900 placeholder-neutral-400 text-lg transition-all duration-300",
            button: "bg-primary-900 text-white px-8 py-4 font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            trustIndicators: "mt-6"
        },
        inline: {
            container: "",
            form: "mb-0",
            inputGroup: "flex gap-3 justify-center",
            input: "flex-1 min-w-[260px] px-4 py-3 text-primary-900 bg-white border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#236b7c] focus:border-[#236b7c] placeholder-neutral-400 transition-all duration-300",
            button: "bg-[#236b7c] text-white hover:text-white px-6 py-3 font-medium text-sm tracking-wide hover:bg-[#1a5463] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            trustIndicators: "mt-2"
        },
        sidebar: {
            container: "bg-white p-6 border border-neutral-200 sticky top-8",
            form: "",
            inputGroup: "space-y-3",
            input: "w-full px-4 py-3 text-primary-900 bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 placeholder-neutral-400 text-sm transition-all duration-300",
            button: "bg-primary-900 text-white px-8 py-4 font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            trustIndicators: ""
        },
        'blog-post': {
            container: "bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-xl p-8 sm:p-12 my-16",
            form: "mb-6",
            inputGroup: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto",
            input: "flex-1 px-4 py-4 text-black bg-white border-2 border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236b7c] focus:border-[#236b7c] placeholder-neutral-400 text-lg transition-all duration-300 shadow-sm",
            button: "bg-[#236b7c] text-white px-8 py-4 font-gilroy font-medium tracking-wide hover:bg-[#1a5463] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm",
            trustIndicators: "mt-6"
        }
    };

    return styles[variant as keyof typeof styles] || styles.default;
} 