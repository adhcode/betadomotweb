import Link from 'next/link';
import Image from 'next/image';

export default function ShopHero() {
  return (
    <section className="relative pt-48 md:pt-48 lg:pt-48 pb-32 overflow-hidden bg-gray-900">
      {/* Background Image */}
      <Image
        src="/images/blog/hero.png"
        alt="Modern living space"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-tight" style={{ color: '#ffffff' }}>
            Curated for<br />modern living
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light leading-relaxed" style={{ color: '#ffffff', opacity: 0.95 }}>
            Home tech, furniture, and essentials—thoughtfully selected for Nigerian homes.
          </p>
          <Link 
            href="#products"
            className="inline-block bg-white text-gray-900 px-10 py-4 text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors"
          >
            Explore the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
