# Full-Scale E-Commerce Shop Specification

## Vision

Transform Betadomot into a revenue-generating e-commerce platform that sells furniture, decor, and home products at scale, while preserving its editorial identity as a thoughtful lifestyle platform.

## Core Principles

1. **Editorial Homepage** - Homepage prioritizes brand, taste, and curated selections
2. **Dedicated Shop** - Full-scale commerce happens in a dedicated Shop section
3. **Clear Hierarchy** - Curated content vs. full inventory are clearly separated
4. **Premium Experience** - Calm, thoughtful design throughout
5. **Revenue Focus** - Built to generate real sales and scale inventory

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HOMEPAGE (Editorial)                      │
│  - Hero / Brand Story                                        │
│  - Curated Selection (8-12 featured products)                │
│  - Lifestyle Categories (editorial groupings)                │
│  - Link to Full Shop                                         │
│  - Blog/Journal Connection                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SHOP SECTION (Commerce)                   │
│                                                              │
│  /shop                                                       │
│  ├── /shop/all                    (All products)            │
│  ├── /shop/furniture              (Category pages)          │
│  ├── /shop/lighting                                         │
│  ├── /shop/decor                                            │
│  ├── /shop/textiles                                         │
│  ├── /shop/storage                                          │
│  ├── /shop/search?q=chair         (Search)                  │
│  └── /shop/products/[slug]        (Product detail)          │
│                                                              │
│  Features:                                                   │
│  - Category navigation                                       │
│  - Filters (price, brand, material, color)                  │
│  - Sort (price, newest, popular)                            │
│  - Search                                                    │
│  - Pagination                                                │
│  - Cart & Checkout                                           │
│  - Product reviews                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema Extensions

### Product Categories Table

```sql
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example categories:
-- Furniture > Seating > Chairs
-- Furniture > Seating > Sofas
-- Furniture > Tables > Dining Tables
-- Lighting > Ceiling > Pendants
-- Decor > Wall Art
-- Textiles > Rugs
```

### Product Attributes (for filtering)

```sql
CREATE TABLE product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "Material", "Color", "Brand"
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'select', 'multiselect', 'range'
  display_order INTEGER DEFAULT 0,
  is_filterable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID REFERENCES product_attributes(id),
  value TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_attribute_assignments (
  product_id UUID REFERENCES products(id),
  attribute_value_id UUID REFERENCES product_attribute_values(id),
  PRIMARY KEY (product_id, attribute_value_id)
);
```

### Product Reviews

```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved);
```

### Product Collections (for merchandising)

```sql
CREATE TABLE product_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_collection_items (
  collection_id UUID REFERENCES product_collections(id),
  product_id UUID REFERENCES products(id),
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);
```

### Update Products Table

```sql
-- Add fields to existing products table
ALTER TABLE products
ADD COLUMN category_id UUID REFERENCES product_categories(id),
ADD COLUMN brand TEXT,
ADD COLUMN material TEXT,
ADD COLUMN color TEXT,
ADD COLUMN rating_average DECIMAL(2,1) DEFAULT 0,
ADD COLUMN rating_count INTEGER DEFAULT 0,
ADD COLUMN view_count INTEGER DEFAULT 0,
ADD COLUMN sales_count INTEGER DEFAULT 0,
ADD COLUMN is_bestseller BOOLEAN DEFAULT false,
ADD COLUMN is_new_arrival BOOLEAN DEFAULT false,
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT;

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_bestseller ON products(is_bestseller);
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival);
CREATE INDEX idx_products_price ON products(price);
```

---

## Page Structure

### 1. Homepage (Editorial Focus)

**URL**: `/` (shop app root)

**Sections**:
1. **Hero** - Brand story, seasonal message
2. **Curated Selection** - 8-12 handpicked products with editorial notes
3. **Shop by Room** - Visual grid linking to categories
4. **New Arrivals** - 4-6 newest products
5. **Featured Collection** - Themed collection with story
6. **From the Journal** - Link to blog
7. **Shop CTA** - Clear link to full shop

**Design**:
- Spacious, editorial layout
- Large imagery
- Minimal text
- No aggressive CTAs
- Calm color palette

### 2. Shop Landing Page

**URL**: `/shop`

**Sections**:
1. **Shop Header** - "Explore our full collection"
2. **Category Grid** - All main categories with images
3. **Featured Collections** - Curated groupings
4. **Shop by Price** - Under ₦50k, ₦50k-₦100k, ₦100k+
5. **Bestsellers** - Top selling products
6. **New Arrivals** - Latest additions

**Design**:
- More structured than homepage
- Clear navigation
- Category cards with product counts
- Search bar prominent

### 3. Category Pages

**URL**: `/shop/[category-slug]`

**Example**: `/shop/furniture`, `/shop/lighting`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Shop > Furniture                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Category Hero                                            │
│ - Image                                                  │
│ - Title: "Furniture"                                     │
│ - Description: Editorial intro (2-3 sentences)           │
│                                                          │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  FILTERS     │  PRODUCTS GRID                           │
│              │                                           │
│  Price       │  [Sort: Newest ▼]  [48 products]         │
│  □ Under 50k │                                           │
│  □ 50k-100k  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  □ 100k+     │  │    │ │    │ │    │ │    │           │
│              │  │    │ │    │ │    │ │    │           │
│  Brand       │  └────┘ └────┘ └────┘ └────┘           │
│  □ IKEA      │                                           │
│  □ HAY       │  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  □ Muuto     │  │    │ │    │ │    │ │    │           │
│              │  │    │ │    │ │    │ │    │           │
│  Material    │  └────┘ └────┘ └────┘ └────┘           │
│  □ Wood      │                                           │
│  □ Metal     │  [Load More]                             │
│  □ Fabric    │                                           │
│              │                                           │
└──────────────┴──────────────────────────────────────────┘
```

**Features**:
- Sidebar filters (collapsible on mobile)
- Sort options (price, newest, popular, rating)
- Product grid (responsive: 2-4 columns)
- Pagination or infinite scroll
- Active filter tags
- Product count
- Breadcrumb navigation

### 4. Product Detail Page

**URL**: `/shop/products/[slug]`

**Layout** (Everyday Products):
```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Shop > Furniture > Product Name      │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│  PRODUCT IMAGES      │  PRODUCT INFO                    │
│                      │                                   │
│  ┌────────────────┐  │  Product Name                    │
│  │                │  │  ★★★★☆ (24 reviews)              │
│  │  Main Image    │  │                                   │
│  │                │  │  ₦45,000  ₦38,000 (15% off)      │
│  └────────────────┘  │                                   │
│                      │  In Stock (12 available)          │
│  [img][img][img]     │                                   │
│                      │  [Select Size: Medium ▼]          │
│                      │  [Select Color: Oak ▼]            │
│                      │                                   │
│                      │  [Quantity: 1]                    │
│                      │                                   │
│                      │  [Add to Cart - ₦38,000]          │
│                      │  [♡ Add to Wishlist]              │
│                      │                                   │
│                      │  ✓ Free delivery over ₦50k        │
│                      │  ✓ 7-day return policy            │
│                      │  ✓ Secure payment                 │
│                      │                                   │
├──────────────────────┴──────────────────────────────────┤
│                                                          │
│  TABS: Description | Specifications | Reviews | Shipping│
│                                                          │
│  [Tab Content]                                           │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  YOU MAY ALSO LIKE                                       │
│  [Product] [Product] [Product] [Product]                │
└─────────────────────────────────────────────────────────┘
```

### 5. Search Results Page

**URL**: `/shop/search?q=chair`

**Layout**: Similar to category page but with search-specific features
- Search query displayed
- "Did you mean..." suggestions
- Filter by category
- Sort by relevance

### 6. Collection Pages

**URL**: `/shop/collections/[slug]`

**Example**: `/shop/collections/scandinavian-living`

**Layout**: Similar to category but with collection story at top

---

## Component Architecture

### New Components Needed

```
shop/
├── components/
│   ├── shop/
│   │   ├── ShopHeader.tsx              (Shop-specific header with search)
│   │   ├── CategoryGrid.tsx            (Category cards)
│   │   ├── ProductFilters.tsx          (Sidebar filters)
│   │   ├── ProductSort.tsx             (Sort dropdown)
│   │   ├── ProductCard.tsx             (Product in grid)
│   │   ├── ProductGallery.tsx          (Image gallery with zoom)
│   │   ├── ProductInfo.tsx             (Price, stock, variants)
│   │   ├── ProductTabs.tsx             (Description, specs, reviews)
│   │   ├── ProductReviews.tsx          (Reviews list and form)
│   │   ├── RelatedProducts.tsx         (Recommendations)
│   │   ├── SearchBar.tsx               (Search input)
│   │   ├── Breadcrumb.tsx              (Navigation breadcrumb)
│   │   ├── FilterTag.tsx               (Active filter chip)
│   │   ├── PriceRange.tsx              (Price slider)
│   │   └── Pagination.tsx              (Page navigation)
│   │
│   ├── home/
│   │   ├── HomeHero.tsx                (Editorial hero)
│   │   ├── CuratedSelection.tsx        (Featured products)
│   │   ├── ShopByRoom.tsx              (Category visual grid)
│   │   ├── FeaturedCollection.tsx      (Collection showcase)
│   │   └── ShopCTA.tsx                 (Link to full shop)
│   │
│   └── [existing components]
│
├── app/
│   ├── page.tsx                        (Homepage - editorial)
│   ├── shop/
│   │   ├── page.tsx                    (Shop landing)
│   │   ├── all/page.tsx                (All products)
│   │   ├── [category]/page.tsx         (Category page)
│   │   ├── search/page.tsx             (Search results)
│   │   ├── collections/
│   │   │   └── [slug]/page.tsx         (Collection page)
│   │   └── products/
│   │       └── [slug]/page.tsx         (Product detail)
│   │
│   └── [existing pages]
│
└── lib/
    ├── shop-api.ts                     (Shop-specific API calls)
    ├── filters.ts                      (Filter logic)
    ├── search.ts                       (Search logic)
    └── [existing libs]
```

---

## API Endpoints

### Products

```
GET  /products                          # All products with filters
GET  /products?category=furniture       # Filter by category
GET  /products?brand=ikea               # Filter by brand
GET  /products?price_min=10000          # Price range
GET  /products?price_max=50000
GET  /products?sort=price_asc           # Sort options
GET  /products?sort=newest
GET  /products?sort=popular
GET  /products?page=2&limit=24          # Pagination
GET  /products/search?q=chair           # Search
GET  /products/{slug}                   # Single product
GET  /products/{slug}/related           # Related products
GET  /products/{slug}/reviews           # Product reviews
POST /products/{slug}/reviews           # Add review
```

### Categories

```
GET  /categories                        # All categories
GET  /categories/{slug}                 # Single category
GET  /categories/{slug}/products        # Products in category
```

### Collections

```
GET  /collections                       # All collections
GET  /collections/featured              # Featured collections
GET  /collections/{slug}                # Single collection
GET  /collections/{slug}/products       # Products in collection
```

### Filters

```
GET  /filters                           # Available filters
GET  /filters/brands                    # All brands
GET  /filters/materials                 # All materials
GET  /filters/colors                    # All colors
```

---

## Filter System

### Filter Types

1. **Price Range**
   - Slider: ₦0 - ₦500,000
   - Presets: Under ₦50k, ₦50k-₦100k, ₦100k+

2. **Category**
   - Hierarchical tree
   - Multi-select

3. **Brand**
   - Checkbox list
   - Search within brands

4. **Material**
   - Wood, Metal, Fabric, Glass, Plastic, etc.

5. **Color**
   - Visual color swatches
   - Multi-select

6. **Availability**
   - In Stock
   - On Sale
   - New Arrivals
   - Bestsellers

7. **Rating**
   - 4+ stars
   - 3+ stars

### Filter UI

```typescript
interface FilterState {
  category: string[];
  brand: string[];
  material: string[];
  color: string[];
  priceMin: number;
  priceMax: number;
  inStock: boolean;
  onSale: boolean;
  rating: number;
}

// URL structure
/shop/furniture?brand=ikea,hay&price_min=10000&price_max=50000&color=oak
```

---

## Search System

### Search Features

1. **Full-text search** across:
   - Product name
   - Description
   - Brand
   - Category
   - Tags

2. **Search suggestions**
   - As-you-type autocomplete
   - Popular searches
   - Recent searches (client-side)

3. **Search filters**
   - All standard filters apply
   - Sort by relevance

4. **No results handling**
   - "Did you mean..." suggestions
   - Show popular products
   - Search tips

### Implementation

```typescript
// Backend: PostgreSQL full-text search
SELECT * FROM products
WHERE 
  to_tsvector('english', name || ' ' || description || ' ' || brand)
  @@ plainto_tsquery('english', 'modern chair')
ORDER BY ts_rank(
  to_tsvector('english', name || ' ' || description),
  plainto_tsquery('english', 'modern chair')
) DESC;
```

---

## Homepage vs Shop Distinction

### Homepage (Editorial)

**Purpose**: Brand, inspiration, curation

**Characteristics**:
- Large hero image
- 8-12 curated products max
- Editorial descriptions
- Lifestyle imagery
- Calm, spacious layout
- "Discover" language
- Link to full shop

**Example Copy**:
> "Thoughtfully selected pieces for intentional living"
> "Explore our curated selection →"

### Shop Section (Commerce)

**Purpose**: Browse, filter, purchase at scale

**Characteristics**:
- Dense product grids (24-48 per page)
- Filters and sort
- Search bar
- Product counts
- Clear pricing
- Stock indicators
- "Shop" language

**Example Copy**:
> "Browse 240 products"
> "Filter by price, brand, material"
> "Add to cart"

---

## Navigation Structure

### Main Header

```
┌─────────────────────────────────────────────────────────┐
│ Betadomot                    [Search]    Cart (2)  Login│
│                                                          │
│ Home  |  Shop  |  Journal  |  About  |  Contact         │
└─────────────────────────────────────────────────────────┘
```

### Shop Mega Menu (on hover/click "Shop")

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  FURNITURE          LIGHTING         DECOR              │
│  Seating            Ceiling          Wall Art           │
│  Tables             Floor            Vases              │
│  Storage            Table            Sculptures         │
│  Beds               Outdoor          Mirrors            │
│                                                          │
│  TEXTILES           OUTDOOR          COLLECTIONS         │
│  Rugs               Furniture        Scandinavian       │
│  Cushions           Planters         Minimalist         │
│  Throws             Lighting         New Arrivals       │
│  Curtains           Decor            Bestsellers        │
│                                                          │
│  [View All Products →]                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Mobile Experience

### Mobile Navigation

```
┌──────────────────────┐
│ ☰  Betadomot    🔍 🛒│
├──────────────────────┤
│                      │
│  [Content]           │
│                      │
└──────────────────────┘

Hamburger Menu:
- Home
- Shop
  - All Products
  - Furniture
  - Lighting
  - Decor
  - Collections
- Journal
- About
```

### Mobile Filters

- Bottom sheet/drawer
- "Filters" button opens overlay
- Apply/Clear buttons
- Active filter count badge

### Mobile Product Grid

- 2 columns
- Compact product cards
- Infinite scroll

---

## Performance Optimizations

### 1. Caching Strategy

```typescript
// Category pages - 1 hour
export const revalidate = 3600;

// Product detail - 30 minutes
export const revalidate = 1800;

// Homepage - 5 minutes
export const revalidate = 300;

// Search results - No cache
export const dynamic = 'force-dynamic';
```

### 2. Image Optimization

- Next.js Image component
- WebP format
- Lazy loading
- Responsive sizes
- CDN delivery

### 3. Database Indexes

```sql
-- Critical indexes
CREATE INDEX idx_products_category_active ON products(category_id, active);
CREATE INDEX idx_products_price_active ON products(price, active) WHERE active = true;
CREATE INDEX idx_products_featured ON products(featured, active) WHERE active = true;
CREATE INDEX idx_products_bestseller ON products(is_bestseller, active) WHERE active = true;

-- Full-text search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description || ' ' || brand));
```

### 4. API Response Optimization

- Pagination (24-48 items per page)
- Field selection (only return needed fields)
- Eager loading (include related data)
- Response compression

---

## Revenue Features

### 1. Merchandising Tools

- Featured products
- Bestseller badges
- New arrival badges
- Sale badges
- Cross-sells ("You may also like")
- Up-sells (variant suggestions)
- Bundle deals

### 2. Conversion Optimization

- Clear CTAs
- Stock scarcity ("Only 3 left")
- Social proof (reviews, ratings)
- Free shipping threshold
- Easy checkout
- Guest checkout option
- Multiple payment methods

### 3. Analytics Tracking

```typescript
// Track key events
- Product view
- Add to cart
- Remove from cart
- Checkout started
- Purchase completed
- Search performed
- Filter applied
- Category viewed
```

### 4. Email Marketing Integration

- Abandoned cart emails
- Order confirmation
- Shipping updates
- Product recommendations
- New arrival notifications
- Sale announcements

---

## Content Strategy

### Homepage

**Tone**: Inspirational, calm, curated
**Copy**: Minimal, thoughtful
**Imagery**: Lifestyle, contextual
**Products**: 8-12 handpicked items

### Shop Pages

**Tone**: Helpful, informative, clear
**Copy**: Descriptive, practical
**Imagery**: Product-focused, multiple angles
**Products**: Full inventory

### Category Pages

**Intro Copy Example**:
> "Furniture for intentional living. Each piece in our furniture collection is selected for its quality, design, and ability to enhance everyday spaces. From seating that invites conversation to tables that anchor your home, find pieces that matter."

### Product Descriptions

**Structure**:
1. Short headline (what it is)
2. Key features (3-5 bullets)
3. Specifications (dimensions, materials)
4. Care instructions
5. Why we selected it (editorial note)

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema updates
- [ ] Category system
- [ ] Product attributes
- [ ] Basic filtering
- [ ] Shop landing page
- [ ] Category pages

### Phase 2: Core Commerce (Week 3-4)
- [ ] Advanced filters
- [ ] Search functionality
- [ ] Product reviews
- [ ] Collections
- [ ] Related products
- [ ] Breadcrumb navigation

### Phase 3: Optimization (Week 5-6)
- [ ] Performance tuning
- [ ] Mobile optimization
- [ ] SEO improvements
- [ ] Analytics integration
- [ ] Email notifications
- [ ] Admin tools

### Phase 4: Revenue Features (Week 7-8)
- [ ] Merchandising tools
- [ ] Abandoned cart recovery
- [ ] Product recommendations
- [ ] Loyalty program
- [ ] Gift cards
- [ ] Bulk discounts

---

## Success Metrics

### Traffic
- Homepage visits
- Shop section visits
- Category page views
- Product page views
- Search usage

### Engagement
- Time on site
- Pages per session
- Bounce rate
- Filter usage
- Search queries

### Conversion
- Add to cart rate
- Cart abandonment rate
- Checkout completion rate
- Average order value
- Revenue per visitor

### Product Performance
- Best selling products
- Most viewed products
- Highest rated products
- Most searched terms
- Popular categories

---

## Conclusion

This full-scale e-commerce system transforms Betadomot into a revenue-generating platform while maintaining its editorial identity. The homepage remains calm and curated, while the dedicated Shop section provides all the tools needed for serious commerce at scale.

**Key Differentiators**:
- Editorial homepage vs. commerce shop (clear separation)
- Thoughtful design throughout
- Contextual category introductions
- Premium user experience
- Built for scale and revenue

The system supports hundreds or thousands of products while keeping the brand's thoughtful, intentional character intact.
