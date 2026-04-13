# Shop Module Setup Guide

## Overview
This guide covers the new shop module added to your Go + Next.js monorepo. The shop is completely separate from the blog and uses additive changes only.

## What Was Added

### Backend (Go)
✅ Already exists:
- `backend/models/models.go` - Product models already defined
- `backend/handlers/products.go` - Product CRUD handlers already implemented
- `backend/main.go` - Product routes already registered

✅ New files:
- `backend/create_products_table.sql` - Database migration for products table
- `backend/run_products_migration.sh` - Migration script
- `backend/create_blog_product_links.sql` - Blog-product linking table (prepared for future)
- `backend/handlers/blog_product_links.go` - Blog-product linking handlers (prepared for future)

### Frontend (Next.js)
✅ New files:
- `frontend/lib/api-client.ts` - Added `fetchProducts()` and `fetchProduct()` functions
- `frontend/app/shop/page.tsx` - Product listing page
- `frontend/app/shop/[slug]/page.tsx` - Product detail page
- `frontend/components/Header.tsx` - Updated Shop link to point to `/shop`

## Setup Instructions

### 1. Database Migration (Optional - if products table doesn't exist)

```bash
cd backend
chmod +x run_products_migration.sh
./run_products_migration.sh
```

This creates the `products` table with:
- Basic product fields (name, description, price, sale_price)
- Images array
- Category and tags
- Stock management
- SKU and dimensions
- Featured and active flags

### 2. Test the Backend API

The product endpoints are already registered in `main.go`:

**Public endpoints:**
- `GET /products` - List all active products
- `GET /products?category=furniture` - Filter by category
- `GET /products?featured=true` - Get featured products
- `GET /products/{slug}` - Get single product

**Admin endpoints (require auth):**
- `GET /admin/products` - List all products (including inactive)
- `POST /admin/products` - Create product
- `PUT /admin/products/{slug}` - Update product
- `DELETE /admin/products/{slug}` - Delete product

Test with:
```bash
curl http://localhost:8080/products
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

Visit:
- `http://localhost:3000/shop` - Product listing
- `http://localhost:3000/shop/[slug]` - Product detail

### 4. Add Sample Products (via API)

```bash
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic [your-auth-token]" \
  -d '{
    "name": "Modern Office Chair",
    "description": "Ergonomic office chair with lumbar support",
    "price": 45000,
    "images": ["https://example.com/chair.jpg"],
    "category": "Furniture",
    "tags": ["office", "ergonomic"],
    "stock": 10,
    "sku": "CHAIR-001",
    "weight": 12.5,
    "dimensions": "60x60x120cm",
    "featured": true,
    "active": true
  }'
```

## Blog-Product Linking (Prepared for Future)

The blog-product linking module is prepared but not integrated into the UI yet. To enable it:

### 1. Run the migration:
```bash
cd backend
psql "$DATABASE_URL" -f create_blog_product_links.sql
```

### 2. Add routes to `main.go`:
```go
// In main.go, add after other routes:
blogProductLinkHandler := handlers.NewBlogProductLinkHandler(db)

r.Route("/posts/{slug}/products", func(r chi.Router) {
    r.Get("/", blogProductLinkHandler.GetProductsForPost)
})

r.Route("/admin/blog-product-links", func(r chi.Router) {
    r.Use(middleware.BasicAuth(cfg.AdminUsername, cfg.AdminPassword))
    r.Post("/", blogProductLinkHandler.LinkProductToPost)
    r.Delete("/", blogProductLinkHandler.UnlinkProductFromPost)
})
```

### 3. Use in frontend:
```typescript
// Add to lib/api-client.ts
export async function fetchProductsForPost(postSlug: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${postSlug}/products`);
  if (!response.ok) return [];
  return await response.json();
}
```

## Architecture Notes

### Clean Separation
- Blog code: `frontend/app/blog/*`, `backend/handlers/posts.go`
- Shop code: `frontend/app/shop/*`, `backend/handlers/products.go`
- No shared components or dependencies

### Minimal Risk
- All changes are additive
- No modifications to existing blog functionality
- Blog continues to work exactly as before
- Shop can be removed by deleting `/shop` folder

### Future Integration Points
- `blog_product_links` table ready for linking posts to products
- `related_products` field already exists in Post model
- Can add product recommendations to blog posts later

## Testing Checklist

- [ ] Backend starts without errors
- [ ] `/products` endpoint returns data
- [ ] `/shop` page loads
- [ ] `/shop/[slug]` page loads
- [ ] Blog pages still work (`/blog/[slug]`, `/category/[slug]`)
- [ ] Header navigation includes Shop link
- [ ] No console errors in browser

## Next Steps

1. Add real product data via admin API
2. Style shop pages to match blog design
3. Add shopping cart functionality (client-side)
4. Implement checkout flow
5. Enable blog-product linking in admin UI
6. Add product recommendations to blog posts

## Rollback

To remove the shop module:
```bash
# Frontend
rm -rf frontend/app/shop

# Remove shop functions from api-client.ts
# Revert Header.tsx shop link to external URL

# Backend (optional - products table can stay)
# No changes needed - routes are harmless if unused
```

## Support

The shop module is completely isolated. If issues arise:
1. Check backend logs for API errors
2. Check browser console for frontend errors
3. Verify database connection
4. Test product endpoints directly with curl

Blog functionality remains untouched and stable.
