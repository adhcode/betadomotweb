// API Client for making requests to the backend

// ALWAYS use the Railway URL in production, only use localhost in development
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://betadomotweb-production.up.railway.app'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

console.log('Using API URL:', API_BASE_URL);

export async function fetchPosts() {
  console.log('Fetching posts from:', `${API_BASE_URL}/posts`);
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }
  return await response.json();
}

export async function fetchPost(slug: string) {
  console.log('Fetching post from:', `${API_BASE_URL}/posts/${slug}`);
  console.log('Using API_BASE_URL:', API_BASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Post not found (404)');
        return null;
      }
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Failed to fetch post: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched post:', data.title);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchAdminPosts(authHeader: string) {
  console.log('Fetching admin posts from:', `${API_BASE_URL}/admin/posts`);
  const response = await fetch(`${API_BASE_URL}/admin/posts`, {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

export async function createPost(postData: Record<string, unknown>, authHeader: string) {
  console.log('Creating post at:', `${API_BASE_URL}/posts`);
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

export async function updatePost(slug: string, postData: Record<string, unknown>, authHeader: string) {
  console.log('Updating post at:', `${API_BASE_URL}/admin/posts/${slug}`);
  const response = await fetch(`${API_BASE_URL}/admin/posts/${slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

export async function deletePost(slug: string, authHeader: string) {
  console.log('Deleting post at:', `${API_BASE_URL}/admin/posts/${slug}`);
  const response = await fetch(`${API_BASE_URL}/admin/posts/${slug}`, {
    method: 'DELETE',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}