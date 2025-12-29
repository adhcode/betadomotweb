'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { X, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartEntry {
    product?: any;
    product_id?: string;
    quantity: number;
}

export default function CartDrawer() {
    const [open, setOpen] = useState(false);
    // mode: 'modal' will block background and trap focus, 'non-modal' will allow browsing while drawer is open
    const [mode, setMode] = useState<'modal' | 'non-modal'>(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 'non-modal' : 'modal'));
    const [items, setItems] = useState<CartEntry[]>([]);
    const [inlineConfirmation, setInlineConfirmation] = useState<{ message: string; image?: string } | null>(null);
    const router = useRouter();
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLElement | null>(null);
    const openerRef = useRef<Element | null>(null);

    // watch resize to switch mode (mobile -> non-modal)
    useEffect(() => {
        const onResize = () => setMode(window.innerWidth < 768 ? 'non-modal' : 'modal');
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', onResize);
            return () => window.removeEventListener('resize', onResize);
        }
    }, []);

    const loadCart = () => {
        try {
            const raw = localStorage.getItem('cart') || '[]';
            const parsed = JSON.parse(raw);
            setItems(parsed);
        } catch (e) {
            setItems([]);
        }
    };

    useEffect(() => {
        // open drawer when cartUpdated or add-bundle-to-cart occurs
        const onCartUpdated = (ev?: Event) => {
            // capture the element that triggered the open (if any)
            openerRef.current = document.activeElement as Element | null;
            loadCart();
            // Only auto-open when in modal mode (desktop) or when the emitter explicitly asked for open
            const forceOpen = ev && (ev as any).detail && (ev as any).detail.forceOpen;

            // If we're about to open the modal drawer, set a global flag so the toast system can suppress the following toast
            if (mode === 'modal' || forceOpen) {
                try { (window as any).__suppressNextCartToast = true; } catch (e) {}

                // capture optional added item for inline confirmation (if provided by emitter)
                const added = ev && (ev as any).detail && (ev as any).detail.added;
                if (added) {
                    setInlineConfirmation({ message: added.name || 'Added to cart', image: added.image });
                    window.setTimeout(() => setInlineConfirmation(null), 3000);
                } else {
                    // generic confirmation when not provided
                    setInlineConfirmation({ message: 'Added to cart' });
                    window.setTimeout(() => setInlineConfirmation(null), 3000);
                }

                setOpen(true);
            }
        };

        const onBundle = (ev?: Event) => {
            openerRef.current = document.activeElement as Element | null;
            loadCart();
            const forceOpen = ev && (ev as any).detail && (ev as any).detail.forceOpen;
            if (mode === 'modal' || forceOpen) {
                try { (window as any).__suppressNextCartToast = true; } catch (e) {}

                const added = ev && (ev as any).detail && (ev as any).detail.items;
                if (Array.isArray(added) && added.length > 0) {
                    setInlineConfirmation({ message: `${added.length} items added`, image: added[0].image });
                    window.setTimeout(() => setInlineConfirmation(null), 3500);
                } else {
                    setInlineConfirmation({ message: 'Bundle added' });
                    window.setTimeout(() => setInlineConfirmation(null), 3000);
                }

                setOpen(true);
            }
        };

        window.addEventListener('cartUpdated', onCartUpdated);
        window.addEventListener('add-bundle-to-cart', onBundle);

        // Load initially
        loadCart();

        return () => {
            window.removeEventListener('cartUpdated', onCartUpdated);
            window.removeEventListener('add-bundle-to-cart', onBundle);
        };
    }, [mode]);

    // Accessibility: focus trap and Escape key to close — only for modal mode
    useEffect(() => {
        if (!open || mode !== 'modal') return;
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.setAttribute('aria-hidden', 'true');

        // focus the close button when opening
        setTimeout(() => closeButtonRef.current?.focus(), 50);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
            if (e.key === 'Tab' && panelRef.current) {
                const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            if (mainEl) mainEl.removeAttribute('aria-hidden');
            try {
                if (openerRef.current && (openerRef.current as HTMLElement).focus) {
                    (openerRef.current as HTMLElement).focus();
                }
            } catch (e) {}
            openerRef.current = null;
        };
    }, [open, mode]);

    const close = () => setOpen(false);

    const removeItem = (productId: string) => {
        try {
            const raw = JSON.parse(localStorage.getItem('cart') || '[]');
            const filtered = raw.filter((it: any) => {
                const pid = it.product ? it.product.id : it.product_id;
                return pid !== productId;
            });
            localStorage.setItem('cart', JSON.stringify(filtered));
            window.dispatchEvent(new Event('cartUpdated'));
            loadCart();
        } catch (e) {
            console.error(e);
        }
    };

    const subtotal = items.reduce((sum, it) => {
        const prod = it.product || {};
        const price = prod.sale_price || prod.price || 0;
        return sum + (price * (it.quantity || 1));
    }, 0);

    // root overlay: allow pointer-events to block background only when modal+open
    const rootPointer = open && mode === 'modal' ? 'pointer-events-auto' : 'pointer-events-none';

    return (
        <div aria-hidden={!open} className={`fixed inset-0 z-50 ${rootPointer}`}> 
            {/* backdrop */}
            <div className={`absolute inset-0 bg-black/40 transition-opacity ${open && mode === 'modal' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={mode === 'modal' ? close : undefined} />

            {/* Drawer panel */}
            <aside ref={(el) => { panelRef.current = el; }} className={`absolute right-0 top-0 h-full w-full max-w-md md:max-w-lg bg-white shadow-xl transform transition-transform pointer-events-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-neutral-700" />
                        <h3 className="text-lg font-semibold">Your Cart</h3>
                    </div>
                    <button aria-label="Close cart" ref={closeButtonRef} onClick={close} className="p-2">
                        <X className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>

                {/* Inline confirmation pill when we suppressed the global toast */}
                {inlineConfirmation && (
                    <div className="px-4 mt-3">
                        <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 rounded-full text-sm">
                            {inlineConfirmation.image && (
                                <span className="w-6 h-6 relative rounded overflow-hidden bg-white">
                                    <Image src={inlineConfirmation.image} alt="added" fill className="object-cover" sizes="24px" />
                                </span>
                            )}
                            <span>{inlineConfirmation.message}</span>
                        </div>
                    </div>
                )}

                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                    {items.length === 0 ? (
                        <div className="text-center text-neutral-600 py-12">Your cart is empty</div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((it, idx) => {
                                const prod = it.product || {};
                                const id = prod.id || it.product_id;
                                const image = prod.images?.[0] || prod.image || '/placeholder-product.jpg';
                                const price = prod.sale_price || prod.price || 0;
                                return (
                                    <li key={id + idx} className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0 relative">
                                            <Image src={image} alt={prod.name || 'product'} fill className="object-cover" sizes="64px" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm line-clamp-2">{prod.name}</div>
                                            <div className="text-xs text-neutral-500">Qty: {it.quantity}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price)}</div>
                                            <button onClick={() => removeItem(id)} className="text-xs text-red-500 mt-1">Remove</button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="p-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-sm text-neutral-600">Subtotal</div>
                            <div className="text-xs text-neutral-500">Items in your cart are reserved while you browse</div>
                        </div>
                        <div className="font-medium">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(subtotal)}</div>
                    </div>

                    <div className="text-xs text-neutral-500 mb-3">Looking for the next thing for your home?</div>

                    <div className="flex gap-2">
                        <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-neutral-700 hover:text-neutral-900 rounded">Continue exploring</button>
                        <button onClick={() => router.push('/cart')} className="flex-1 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded hover:shadow-sm">View Cart</button>
                        <button onClick={() => router.push('/checkout')} className="flex-1 px-4 py-2 bg-[#236b7c] hover:bg-[#1f5b64] text-white rounded">Checkout</button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
