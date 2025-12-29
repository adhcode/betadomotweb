'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '@/components/Toast';

interface ToastData {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    productName?: string;
    productImage?: string;
}

interface ToastContextType {
    showToast: (toast: Omit<ToastData, 'id'>) => void;
    showCartToast: (productName: string, productImage?: string) => void;
    showClearCartToast: (itemCount: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = (toast: Omit<ToastData, 'id'>) => {
        // Respect global suppression flag set by CartDrawer when it auto-opens
        if (typeof window !== 'undefined' && (window as any).__suppressNextCartToast) {
            try { delete (window as any).__suppressNextCartToast; } catch (e) { (window as any).__suppressNextCartToast = false; }
            console.log('Skipping toast due to suppressed flag');
            return;
        }

        const id = Date.now().toString();
        const newToast = { ...toast, id };
        
        console.log('Adding toast:', newToast); // Debug log
        setToasts(prev => {
            console.log('Current toasts:', prev); // Debug log
            return [...prev, newToast];
        });
    };

    const showCartToast = (productName: string, productImage?: string) => {
        console.log('showCartToast called with:', productName, productImage); // Debug log
        showToast({
            message: 'Added to cart!',
            type: 'success',
            productName,
            productImage,
            duration: 3000
        });
    };

    const showClearCartToast = (itemCount: number) => {
        showToast({
            message: `Cleared ${itemCount} item${itemCount !== 1 ? 's' : ''} from cart`,
            type: 'info',
            duration: 2000
        });
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, showCartToast, showClearCartToast }}>
            {children}
            {/* Render toasts */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    productName={toast.productName}
                    productImage={toast.productImage}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Debug function to test if toast is working
export function testToast() {
    console.log('Toast test function called');
}