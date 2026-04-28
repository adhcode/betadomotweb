# Everyday Products System Specification

## Overview

Extend Betadomot's editorial lifestyle system to support **Everyday Products** alongside existing **Editorial Products**, maintaining the editorial identity while enabling practical commerce.

## Core Principles

1. **Editorial First**: Editorial products remain the primary lens and taste-setter
2. **Coexistence**: Two product behaviors live side-by-side without confusion
3. **Natural Extension**: Everyday products feel helpful, not commercial
4. **Clear Distinction**: Users always understand purchase vs. inspiration intent
5. **Premium Experience**: Maintain calm, editorial visual hierarchy throughout

---

## Product Type Definitions

### Editorial Products (Existing)
**Purpose**: Inspiration, reference, curation, taste-setting

**Characteristics**:
- Magazine-style presentation
- Focus on storytelling and context
- May have limited or no availability
- Price optional or "on request"
- Emphasis on "why we chose this"
- Long-form editorial content
- Links to external sources acceptable

**User Experience**:
- Presented as ideas and references
- No pressure to purchase
- Rich contextual information
- Aspirational tone

### Everyday Products (New)
**Purpose**: Accessible, practical, sellable items for daily use

**Characteristics**:
- Detailed product information
- Clear pricing and availability
- Stock management
- Variants (size, color) support
- Add-to-cart functionality
- Shipping and delivery info
- Return policy details

**User Experience**:
- Clear purchase path
- Practical product details
- Still includes editorial note
- Helpful, not pushy
- Reliable for daily use

---

## Database Schema Changes

### Add `product_type` Field

```sql
-- Migration: Add product_type to products table
ALTER TABLE products 
ADD COLUMN product_type TEXT DEFAULT 'everyday' CHECK (product_type IN ('editorial', 'everyday'));

-- Add index for filtering
CREATE INDEX idx_products_type ON products(product_type);

-- Add editorial-specific fields
ALTER TABLE products
ADD COLUMN editorial_note TEXT,
ADD COLUMN external_link TEXT,
ADD COLUMN availability_status TEXT DEFAULT 'available' 
  CHECK (availability_status IN ('available', 'limited', 'reference', 'sold_out'));

-- Add everyday-specific fields
ALTER TABLE products
ADD COLUMN variants JSONB DEFAULT '[]',
ADD COLUMN shipping_info TEXT,
ADD COLUMN return_policy TEXT,
ADD COLUMN care_instructions TEXT;

-- Update existing products to be 'everyday' by default
UPDATE products SET product_type = 'everyday' WHERE product_type IS NULL;
```

### Product Variants Structure

```typescript
interface ProductVariant {
  id: string;
  name: string; // e.g., "Small", "Blue", "Oak"
  type: 'size' | 'color' | 'material' | 'other';
  price_adjustment: number; // +/- from base price
  sku_suffix: string;
  stock: number;
  image_index?: number; // Which product image to show
}
```

---

## Backend Changes

### 1. Update Product Model

**File**: `backend/models/models.go`

```go
type Product struct {
    // ... existing fields ...
    
    // Product Type
    ProductType string `json:"product_type"` // "editorial" or "everyday"
    
    // Editorial-specific
    EditorialNote      string  `json:"editorial_note,omitempty"`
    ExternalLink       string  `json:"external_link,omitempty"`
    AvailabilityStatus string  `json:"availability_status"` // available, limited, reference, sold_out
    
    // Everyday-specific
    Variants         []ProductVariant `json:"variants,omitempty"`
    ShippingInfo     string          `json:"shipping_info,omitempty"`
    ReturnPolicy     string          `json:"return_policy,omitempty"`
    CareInstructions string          `json:"care_instructions,omitempty"`
}

type ProductVariant struct {
    ID              string  `json:"id"`
    Name            string  `json:"name"`
    Type            string  `json:"type"` // size, color, material, other
    PriceAdjustment float64 `json:"price_adjustment"`
    SKUSuffix       string  `json:"sku_suffix"`
    Stock           int     `json:"stock"`
    ImageIndex      *int    `json:"image_index,omitempty"`
}
```

### 2. Update Product Handlers

**File**: `backend/handlers/products.go`

Add filtering by product type:
- `GET /products?type=editorial`
- `GET /products?type=everyday`
- `GET /products` (returns all, with type field)

---

## Frontend Changes

### 1. Product Type Detection

**File**: `shop/lib/product-utils.ts` (new)

```typescript
export type ProductType = 'editorial' | 'everyday';

export interface BaseProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  product_type: ProductType;
}

export interface EditorialProduct extends BaseProduct {
  product_type: 'editorial';
  editorial_note: string;
  external_link?: string;
  availability_status: 'available' | 'limited' | 'reference' | 'sold_out';
}

export interface EverydayProduct extends BaseProduct {
  product_type: 'everyday';
  sale_price?: number;
  stock: number;
  sku: string;
  variants?: ProductVariant[];
  shipping_info?: string;
  return_policy?: string;
  care_instructions?: string;
}

export type Product = EditorialProduct | EverydayProduct;

export function isEditorialProduct(product: Product): product is EditorialProduct {
  return product.product_type === 'editorial';
}

export function isEverydayProduct(product: Product): product is EverydayProduct {
  return product.product_type === 'everyday';
}
```

### 2. Product Detail Pages

Create two distinct product page experiences:

#### Editorial Product Page
**File**: `shop/components/EditorialProductPage.tsx` (enhance existing)

**Layout**:
- Full-screen hero image
- Minimal header with back button
- Product name + editorial note (prominent)
- "Why we chose this" section
- Long-form storytelling
- Contextual images
- External link (if available)
- Subtle availability indicator
- Optional "Notify me" for limited items
- No cart pressure

**Key Sections**:
1. Hero with product name
2. Editorial note (short, prominent)
3. Why we chose this (long-form)
4. In context (lifestyle images)
5. What it's good for
6. How we'd style it
7. From the journal (link to blog)

#### Everyday Product Page
**File**: `shop/components/EverydayProductPage.tsx` (new)

**Layout**:
- Product gallery (multiple images)
- Product name + short editorial note
- Clear pricing and availability
- Variant selector (if applicable)
- Add to cart (prominent)
- Product details (specs, dimensions)
- Shipping & returns
- Care instructions
- Still includes "Why we selected this"

**Key Sections**:
1. Image gallery + variant selector
2. Product info + editorial note
3. Add to cart
4. Why we selected this (editorial touch)
5. Product specifications
6. Shipping & delivery
7. Care & maintenance
8. Related products

### 3. Product Grid Component

**File**: `shop/components/ProductGrid.tsx` (update)

Add visual distinction in grid view:

```typescript
// Editorial products: Show with "Reference" or "Limited" badge
// Everyday products: Show with price and "Add to cart" quick action

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isEditorial = isEditorialProduct(product);
  
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="space-y-4">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <Image src={product.images[0]} alt={product.name} fill />
          
          {/* Badge */}
          {isEditorial && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-light text-gray-700">
              {product.availability_status === 'reference' ? 'Reference' : 'Limited'}
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-light text-lg text-gray-900">
            {product.name}
          </h3>
          
          {isEditorial ? (
            <p className="text-sm text-gray-600 font-light">
              {product.editorial_note}
            </p>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-light text-gray-900">
                ₦{product.price.toLocaleString()}
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

### 4. Homepage Sections

**File**: `shop/app/page.tsx` (update)

Organize homepage to present both types naturally:

```typescript
export default async function ShopPage() {
  const allProducts = await fetchProducts();
  
  // Separate by type
  const editorialProducts = allProducts.filter(isEditorialProduct);
  const everydayProducts = allProducts.filter(isEverydayProduct);
  
  return (
    <div className="min-h-screen bg-white">
      <EditorialHeader />
      
      {/* 1. Hero */}
      <HeroSection />
      
      {/* 2. Editor's Selection (Editorial Products) */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
              Editor's Selection
            </p>
            <h2 className="text-4xl font-light text-gray-900">
              Chosen for inspiration
            </h2>
            <p className="text-lg text-gray-600 font-light mt-4 max-w-2xl mx-auto">
              Pieces we admire for their design, craft, and story
            </p>
          </div>
          <EditorialGallery products={editorialProducts} />
        </div>
      </section>
      
      {/* 3. Everyday Essentials (Everyday Products) */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
              Everyday Essentials
            </p>
            <h2 className="text-4xl font-light text-gray-900">
              Practical pieces for your home
            </h2>
            <p className="text-lg text-gray-600 font-light mt-4 max-w-2xl mx-auto">
              Reliable, accessible products selected for daily use
            </p>
          </div>
          <ProductGrid products={everydayProducts} />
        </div>
      </section>
      
      {/* 4. Lifestyle Categories (Mixed, but clearly labeled) */}
      <LifestyleCategoriesSection products={allProducts} />
      
      {/* 5. Editorial Connection */}
      <JournalLinkSection />
      
      <ShopFooter />
    </div>
  );
}
```

### 5. Lifestyle Categories Update

**File**: `shop/lib/lifestyle-categories.ts` (update)

Add product type awareness:

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
    id: 'minimal-living',
    title: 'For minimal living',
    description: 'Less, but better',
    filter: {
      tags: ['minimalist', 'minimal'],
      product_type: 'both', // Mix of both types
    },
    viewAllLink: '/collections/minimal-living',
    order: 2,
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

---

## Visual Design Guidelines

### Editorial Products
- **Color Palette**: Warm whites, soft grays, muted tones
- **Typography**: Larger, more spacious, serif accents
- **Imagery**: Full-bleed, atmospheric, contextual
- **Buttons**: Subtle, text-based, minimal
- **Tone**: Contemplative, aspirational, story-driven

### Everyday Products
- **Color Palette**: Clean whites, clear blacks, accent gold (#dca744)
- **Typography**: Clear hierarchy, sans-serif, readable
- **Imagery**: Product-focused, multiple angles, lifestyle context
- **Buttons**: Clear CTAs, "Add to cart" prominent but tasteful
- **Tone**: Helpful, practical, trustworthy

### Shared Elements
- Both maintain premium feel
- Both use Betadomot's editorial voice
- Both include "why we chose/selected this"
- Both link back to journal
- Both respect user's time and attention

---

## Cart & Checkout Behavior

### Editorial Products
- **Cannot be added to cart** (reference only)
- Show "View details" or "Learn more"
- Optional "Notify me" for limited availability
- External link opens in new tab with disclaimer

### Everyday Products
- **Can be added to cart**
- Variant selection before add-to-cart
- Stock validation
- Standard checkout flow
- Shipping and delivery options

---

## Admin Interface

### Product Creation Form

Add product type selector at the top:

```typescript
<select name="product_type">
  <option value="everyday">Everyday Product</option>
  <option value="editorial">Editorial Product</option>
</select>

{/* Conditional fields based on selection */}
{productType === 'editorial' && (
  <>
    <textarea name="editorial_note" label="Editorial Note" />
    <input name="external_link" label="External Link (optional)" />
    <select name="availability_status">
      <option value="available">Available</option>
      <option value="limited">Limited</option>
      <option value="reference">Reference Only</option>
    </select>
  </>
)}

{productType === 'everyday' && (
  <>
    <input name="sku" label="SKU" required />
    <input name="stock" type="number" label="Stock" required />
    <textarea name="shipping_info" label="Shipping Info" />
    <textarea name="return_policy" label="Return Policy" />
    <VariantManager />
  </>
)}
```

---

## Migration Strategy

### Phase 1: Database & Backend (Week 1)
1. Run database migration to add new fields
2. Update Go models and handlers
3. Add product type filtering to API
4. Test with sample data

### Phase 2: Frontend Components (Week 2)
1. Create `EverydayProductPage` component
2. Update `EditorialProductPage` with new fields
3. Update `ProductGrid` with type awareness
4. Create product type utilities

### Phase 3: Homepage Integration (Week 3)
1. Update homepage to separate sections
2. Update lifestyle categories with type filtering
3. Add visual distinctions in grid views
4. Test user flows

### Phase 4: Admin & Polish (Week 4)
1. Update admin product form
2. Add bulk product type assignment
3. Polish transitions and interactions
4. User testing and refinements

---

## Success Metrics

### User Understanding
- Users can distinguish editorial vs. everyday products
- Clear purchase intent for everyday products
- No confusion about availability

### Editorial Integrity
- Editorial products maintain aspirational quality
- No commercial pressure on editorial content
- Journal connection remains strong

### Commerce Effectiveness
- Clear conversion path for everyday products
- Appropriate cart abandonment rates
- Positive feedback on product information

---

## Example Product Scenarios

### Editorial Product Example
**Name**: "Eames Lounge Chair"
**Type**: Editorial
**Editorial Note**: "A masterpiece of mid-century design that defined an era"
**Availability**: Reference
**Price**: Not shown (or "From $5,000")
**External Link**: Herman Miller official page
**Experience**: User reads about the design history, sees it in context, gets inspired, no pressure to buy

### Everyday Product Example
**Name**: "IKEA POÄNG Armchair"
**Type**: Everyday
**Editorial Note**: "Affordable comfort that works in any space"
**Price**: ₦45,000
**Stock**: 12 available
**Variants**: Birch veneer, Black-brown
**Experience**: User sees clear price, selects variant, adds to cart, completes purchase

---

## Technical Considerations

### Performance
- Separate queries for editorial vs. everyday products
- Cache product type filters
- Lazy load product images
- Optimize variant data structure

### SEO
- Different meta descriptions for product types
- Schema.org markup for everyday products (Product)
- Schema.org markup for editorial products (Article)
- Separate sitemaps for product types

### Analytics
- Track product type views separately
- Monitor editorial → everyday conversion
- Track external link clicks
- Measure time on page by type

---

## Future Enhancements

### Phase 2 Features
- Product comparison tool
- "Similar everyday alternatives" for editorial products
- Editorial stories featuring everyday products
- User reviews (everyday products only)
- Wishlist with type awareness

### Integration Opportunities
- Blog posts can reference both product types
- Editorial products can suggest everyday alternatives
- Lifestyle guides can mix both types appropriately
- Email campaigns can segment by product type

---

## Questions & Decisions

### Resolved
- ✅ Product types: Editorial vs. Everyday
- ✅ Database schema approach
- ✅ Homepage organization
- ✅ Visual distinction strategy

### To Decide
- [ ] Should editorial products ever become everyday products?
- [ ] How to handle products that are both (limited edition everyday)?
- [ ] Notification system for editorial product availability?
- [ ] User accounts and saved preferences by product type?

---

## Implementation Checklist

### Database
- [ ] Create migration script
- [ ] Add product_type column
- [ ] Add editorial-specific columns
- [ ] Add everyday-specific columns
- [ ] Create indexes
- [ ] Test migration on staging

### Backend
- [ ] Update Product model
- [ ] Add ProductVariant model
- [ ] Update product handlers
- [ ] Add type filtering
- [ ] Update API documentation
- [ ] Write tests

### Frontend - Core
- [ ] Create product type utilities
- [ ] Create EverydayProductPage component
- [ ] Update EditorialProductPage component
- [ ] Update ProductGrid component
- [ ] Create VariantSelector component
- [ ] Update cart logic

### Frontend - Pages
- [ ] Update homepage sections
- [ ] Update lifestyle categories
- [ ] Create collection pages
- [ ] Update product detail routing
- [ ] Add type-specific meta tags

### Admin
- [ ] Update product creation form
- [ ] Add product type selector
- [ ] Add conditional field rendering
- [ ] Create variant manager
- [ ] Add bulk type assignment

### Testing
- [ ] Unit tests for type utilities
- [ ] Integration tests for API
- [ ] E2E tests for user flows
- [ ] Visual regression tests
- [ ] Performance testing

### Documentation
- [ ] Update API documentation
- [ ] Create admin guide
- [ ] Write content guidelines
- [ ] Document product type strategy
- [ ] Create migration guide

---

## Content Guidelines

### Editorial Products
**When to use**:
- High-end designer pieces
- Historical design references
- Aspirational items
- Limited availability items
- Items that tell a story

**Editorial note should**:
- Explain why it matters
- Provide context and history
- Connect to design principles
- Inspire without selling

### Everyday Products
**When to use**:
- Accessible price points
- Reliable availability
- Practical daily use
- Clear value proposition
- Straightforward purchase

**Editorial note should**:
- Explain selection criteria
- Highlight practical benefits
- Connect to lifestyle
- Build trust and confidence

---

## Conclusion

This dual-product system allows Betadomot to:
1. Maintain editorial integrity and taste-setting role
2. Offer practical, purchasable products for real homes
3. Create clear user experiences without confusion
4. Scale both editorial and commerce independently
5. Preserve the calm, premium brand experience

The key is **clear distinction with natural coexistence** — users should always know what they're looking at and what they can do with it, while feeling that both product types belong to the same thoughtful, curated world.
