# Everyday Products Implementation Guide

## Overview

This guide walks you through implementing the dual-product system (Editorial + Everyday) for Betadomot.

## What's Been Created

### 1. Database Migration
- ✅ `backend/add_product_types.sql` - Adds product_type and related fields
- ✅ `backend/run_product_types_migration.sh` - Migration script

### 2. Backend Updates
- ✅ Updated `backend/models/models.go` with ProductVariant and extended Product model
- ✅ Updated `backend/handlers/products.go` with type filtering support

### 3. Frontend Utilities
- ✅ `shop/lib/product-utils.ts` - Type guards, helpers, and interfaces

### 4. New Components
- ✅ `shop/components/EverydayProductPage.tsx` - Detailed product page for everyday products

### 5. Documentation
- ✅ `EVERYDAY_PRODUCTS_SPEC.md` - Complete specification

## Implementation Steps

### Step 1: Run Database Migration

```bash
cd backend
chmod +x run_product_types_migration.sh
./run_product_types_migration.sh
```

This adds:
- `product_type` column (editorial/everyday)
- Editorial-specific fields (editorial_note, external_link, availability_status)
- Everyday-specific fields (variants, shipping_info, return_policy, care_instructions)
- Indexes for performance

### Step 2: Update Product Detail Page Router

Update `shop/app/products/[slug]/page.tsx` to route to the correct component based on product type:

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
  
  // Route to appropriate component based on product type
  if (isEditorialProduct(product)) {
    return <EditorialProductPage product={product} />;
  }
  
  if (isEverydayProduct(product)) {
    return <EverydayProductPage product={product} />;
  }
  
  // Fallback for products without type (shouldn't happen after migration)
  return <EverydayProductPage product={product as any} />;
}
```

### Step 3: Update EditorialProductPage

Enhance the existing `shop/components/EditorialProductPage.tsx` to use the new fields:

```typescript
// Add to the component props interface
interface EditorialProductPageProps {
  product: EditorialProduct; // Use the typed interface
}

// Update the component to use editorial_note
<p className="text-lg text-gray-600 font-light leading-relaxed">
  {product.editorial_note || product.description}
</p>

// Add external link handling
{product.external_link && (
  <a
    href={product.external_link}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block text-sm text-gray-900 font-medium hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-1"
  >
    View at manufacturer →
  </a>
)}

// Update availability display
<div className="text-sm font-light text-gray-600">
  {getAvailabilityLabel(product)}
</div>
```

### Step 4: Update ProductGrid Component

Update `shop/components/ProductGrid.tsx` to show visual distinction:

```typescript
import { Product, isEditorialProduct, getProductBadge, formatPrice } from '@/lib/product-utils';

function ProductCard({ product }: { product: Product }) {
  const isEditorial = isEditorialProduct(product);
  const badge = getProductBadge(product);
  
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="space-y-4">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <Image src={product.images[0]} alt={product.name} fill />
          
          {/* Badge for editorial products */}
          {badge && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-light text-gray-700">
              {badge}
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-light text-lg text-gray-900">
            {product.name}
          </h3>
          
          {isEditorial ? (
            <p className="text-sm text-gray-600 font-light line-clamp-2">
              {product.editorial_note || product.description}
            </p>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-light text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && (
                <span className="text-xs text-green-600">In stock</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### Step 5: Update Homepage

Update `shop/app/page.tsx` to separate editorial and everyday products:

```typescript
import { fetchProducts } from '@/lib/api-client';
import { isEditorialProduct, isEverydayProduct, Product } from '@/lib/product-utils';
import EditorialHeader from '@/components/EditorialHeader';
import ShopFooter from '@/components/ShopFooter';
import EditorialGallery from '@/components/EditorialGallery';
import ProductGrid from '@/components/ProductGrid';
import LifestyleCategory from '@/components/LifestyleCategory';
import { lifestyleCategories, filterProductsByCategory } from '@/lib/lifestyle-categories';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const allProducts = await fetchProducts() as Product[];
  
  // Separate by type
  const editorialProducts = allProducts.filter(isEditorialProduct);
  const everydayProducts = allProducts.filter(isEverydayProduct);

  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* ... existing hero ... */}
      </section>

      {/* Editor's Selection (Editorial Products) */}
      {editorialProducts.length > 0 && (
        <section className="py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-20 lg:mb-32 text-center">
              <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
                Editor's Selection
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                Chosen for inspiration
              </h2>
              <p className="text-lg text-gray-600 font-light mt-4 max-w-2xl mx-auto">
                Pieces we admire for their design, craft, and story
              </p>
            </div>
            <EditorialGallery products={editorialProducts} />
          </div>
        </section>
      )}

      {/* Everyday Essentials (Everyday Products) */}
      {everydayProducts.length > 0 && (
        <section className="py-32 lg:py-40 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-20 lg:mb-32 text-center">
              <p className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
                Everyday Essentials
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                Practical pieces for your home
              </h2>
              <p className="text-lg text-gray-600 font-light mt-4 max-w-2xl mx-auto">
                Reliable, accessible products selected for daily use
              </p>
            </div>
            <ProductGrid products={everydayProducts} />
          </div>
        </section>
      )}

      {/* Lifestyle Categories */}
      <div className="border-t border-gray-100">
        {lifestyleCategories.map((category) => {
          const categoryProducts = filterProductsByCategory(allProducts, category.filter);
          if (categoryProducts.length === 0) return null;
          
          return (
            <LifestyleCategory
              key={category.id}
              title={category.title}
              description={category.description}
              products={categoryProducts}
              viewAllLink={category.viewAllLink}
            />
          );
        })}
      </div>

      {/* Editorial Connection */}
      <section className="py-32 lg:py-40 border-t border-gray-100">
        {/* ... existing journal link ... */}
      </section>

      <ShopFooter />
    </div>
  );
}
```

### Step 6: Update Lifestyle Categories

Update `shop/lib/lifestyle-categories.ts` to support product type filtering:

```typescript
export interface LifestyleCategoryConfig {
  id: string;
  title: string;
  description?: string;
  filter: {
    tags?: string[];
    category?: string;
    product_type?: 'editorial' | 'everyday' | 'both'; // NEW
    featured?: boolean;
  };
  viewAllLink?: string;
  order: number;
}

// Update filterProductsByCategory function
export function filterProductsByCategory(
  products: any[],
  categoryFilter: LifestyleCategoryConfig['filter']
): any[] {
  return products.filter((product) => {
    // Filter by product type
    if (categoryFilter.product_type && categoryFilter.product_type !== 'both') {
      if (product.product_type !== categoryFilter.product_type) {
        return false;
      }
    }
    
    // ... rest of existing filters ...
  });
}

// Example category configurations
export const lifestyleCategories: LifestyleCategoryConfig[] = [
  {
    id: 'ikea-selected',
    title: 'From IKEA, selected by Betadomot',
    description: 'Trusted everyday pieces chosen for real homes',
    filter: {
      tags: ['ikea'],
      product_type: 'everyday', // Only everyday products
    },
    viewAllLink: '/collections/ikea-selected',
    order: 1,
  },
  {
    id: 'design-references',
    title: 'Design references',
    description: 'Pieces that inspire our curation',
    filter: {
      product_type: 'editorial', // Only editorial
      featured: true,
    },
    viewAllLink: '/collections/design-references',
    order: 5,
  },
];
```

### Step 7: Update Cart Logic

Update `shop/lib/cart-context.tsx` to prevent editorial products from being added:

```typescript
import { canAddToCart, Product } from './product-utils';

const addToCart = (product: Product) => {
  // Check if product can be added to cart
  if (!canAddToCart(product)) {
    console.warn('This product cannot be added to cart');
    return;
  }
  
  // ... existing cart logic ...
};
```

### Step 8: Update API Client

Update `shop/lib/api-client.ts` to support type filtering:

```typescript
export async function fetchProducts(type?: 'editorial' | 'everyday'): Promise<any[]> {
  try {
    const url = type 
      ? `${API_BASE_URL}/products?type=${type}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
```

## Testing the Implementation

### 1. Test Database Migration

```bash
cd backend
./run_product_types_migration.sh
```

Verify columns were added:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('product_type', 'editorial_note', 'variants');
```

### 2. Test Backend API

```bash
# Get all products
curl http://localhost:8080/products

# Get only editorial products
curl http://localhost:8080/products?type=editorial

# Get only everyday products
curl http://localhost:8080/products?type=everyday
```

### 3. Create Test Products

Create an editorial product:
```json
{
  "name": "Eames Lounge Chair",
  "description": "A masterpiece of mid-century modern design",
  "price": 500000,
  "images": ["https://example.com/eames.jpg"],
  "category": "Furniture",
  "tags": ["designer", "iconic", "mid-century"],
  "product_type": "editorial",
  "editorial_note": "This chair defined an era of American design and remains a symbol of comfort and sophistication",
  "external_link": "https://www.hermanmiller.com/products/seating/lounge-seating/eames-lounge-chair-and-ottoman/",
  "availability_status": "reference",
  "sku": "EDITORIAL-EAMES-001",
  "stock": 0,
  "featured": true,
  "active": true
}
```

Create an everyday product:
```json
{
  "name": "IKEA POÄNG Armchair",
  "description": "Comfortable armchair with layer-glued bent birch frame",
  "price": 45000,
  "sale_price": 38000,
  "images": ["https://example.com/poang.jpg"],
  "category": "Furniture",
  "tags": ["ikea", "affordable", "comfortable"],
  "product_type": "everyday",
  "sku": "IKEA-POANG-001",
  "stock": 15,
  "weight": 10.5,
  "dimensions": "68x82x100 cm",
  "shipping_info": "Free delivery within Lagos. 3-5 business days for other regions.",
  "return_policy": "7-day return policy. Item must be unused and in original packaging.",
  "care_instructions": "Wipe clean with a damp cloth. Avoid harsh chemicals.",
  "featured": true,
  "active": true
}
```

### 4. Test Frontend

```bash
cd shop
npm run dev
```

Visit:
- `http://localhost:3000` - Homepage should show separated sections
- `http://localhost:3000/products/eames-lounge-chair` - Editorial product page
- `http://localhost:3000/products/ikea-poang-armchair` - Everyday product page

## Content Guidelines

### Editorial Products

**When to use**:
- High-end designer pieces (Herman Miller, Vitra, etc.)
- Historical design references
- Aspirational items
- Limited availability or vintage pieces
- Items that tell a compelling story

**Editorial note examples**:
- "This chair defined an era of American design and remains a symbol of comfort and sophistication"
- "A minimalist masterpiece that proves less truly is more"
- "Handcrafted by artisans using centuries-old techniques"

**Availability status**:
- `reference` - For inspiration only, not available for purchase
- `limited` - Very limited availability, may become available
- `available` - Can be sourced or ordered
- `sold_out` - Was available but no longer

### Everyday Products

**When to use**:
- IKEA selections
- Accessible price points (under ₦100,000)
- Reliable availability
- Practical daily use items
- Clear value propositions

**Description examples**:
- "Comfortable armchair with layer-glued bent birch frame. Affordable comfort that works in any space."
- "Simple desk lamp with adjustable arm. Perfect for focused work without breaking the bank."
- "Durable storage boxes in natural materials. Organize your space with style."

**Required fields**:
- SKU (unique identifier)
- Stock (actual inventory count)
- Shipping info
- Return policy

## Troubleshooting

### Products not showing correct type

Check database:
```sql
SELECT slug, name, product_type FROM products;
```

Update if needed:
```sql
UPDATE products SET product_type = 'everyday' WHERE slug = 'product-slug';
```

### Type guards not working

Ensure product has `product_type` field:
```typescript
console.log('Product type:', product.product_type);
console.log('Is editorial:', isEditorialProduct(product));
console.log('Is everyday:', isEverydayProduct(product));
```

### Cart accepting editorial products

Check cart logic uses `canAddToCart()`:
```typescript
import { canAddToCart } from '@/lib/product-utils';

if (!canAddToCart(product)) {
  // Show error or redirect
  return;
}
```

## Next Steps

1. ✅ Run database migration
2. ✅ Update product detail page router
3. ✅ Update EditorialProductPage component
4. ✅ Update ProductGrid component
5. ✅ Update homepage sections
6. ✅ Update lifestyle categories
7. ✅ Update cart logic
8. ✅ Create test products
9. ✅ Test user flows
10. ✅ Update admin interface (future)

## Admin Interface (Future Enhancement)

The admin interface will need:
- Product type selector (radio buttons)
- Conditional field rendering based on type
- Variant manager for everyday products
- Editorial note editor for editorial products
- Availability status selector for editorial products

See `EVERYDAY_PRODUCTS_SPEC.md` for detailed admin interface design.

## Success Criteria

- ✅ Users can distinguish editorial from everyday products
- ✅ Editorial products show inspiration-focused content
- ✅ Everyday products show purchase-focused content
- ✅ Cart only accepts everyday products
- ✅ Homepage clearly separates both types
- ✅ No confusion about purchase intent
- ✅ Editorial identity preserved
- ✅ Commerce functionality works smoothly

---

**Questions?** Refer to `EVERYDAY_PRODUCTS_SPEC.md` for complete specification.
