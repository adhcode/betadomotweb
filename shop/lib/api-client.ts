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

// Category API functions
export async function fetchCategories(params?: { 
  featured?: boolean;
  parent_id?: string | null;
}): Promise<any[]> {
  try {
    let url = `${API_BASE_URL}/categories`;
    const queryParams = new URLSearchParams();
    
    if (params?.featured) {
      queryParams.append('featured', 'true');
    }
    
    if (params?.parent_id !== undefined) {
      queryParams.append('parent_id', params.parent_id || 'null');
    }
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    console.log('[Shop] Fetching categories from:', url);
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error('[Shop] Categories API error:', response.status);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Shop] Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategory(slug: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('[Shop] Category API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('[Shop] Error fetching category:', error);
    return null;
  }
}

export async function fetchCategoryProducts(slug: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}/products`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('[Shop] Category products API error:', response.status);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Shop] Error fetching category products:', error);
    return [];
  }
}

// Collection API functions
export async function fetchCollections(params?: { 
  featured?: boolean;
}): Promise<any[]> {
  try {
    let url = `${API_BASE_URL}/collections`;
    const queryParams = new URLSearchParams();
    
    if (params?.featured) {
      queryParams.append('featured', 'true');
    }
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    console.log('[Shop] Fetching collections from:', url);
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error('[Shop] Collections API error:', response.status);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Shop] Error fetching collections:', error);
    return [];
  }
}

export async function fetchCollection(slug: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/collections/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('[Shop] Collection API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('[Shop] Error fetching collection:', error);
    return null;
  }
}

export async function fetchCollectionProducts(slug: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/collections/${slug}/products`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('[Shop] Collection products API error:', response.status);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Shop] Error fetching collection products:', error);
    return [];
  }
}
