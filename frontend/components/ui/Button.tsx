'use client';

import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    href?: string;
    className?: string;
    showArrow?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    href,
    className = '',
    showArrow = false,
    disabled = false,
    type = 'button'
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center gap-3 font-gilroy font-semibold tracking-[0.1em] uppercase transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dca744] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-[#dca744] text-white border-2 border-[#dca744] hover:bg-[#c9963d] hover:border-[#c9963d] hover:shadow-lg hover:shadow-[#dca744]/30 hover:scale-105',
        secondary: 'bg-white text-[#dca744] border-2 border-[#dca744] hover:bg-[#dca744] hover:text-white hover:shadow-md hover:shadow-[#dca744]/20',
        outline: 'bg-transparent text-[#dca744] border-2 border-[#dca744] hover:bg-[#dca744] hover:text-white hover:shadow-md hover:shadow-[#dca744]/20'
    };
    
    const sizeClasses = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-sm'
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    const content = (
        <>
            {children}
            {showArrow && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            )}
        </>
    );
    
    if (href) {
        return (
            <a href={href} className={`${classes} group`}>
                {content}
            </a>
        );
    }
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${classes} group`}
        >
            {content}
        </button>
    );
}