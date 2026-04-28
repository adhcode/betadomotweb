# Test Everyday Products System

## Quick Test Guide

### 1. Start the Shop

```bash
cd shop
npm run dev
```

Shop should start on http://localhost:3001

### 2. Create Test Products

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Editorial Product
INSERT INTO products (
  slug, name, description, price, images, category, tags,
  product_type, editorial_note, availability_status,
  sku, stock, featured, active
) VALUES (
  'eames-lounge-chair',
  'Eames Lounge Chair',
  'A masterpiece of mid-century modern design',
  500000,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
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

-- Everyday Product
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
  ARRAY['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'],
  'Furniture',
  ARRAY['ikea', 'affordable'],
  'everyday',
  'IKEA-POANG-001',
  15,
  'Free delivery within Lagos',
  '7-day return policy',
  true,
  true
);
```

### 3. Test Checklist

#### Homepage (http://localhost:3001)
- [ ] See "Editor's Selection" section with editorial products
- [ ] See "Everyday Essentials" section with everyday products
- [ ] Sections have different descriptions
- [ ] Visual distinction between product types

#### Editorial Product (http://localhost:3001/products/eames-lounge-chair)
- [ ] Magazine-style layout
- [ ] Shows editorial note
- [ ] Shows "Reference only" status
- [ ] No "Add to cart" button (or disabled)
- [ ] External link button (if provided)
- [ ] "Why we chose this" section

#### Everyday Product (http://localhost:3001/products/ikea-poang-chair)
- [ ] E-commerce layout
- [ ] Shows price (₦38,000 with ₦45,000 crossed out)
- [ ] Shows "In Stock (15 available)"
- [ ] "Add to cart" button is prominent
- [ ] Shipping info section visible
- [ ] Return policy section visible
- [ ] Product details section

#### Product Grid
- [ ] Editorial products show "Reference" badge
- [ ] Everyday products show price
- [ ] Different information for each type

#### Cart Functionality
- [ ] Can add everyday product to cart
- [ ] Cannot add editorial product to cart
- [ ] Console shows warning for editorial products

### 4. API Tests

```bash
# Test backend API
curl http://localhost:8080/products

# Should show both products with product_type field

# Filter by type
curl http://localhost:8080/products?type=editorial
curl http://localhost:8080/products?type=everyday
```

### 5. Expected Console Output

When visiting product pages, you should see:
```
[ProductPage] Fetching product with slug: eames-lounge-chair
[ProductPage] Product fetched: Success
[ProductPage] Product type: editorial
[ProductPage] Rendering Editorial product page
```

### 6. Common Issues

**Issue**: Product page shows 404
**Fix**: Check product exists and has correct slug

**Issue**: Product type not detected
**Fix**: Verify product has `product_type` field in database

**Issue**: Editorial product can be added to cart
**Fix**: Check cart-context.tsx has the type check

**Issue**: Homepage doesn't separate products
**Fix**: Verify products have `product_type` set correctly

### 7. Verify Database

```sql
-- Check products have correct types
SELECT slug, name, product_type, availability_status, stock
FROM products
ORDER BY created_at DESC;

-- Should show:
-- eames-lounge-chair | editorial | reference | 0
-- ikea-poang-chair   | everyday  | available | 15
```

### 8. Success Indicators

✅ Homepage shows two distinct sections
✅ Editorial products have magazine-style pages
✅ Everyday products have e-commerce pages
✅ Cart only accepts everyday products
✅ Visual badges distinguish product types
✅ No errors in console
✅ All links work correctly

---

If all checks pass, the system is working correctly! 🎉
