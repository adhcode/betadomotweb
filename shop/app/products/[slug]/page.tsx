import { fetchProduct } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import AppleEditorialProductPage from '@/components/AppleEditorialProductPage';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  console.log('[ProductPage] Fetching product with slug:', slug);
  
  const product = await fetchProduct(slug);
  console.log('[ProductPage] Product fetched:', product ? 'Success' : 'Not found');
  
  if (!product) {
    console.log('[ProductPage] Product not found, showing 404');
    notFound();
  }

  return <AppleEditorialProductPage product={product} />;
}
