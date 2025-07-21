'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #0A0A0A 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pt-32 pb-4">
                <div className="text-center">

                    {/* Main Heading */}
                    <div className="mb-16">
                        <h1 className="font-cutive font-normal text-primary-900 mb-8 leading-[0.85] tracking-tight">
                            <span className={`block text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                Home Finds and Inspiration
                            </span>
                            <span className={`block text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl transition-all duration-1200 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}>
                                that feels like You.
                            </span>
                        </h1>
                    </div>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 transition-all duration-1200 ease-out delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}>
                        <button
                            onClick={() => router.push('/products')}
                            className="group relative bg-[#dca744] text-white px-8 py-4 font-body font-light text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#c9963d] hover:shadow-lg hover:shadow-[#dca744]/20"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Cool Home Finds
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </button>

                        <button
                            onClick={() => router.push('/blog')}
                            className="group px-8 py-4 font-body font-light text-sm tracking-[0.1em] uppercase border border-neutral-300 text-primary-900 hover:border-primary-900 hover:bg-neutral-50 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                Blog
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </button>
                    </div>


                </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neutral-200 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neutral-300 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-neutral-200 rounded-full animate-pulse delay-500"></div>
        </section>
    );
} 