// API Client for Shop

const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://betadomotweb-production.up.railway.app'
    : 'http://localhost:8080';

console.log('[Shop] Using API URL:', API_BASE_URL);

export async function fetchProducts(params?: { category?: string; featured?: boolean; limit?: number }) {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.featured) queryParams.append('featured', 'true');
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams}` : ''}`;
  console.log('[Shop] Fetching products from:', url);
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error('[Shop] API error:', response.status, response.statusText);
      // Return empty array if API fails
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('[Shop] Fetch error:', error);
    // Return empty array if fetch fails (backend not running)
    return [];
  }
}

export async function fetchProduct(slug: string) {
  console.log('[Shop] Fetching product from:', `${API_BASE_URL}/products/${slug}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, { cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('[Shop] Product not found:', slug);
        return null;
      }
      console.error('[Shop] API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('[Shop] Product data received:', data);
    
    // Handle both array and single object responses
    const product = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    // Validate product has required fields
    if (!product || typeof product !== 'object') {
      console.error('[Shop] Invalid product data:', product);
      return null;
    }
    
    return product;
  } catch (error) {
    console.error('[Shop] Fetch error:', error);
    return null;
  }
}
