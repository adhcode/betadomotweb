'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import Image from 'next/image';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
    productName?: string;
    productImage?: string;
}

export default function Toast({ 
    message, 
    type = 'success', 
    duration = 3000, 
    onClose,
    productName,
    productImage 
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Show toast with slight delay for smooth animation
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        // Auto hide after duration
        const hideTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 400);
    };

    return (
        <div
            className={`fixed top-24 right-6 z-[100] transform transition-all duration-400 ease-out ${
                isVisible && !isLeaving
                    ? 'translate-x-0 opacity-100 translate-y-0'
                    : 'translate-x-full opacity-0 translate-y-2'
            }`}
        >
            {/* Minimal Toast Design */}
            <div className="bg-white border border-neutral-200 shadow-lg shadow-black/5 max-w-sm min-w-[300px] overflow-hidden">
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {/* Minimal Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                type === 'info' ? 'bg-blue-500' : 'bg-[#dca744]'
                            }`}>
                                {type === 'info' ? (
                                    <X className="w-3 h-3 text-white" />
                                ) : (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="font-body font-light text-sm text-primary-900 mb-1">
                                        {message}
                                    </p>
                                    {productName && (
                                        <p className="font-body font-light text-xs text-neutral-600 tracking-wide">
                                            {productName}
                                        </p>
                                    )}
                                </div>

                                {/* Minimal Product Image */}
                                {productImage && (
                                    <div className="flex-shrink-0 ml-3">
                                        <div className="w-10 h-10 bg-neutral-100 overflow-hidden relative">
                                            <Image src={productImage} alt={productName || ''} fill className="object-cover" sizes="40px" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Minimal Close Button */}
                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 p-1 hover:bg-neutral-50 transition-colors duration-200"
                        >
                            <X className="w-3 h-3 text-neutral-400 hover:text-neutral-600" />
                        </button>
                    </div>
                </div>

                {/* Minimal Progress Bar */}
                <div className="h-0.5 bg-neutral-100">
                    <div
                        className={`h-full transition-all ease-linear ${
                            type === 'info' ? 'bg-blue-500' : 'bg-[#dca744]'
                        }`}
                        style={{
                            width: isVisible && !isLeaving ? '0%' : '100%',
                            transition: `width ${duration}ms linear`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}