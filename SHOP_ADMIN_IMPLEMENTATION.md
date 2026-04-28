# Shop Admin Implementation Plan

## Overview
Build a complete admin interface for managing the Betadomot shop, including products, categories, and collections.

## Database Structure

### Already Exists:
- ✅ `products` table
- ✅ `product_categories` table

### Need to Create:
- `product_collections` table (for homepage collections)
- `collection_products` junction table (many-to-many)

## Backend API Endpoints Needed

### Categories
- ✅ GET `/categories` - List all categories
- ✅ GET `/categories/{slug}` - Get single category
- ⬜ POST `/admin/categories` - Create category
- ⬜ PUT `/admin/categories/{id}` - Update category
- ⬜ DELETE `/admin/categories/{id}` - Delete category

### Products
- ✅ GET `/products` - List products
- ✅ GET `/products/{slug}` - Get single product
- ✅ POST `/admin/products` - Create product
- ✅ PUT `/admin/products/{slug}` - Update product
- ✅ DELETE `/admin/products/{slug}` - Delete product

### Collections
- ⬜ GET `/collections` - List all collections
- ⬜ GET `/collections/{slug}` - Get single collection with products
- ⬜ POST `/admin/collections` - Create collection
- ⬜ PUT `/admin/collections/{id}` - Update collection
- ⬜ DELETE `/admin/collections/{id}` - Delete collection
- ⬜ POST `/admin/collections/{id}/products` - Add products to collection
- ⬜ DELETE `/admin/collections/{id}/products/{productId}` - Remove product from collection

## Frontend Admin Pages Needed

### Shop Admin Dashboard
- `/admin/dashboard/shop` - Overview with stats

### Products Management
- `/admin/dashboard/shop/products` - List all products
- `/admin/dashboard/shop/products/new` - Create new product
- `/admin/dashboard/shop/products/[id]/edit` - Edit product

### Categories Management
- `/admin/dashboard/shop/categories` - List all categories
- `/admin/dashboard/shop/categories/new` - Create new category
- `/admin/dashboard/shop/categories/[id]/edit` - Edit category

### Collections Management
- `/admin/dashboard/shop/collections` - List all collections
- `/admin/dashboard/shop/collections/new` - Create new collection
- `/admin/dashboard/shop/collections/[id]/edit` - Edit collection

## Implementation Steps

### Phase 1: Database & Backend (Priority)
1. Create collections tables migration
2. Create category admin handlers
3. Create collection admin handlers
4. Update main.go with new routes

### Phase 2: Admin UI (Next)
1. Create shop admin layout
2. Create products management page
3. Create categories management page
4. Create collections management page

### Phase 3: Homepage Integration
1. Update homepage to fetch and display collections
2. Add collection pages to shop

## Collections Table Schema

```sql
CREATE TABLE product_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE collection_products (
  collection_id UUID REFERENCES product_collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);
```

## Next Steps

1. Run collections migration
2. Create backend handlers
3. Build admin UI
4. Test everything
5. Deploy

---

**Let's start with Phase 1!**
