// API Client for making requests to the backend

// Use the environment variable if available, otherwise use the Railway URL directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://betadomotweb-production.up.railway.app';

export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }
  return await response.json();
}

export async function fetchPost(slug: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch post: ${response.status}`);
  }
  return await response.json();
}

export async function fetchAdminPosts(authHeader: string) {
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

export async function createPost(postData: any, authHeader: string) {
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

export async function updatePost(slug: string, postData: any, authHeader: string) {
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