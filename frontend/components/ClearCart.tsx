'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface ClearCartProps {
    onClear: () => void;
    itemCount: number;
    className?: string;
    variant?: 'button' | 'link';
}

export default function ClearCart({ 
    onClear, 
    itemCount, 
    className = '', 
    variant = 'link' 
}: ClearCartProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const { showClearCartToast } = useToast();

    const handleClear = async () => {
        setIsClearing(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onClear();
        showClearCartToast(itemCount);
        setShowConfirm(false);
        setIsClearing(false);
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    if (itemCount === 0) {
        return null;
    }

    if (showConfirm) {
        return (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                <div className="bg-white max-w-sm w-full mx-4 border border-neutral-200 shadow-lg shadow-black/5">
                    <div className="p-6 sm:p-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-neutral-100 mx-auto mb-4 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-neutral-600" />
                            </div>
                            
                            <h3 className="font-cutive font-normal text-xl text-primary-900 mb-3">
                                Clear Cart?
                            </h3>
                            
                            <p className="font-body font-light text-neutral-600 text-sm leading-relaxed mb-8">
                                Remove all {itemCount} item{itemCount !== 1 ? 's' : ''} from your cart? This cannot be undone.
                            </p>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={handleClear}
                                    disabled={isClearing}
                                    className="w-full bg-primary-900 text-white py-3 px-6 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isClearing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                            Clearing...
                                        </div>
                                    ) : (
                                        'Clear Cart'
                                    )}
                                </button>
                                
                                <button
                                    onClick={handleCancel}
                                    disabled={isClearing}
                                    className="w-full border border-neutral-300 text-primary-900 py-3 px-6 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-neutral-50 transition-colors duration-300 disabled:opacity-50"
                                >
                                    Keep Items
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className={`bg-red-600 text-white px-4 py-2 font-body font-light text-xs tracking-[0.1em] uppercase hover:bg-red-700 transition-colors duration-300 flex items-center gap-2 ${className}`}
            >
                <Trash2 className="w-3 h-3" />
                Clear Cart ({itemCount})
            </button>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className={`font-body font-light text-sm text-neutral-500 hover:text-red-600 transition-colors duration-300 tracking-[0.1em] uppercase flex items-center gap-2 ${className}`}
        >
            <Trash2 className="w-3 h-3" />
            Clear Cart
        </button>
    );
}