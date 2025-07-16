import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
}

export default function Button({
    children,
    href,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-gilroy font-semibold tracking-wide transition-all duration-300 rounded-none relative overflow-hidden group';

    const variantClasses = {
        primary: 'bg-[#236b7c] text-white hover:bg-[#1a5463] hover:scale-105 hover:shadow-lg hover:shadow-[#236b7c]/20',
        secondary: 'bg-[#dca744] text-black hover:bg-[#c4963d] hover:scale-105 hover:shadow-lg hover:shadow-[#dca744]/20',
        outline: 'border-2 border-[#236b7c] text-black bg-transparent hover:bg-[#236b7c] hover:text-white',
        ghost: 'text-black border border-neutral-200 bg-white hover:border-[#dca744] hover:text-[#236b7c] hover:bg-neutral-50',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' : '';

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

    if (href) {
        return (
            <Link href={href} className={buttonClasses} onClick={onClick}>
                <span className="relative z-10 flex items-center">
                    {children}
                </span>
                {/* Hover animation overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses}
        >
            <span className="relative z-10 flex items-center">
                {children}
            </span>
            {/* Hover animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
    );
} 