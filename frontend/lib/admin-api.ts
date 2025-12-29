// Admin API utility for authenticated requests

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://betadomotweb-production.up.railway.app'
    : 'http://localhost:8080';

// Get admin credentials (you should implement proper auth storage)
const getAdminCredentials = () => {
    // For now, using default credentials - you should implement proper login/storage
    const username = localStorage.getItem('admin_username') || 'admin';
    const password = localStorage.getItem('admin_password') || 'password';
    return { username, password };
};

// Create authorization header
const getAuthHeaders = () => {
    const { username, password } = getAdminCredentials();
    const credentials = btoa(`${username}:${password}`);
    return {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
    };
};

// Admin API client
export const adminAPI = {
    // Products
    async getProducts() {
        const response = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async createProduct(productData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async updateProduct(slug: string, productData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/products/${slug}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async deleteProduct(slug: string) {
        const response = await fetch(`${API_BASE_URL}/admin/products/${slug}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Posts
    async getPosts() {
        const response = await fetch(`${API_BASE_URL}/admin/posts`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async createPost(postData: any) {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async updatePost(slug: string, postData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/posts/${slug}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async deletePost(slug: string) {
        const response = await fetch(`${API_BASE_URL}/admin/posts/${slug}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Blog-to-Product Collections
    async getBlogToProductCollections() {
        const response = await fetch(`${API_BASE_URL}/admin/blog-to-product-collections`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async createBlogToProductCollection(collectionData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/blog-to-product-collections`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async updateBlogToProductCollection(id: string, collectionData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/blog-to-product-collections/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async deleteBlogToProductCollection(id: string) {
        const response = await fetch(`${API_BASE_URL}/admin/blog-to-product-collections/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Lifestyle Collections  
    async getLifestyleCollections() {
        const response = await fetch(`${API_BASE_URL}/admin/lifestyle-collections`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async createLifestyleCollection(collectionData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/lifestyle-collections`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async updateLifestyleCollection(id: string, collectionData: any) {
        const response = await fetch(`${API_BASE_URL}/admin/lifestyle-collections/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async deleteLifestyleCollection(id: string) {
        const response = await fetch(`${API_BASE_URL}/admin/lifestyle-collections/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Comments
    async getComments() {
        const response = await fetch(`${API_BASE_URL}/admin/comments`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async deleteComment(id: string) {
        const response = await fetch(`${API_BASE_URL}/admin/comments/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Newsletter
    async getSubscribers() {
        const response = await fetch(`${API_BASE_URL}/admin/subscribers`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Product Categories (simplified for now)
    async getProductCategories() {
        const response = await fetch(`${API_BASE_URL}/admin/product-categories`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    // Product Assignment
    async assignProducts(collectionType: string, collectionId: string, productSlugs: string[], action: 'add' | 'remove' | 'set' = 'set') {
        const response = await fetch(`${API_BASE_URL}/admin/assign-products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                collection_type: collectionType,
                collection_id: collectionId,
                product_slugs: productSlugs,
                action: action
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },

    async getCollectionProducts(collectionType: string, collectionId: string) {
        const response = await fetch(`${API_BASE_URL}/admin/collection-products/${collectionType}/${collectionId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    },
};

// Simple login function (you should enhance this with proper authentication)
export const adminLogin = (username: string, password: string) => {
    localStorage.setItem('admin_username', username);
    localStorage.setItem('admin_password', password);
};

export const adminLogout = () => {
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_password');
}; 