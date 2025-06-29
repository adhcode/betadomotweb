import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline';
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
    const baseClasses = 'inline-flex items-center justify-center font-body font-semibold transition-all duration-300 rounded-xl';

    const variantClasses = {
        primary: 'bg-[#D98958] text-white hover:bg-brand-orange-600',
        secondary: 'bg-brand-teal-500 text-white hover:bg-brand-teal-600',
        outline: 'border-2 border-[#D98958] text-[#D98958] hover:bg-[#D98958] hover:text-white',
    };

    const sizeClasses = {
        sm: 'px-6 py-2 text-sm',
        md: 'px-8 py-4 text-lg',
        lg: 'px-12 py-4 text-lg',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

    if (href) {
        return (
            <Link href={href} className={buttonClasses} onClick={onClick}>
                {children}
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
            {children}
        </button>
    );
} 