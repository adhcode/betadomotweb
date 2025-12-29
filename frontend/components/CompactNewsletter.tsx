"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

interface CompactNewsletterProps {
    className?: string;
}

export default function CompactNewsletter({ className = "" }: CompactNewsletterProps) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, source: 'blog_sidebar' }),
            });

            if (response.ok) {
                setSubscribed(true);
                setEmail("");
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (subscribed) {
        return (
            <div className={`bg-gradient-to-br from-[#236b7c] to-[#1a5463] rounded-xl p-6 text-white ${className}`}>
                <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-gilroy font-bold text-lg mb-2">
                        You're All Set!
                    </h3>
                    <p className="font-gilroy font-light text-sm text-white/90">
                        Welcome to our community of home enthusiasts.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gradient-to-br from-[#236b7c] to-[#1a5463] rounded-xl p-6 text-white ${className}`}>
            <div className="text-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="font-gilroy font-light text-xs tracking-[0.2em] uppercase text-white/80 block mb-2">
                    Join 5,000+ Subscribers
                </span>
                <h3 className="font-gilroy font-bold text-lg mb-2">
                    Weekly Home Finds
                </h3>
                <p className="font-gilroy font-light text-sm text-white/90 leading-relaxed">
                    Get curated Nigerian home decor, DIY tips, and smart finds delivered weekly.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 font-gilroy font-light text-sm focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                        required
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-white text-[#236b7c] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-gilroy font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-[#236b7c]/30 border-t-[#236b7c] rounded-full animate-spin"></div>
                            <span>Subscribing...</span>
                        </>
                    ) : (
                        <>
                            <span>Get Weekly Updates</span>
                            <Mail className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-white/60 text-xs font-gilroy font-light mt-3">
                No spam, unsubscribe anytime
            </p>
        </div>
    );
} 