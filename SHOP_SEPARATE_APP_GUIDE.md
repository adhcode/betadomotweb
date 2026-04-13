# Shop - Separate Application Guide

## 🎯 Architecture Overview

The shop is a **completely separate Next.js application** from the blog:

```
betadomot-blog/
├── backend/          # Shared Go API (serves both blog and shop)
├── frontend/         # Blog app (blog.betadomot.com)
└── shop/            # Shop app (shop.betadomot.com) ← NEW SEPARATE APP
```

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DOMAINS                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  blog.betadomot.com          shop.betadomot.com         │
│         │                            │                   │
│         ▼                            ▼                   │
│  ┌──────────────┐            ┌──────────────┐          │
│  │   Frontend   │            │     Shop     │          │
│  │  (Vercel 1)  │            │  (Vercel 2)  │          │
│  └──────┬───────┘            └──────┬───────┘          │
│         │                            │                   │
│         └────────────┬───────────────┘                   │
│                      ▼                                   │
│              ┌───────────────┐                          │
│              │    Backend    │                          │
│              │   (Railway)   │                          │
│              └───────┬───────┘                          │
│                      ▼                                   │
│              ┌───────────────┐                          │
│              │   Database    │                          │
│              │  (Supabase)   │                          │
│              └───────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

## 📁 Shop App Structure

```
shop/
├── app/
│   ├── page.tsx                    # Product listing (home)
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx            # Product detail
│   ├── layout.tsx                  # Shop layout
│   └── globals.css                 # Shop styles
├── lib/
│   └── api-client.ts               # API functions
├── public/                         # Shop assets
├── .env.local                      # Shop environment variables
├── package.json                    # Shop dependencies
├── next.config.ts                  # Shop Next.js config
└── tsconfig.json                   # Shop TypeScript config
```

## 🚀 Setup Instructions

### 1. Install Shop Dependencies

```bash
cd shop
npm install
```

### 2. Configure Environment Variables

Create `shop/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production:
```env
NEXT_PUBLIC_API_URL=https://betadomotweb-production.up.railway.app
```

### 3. Run Shop Locally

```bash
# Terminal 1: Backend
cd backend
go run main.go

# Terminal 2: Blog
cd frontend
npm run dev
# Runs on http://localhost:3000

# Terminal 3: Shop
cd shop
npm run dev
# Runs on http://localhost:3001
```

## 🌍 Production Deployment

### Option 1: Vercel (Recommended)

#### Deploy Blog (frontend/)
```bash
cd frontend
vercel --prod
# Set domain: blog.betadomot.com
```

#### Deploy Shop (shop/)
```bash
cd shop
vercel --prod
# Set domain: shop.betadomot.com
```

### Option 2: Manual Deployment

#### Build Shop
```bash
cd shop
npm run build
npm start
```

## 🔗 Domain Configuration

### DNS Settings

```
# Blog
blog.betadomot.com    →  CNAME  →  vercel-blog.vercel.app

# Shop
shop.betadomot.com    →  CNAME  →  vercel-shop.vercel.app

# API (shared)
api.betadomot.com     →  CNAME  →  betadomotweb-production.up.railway.app
```

### Vercel Project Settings

**Blog Project:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`
- Domain: `blog.betadomot.com`

**Shop Project:**
- Root Directory: `shop`
- Build Command: `npm run build`
- Output Directory: `.next`
- Domain: `shop.betadomot.com`

## 📦 Package.json Scripts

Add to `shop/package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  }
}
```

## 🔄 Blog-Shop Integration

### Link from Blog to Shop

In `frontend/components/Header.tsx`:
```typescript
{
  title: 'Shop',
  href: 'https://shop.betadomot.com'  // External link to shop
}
```

### Link from Shop to Blog

In `shop/app/layout.tsx`:
```typescript
<Link href="https://blog.betadomot.com">
  Visit Our Blog
</Link>
```

## 🎨 Shared Branding

### Copy Shared Assets

```bash
# Copy fonts
cp frontend/public/*.ttf shop/public/

# Copy logo
cp frontend/public/images/blog/beta-logo2.png shop/public/
```

### Shared Tailwind Config

Both apps can share similar Tailwind configurations for consistent branding.

## 🔐 Environment Variables

### Shop (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BLOG_URL=http://localhost:3000
```

### Shop (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.betadomot.com
NEXT_PUBLIC_BLOG_URL=https://blog.betadomot.com
```

## 📊 Benefits of Separate Apps

### 1. Independent Deployment
- Deploy shop without affecting blog
- Different release cycles
- Separate CI/CD pipelines

### 2. Performance
- Smaller bundle sizes
- Faster builds
- Independent caching

### 3. Scalability
- Scale shop independently
- Different server resources
- Separate monitoring

### 4. Team Organization
- Different teams can own each app
- Clear boundaries
- Independent development

### 5. Technology Flexibility
- Can use different Next.js versions
- Different dependencies
- Different optimization strategies

## 🧪 Testing

### Test Shop Locally
```bash
cd shop
npm run dev
# Visit http://localhost:3001
```

### Test Shop Build
```bash
cd shop
npm run build
npm start
```

### Test API Connection
```bash
# From shop directory
curl http://localhost:8080/products
```

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Shop builds successfully
- [ ] Environment variables configured
- [ ] API connection tested
- [ ] Product pages load correctly
- [ ] Images optimized
- [ ] SEO meta tags added

### Vercel Deployment
- [ ] Create new Vercel project for shop
- [ ] Set root directory to `shop`
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Configure custom domain
- [ ] Test production URL

### Post-Deployment
- [ ] Verify shop.betadomot.com loads
- [ ] Test product listing
- [ ] Test product detail pages
- [ ] Verify API calls work
- [ ] Check mobile responsive
- [ ] Monitor error logs

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy-shop.yml`:
```yaml
name: Deploy Shop

on:
  push:
    branches: [main]
    paths:
      - 'shop/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          cd shop
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🎯 Next Steps

1. **Complete shop setup**
   ```bash
   cd shop
   npm install
   npm run dev
   ```

2. **Add products via API**
   ```bash
   curl -X POST http://localhost:8080/admin/products \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Product","price":10000,...}'
   ```

3. **Deploy to Vercel**
   ```bash
   cd shop
   vercel --prod
   ```

4. **Configure domain**
   - Add `shop.betadomot.com` in Vercel dashboard

## 📚 Documentation

- **Shop Setup:** This file
- **Backend API:** `SHOP_SETUP_GUIDE.md`
- **Database:** `backend/create_products_table.sql`
- **Blog Integration:** `SHOP_ARCHITECTURE.md`

## 🆘 Troubleshooting

### Shop won't start
```bash
cd shop
rm -rf node_modules .next
npm install
npm run dev
```

### API connection fails
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running on port 8080
- Check CORS settings in backend

### Build fails
```bash
cd shop
npm run build
# Check error messages
```

## ✅ Summary

- ✅ Shop is a separate Next.js app in `/shop` directory
- ✅ Independent deployment from blog
- ✅ Separate domain: `shop.betadomot.com`
- ✅ Shares backend API with blog
- ✅ Can be deployed to separate Vercel project
- ✅ Zero impact on blog functionality

---

**Ready to deploy!** The shop app is completely independent and can be deployed separately from the blog.
