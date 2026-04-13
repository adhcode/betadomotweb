# Complete Setup Guide - Blog + Shop Monorepo

## 🎯 Overview

This monorepo contains **three separate applications**:

1. **Backend** (Go API) - Shared by both blog and shop
2. **Blog** (Next.js) - Content and articles
3. **Shop** (Next.js) - E-commerce store

Each can be deployed independently to different domains.

## 📁 Project Structure

```
betadomot-blog/
│
├── backend/                 # Go API (Railway)
│   ├── handlers/           # API handlers
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   └── main.go            # Entry point
│
├── frontend/               # Blog App (Vercel)
│   ├── app/               # Blog pages
│   ├── components/        # Blog components
│   └── lib/               # Blog utilities
│
└── shop/                  # Shop App (Vercel)
    ├── app/               # Shop pages
    ├── lib/               # Shop utilities
    └── .env.local         # Shop config
```

## 🌐 Deployment Map

```
Production URLs:
├── blog.betadomot.com  →  frontend/  (Vercel Project 1)
├── shop.betadomot.com  →  shop/      (Vercel Project 2)
└── api.betadomot.com   →  backend/   (Railway)

Local Development:
├── http://localhost:3000  →  Blog
├── http://localhost:3001  →  Shop
└── http://localhost:8080  →  API
```

## 🚀 Complete Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Go dependencies
go mod download

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
./run_products_migration.sh

# Start backend
go run main.go
# → http://localhost:8080
```

### 2. Blog Setup

```bash
# Navigate to blog
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local

# Run development server
npm run dev
# → http://localhost:3000
```

### 3. Shop Setup

```bash
# Navigate to shop
cd shop

# Install dependencies
npm install

# Setup environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Run development server
npm run dev
# → http://localhost:3001
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8080
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_KEY=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
RESEND_API_KEY=...
```

### Blog (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Shop (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BLOG_URL=http://localhost:3000
```

## 📦 Production Deployment

### Step 1: Deploy Backend (Railway)

```bash
cd backend

# Deploy to Railway
railway up

# Or use Railway CLI
railway login
railway link
railway up
```

**Set environment variables in Railway dashboard**

### Step 2: Deploy Blog (Vercel)

```bash
cd frontend

# Deploy to Vercel
vercel --prod

# Or link to existing project
vercel link
vercel --prod
```

**Vercel Settings:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`
- Domain: `blog.betadomot.com`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://api.betadomot.com
```

### Step 3: Deploy Shop (Vercel)

```bash
cd shop

# Deploy to Vercel
vercel --prod
```

**Vercel Settings:**
- Root Directory: `shop`
- Build Command: `npm run build`
- Output Directory: `.next`
- Domain: `shop.betadomot.com`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://api.betadomot.com
NEXT_PUBLIC_BLOG_URL=https://blog.betadomot.com
```

## 🌍 DNS Configuration

### Add these DNS records:

```
Type    Name    Value
────────────────────────────────────────────────
CNAME   blog    vercel-blog.vercel.app
CNAME   shop    vercel-shop.vercel.app
CNAME   api     betadomotweb-production.up.railway.app
```

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:8080/health
curl http://localhost:8080/products
curl http://localhost:8080/posts
```

### Test Blog
```bash
# Visit in browser
open http://localhost:3000

# Check build
cd frontend && npm run build
```

### Test Shop
```bash
# Visit in browser
open http://localhost:3001

# Check build
cd shop && npm run build
```

## 📊 Development Workflow

### Working on Blog Only
```bash
# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Blog
cd frontend && npm run dev
```

### Working on Shop Only
```bash
# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Shop
cd shop && npm run dev
```

### Working on Both
```bash
# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Blog
cd frontend && npm run dev

# Terminal 3: Shop
cd shop && npm run dev
```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy All Apps

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    if: contains(github.event.head_commit.modified, 'backend/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
        
  deploy-blog:
    if: contains(github.event.head_commit.modified, 'frontend/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
          
  deploy-shop:
    if: contains(github.event.head_commit.modified, 'shop/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          cd shop
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📝 Common Tasks

### Add a Product
```bash
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -d '{
    "name": "Product Name",
    "description": "Description",
    "price": 10000,
    "images": ["https://example.com/image.jpg"],
    "category": "Category",
    "stock": 10,
    "active": true
  }'
```

### Add a Blog Post
```bash
curl -X POST http://localhost:8080/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -d '{
    "title": "Post Title",
    "excerpt": "Excerpt",
    "content": "Content",
    "category": "Category"
  }'
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
go mod tidy
go run main.go
```

### Blog won't build
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Shop won't build
```bash
cd shop
rm -rf .next node_modules
npm install
npm run build
```

### API connection fails
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check CORS settings in backend

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) | This file - complete setup |
| [SHOP_SEPARATE_APP_GUIDE.md](SHOP_SEPARATE_APP_GUIDE.md) | Shop-specific guide |
| [SHOP_FINAL_SUMMARY.md](SHOP_FINAL_SUMMARY.md) | Implementation summary |
| [SHOP_SETUP_GUIDE.md](SHOP_SETUP_GUIDE.md) | Backend API guide |

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Backend builds successfully
- [ ] Blog builds successfully
- [ ] Shop builds successfully
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] API endpoints tested

### Backend Deployment
- [ ] Deploy to Railway
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Test API endpoints
- [ ] Configure custom domain (optional)

### Blog Deployment
- [ ] Create Vercel project
- [ ] Set root directory to `frontend`
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Configure `blog.betadomot.com`
- [ ] Test production URL

### Shop Deployment
- [ ] Create Vercel project
- [ ] Set root directory to `shop`
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Configure `shop.betadomot.com`
- [ ] Test production URL

### Post-Deployment
- [ ] All URLs accessible
- [ ] API calls working
- [ ] Images loading
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Analytics configured
- [ ] Error monitoring setup

## 🎉 Success!

You now have:
- ✅ Blog running on `blog.betadomot.com`
- ✅ Shop running on `shop.betadomot.com`
- ✅ API running on `api.betadomot.com`
- ✅ All apps deployed independently
- ✅ Shared backend for both apps

## 🔗 Quick Links

- **Blog:** https://blog.betadomot.com
- **Shop:** https://shop.betadomot.com
- **API:** https://api.betadomot.com
- **Railway Dashboard:** https://railway.app
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**Need help?** Check the documentation files or run the test scripts in each directory.
