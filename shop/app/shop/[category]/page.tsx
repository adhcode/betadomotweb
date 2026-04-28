import { fetchCategory, fetchCategoryProducts } from '@/lib/api-client';
import ProductGrid from '@/components/ProductGrid';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category: slug } = await params;
  
  const [category, products] = await Promise.all([
    fetchCategory(slug),
    fetchCategoryProducts(slug)
  ]);
  
  if (!category) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-900">Shop</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>
        </div>
      </div>
      
      {/* Category Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-light mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-3xl">
            {category.description}
          </p>
        )}
        <p className="text-gray-500 mt-4">{products.length} products</p>
      </div>
      
      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
