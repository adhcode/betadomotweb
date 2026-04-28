import { fetchProduct } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/product-utils';
import EditorialProductPage from '@/components/EditorialProductPage';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  const product = await fetchProduct(slug);
  
  if (!product) {
    notFound();
  }

  const typedProduct = product as Product;

  // Always use editorial product page for all products
  return <EditorialProductPage product={typedProduct} />;
}
