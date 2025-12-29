'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './useToast';

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

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const { showToast } = useToast();

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                const parsedWishlist = JSON.parse(savedWishlist);
                setWishlist(parsedWishlist);
            } catch (error) {
                console.error('Error parsing wishlist:', error);
                localStorage.removeItem('wishlist');
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        if (!isInWishlist(product.id)) {
            setWishlist(prev => [...prev, product]);
            showToast({
                message: 'Added to wishlist!',
                type: 'success',
                productName: product.name,
                productImage: product.images[0],
                duration: 2000
            });
        }
    };

    const removeFromWishlist = (productId: string) => {
        const product = wishlist.find(p => p.id === productId);
        setWishlist(prev => prev.filter(p => p.id !== productId));
        
        if (product) {
            showToast({
                message: 'Removed from wishlist',
                type: 'info',
                productName: product.name,
                duration: 2000
            });
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(product => product.id === productId);
    };

    const clearWishlist = () => {
        const count = wishlist.length;
        setWishlist([]);
        showToast({
            message: `Cleared ${count} item${count !== 1 ? 's' : ''} from wishlist`,
            type: 'info',
            duration: 2000
        });
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}