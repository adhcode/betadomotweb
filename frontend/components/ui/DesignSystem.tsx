import React from 'react';

// Creative Coding Typography
export const H1 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h1 className={`text-5xl md:text-7xl font-extralight tracking-[-0.02em] text-gray-900 leading-[0.9] ${className}`}>
    {children}
  </h1>
);

export const H2 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-3xl md:text-5xl font-extralight tracking-[-0.01em] text-gray-900 leading-tight ${className}`}>
    {children}
  </h2>
);

export const H3 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xl md:text-2xl font-light tracking-wide text-gray-800 ${className}`}>
    {children}
  </h3>
);

export const MonoText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-sm text-gray-600 tracking-wider ${className}`}>
    {children}
  </span>
);

export const Body = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-base leading-relaxed text-gray-600 font-light ${className}`}>
    {children}
  </p>
);

export const Caption = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-xs font-mono text-gray-400 uppercase tracking-widest ${className}`}>
    {children}
  </p>
);

// Minimal Layout Components
export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-12 ${className}`}>
    {children}
  </div>
);

export const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`py-20 md:py-32 ${className}`}>
    {children}
  </section>
);

export const Grid = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 ${className}`}>
    {children}
  </div>
);

// Creative Cards
export const MinimalCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`group cursor-pointer transition-all duration-500 hover:translate-y-[-2px] ${className}`}>
    <div className="border border-gray-100 hover:border-gray-200 transition-colors duration-300 p-8 md:p-12">
      {children}
    </div>
  </div>
);

export const CodeCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-50 border-l-2 border-gray-900 p-6 font-mono text-sm ${className}`}>
    {children}
  </div>
);

export const FloatingCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-500 ${className}`}>
    {children}
  </div>
);

// Minimal Buttons
export const GhostButton = ({ children, className = '', variant = 'default', ...props }: { children: React.ReactNode; className?: string; variant?: 'default' | 'brand'; [key: string]: any }) => {
  const variantClasses = variant === 'brand' 
    ? 'border-[#236b7c] text-[#236b7c] hover:bg-[#236b7c] hover:text-white'
    : 'border-gray-900 hover:bg-gray-900 hover:text-white';
  
  const bgClass = variant === 'brand' ? 'bg-[#236b7c]' : 'bg-gray-900';
  
  return (
    <button className={`group relative overflow-hidden border px-8 py-3 font-light tracking-wide transition-all duration-300 ${variantClasses} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      <div className={`absolute inset-0 ${bgClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </button>
  );
};

export const PrimaryButton = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <button className={`bg-[#236b7c] text-white px-8 py-3 font-light tracking-wide transition-all duration-300 hover:bg-[#1a5463] hover:tracking-widest ${className}`} {...props}>
    {children}
  </button>
);

export const SecondaryButton = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <button className={`bg-[#dca744] text-white px-8 py-3 font-light tracking-wide transition-all duration-300 hover:bg-[#c4953d] hover:tracking-widest ${className}`} {...props}>
    {children}
  </button>
);

export const MinimalButton = ({ children, className = '', variant = 'default', ...props }: { children: React.ReactNode; className?: string; variant?: 'default' | 'brand'; [key: string]: any }) => {
  const variantClasses = variant === 'brand'
    ? 'text-[#236b7c] hover:border-[#236b7c]'
    : 'text-gray-900 hover:border-gray-900';
    
  return (
    <button className={`font-light tracking-wide hover:tracking-widest transition-all duration-300 border-b border-transparent pb-1 ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const CodePill = ({ children, color = 'gray', className = '' }: { children: React.ReactNode; color?: string; className?: string }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  };

  return (
    <span className={`inline-block px-4 py-1 font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${colorClasses[color as keyof typeof colorClasses]} ${className}`}>
      {children}
    </span>
  );
};

// Creative Spacing
export const Spacer = ({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' }) => {
  const sizeClasses = {
    xs: 'h-4',
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32',
    xxl: 'h-48'
  };

  return <div className={sizeClasses[size]} />;
};

// Advanced Animations
export const FadeInUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div
    className="animate-fade-in-up opacity-0 translate-y-8"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

export const SlideInLeft = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div
    className="animate-slide-in-left opacity-0 -translate-x-8"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

export const ScaleIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div
    className="animate-scale-in opacity-0 scale-95"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

// Grid Lines Component
export const GridLines = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, #000 1px, transparent 1px),
        linear-gradient(to bottom, #000 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px'
    }} />
  </div>
);

// Minimal Color Palette
export const colors = {
  mono: {
    white: '#ffffff',
    gray50: '#fafafa',
    gray100: '#f5f5f5',
    gray200: '#e5e5e5',
    gray400: '#a3a3a3',
    gray600: '#525252',
    gray800: '#262626',
    gray900: '#171717',
    black: '#000000'
  },
  brand: {
    primary: '#236b7c',
    primaryDark: '#1a5463',
    secondary: '#dca744',
    secondaryLight: '#e6b85c'
  },
  accent: {
    blue: '#2563eb',
    green: '#059669',
    purple: '#7c3aed',
    red: '#dc2626'
  }
};