# Shop Module - Deployment Guide

## Pre-Deployment Checklist

### 1. Database Setup
- [ ] Run products table migration on production database
- [ ] Verify table created successfully
- [ ] Check indexes are in place

```bash
# On production database
psql "$PRODUCTION_DATABASE_URL" -f backend/create_products_table.sql
```

### 2. Backend Verification
- [ ] Backend compiles without errors
- [ ] Product routes are registered in main.go
- [ ] Environment variables are set
- [ ] API endpoints respond correctly

```bash
# Test production API
curl https://your-api-url.com/products
curl https://your-api-url.com/health
```

### 3. Frontend Build
- [ ] Next.js builds without errors
- [ ] Shop pages are included in build
- [ ] API_BASE_URL points to production
- [ ] No TypeScript errors

```bash
cd frontend
npm run build
```

### 4. Testing
- [ ] Shop listing page loads
- [ ] Shop detail page loads
- [ ] Blog pages still work
- [ ] Navigation links work
- [ ] Images load correctly
- [ ] Mobile responsive

## Deployment Steps

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Backend (Railway)
```bash
# Railway will auto-deploy from git
# Ensure these env vars are set:
# - DATABASE_URL
# - SUPABASE_URL
# - SUPABASE_KEY
# - ADMIN_USERNAME
# - ADMIN_PASSWORD
```

#### Frontend (Vercel)
```bash
# Vercel will auto-deploy from git
# Ensure env var is set:
# - NEXT_PUBLIC_API_URL (or use production check in api-client.ts)
```

### Option 2: Docker Deployment

```bash
# Build and deploy both services
docker-compose up -d
```

### Option 3: Manual Deployment

#### Backend
```bash
cd backend
go build -o shop-api
./shop-api
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## Post-Deployment Verification

### 1. Smoke Tests
```bash
# Check health
curl https://your-api.com/health

# Check products endpoint
curl https://your-api.com/products

# Check blog still works
curl https://your-api.com/posts
```

### 2. Frontend Tests
- [ ] Visit https://your-site.com/shop
- [ ] Check console for errors
- [ ] Test navigation
- [ ] Verify blog pages work
- [ ] Check mobile view

### 3. Admin Tests
- [ ] Login to admin dashboard
- [ ] Create a test product
- [ ] Verify product appears on shop page
- [ ] Update product
- [ ] Delete test product

## Adding Initial Products

### Via API
```bash
curl -X POST https://your-api.com/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -d '{
    "name": "Product Name",
    "description": "Product description",
    "price": 10000,
    "images": ["https://your-cdn.com/image.jpg"],
    "category": "Category",
    "tags": ["tag1", "tag2"],
    "stock": 10,
    "featured": true,
    "active": true
  }'
```

### Via Database (Bulk Import)
```sql
INSERT INTO products (slug, name, description, price, images, category, stock, sku, active)
VALUES 
  ('product-1', 'Product 1', 'Description', 10000, ARRAY['url1'], 'Category', 10, 'SKU-001', true),
  ('product-2', 'Product 2', 'Description', 20000, ARRAY['url2'], 'Category', 5, 'SKU-002', true);
```

## Monitoring

### Key Metrics
- [ ] API response times
- [ ] Error rates
- [ ] Product page views
- [ ] Database query performance

### Logs to Watch
```bash
# Backend logs
tail -f backend/server.log

# Check for errors
grep ERROR backend/server.log
```

## Rollback Plan

### If Issues Arise

#### Quick Rollback (Frontend Only)
```bash
# Revert to previous deployment
vercel rollback

# Or hide shop pages
# Add to frontend/middleware.ts:
if (request.nextUrl.pathname.startsWith('/shop')) {
  return NextResponse.redirect(new URL('/', request.url))
}
```

#### Full Rollback
```bash
# Revert git commits
git revert HEAD~3  # Adjust number as needed
git push

# Or checkout previous version
git checkout <previous-commit>
git push -f
```

#### Database Rollback
```sql
-- If needed, drop products table
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS blog_product_links CASCADE;
```

## Performance Optimization

### After Deployment

#### 1. Enable Caching
```typescript
// In frontend/app/shop/page.tsx
export const revalidate = 3600; // Cache for 1 hour
```

#### 2. Image Optimization
- Use Next.js Image component (already implemented)
- Consider CDN for product images
- Optimize image sizes

#### 3. Database Indexes
```sql
-- Already created in migration, but verify:
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
```

## Security Checklist

- [ ] Admin endpoints require authentication
- [ ] SQL injection protection (using parameterized queries)
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting enabled (if needed)

## SEO Optimization

### Add to Product Pages
```typescript
// In frontend/app/shop/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: product.images,
    },
  };
}
```

## Support & Maintenance

### Regular Tasks
- [ ] Monitor product inventory
- [ ] Update product information
- [ ] Check for broken image links
- [ ] Review analytics
- [ ] Update featured products

### Monthly Review
- [ ] Check API performance
- [ ] Review error logs
- [ ] Update product categories
- [ ] Optimize slow queries
- [ ] Review user feedback

## Success Metrics

### Week 1
- [ ] Zero critical errors
- [ ] Shop pages loading < 2s
- [ ] Blog performance unchanged
- [ ] At least 10 products live

### Month 1
- [ ] Product page views tracked
- [ ] User engagement measured
- [ ] Performance optimized
- [ ] Ready for blog-product integration

## Next Steps After Deployment

1. **Add More Products**
   - Create product catalog
   - Add high-quality images
   - Write compelling descriptions

2. **Enable Blog-Product Links**
   - Run blog_product_links migration
   - Add admin UI for linking
   - Display products on blog posts

3. **Add Shopping Cart**
   - Implement client-side cart
   - Add checkout flow
   - Integrate payment gateway

4. **Analytics**
   - Track product views
   - Monitor conversion rates
   - A/B test product pages

## Emergency Contacts

- Backend Issues: Check Railway logs
- Frontend Issues: Check Vercel logs
- Database Issues: Check Supabase dashboard
- DNS Issues: Check domain registrar

## Documentation

- Setup Guide: `SHOP_SETUP_GUIDE.md`
- Quick Start: `SHOP_QUICK_START.md`
- Summary: `SHOP_MODULE_SUMMARY.md`
- This File: `SHOP_DEPLOYMENT.md`

---

**Remember:** The blog is completely unchanged. If shop has issues, blog continues to work normally.
