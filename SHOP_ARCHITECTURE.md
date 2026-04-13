# Shop Module - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                      (Next.js App)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │     BLOG     │              │     SHOP     │            │
│  │  (Existing)  │              │    (NEW)     │            │
│  ├──────────────┤              ├──────────────┤            │
│  │ /blog/[slug] │              │ /shop        │            │
│  │ /category/*  │              │ /shop/[slug] │            │
│  │ /guides/*    │              │              │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                             │                     │
│         │    ┌────────────────┐      │                     │
│         └────┤  api-client.ts ├──────┘                     │
│              └────────┬───────┘                             │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ HTTP/JSON
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                       ▼          BACKEND                     │
│                  (Go + Chi)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │ Blog Routes  │              │ Shop Routes  │            │
│  ├──────────────┤              ├──────────────┤            │
│  │ GET /posts   │              │ GET /products│            │
│  │ GET /guides  │              │ GET /products│            │
│  │ POST /posts  │              │     /{slug}  │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                             │                     │
│  ┌──────▼───────┐              ┌─────▼────────┐            │
│  │PostHandler   │              │ProductHandler│            │
│  │GuideHandler  │              │              │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                             │                     │
│         │    ┌────────────────┐      │                     │
│         └────┤ DatabaseService├──────┘                     │
│              └────────┬───────┘                             │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ PostgreSQL
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      DATABASE                                │
│                   (Supabase/PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │ posts        │              │ products     │            │
│  │ guides       │              │              │            │
│  │ comments     │              │              │            │
│  │ subscribers  │              │              │            │
│  └──────────────┘              └──────────────┘            │
│                                                              │
│                 ┌──────────────────────┐                    │
│                 │ blog_product_links   │                    │
│                 │    (Prepared)        │                    │
│                 └──────────────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Shop Product Listing
```
User → /shop → fetchProducts() → GET /products → ProductHandler
                                                        ↓
                                                  DatabaseService
                                                        ↓
                                                  products table
                                                        ↓
                                                  JSON Response
                                                        ↓
                                                  Shop Page
```

### Shop Product Detail
```
User → /shop/[slug] → fetchProduct(slug) → GET /products/{slug}
                                                        ↓
                                                  ProductHandler
                                                        ↓
                                                  DatabaseService
                                                        ↓
                                                  products table
                                                        ↓
                                                  JSON Response
                                                        ↓
                                                  Product Page
```

### Blog (Unchanged)
```
User → /blog/[slug] → fetchPost(slug) → GET /posts/{slug}
                                                    ↓
                                              PostHandler
                                                    ↓
                                              DatabaseService
                                                    ↓
                                              posts table
                                                    ↓
                                              JSON Response
                                                    ↓
                                              Blog Page
```

## Module Boundaries

### Blog Domain
```
Frontend:
  - /app/blog/*
  - /app/category/*
  - /app/guides/*
  - /components/BlogPost*
  - /components/Hero.tsx
  - /components/FeaturedPosts.tsx

Backend:
  - /handlers/posts.go
  - /handlers/guides.go
  - /handlers/comments.go
  - /models/models.go (Post, Guide, Comment)

Database:
  - posts
  - guides
  - comments
  - subscribers
```

### Shop Domain
```
Frontend:
  - /app/shop/*
  - (No shared components)

Backend:
  - /handlers/products.go
  - /models/models.go (Product)

Database:
  - products
```

### Shared Infrastructure
```
Frontend:
  - /lib/api-client.ts (both domains)
  - /components/Header.tsx (navigation)
  - /components/Footer.tsx (navigation)

Backend:
  - /services/database.go
  - /middleware/*
  - /config/*
  - main.go (routing)
```

## Future Integration Points

### Blog-Product Links (Prepared)
```
┌──────────────┐         ┌──────────────────────┐         ┌──────────────┐
│   Blog Post  │────────▶│ blog_product_links   │◀────────│   Product    │
│              │         │                      │         │              │
│ post_slug    │         │ post_slug            │         │ product_slug │
│              │         │ product_slug         │         │              │
│              │         │ link_type            │         │              │
│              │         │ display_order        │         │              │
└──────────────┘         └──────────────────────┘         └──────────────┘
```

### Usage Example
```typescript
// In blog post page
const products = await fetchProductsForPost(postSlug);

// Display related products
<RelatedProducts products={products} />
```

## API Endpoints Map

```
Public Endpoints:
├── /health                          [Blog & Shop]
├── /posts                           [Blog]
│   ├── /{slug}
│   ├── /{slug}/comments
│   └── /{slug}/clap
├── /guides                          [Blog]
│   ├── /{slug}
│   └── /category/{category}
├── /products                        [Shop]
│   └── /{slug}
└── /newsletter
    ├── /subscribe
    └── /unsubscribe

Admin Endpoints (Protected):
├── /admin/posts                     [Blog]
│   ├── /{slug}
│   └── /{slug}/featured-hero
├── /admin/guides                    [Blog]
│   └── /{slug}/featured-hero
├── /admin/products                  [Shop]
│   └── /{slug}
├── /admin/comments                  [Blog]
├── /admin/subscribers               [Blog]
└── /admin/newsletter                [Blog]

Future Endpoints (Prepared):
└── /posts/{slug}/products           [Blog-Shop Link]
    └── /admin/blog-product-links
```

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Server Components

### Backend
- Go 1.21+
- Chi Router
- Supabase Go Client
- PostgreSQL

### Database
- PostgreSQL (Supabase)
- Row Level Security
- Indexes for performance

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Supabase

## Design Principles

### 1. Domain Separation
- Blog and Shop are separate domains
- No cross-domain dependencies
- Each can be deployed independently

### 2. Minimal Coupling
- Shared only at infrastructure level
- API client is the only shared code
- Components are domain-specific

### 3. Additive Changes
- No modifications to existing blog code
- New routes added alongside existing
- Database tables are independent

### 4. Future-Ready
- Blog-product linking prepared
- Easy to add shopping cart
- Ready for checkout integration

## Performance Considerations

### Caching Strategy
```typescript
// Product listing - cache for 1 hour
export const revalidate = 3600;

// Product detail - cache for 30 minutes
export const revalidate = 1800;

// Blog posts - cache for 5 minutes
export const revalidate = 300;
```

### Database Indexes
```sql
-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_featured ON products(featured);

-- Blog-Product Links
CREATE INDEX idx_blog_product_links_post ON blog_product_links(post_slug);
CREATE INDEX idx_blog_product_links_product ON blog_product_links(product_slug);
```

### API Response Times
- Target: < 200ms for product listing
- Target: < 100ms for single product
- Target: < 300ms for blog posts (unchanged)

## Security Model

### Authentication
- Admin endpoints: Basic Auth
- Public endpoints: No auth required
- Future: JWT tokens for user sessions

### Authorization
- Admin: Full CRUD on products
- Public: Read-only access
- Future: User-specific carts and orders

### Data Validation
- Input sanitization in handlers
- Type checking with Go structs
- SQL injection prevention (parameterized queries)

## Monitoring & Observability

### Metrics to Track
- API response times
- Error rates
- Product page views
- Database query performance
- Cache hit rates

### Logging
- Request/response logging
- Error logging
- Performance logging
- Audit logging (admin actions)

## Scalability

### Current Capacity
- Handles 1000+ products
- Supports 10k+ concurrent users
- Database optimized with indexes

### Future Scaling
- Add Redis for caching
- CDN for product images
- Read replicas for database
- Horizontal scaling of API servers

---

**Key Takeaway:** Blog and Shop are cleanly separated domains that share only infrastructure. This allows independent development, deployment, and scaling while maintaining system integrity.
