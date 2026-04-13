# 🛍️ Shop Module

A minimal, production-ready e-commerce module for your Go + Next.js blog monorepo.

## 🎯 Overview

This shop module was designed with three core principles:
1. **Minimal Risk** - Zero changes to existing blog functionality
2. **Clean Separation** - Shop and blog are completely isolated domains
3. **Speed Over Engineering** - Simple, working code that can be extended later

## ⚡ Quick Start

```bash
# 1. Setup database
cd backend && ./run_products_migration.sh

# 2. Start backend
go run main.go

# 3. Start frontend
cd ../frontend && npm run dev

# 4. Visit shop
open http://localhost:3000/shop
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [Quick Start](SHOP_QUICK_START.md) | Get running in 3 steps |
| [Setup Guide](SHOP_SETUP_GUIDE.md) | Complete setup instructions |
| [Architecture](SHOP_ARCHITECTURE.md) | System design and data flow |
| [Deployment](SHOP_DEPLOYMENT.md) | Production deployment guide |
| [Checklist](SHOP_CHECKLIST.md) | Implementation checklist |
| [Summary](SHOP_MODULE_SUMMARY.md) | What was built and why |
| [Files Added](SHOP_FILES_ADDED.md) | Complete file tree |

## 🏗️ Architecture

```
Frontend (Next.js)          Backend (Go)           Database (PostgreSQL)
─────────────────          ──────────────         ─────────────────────
/shop                  →   GET /products      →   products table
/shop/[slug]           →   GET /products/:id  →   
```

**Key Features:**
- Server-side rendering for SEO
- Image optimization with Next.js
- Responsive design (mobile-first)
- Clean REST API
- Database indexes for performance

## 🎨 Features

### Current (v1.0)
- ✅ Product listing page
- ✅ Product detail page
- ✅ Category filtering
- ✅ Featured products
- ✅ Stock management
- ✅ Sale pricing
- ✅ Admin CRUD API
- ✅ Responsive design

### Prepared (Ready to Enable)
- 🔄 Blog-product linking
- 🔄 Related products on blog posts
- 🔄 "Shop This Post" sections

### Planned (Future)
- 📋 Shopping cart
- 📋 Checkout flow
- 📋 Order management
- 📋 Product search
- 📋 Reviews & ratings

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Server Components

**Backend:**
- Go 1.21+
- Chi Router
- Supabase Client
- PostgreSQL

**Infrastructure:**
- Vercel (Frontend)
- Railway (Backend)
- Supabase (Database)

## 📊 API Endpoints

### Public (Read-Only)
```
GET  /products              List all active products
GET  /products?category=X   Filter by category
GET  /products?featured=1   Get featured products
GET  /products/:slug        Get single product
```

### Admin (Protected)
```
GET    /admin/products           List all products
POST   /admin/products           Create product
PUT    /admin/products/:slug     Update product
DELETE /admin/products/:slug     Delete product
```

## 🗄️ Database Schema

```sql
products (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  images TEXT[],
  category TEXT,
  tags TEXT[],
  stock INTEGER,
  sku TEXT UNIQUE,
  weight DECIMAL(10,2),
  dimensions TEXT,
  featured BOOLEAN,
  active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

## 🧪 Testing

```bash
# Test API endpoints
cd backend && ./test_shop_api.sh

# Test frontend build
cd frontend && npm run build

# Check TypeScript
npm run type-check
```

## 📦 Adding Products

### Via API
```bash
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -d '{
    "name": "Modern Office Chair",
    "description": "Ergonomic chair with lumbar support",
    "price": 45000,
    "images": ["https://example.com/chair.jpg"],
    "category": "Furniture",
    "stock": 10,
    "active": true
  }'
```

### Via Database
```sql
INSERT INTO products (slug, name, price, images, category, stock, sku, active)
VALUES ('office-chair', 'Office Chair', 45000, 
        ARRAY['https://example.com/chair.jpg'], 
        'Furniture', 10, 'SKU-001', true);
```

## 🚀 Deployment

### Production Checklist
- [ ] Run database migration
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Add sample products
- [ ] Test all endpoints
- [ ] Monitor for errors

See [SHOP_DEPLOYMENT.md](SHOP_DEPLOYMENT.md) for detailed instructions.

## 🔮 Future Integration

### Blog-Product Linking (Prepared)

The infrastructure is ready to link blog posts to products:

```typescript
// Already prepared in backend
GET /posts/:slug/products

// Usage in blog post
const products = await fetchProductsForPost(postSlug);
```

To enable:
1. Run `create_blog_product_links.sql`
2. Add routes to `main.go`
3. Create admin UI for linking
4. Display products on blog posts

## 📈 Performance

**Targets:**
- Product listing: < 2s load time
- Product detail: < 1.5s load time
- API response: < 200ms
- Image loading: Optimized with Next.js

**Optimizations:**
- Database indexes on slug, category, active
- Server-side rendering
- Image optimization
- API response caching

## 🔒 Security

- ✅ Admin endpoints protected with Basic Auth
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation on all endpoints
- ✅ CORS configured correctly
- ✅ HTTPS enforced in production

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check Go version
go version  # Should be 1.21+

# Check environment variables
cat backend/.env

# Check database connection
psql "$DATABASE_URL" -c "SELECT 1"
```

### Frontend errors?
```bash
# Clear cache
rm -rf frontend/.next

# Reinstall dependencies
cd frontend && npm install

# Check for TypeScript errors
npm run type-check
```

### Products not showing?
```bash
# Check if table exists
psql "$DATABASE_URL" -c "\dt products"

# Check if products exist
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM products"

# Check API endpoint
curl http://localhost:8080/products
```

## 📞 Support

**Documentation:**
- See `SHOP_SETUP_GUIDE.md` for setup
- See `SHOP_ARCHITECTURE.md` for design
- See `SHOP_DEPLOYMENT.md` for deployment

**Testing:**
- Run `backend/test_shop_api.sh` to verify API
- Check browser console for frontend errors
- Check `backend/server.log` for backend errors

## ✨ Key Benefits

### For Development
- **Fast to implement** - Working in hours, not days
- **Easy to understand** - Simple, clean code
- **Safe to deploy** - Zero risk to blog
- **Easy to extend** - Prepared for future features

### For Business
- **Quick to market** - Launch shop immediately
- **Low maintenance** - Minimal code to maintain
- **Scalable** - Ready for growth
- **Flexible** - Easy to customize

## 🎉 Success Metrics

**Week 1:**
- ✅ Shop pages live
- ✅ Products displaying
- ✅ Blog unchanged
- ✅ Zero critical errors

**Month 1:**
- 📊 Product views tracked
- 📊 User engagement measured
- 📊 Performance optimized
- 📊 Ready for cart/checkout

## 📝 License

Same as parent project.

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Go](https://golang.org/)
- [Chi Router](https://github.com/go-chi/chi)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Ready to launch!** Follow the [Quick Start](SHOP_QUICK_START.md) to get started.
