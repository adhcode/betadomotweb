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

export async function fetchFeaturedHeroPost() {
  console.log('🔍 Fetching featured hero content from posts and guides');
  console.log('📡 API Base URL:', API_BASE_URL);
  
  try {
    // Try to fetch featured hero from posts first
    try {
      const postsUrl = `${API_BASE_URL}/posts?featured_hero=true&limit=1`;
      console.log('📝 Checking posts:', postsUrl);
      
      const postsResponse = await fetch(postsUrl, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📝 Posts response status:', postsResponse.status);
      
      if (postsResponse.ok) {
        const posts = await postsResponse.json();
        console.log('📝 Posts data:', posts);
        
        if (Array.isArray(posts) && posts.length > 0) {
          console.log('✅ Found featured post:', posts[0].title);
          return { ...posts[0], type: 'post' };
        } else {
          console.log('📝 No featured posts found (empty array)');
        }
      } else {
        console.warn('⚠️ Posts API returned:', postsResponse.status);
      }
    } catch (postError) {
      console.error('❌ Error fetching featured post:', postError);
    }

    // If no featured post, try guides
    try {
      const guidesUrl = `${API_BASE_URL}/guides?featured_hero=true&limit=1`;
      console.log('💡 Checking guides:', guidesUrl);
      
      const guidesResponse = await fetch(guidesUrl, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('💡 Guides response status:', guidesResponse.status);
      
      if (guidesResponse.ok) {
        const guides = await guidesResponse.json();
        console.log('💡 Guides data:', guides);
        
        if (Array.isArray(guides) && guides.length > 0) {
          console.log('✅ Found featured guide:', guides[0].title);
          // Map guide fields to match post structure for Hero component
          const guide = guides[0];
          return {
            ...guide,
            type: 'guide',
            excerpt: guide.description || guide.excerpt, // Map description to excerpt
          };
        } else {
          console.log('💡 No featured guides found (empty array)');
        }
      } else {
        console.warn('⚠️ Guides API returned:', guidesResponse.status);
      }
    } catch (guideError) {
      console.error('❌ Error fetching featured guide:', guideError);
    }

    console.log('ℹ️ No featured content found - will show default hero');
    return null;
  } catch (error) {
    console.error('❌ Error fetching featured hero content:', error);
    return null;
  }
}

export async function setFeaturedHero(slug: string, authHeader: string) {
  console.log('Setting featured hero at:', `${API_BASE_URL}/admin/posts/${slug}/featured-hero`);
  const response = await fetch(`${API_BASE_URL}/admin/posts/${slug}/featured-hero`, {
    method: 'POST',
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

export async function unsetFeaturedHero(slug: string, authHeader: string) {
  console.log('Unsetting featured hero at:', `${API_BASE_URL}/admin/posts/${slug}/featured-hero`);
  const response = await fetch(`${API_BASE_URL}/admin/posts/${slug}/featured-hero`, {
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

export async function setGuideFeaturedHero(slug: string, authHeader: string) {
  console.log('Setting guide featured hero at:', `${API_BASE_URL}/admin/guides/${slug}/featured-hero`);
  const response = await fetch(`${API_BASE_URL}/admin/guides/${slug}/featured-hero`, {
    method: 'POST',
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

export async function unsetGuideFeaturedHero(slug: string, authHeader: string) {
  console.log('Unsetting guide featured hero at:', `${API_BASE_URL}/admin/guides/${slug}/featured-hero`);
  const response = await fetch(`${API_BASE_URL}/admin/guides/${slug}/featured-hero`, {
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

export async function fetchAdminGuides(authHeader: string) {
  console.log('Fetching admin guides from:', `${API_BASE_URL}/guides`);
  const response = await fetch(`${API_BASE_URL}/guides?limit=100`, {
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