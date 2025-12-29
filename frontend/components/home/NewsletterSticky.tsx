"use client";
import { useEffect, useState } from 'react';
import NewsletterForm from '@/components/NewsletterForm';

const BAR_HEIGHT = 72; // px
const DISMISS_KEY = 'nl_sticky_dismissed_until';

export default function NewsletterSticky() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Respect dismissal window
        const until = localStorage.getItem(DISMISS_KEY);
        if (until && Date.now() < Number(until)) {
            setDismissed(true);
            return;
        }

        const onScroll = () => {
            if (window.scrollY > 600) setVisible(true);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleClose = () => {
        // Snooze for 7 days
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem(DISMISS_KEY, String(Date.now() + sevenDays));
        setDismissed(true);
        setVisible(false);
    };

    if (!visible || dismissed) return null;

    return (
        <>
            {/* Spacer to prevent overlap with page content */}
            <div style={{ height: BAR_HEIGHT }} />
            <div className="fixed inset-x-0 bottom-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-3 rounded-md border border-neutral-200 bg-white/95 backdrop-blur shadow-sm">
                        <div className="flex items-center gap-3 px-3 py-3">
                            <p className="hidden sm:block text-sm text-neutral-800">
                                Get weekly ideas for smarter, healthier Nigerian homes.
                            </p>
                            <div className="ml-auto flex-1 sm:flex-none">
                                <NewsletterForm variant="inline" source="footer_sticky" />
                            </div>
                            <button
                                aria-label="Close newsletter bar"
                                onClick={handleClose}
                                className="ml-2 text-neutral-500 hover:text-neutral-700 p-1"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 