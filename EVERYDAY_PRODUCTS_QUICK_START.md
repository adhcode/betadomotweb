# Everyday Products - Quick Start

## 🎯 What This Does

Adds support for two types of products on Betadomot:
- **Editorial Products**: Inspiration, reference, curation (can't be purchased)
- **Everyday Products**: Practical, purchasable items for daily use

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Database Migration

**Easiest Method - Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Open your project → **SQL Editor**
3. Copy/paste this SQL and click **Run**:

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'everyday' 
CHECK (product_type IN ('editorial', 'everyday'));

ALTER TABLE products
ADD COLUMN IF NOT EXISTS editorial_note TEXT,
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' 
CHECK (availability_status IN ('available', 'limited', 'reference', 'sold_out'));

ALTER TABLE products
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS shipping_info TEXT,
ADD COLUMN IF NOT EXISTS return_policy TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT;

CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);

UPDATE products SET product_type = 'everyday' WHERE product_type IS NULL;
```

✅ Done! Backend is already updated.

### Step 2: Update Product Detail Page

Edit `shop/app/products/[slug]/page.tsx`:

```typescript
import { fetchProduct } from '@/lib/api-client';
import { isEditorialProduct, isEverydayProduct, Product } from '@/lib/product-utils';
import EditorialProductPage from '@/components/EditorialProductPage';
import EverydayProductPage from '@/components/EverydayProductPage';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const response = await fetchProduct(params.slug);
  
  if (!response || response.length === 0) {
    notFound();
  }
  
  const product = response[0] as Product;
  
  if (isEditorialProduct(product)) {
    return <EditorialProductPage product={product} />;
  }
  
  return <EverydayProductPage product={product as any} />;
}
```

### Step 3: Test It

Create a test product via Supabase Dashboard:

**Editorial Product Example:**
```sql
INSERT INTO products (
  slug, name, description, price, images, category, tags,
  product_type, editorial_note, availability_status,
  sku, stock, featured, active
) VALUES (
  'eames-lounge-chair',
  'Eames Lounge Chair',
  'A masterpiece of mid-century modern design',
  500000,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
  'Furniture',
  ARRAY['designer', 'iconic'],
  'editorial',
  'This chair defined an era of American design and remains a symbol of comfort',
  'reference',
  'EDITORIAL-001',
  0,
  true,
  true
);
```

**Everyday Product Example:**
```sql
INSERT INTO products (
  slug, name, description, price, sale_price, images, category, tags,
  product_type, sku, stock, shipping_info, return_policy,
  featured, active
) VALUES (
  'ikea-poang-chair',
  'IKEA POÄNG Armchair',
  'Comfortable armchair with layer-glued bent birch frame',
  45000,
  38000,
  ARRAY['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'],
  'Furniture',
  ARRAY['ikea', 'affordable'],
  'everyday',
  'IKEA-POANG-001',
  15,
  'Free delivery within Lagos. 3-5 business days for other regions.',
  '7-day return policy. Item must be unused and in original packaging.',
  true,
  true
);
```

Visit:
- http://localhost:3001/products/eames-lounge-chair (Editorial)
- http://localhost:3001/products/ikea-poang-chair (Everyday)

## 📚 Full Documentation

- `EVERYDAY_PRODUCTS_SPEC.md` - Complete specification
- `EVERYDAY_PRODUCTS_IMPLEMENTATION.md` - Detailed implementation guide
- `RUN_PRODUCT_TYPES_MIGRATION.md` - Migration troubleshooting

## 🎨 Key Differences

### Editorial Products
- Magazine-style layout
- Focus on storytelling
- No "Add to cart" button
- Optional external links
- Availability: reference, limited, available, sold_out

### Everyday Products
- E-commerce layout
- Clear pricing and stock
- "Add to cart" functionality
- Shipping and return info
- Variant support (coming soon)

## 🔧 Optional Enhancements

### Update Homepage (Recommended)

Edit `shop/app/page.tsx` to separate product types:

```typescript
import { isEditorialProduct, isEverydayProduct, Product } from '@/lib/product-utils';

export default async function ShopPage() {
  const allProducts = await fetchProducts() as Product[];
  
  const editorialProducts = allProducts.filter(isEditorialProduct);
  const everydayProducts = allProducts.filter(isEverydayProduct);
  
  // Show editorial products in one section
  // Show everyday products in another section
}
```

### Update ProductGrid

Add visual badges for editorial products in `shop/components/ProductGrid.tsx`.

See `EVERYDAY_PRODUCTS_IMPLEMENTATION.md` for complete code examples.

## ✅ Success Checklist

- [ ] Database migration completed
- [ ] Product detail page routes to correct component
- [ ] Test editorial product displays correctly
- [ ] Test everyday product displays correctly
- [ ] Cart only accepts everyday products
- [ ] Homepage separates product types (optional)

## 🆘 Need Help?

Check `RUN_PRODUCT_TYPES_MIGRATION.md` if migration fails.

The system is designed to be backwards compatible - existing products become "everyday" products automatically.
